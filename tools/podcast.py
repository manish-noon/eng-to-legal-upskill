#!/usr/bin/env python3
"""Build a course podcast: a text model writes a two-host script per episode, Gemini TTS voices it, ffmpeg makes MP3s.

Usage:
  python3 tools/podcast.py <course-id> [episode nums...]      # e.g. tools/podcast.py ma 05
  python3 tools/podcast.py <course-id> --script-only 01        # write/print the script only (cheap review)
  python3 tools/podcast.py <course-id> --index                 # rebuild episodes.json + report words/min

Config:  build/<id>/podcast.json   (see .claude/skills/build-podcast/SKILL.md for the schema)
Outputs: courses/<id>/podcast/epNN.mp3, epNN.md (transcript), episodes.json
Cache:   /tmp/<id>-podcast/ (scripts epNN.json and per-chunk WAVs; reruns resume). Delete an mp3 to rebuild it;
         an existing transcript is the source for the new recording.
Env:     GOOGLE_API_KEY, TEXT_MODEL, TTS_MODEL, PAR (episodes in parallel, default 4). Loaded from .env automatically.
Python 3.9 compatible, standard library only (plus ffmpeg/ffprobe on PATH).
"""
import base64, concurrent.futures as cf, hashlib, html, json, os, re, subprocess, sys, time, urllib.error, urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from env import ROOT, load_env  # noqa: E402

load_env()
API = "https://generativelanguage.googleapis.com/v1beta"

DEFAULT_PROMPT = """You are writing episode {num} of "{show}", a two-host audio series that teaches {topic}.

LISTENER: {listener}

HOSTS:
{hosts}
Both are peers. This is a conversation between two experts sharpening an idea, NOT a teacher talking down and NOT a monologue split into two voices.

EPISODE: "{title}"
SOURCE MATERIAL (the course module; treat as the factual boundary):
<<<
{source}
>>>

RULES:
1. Accuracy: use only facts, numbers, statistics and points that appear in the source. Keep the source's caveats ("confirm", "secondary source", "varies by jurisdiction"). Name the study when quoting a statistic, exactly as the source does. Do not invent case names, statutes, figures or real events. Do not name real living people.
2. Density: every exchange must teach something. No "great question", no "welcome back", no recaps of what you are about to say, no sign-off beyond one line. Open cold with a concrete tension or scenario in the first ten seconds; one line names the episode. Close with a tight 3-point takeaway said naturally, and one line pointing to the next episode topic if obvious.
3. Shape: mostly short turns (1 to 4 sentences), occasional longer explanation (max ~90 words). Real dialogue: interruptions, disagreement resolved by mechanism, the second host stress-testing with a fact pattern, the expert giving the "how a practitioner would say it" line. Work at least two numeric examples aloud from the source, slowly enough to follow by ear (say numbers the way people speak them: "seventy-six million", "one percent").
4. Cover every major section of the source, in a sensible order. Skip quiz mechanics, but use the hardest quiz scenarios (answers marked [CORRECT]) as fact patterns the hosts argue through.
5. Ear, not eye: no tables, no bullet lists, no URLs, no section numbers unless meaningful, no symbols like "%"; write "percent". Expand abbreviations the first time.
6. Length: {words} words of dialogue in total.
{extra}
OUTPUT: JSON only: {{"turns":[{{"speaker":{speakers},"text":"...","style":"short delivery note, e.g. 'dry, amused', 'thinking aloud', 'firm'"}}]}}"""


def load_cfg(cid):
    p = os.path.join(ROOT, "build", cid, "podcast.json")
    if not os.path.exists(p):
        sys.exit("missing " + p)
    c = json.load(open(p))
    c["id"] = cid
    c["site"] = os.path.join(ROOT, "courses", cid)
    c["out"] = os.path.join(c["site"], "podcast")
    c["tmp"] = os.path.join("/tmp", cid + "-podcast")
    for d in (c["out"], c["tmp"]):
        os.makedirs(d, exist_ok=True)
    if len(c["hosts"]) != 2:
        sys.exit("exactly two hosts: the TTS request accepts at most two speakers")
    return c


def post(url, body, timeout=600):
    key = os.environ.get("GOOGLE_API_KEY") or sys.exit("GOOGLE_API_KEY not set (put it in .env)")
    req = urllib.request.Request(url, json.dumps(body).encode(), {"Content-Type": "application/json", "x-goog-api-key": key})
    last = None
    for attempt in range(7):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:300]
            if e.code in (429, 500, 502, 503, 504):
                last = "HTTP %d: %s" % (e.code, msg)
                time.sleep(min(90, 8 * 2 ** attempt))
                continue
            raise RuntimeError("HTTP %d: %s" % (e.code, msg))
        except Exception as e:  # network errors, timeouts
            last = e
            time.sleep(min(90, 8 * 2 ** attempt))
    raise RuntimeError("gave up on %s: %s" % (url, last))


