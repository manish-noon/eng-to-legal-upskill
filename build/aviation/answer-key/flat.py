"""Check the curated fields and publish the flat static grader inputs."""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
COURSE = HERE.parents[2] / "courses/aviation"


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
