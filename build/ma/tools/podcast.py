#!/usr/bin/env python3
"""Build the course podcast: Gemini Pro writes a two-host script per episode, Gemini TTS voices it, ffmpeg makes MP3s.

Usage: GOOGLE_API_KEY=... python3 build/ma/tools/podcast.py [episode ids...]
Outputs: courses/ma/podcast/epNN.mp3, site/podcast/epNN.md (transcript), site/podcast/episodes.json, site/podcast/feed.xml
"""
import json, os, re, sys, time, base64, html, subprocess, urllib.request, urllib.error, concurrent.futures as cf
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(os.path.dirname(os.path.dirname(ROOT)), "courses", "ma")
OUT = os.path.join(SITE, "podcast"); os.makedirs(OUT, exist_ok=True)
TMP = "/tmp/ma-podcast"; os.makedirs(TMP, exist_ok=True)
KEY = os.environ["GOOGLE_API_KEY"]
TEXT_MODEL = os.environ.get("TEXT_MODEL", "gemini-3.1-pro-preview")
TTS_MODEL = os.environ.get("TTS_MODEL", "gemini-3.8-flash-tts")
HOSTS = {"Nadia": "Kore", "Sam": "Charon"}

EPISODES = [
 ("01", "What lawyers actually sell", ["m00"]),
 ("02", "Contract mechanics: the physics under every deal", ["m01"]),
 ("03", "Companies, structures and who is in the room", ["m02"]),
 ("04", "The deal timeline and the documents before the SPA", ["m03"]),
 ("05", "Price: from enterprise value to the cheque", ["m04"]),
 ("06", "Due diligence: routing every finding", ["m05"]),
 ("07", "Reading an 80,000-word SPA in an hour", ["m06"]),
 ("08", "Warranties and disclosure: the information game", ["m07"]),
 ("09", "The claim pipeline: de minimis, basket, cap, time", ["m08"]),
 ("10", "Indemnities, W&I insurance and where the money comes from", ["m09"]),
 ("11", "Conditions, the gap and the right to walk", ["m10"]),
 ("12", "The clauses that decide disputes, and life after closing", ["m11"]),
 ("13", "The UAE and GCC overlay", ["m12"]),
 ("14", "How terms actually move: negotiation dynamics", ["m13"]),
 ("15", "Predicting the landing: precedent plus leverage", ["m14"]),
 ("16", "Kept risk and the pursue or walk call", ["m15"]),
 ("17", "Three deals, three verdicts", ["CAPSTONE"]),
]

def post(url, body, timeout=600):
    req = urllib.request.Request(url, json.dumps(body).encode(), {"Content-Type": "application/json", "x-goog-api-key": KEY})
    for attempt in range(7):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r: return json.load(r)
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:300]
            if e.code in (429, 500, 502, 503, 504): time.sleep(min(90, 8 * 2 ** attempt)); continue
            raise RuntimeError(f"HTTP {e.code}: {msg}")
        except Exception as e:
            time.sleep(min(90, 8 * 2 ** attempt)); last = e
    raise RuntimeError("gave up: " + url)

def module_text(mid):
    if mid == "CAPSTONE":
        js = open(os.path.join(SITE, "labs.js")).read()
        i = js.index("const DEALS="); j = js.index("function runDeal")
        return "Capstone deals from the course's deal desk lab (JavaScript data: facts, leverage scores and reasons, diligence findings with routing, risk register, and the model advice):\n" + js[i:j]
    t = open(os.path.join(SITE, "content", mid + ".html")).read()
    t = re.sub(r"<div data-widget[^>]*></div>", "", t)
    t = re.sub(r"<li data-correct>", "<li>[CORRECT] ", t)
    t = re.sub(r"</(p|li|h1|h2|h3|tr|dd|dt|blockquote|div|summary)>", "\n", t)
    t = re.sub(r"<(td|th)[^>]*>", " | ", t)
    t = html.unescape(re.sub(r"<[^>]+>", "", t))
    return re.sub(r"\n\s*\n+", "\n\n", t).strip()

