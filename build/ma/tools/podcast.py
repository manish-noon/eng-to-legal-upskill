#!/usr/bin/env python3
"""Moved: the generic generator is tools/podcast.py; this course's config is build/ma/podcast.json.
Kept as a shim so old commands still work: python3 build/ma/tools/podcast.py [episode nums...]"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(here, "..", "..", "..", "tools"))
import podcast  # noqa: E402
podcast.main(["ma"] + sys.argv[1:])
