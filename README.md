# Engineer to Legal

Static, self-paced courses that teach legal practice to engineers. No backend: every page, quiz, lab grader and podcast player runs in the browser, and progress is kept in `localStorage` (export/import from the sidebar to move between devices).

## Courses
| Course | Path | What's in it |
|---|---|---|
| Calling the Deal: private M&A from zero | `courses/ma/` | 16 modules + diagnostic + final exam, 7 labs on 22 real SEC-filed share purchase agreements, 17-episode podcast (5h 17m), handbook, cheatsheet |

## Layout
```
index.html          course catalog (reads courses.json)
courses.json        list of courses shown on the catalog
shared/             design system shared by all courses (style.css, theme.js)
courses/<id>/       one self-contained static course
build/<id>/         sources and tools used to build a course (not needed to serve it)
```

## Build the next course
Two Claude Code skills in this repo encode how the first course was made:

| Skill | What it does |
|---|---|
| [`build-course`](.claude/skills/build-course/SKILL.md) | Topic + learner profile + end capability → `courses/<id>/`: goal-first syllabus, real primary documents, audited answer key, research file, parallel module writing to a fixed spec, mandatory verification pass, labs, diagnostic, final exam, handbook, cheatsheet, and the position → precedent → leverage → landing → value → advice method |
| [`build-podcast`](.claude/skills/build-podcast/SKILL.md) | One two-host episode per module with Gemini (script + multi-speaker TTS), MP3s, transcripts, RSS feed, player page |

Design guide: [`docs/DESIGN.md`](docs/DESIGN.md). Setup: `cp .env.example .env` and add a Gemini key (`.env` is gitignored; tools load it automatically). In Claude Code, ask e.g. "build a course on employment law for …" or run `/build-course`.

## Run locally
```
python3 -m http.server 8000      # then open http://localhost:8000
```

## Host
Any static host works. GitHub Pages: Settings → Pages → Deploy from branch → `main` / root. Then regenerate the podcast feed with the public URL:
```
python3 tools/build_feed.py ma https://<user>.github.io/<repo>/courses/ma
```

## Add a course
Use the `build-course` skill. In short: create `courses/<id>/` (structure of `courses/ma/`, own localStorage prefix), sources and tools in `build/<id>/`, then add an entry to `courses.json`.

## Rebuild a podcast
```
python3 tools/podcast.py ma            # all episodes, skips existing mp3s (config: build/ma/podcast.json)
python3 tools/podcast.py ma 05         # one episode (delete its mp3 first)
python3 tools/podcast.py ma --index    # episodes.json + words-per-minute check
```
Scripts: Gemini Pro, from the module text. Voices: Gemini TTS, two speakers. Reads `.env`.

## Caveats
- The lab answer key ships with the site (`courses/ma/data/precedents.json`), so anyone with the site can read it.
- Precedent data is machine-extracted from public SEC exhibits and spot-checked. Market statistics are from secondary summaries; verify before relying on them. Not legal advice.