PROMPT = """You are writing episode {num} of "Calling the Deal", a two-host audio series that teaches private M&A.

LISTENER: a CTO and co-founder with 17 to 18 years in technology, based in Dubai, building an AI legal-services company. Very fast, sceptical, allergic to fluff. Not a lawyer. He has just been through the written course this episode is drawn from, or is about to. He needs to hold his own with senior M&A partners and, ultimately, to predict where negotiated terms land from precedent and leverage and advise whether a deal is worth pursuing.

HOSTS:
- Nadia: senior M&A partner, English-qualified, 20 years of Gulf and European private M&A. Precise, dry, quietly funny. Explains mechanism, not trivia. Says where things usually land and what moves them.
- Sam: former CTO, now a deal partner at a growth investor; has sat across the table on a dozen acquisitions. Asks the question a smart engineer would ask, pushes back, reframes legal mechanisms in systems terms (state machines, failure modes, incentives, option value, SLAs) only when the analogy is exact, and is not afraid to say "that sounds like a bad trade".
Both are peers. This is a conversation between two experts sharpening an idea, NOT a teacher talking down and NOT a monologue split into two voices.

EPISODE: "{title}"
SOURCE MATERIAL (the course module; treat as the factual boundary):
<<<
{source}
>>>

RULES:
1. Accuracy: use only facts, numbers, statistics and legal points that appear in the source. Keep the source's caveats ("confirm", "secondary source", "varies by jurisdiction"). Name the study when quoting a statistic, exactly as the source does. Do not invent case names, statutes, figures or real deals. Do not name real living people.
2. Density: every exchange must teach something. No "great question", no "welcome back", no recaps of what you are about to say, no sign-off beyond one line. Open cold with a concrete tension or scenario in the first ten seconds; one line names the episode. Close with a tight 3-point takeaway said naturally, and one line pointing to the next episode topic if obvious.
3. Shape: mostly short turns (1 to 4 sentences), occasional longer explanation (max ~90 words). Real dialogue: interruptions, disagreement resolved by mechanism, Sam stress-testing with a fact pattern, Nadia giving the "how a partner would say it" line. Work at least two numeric examples aloud from the source, slowly enough to follow by ear (say numbers the way people speak them: "seventy-six million", "one percent").
4. Cover every major section of the source, in a sensible order. Skip quiz mechanics, but use the hardest quiz scenarios as fact patterns the hosts argue through.
5. Ear, not eye: no tables, no bullet lists, no URLs, no section numbers unless meaningful, no symbols like "%"; write "percent". Write "S P A" as "SPA" is fine. Expand abbreviations the first time.
6. Length: {words} words of dialogue in total.

OUTPUT: JSON only: {{"turns":[{{"speaker":"Nadia"|"Sam","text":"...","style":"short delivery note, e.g. 'dry, amused', 'thinking aloud', 'firm'"}}]}}"""

def write_script(num, title, mids):
    path = os.path.join(TMP, f"ep{num}.json")
    if os.path.exists(path): return json.load(open(path))
    src = "\n\n".join(module_text(m) for m in mids)
    words = "2,800 to 3,400" if mids != ["CAPSTONE"] else "3,200 to 3,800"
    body = {"contents": [{"role": "user", "parts": [{"text": PROMPT.format(num=int(num), title=title, source=src, words=words)}]}],
            "generationConfig": {"responseMimeType": "application/json", "temperature": 0.8, "maxOutputTokens": 32000}}
    d = post(f"https://generativelanguage.googleapis.com/v1beta/models/{TEXT_MODEL}:generateContent", body)
    txt = "".join(p.get("text", "") for p in d["candidates"][0]["content"]["parts"] if not p.get("thought"))
    j = json.loads(txt)
    turns = j["turns"] if isinstance(j, dict) else (j[0]["turns"] if j and isinstance(j[0], dict) and "turns" in j[0] else j)
    turns = [t for t in turns if t.get("speaker") in HOSTS and t.get("text", "").strip()]
    json.dump(turns, open(path, "w"), indent=1)
    return turns

def chunks(turns, limit=2200):
    cur, n = [], 0
    for t in turns:
        if cur and n + len(t["text"]) > limit: yield cur; cur, n = [], 0
        cur.append(t); n += len(t["text"])
    if cur: yield cur

