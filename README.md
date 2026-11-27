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

## Run locally
```
python3 -m http.server 8000      # then open http://localhost:8000
```

## Host
Any static host works. GitHub Pages: Settings → Pages → Deploy from branch → `main` / root. Then regenerate the podcast feed with the public URL:
```
python3 build/ma/tools/build_feed.py https://<user>.github.io/<repo>/courses/ma
```

## Add a course
1. Create `courses/<id>/` (copy `courses/ma/` as a template: `data.js` lists modules and labs, `content/` holds module HTML fragments).
2. Use a distinct localStorage prefix if the course has its own progress (the M&A course uses `ma_*`).
3. Add an entry to `courses.json`.

## Rebuild the M&A podcast
```
GOOGLE_API_KEY=... python3 build/ma/tools/podcast.py          # all episodes, skips existing mp3s
GOOGLE_API_KEY=... python3 build/ma/tools/podcast.py 05       # one episode (delete its mp3 first)
```
Scripts: Gemini Pro, from the module text. Voices: Gemini TTS, two speakers.

## Caveats
- The lab answer key ships with the site (`courses/ma/data/precedents.json`), so anyone with the site can read it.
- Precedent data is machine-extracted from public SEC exhibits and spot-checked. Market statistics are from secondary summaries; verify before relying on them. Not legal advice.
