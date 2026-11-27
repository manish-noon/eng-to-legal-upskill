#!/usr/bin/env python3
"""Mechanical checks for course module fragments. Usage: python3 .claude/skills/build-course/check_modules.py <course-id>"""
import glob, os, re, sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
VOID = {"br", "hr", "img", "input", "meta", "link", "wbr", "col"}


class Nest(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.stack, self.errs = [], []

    def handle_starttag(self, t, a):
        if t not in VOID:
            self.stack.append(t)

    def handle_endtag(self, t):
        if t in VOID:
            return
        if self.stack and self.stack[-1] == t:
            self.stack.pop()
        elif t in self.stack:
            while self.stack and self.stack[-1] != t:
                self.errs.append("unclosed <%s>" % self.stack.pop())
            self.stack.pop()
        else:
            self.errs.append("stray </%s>" % t)


def main(cid):
    files = sorted(glob.glob(os.path.join(ROOT, "courses", cid, "content", "*.html")))
    seen, bad = {}, 0
    for f in files:
        name = os.path.basename(f)[:-5]
        t = open(f).read()
        probs, warns = [], []
        if re.search(r"<(script|style|html|head|body)\b", t) or ' style="' in t:
            probs.append("forbidden tag or inline style")
        if "—" in t:
            probs.append("em dash x%d" % t.count("—"))
        for block in re.findall(r'<div class="quiz"(.*?)</div>', t, re.S):
            m = re.search(r'data-id="([^"]+)"', block)
            n = block.count("data-correct")
            if n != 1:
                probs.append("%s: %d data-correct" % (m.group(1) if m else "?", n))
        for qid in re.findall(r'data-id="([^"]+)"', t):
            if qid in seen:
                probs.append("duplicate id %s (also in %s)" % (qid, seen[qid]))
            seen[qid] = name
        for d in re.findall(r'<div class="num"[^>]*>', t):
            if not re.search(r'data-answer="-?[\d.]+(e-?\d+)?"', d):
                probs.append("numeric without valid data-answer: " + d[:60])
        p = Nest()
        p.feed(t)
        probs += p.errs[:5] + ["unclosed <%s>" % s for s in p.stack]
        prose = re.sub(r'<div class="(quiz|num)".*?<p class="explain">.*?</p>\s*</div>', " ", t, flags=re.S)
        prose = re.sub(r'<figure class="diagram">.*?</figure>|<details class="think">.*?</details>|<dl class="terms">.*?</dl>', " ", prose, flags=re.S)
        words = len(re.sub(r"<[^>]+>", " ", prose).split())
        nq = t.count('class="quiz"') + t.count('class="num"')
        nn = t.count('class="num"')
        nt = t.count('class="think"')
        if name.startswith("m"):
            if not 1300 <= words <= 2800:
                warns.append("prose words %d (target 1,500-2,300)" % words)
            if not 9 <= nq <= 12 or nn < 2:
                probs.append("items %d (numeric %d)" % (nq, nn))
            if not 3 <= nt <= 5:
                warns.append("think prompts %d (target 3-5)" % nt)
            if '<dl class="terms">' not in t:
                probs.append("no key terms")
        bad += bool(probs)
        print("%-5s %5d words %2d items %d think  %s%s" % (name, words, nq, nt, "; ".join(probs) or "ok", ("  [warn: " + "; ".join(warns) + "]") if warns else ""))
    print("%d files, %d with problems" % (len(files), bad))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "ma"))