def tts(num, i, part):
    wav = os.path.join(TMP, f"ep{num}-{i:03d}.wav")
    if os.path.exists(wav) and os.path.getsize(wav) > 1000: return wav
    content = [{"type": "text", "text": t["text"], "annotations": [{"type": "speech_metadata", "speaker": t["speaker"],
               "style": (t.get("style") or "natural") + "; brisk professional podcast pace"}]} for t in part]
    if len({t["speaker"] for t in part}) == 1:   # API needs both configured speakers only if both appear; keep config anyway
        pass
    body = {"model": TTS_MODEL, "input": [{"type": "user_input", "content": content}], "response_format": {"type": "audio"},
            "generation_config": {"speech_config": {"speakers": [{"speaker": s, "voice": v} for s, v in HOSTS.items()]}}}
    for attempt in range(4):
        d = post("https://generativelanguage.googleapis.com/v1beta/interactions", body)
        def walk(x):
            if isinstance(x, dict):
                if isinstance(x.get("data"), str) and len(x["data"]) > 1000: yield x["data"]
                for v in x.values(): yield from walk(v)
            elif isinstance(x, list):
                for v in x: yield from walk(v)
        blobs = list(walk(d))
        if blobs:
            raw = base64.b64decode(blobs[0])
            if raw[:4] != b"RIFF":
                open(wav + ".pcm", "wb").write(raw)
                subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", wav + ".pcm", wav], check=True)
            else:
                open(wav, "wb").write(raw)
            return wav
        time.sleep(10)
    raise RuntimeError(f"no audio for ep{num} chunk {i}")

def build(ep):
    num, title, mids = ep
    mp3 = os.path.join(OUT, f"ep{num}.mp3")
    if os.path.exists(mp3): return num, "exists"
    turns = write_script(num, title, mids)
    md = f"# Episode {int(num)}: {title}\n\n" + "\n\n".join(f"**{t['speaker']}:** {t['text']}" for t in turns) + "\n"
    open(os.path.join(OUT, f"ep{num}.md"), "w").write(md)
    parts = list(chunks(turns))
    with cf.ThreadPoolExecutor(3) as ex:
        wavs = list(ex.map(lambda a: tts(num, *a), enumerate(parts)))
    lst = os.path.join(TMP, f"ep{num}.txt")
    gap = os.path.join(TMP, "gap.wav")
    if not os.path.exists(gap):
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", "0.35", gap], check=True)
    open(lst, "w").write("".join(f"file '{w}'\nfile '{gap}'\n" for w in wavs))
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-ar", "24000", "-ac", "1",
                    "-c:a", "libmp3lame", "-b:a", "64k", "-metadata", f"title=Ep {int(num)}: {title}", "-metadata", "artist=Calling the Deal",
                    "-metadata", "album=Calling the Deal: M&A for builders", "-metadata", f"track={int(num)}", mp3], check=True)
    return num, f"{len(turns)} turns, {sum(len(t['text'].split()) for t in turns)} words, {len(parts)} chunks"

def index():
    eps = []
    for num, title, _ in EPISODES:
        mp3 = os.path.join(OUT, f"ep{num}.mp3")
        if not os.path.exists(mp3): continue
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3], capture_output=True, text=True).stdout or 0)
        eps.append({"num": num, "title": title, "file": f"ep{num}.mp3", "transcript": f"ep{num}.md", "seconds": round(dur), "bytes": os.path.getsize(mp3)})
    json.dump(eps, open(os.path.join(OUT, "episodes.json"), "w"), indent=1)
    return eps

if __name__ == "__main__":
    want = set(sys.argv[1:])
    todo = [e for e in EPISODES if not want or e[0] in want]
    with cf.ThreadPoolExecutor(int(os.environ.get("PAR", "4"))) as ex:
        futs = {ex.submit(build, e): e[0] for e in todo}
        for f in cf.as_completed(futs):
            try: print("ep", *f.result(), flush=True)
            except Exception as e: print("ep", futs[f], "FAILED", e, flush=True)
    eps = index(); print(len(eps), "episodes,", round(sum(e["seconds"] for e in eps) / 60), "minutes")