def module_text(c, src):
    """src is a module id ("m04" -> courses/<id>/content/m04.html) or {"file": rel path, "from": str, "to": str, "label": str}."""
    if isinstance(src, dict):
        t = open(os.path.join(c["site"], src["file"])).read()
        if src.get("from"):
            t = t[t.index(src["from"]):]
        if src.get("to"):
            t = t[:t.index(src["to"])]
        return (src.get("label", "") + "\n" + t).strip()
    t = open(os.path.join(c["site"], "content", src + ".html")).read()
    t = re.sub(r"<div data-widget[^>]*></div>", "", t)
    t = re.sub(r"<li data-correct>", "<li>[CORRECT] ", t)
    t = re.sub(r"</(p|li|h1|h2|h3|tr|dd|dt|blockquote|div|summary)>", "\n", t)
    t = re.sub(r"<(td|th)[^>]*>", " | ", t)
    t = html.unescape(re.sub(r"<[^>]+>", "", t))
    return re.sub(r"\n\s*\n+", "\n\n", t).strip()


def write_script(c, ep):
    num = ep["num"]
    path = os.path.join(c["tmp"], "ep%s.json" % num)
    transcript = os.path.join(c["out"], "ep%s.md" % num)
    if os.path.exists(transcript):
        with open(transcript, encoding="utf-8") as source:
            _, _, dialogue = source.read().strip().partition("\n")
        styles = {}
        if os.path.exists(path):
            with open(path, encoding="utf-8") as cached:
                for turn in json.load(cached):
                    if turn.get("style"):
                        styles[turn["speaker"], turn["text"]] = turn["style"]
        turns = []
        for paragraph in re.split(r"\n\s*\n", dialogue.strip()):
            match = re.fullmatch(r"\*\*(.+?):\*\*\s+(.+)", paragraph, re.S)
            if not match or match[1] not in c["hosts"]:
                raise ValueError("Invalid dialogue in " + transcript)
            turn = {"speaker": match[1], "text": match[2]}
            style = styles.get((match[1], match[2]))
            if style:
                turn["style"] = style
            turns.append(turn)
        return turns
    if os.path.exists(path):
        return json.load(open(path))
    names = list(c["hosts"])
    hosts = "\n".join("- %s: %s" % (n, c["hosts"][n]["role"]) for n in names)
    src = "\n\n".join(module_text(c, s) for s in ep["sources"])
    prompt = (c.get("prompt") or DEFAULT_PROMPT).format(
        num=int(num), show=c["show"], topic=c["topic"], listener=c["listener"], hosts=hosts, title=ep["title"],
        source=src, words=ep.get("words", c.get("words", "2,800 to 3,400")), extra=c.get("extra_rules", ""),
        speakers="|".join('"%s"' % n for n in names))
    body = {"contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {"responseMimeType": "application/json", "temperature": 0.8, "maxOutputTokens": 32000}}
    model = os.environ.get("TEXT_MODEL", "gemini-3.1-pro-preview")
    d = post("%s/models/%s:generateContent" % (API, model), body)
    txt = "".join(p.get("text", "") for p in d["candidates"][0]["content"]["parts"] if not p.get("thought"))
    j = json.loads(txt)
    # Parse defensively: the model sometimes returns a bare list, or a list wrapping {"turns": [...]}.
    if isinstance(j, dict):
        turns = j["turns"]
    elif j and isinstance(j[0], dict) and "turns" in j[0]:
        turns = j[0]["turns"]
    else:
        turns = j
    turns = [t for t in turns if t.get("speaker") in c["hosts"] and t.get("text", "").strip()]
    json.dump(turns, open(path, "w"), indent=1)
    return turns


def chunks(turns, limit=2200):
    cur, n = [], 0
    for t in turns:
        if cur and n + len(t["text"]) > limit:
            yield cur
            cur, n = [], 0
        cur.append(t)
        n += len(t["text"])
    if cur:
        yield cur


def _blobs(x):
    if isinstance(x, dict):
        if isinstance(x.get("data"), str) and len(x["data"]) > 1000:
            yield x["data"]
        for v in x.values():
            for b in _blobs(v):
                yield b
    elif isinstance(x, list):
        for v in x:
            for b in _blobs(v):
                yield b


def tts(c, num, i, part):
    # A wording, voice or delivery change needs a new take even at the same chunk index.
    signature = json.dumps([part, c["hosts"], c.get("pace"), os.environ.get("TTS_MODEL")], sort_keys=True)
    digest = hashlib.sha256(signature.encode("utf-8")).hexdigest()[:20]
    wav = os.path.join(c["tmp"], "ep%s-%03d-%s.wav" % (num, i, digest))
    if os.path.exists(wav) and os.path.getsize(wav) > 1000:
        return wav
    pace = c.get("pace", "brisk professional podcast pace")
    content = [{"type": "text", "text": t["text"], "annotations": [{"type": "speech_metadata", "speaker": t["speaker"],
                "style": (t.get("style") or "natural") + "; " + pace}]} for t in part]
    body = {"model": os.environ.get("TTS_MODEL", "gemini-3.8-flash-tts"),
            "input": [{"type": "user_input", "content": content}], "response_format": {"type": "audio"},
            "generation_config": {"speech_config": {"speakers": [{"speaker": n, "voice": h["voice"]} for n, h in c["hosts"].items()]}}}
    for _ in range(4):
        d = post(API + "/interactions", body)
        blobs = list(_blobs(d))
        if blobs:
            raw = base64.b64decode(blobs[0])
            if raw[:4] != b"RIFF":  # raw PCM: 24 kHz mono 16-bit
                open(wav + ".pcm", "wb").write(raw)
                subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", wav + ".pcm", wav], check=True)
            else:
                open(wav, "wb").write(raw)
            return wav
        time.sleep(10)
    raise RuntimeError("no audio for ep%s chunk %d" % (num, i))


def build(c, ep):
    num, title = ep["num"], ep["title"]
    mp3 = os.path.join(c["out"], "ep%s.mp3" % num)
    if os.path.exists(mp3):
        return num, "exists"
    turns = write_script(c, ep)
    md = "# Episode %d: %s\n\n" % (int(num), title) + "\n\n".join("**%s:** %s" % (t["speaker"], t["text"]) for t in turns) + "\n"
    open(os.path.join(c["out"], "ep%s.md" % num), "w").write(md)
    parts = list(chunks(turns))
    with cf.ThreadPoolExecutor(3) as ex:
        wavs = list(ex.map(lambda a: tts(c, num, a[0], a[1]), enumerate(parts)))
    gap = os.path.join(c["tmp"], "gap.wav")
    if not os.path.exists(gap):
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", "0.35", gap], check=True)
    lst = os.path.join(c["tmp"], "ep%s.txt" % num)
    open(lst, "w").write("".join("file '%s'\nfile '%s'\n" % (w, gap) for w in wavs))
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-ar", "24000", "-ac", "1",
                    "-c:a", "libmp3lame", "-b:a", "64k", "-metadata", "title=Ep %d: %s" % (int(num), title),
                    "-metadata", "artist=" + c["show"], "-metadata", "album=" + c.get("album", c["show"]),
                    "-metadata", "track=%d" % int(num), mp3], check=True)
    words = sum(len(t["text"].split()) for t in turns)
    return num, "%d turns, %d words, %d chunks" % (len(turns), words, len(parts))


