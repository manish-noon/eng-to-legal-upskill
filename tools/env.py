"""Load KEY=VALUE pairs from the repo-root .env into os.environ (existing env vars win). Python 3.9+, no dependencies."""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_env(path=None):
    path = path or os.path.join(ROOT, ".env")
    if not os.path.exists(path):
        return
    for line in open(path):
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        k = k.strip().replace("export ", "")
        v = v.strip().strip('"').strip("'")
        os.environ.setdefault(k, v)
