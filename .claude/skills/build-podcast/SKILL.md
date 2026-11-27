---
name: build-podcast
description: Generate the two-host audio podcast for a finished course in this repo (one episode per module), with Gemini script writing and Gemini multi-speaker TTS, then MP3s, transcripts, episodes.json, a static RSS feed and the player page. Use when asked to make, regenerate, extend or fix a course podcast or its player.
---

# Build a course podcast

Tool: `tools/podcast.py <course-id>` (generic, stdlib only, Python 3.9). Feed: `tools/build_feed.py <course-id> <public-base-url>`. Both load `.env` from the repo root (`GOOGLE_API_KEY`, `TEXT_MODEL`, `TTS_MODEL`; see `.env.example`). Needs `ffmpeg`/`ffprobe` on PATH. Worked example config: `build/ma/podcast.json`.

## 1. Format (what worked)
- One episode per module (plus one for the capstone), 16–21 min, ≈2,800–3,400 words (capstone 3,200–3,800).
- **Two hosts who are PEERS**, not teacher/student: a senior practitioner of the domain (precise, dry, explains mechanism, says where things land and what moves them) and an ex-CTO/operator who stress-tests with fact patterns, pushes back, and reframes in systems terms only when the analogy is exact. Give them names and voices per course.
- Cold open on a concrete scenario; one line names the episode; numbers spoken as people say them; at least two worked numeric examples by ear; close with a 3-point takeaway; no "welcome back", recaps, "great question" or sign-offs.
- Listener: the course learner profile (e.g. CTO with 17–18 years' experience; mature, word-efficient).
- Accuracy boundary = the module text. No invented statistics, cases, statutes, real deals; no real living people.

## 2. Config: `build/<id>/podcast.json`
```json
{
 "show": "Show title", "album": "Album tag", "topic": "what the series teaches",
 "feed_description": "one line for RSS", "guid_prefix": "show-slug",
 "listener": "who is listening and what they need",
 "hosts": {"Nadia": {"voice": "Kore", "role": "senior practitioner ..."},
           "Sam":   {"voice": "Charon", "role": "former CTO ..."}},
 "words": "2,800 to 3,400", "pace": "brisk professional podcast pace",
 "extra_rules": "optional extra numbered rules appended to the prompt",
 "prompt": "optional full override of the prompt template (same {placeholders})",
 "episodes": [
   {"num": "01", "title": "...", "sources": ["m00"]},
   {"num": "17", "title": "...", "words": "3,200 to 3,800",
    "sources": [{"file": "labs.js", "from": "const DEALS=", "to": "function runDeal", "label": "Capstone data:"}]}
 ]
}
```
Exactly two hosts (the TTS request takes at most two speakers). A source is a module id (`courses/<id>/content/<mid>.html`, HTML stripped, widgets dropped, quiz answers marked `[CORRECT]`) or a file slice.

## 3. Script: text model
`POST https://generativelanguage.googleapis.com/v1beta/models/$TEXT_MODEL:generateContent`, header `x-goog-api-key`. Body: `contents` = the prompt (template `DEFAULT_PROMPT` in `tools/podcast.py`), `generationConfig: {responseMimeType: "application/json", temperature: 0.8, maxOutputTokens: 32000}`. Output `{"turns":[{"speaker","text","style"}]}`. Parse defensively: skip `thought` parts; the model sometimes returns a list or a list wrapping `{"turns"}`; drop turns with unknown speakers or empty text.
Default `TEXT_MODEL=gemini-3.1-pro-preview` (used for the M&A series). **`gemini-4-neon` and `gemini-4-argon`** are available on the same key but untested: before switching, generate one episode's script with each (`TEXT_MODEL=gemini-4-neon python3 tools/podcast.py <id> --script-only 05`, using a separate cache dir or deleting `/tmp/<id>-podcast/ep05.json` between runs), and compare accuracy against the module, density, peer dynamic and length.

## 4. Voice: TTS via the Interactions API (not generateContent)
```
POST https://generativelanguage.googleapis.com/v1beta/interactions      (x-goog-api-key)
{"model": "gemini-3.8-flash-tts",
 "input": [{"type": "user_input", "content": [
    {"type": "text", "text": "<turn>", "annotations": [{"type": "speech_metadata", "speaker": "Nadia",
                                                        "style": "dry, amused; brisk professional podcast pace"}]}, ...]}],
 "response_format": {"type": "audio"},
 "generation_config": {"speech_config": {"speakers": [{"speaker": "Nadia", "voice": "Kore"}, {"speaker": "Sam", "voice": "Charon"}]}}}
```
Response contains base64 `audio/wav` (24 kHz mono 16-bit); if it is raw PCM (no RIFF header) wrap it with ffmpeg `-f s16le -ar 24000 -ac 1`. The tool walks the JSON for the first large `data` string.

## 5. Chunking, retry, caching, assembly
- Turns grouped into ≈2,200-character requests; 3 chunks in parallel per episode; `PAR` episodes in parallel (4–6 is fine).
- Retry 429/5xx and network errors with exponential backoff (8 s doubling, max 90 s, 7 attempts); 4 tries if a response has no audio.
- Cache: `/tmp/<id>-podcast/epNN.json` (script) and `epNN-CCC.wav` (chunks), so reruns resume. Existing MP3s are skipped: delete `courses/<id>/podcast/epNN.mp3` to rebuild one (and its cached `.json` to rewrite its script).
- Join with 0.35 s silence, ffmpeg → MP3 64 kbps mono 24 kHz with ID3 title/artist/album/track.
- Writes `courses/<id>/podcast/epNN.mp3`, `epNN.md` (transcript, `**Speaker:** text`), `episodes.json` (`num, title, file, transcript, seconds, bytes`).

## 6. Run order
1. Write `build/<id>/podcast.json`.
2. `python3 tools/podcast.py <id> --script-only 01` and read the script against the module (cheap).
3. `python3 tools/podcast.py <id> 01`, then **listen to the whole episode** before batching.
4. `python3 tools/podcast.py <id>` (all), then `python3 tools/podcast.py <id> --index`.
5. **Validate**: `--index` prints words per minute; ≈170 wpm (140–200 OK) means nothing was truncated. Anything flagged: delete that mp3 + chunk WAVs and rebuild. Spot-check that transcripts contain no invented numbers (grep figures against the module).
6. `python3 tools/build_feed.py <id> https://manish-noon.github.io/eng-to-legal-upskill/courses/<id>`.
7. Player page: copy `courses/ma/podcast.html` to `courses/<id>/podcast.html`; change the title, cover art text (`.art`), description, and the localStorage key (`ma_pod` → `<id>_pod`, also in the course's export/import key list). It plays in order, resumes per episode, speeds 1–2×, −15/+30 s, lock-screen MediaSession, inline transcripts. Set `"podcast": "courses/<id>/podcast.html"` in `courses.json`.
8. Commit MP3s (~8 MB per 20 min episode at 64 kbps; GitHub Pages serves HTTP Range, which seeking needs). Never commit `.env`.

## Pitfalls
- Two speakers max per TTS request; keep host names identical between config, script and speech_config.
- The model drifts into teacher/student or recaps if the prompt is weakened; keep the rules.
- Quotas: 429s are normal under parallel load; the backoff handles them. Do not raise chunk size above ~2,500 chars (long chunks truncate, which shows up as low wpm).