def index(c):
    eps = []
    for ep in c["episodes"]:
        num = ep["num"]
        mp3 = os.path.join(c["out"], "ep%s.mp3" % num)
        if not os.path.exists(mp3):
            continue
        out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3],
                             capture_output=True, text=True).stdout
        dur = float(out.strip() or 0)
        tr = os.path.join(c["out"], "ep%s.md" % num)
        words = len(re.sub(r"\*\*[^*]+:\*\*", "", open(tr).read()).split()) if os.path.exists(tr) else 0
        wpm = words / (dur / 60) if dur else 0
        flag = "" if 140 <= wpm <= 200 else "   <-- CHECK (truncated or garbled audio?)"
        print("ep%s %5.1f min %5d words %4.0f wpm%s" % (num, dur / 60, words, wpm, flag))
        item = {"num": num, "title": ep["title"], "file": "ep%s.mp3" % num, "transcript": "ep%s.md" % num,
                "seconds": round(dur), "bytes": os.path.getsize(mp3)}
        source = ep["sources"][0]
        if isinstance(source, str):
            item["lesson"] = "#/m/" + source
        elif "lesson" in ep:
            item["lesson"] = ep["lesson"]
        eps.append(item)
    json.dump(eps, open(os.path.join(c["out"], "episodes.json"), "w"), indent=1)
    return eps


def main(argv):
    if not argv:
        sys.exit(__doc__)
    c = load_cfg(argv[0])
    args = argv[1:]
    if "--index" in args:
        index(c)
        return
    script_only = "--script-only" in args
    want = set(a for a in args if not a.startswith("--"))
    todo = [e for e in c["episodes"] if not want or e["num"] in want]
    if script_only:
        for e in todo:
            turns = write_script(c, e)
            print("ep%s: %d turns, %d words -> %s" % (e["num"], len(turns), sum(len(t["text"].split()) for t in turns),
                                                     os.path.join(c["tmp"], "ep%s.json" % e["num"])))
        return
    with cf.ThreadPoolExecutor(int(os.environ.get("PAR", "4"))) as ex:
        futs = {ex.submit(build, c, e): e["num"] for e in todo}
        for f in cf.as_completed(futs):
            try:
                print("ep", *f.result(), flush=True)
            except Exception as e:
                print("ep", futs[f], "FAILED", e, flush=True)
    eps = index(c)
    print(len(eps), "episodes,", round(sum(e["seconds"] for e in eps) / 60), "minutes")


if __name__ == "__main__":
    main(sys.argv[1:])
