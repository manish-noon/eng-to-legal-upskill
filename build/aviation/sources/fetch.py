"""Fetch selected SEC exhibits. Run from any directory with python3 -I."""
import json
import re
import time
import urllib.error
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

HERE = Path(__file__).resolve().parent
DOCS = HERE.parents[2] / "courses/aviation/docs"


class Exhibit(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)

    def handle_starttag(self, tag, attrs):
        if tag in {"br", "p", "tr", "div", "hr"}:
            self.parts.append("\n")
        elif tag == "td":
            self.parts.append(" ")

    def handle_endtag(self, tag):
        if tag in {"p", "div", "tr"}:
            self.parts.append("\n")


def main():
    raw = HERE / "raw"
    raw.mkdir(exist_ok=True)
    for row in json.loads((HERE / "manifest.json").read_text()):
        path = raw / (row["id"] + ".html")
        if not path.exists():
            request = urllib.request.Request(row["url"], headers={
                "User-Agent": "Engineer-to-Legal curriculum research (github.com/manish-noon/eng-to-legal-upskill)"
            })
            try:
                with urllib.request.urlopen(request, timeout=45) as response:
                    payload = response.read()
            except urllib.error.HTTPError as error:
                if error.code not in (404, 502, 503, 504):
                    raise
                base, name = row["url"].rsplit("/", 1)
                accession = base.rsplit("/", 1)[1]
                filing = accession[:10] + "-" + accession[10:12] + "-" + accession[12:]
                request = urllib.request.Request(base + "/" + filing + ".txt", headers=request.headers)
                with urllib.request.urlopen(request, timeout=60) as response:
                    blocks = re.findall(b"<DOCUMENT>(.*?)</DOCUMENT>", response.read(), re.S | re.I)
                payload = next(block for block in blocks if re.search(
                    b"<FILENAME>" + re.escape(name.encode()) + rb"\s", block, re.I))
            path.write_bytes(payload)
            time.sleep(0.3)
        data = path.read_bytes().decode("utf-8", "replace")
        body = re.search(r"<TEXT>(.*?)</TEXT>", data, re.I | re.S)
        data = body.group(1) if body else data
        parser = Exhibit()
        parser.feed(data)
        content = "".join(parser.parts).replace("\xa0", " ")
        content = re.sub(r"[ \t]+", " ", content)
        content = re.sub(r"\n *\n(?: *\n)+", "\n\n", content).strip()
        if len(content) < 2000 or "Request Rate Threshold Exceeded" in content:
            raise ValueError(row["id"])
        content = "\n".join(line.rstrip() for line in content.splitlines()).strip()
        (DOCS / (row["id"] + ".txt")).write_text(content + "\n")
        print(row["id"], len(content), flush=True)


if __name__ == "__main__":
    main()
