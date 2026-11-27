"""Check the curated fields and publish the flat static grader inputs."""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
COURSE = HERE.parents[2] / "courses/aviation"


def check_reading_cases():
    cases = json.loads((COURSE / "data/reading-cases.json").read_text())
    for case in cases:
        text = " ".join((COURSE / "docs" / (case["id"] + ".txt")).read_text().split())
        for row in case["questions"]:
            quote = " ".join(row["quote"].split())
            assert quote in text and 0 < len(quote.split()) <= 25 and row["section"], row
            if "choices" in row:
                assert row["choices"].count(row["value"]) == 1, row
        proof = case["proof"]
        scope = text.index(proof["scope"]) if "scope" in proof else 0
        start = text.index(proof["start"], scope)
        end = text.index(proof["end"], start + len(proof["start"]))
        assert proof["quote"] in text[start:end], proof
        assert proof["core"] in proof["quote"].lower(), proof
        assert proof["locations"].count(proof["locator"]) == 1, proof
    print("Checked %d reading cases and their citation windows" % len(cases))


def main():
    manifest = json.loads((HERE.parent / "sources/manifest.json").read_text())
    rows = []
    for family in ("purchase", "lease"):
        rows.extend(json.loads((HERE / (family + ".json")).read_text()))
    assert [row["id"] for row in rows] == [item["id"] for item in manifest]
    for row in rows:
        source = (COURSE / "docs" / (row["id"] + ".txt")).read_text()
        for field in row["fields"]:
            assert field["section"] and 0 < len(field["quote"].split()) <= 25, field
            assert field["quote"] in source, field
            assert field["choices"].count(field["value"]) == 1, field
            assert len(set(field["choices"])) == len(field["choices"]), field
    (COURSE / "data/precedents.json").write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n")
    print("Checked %d files and %d fields" % (len(rows), sum(len(r["fields"]) for r in rows)))


if __name__ == "__main__":
    main()
    check_reading_cases()
