#!/usr/bin/env python3
"""Moved to tools/build_feed.py. Shim: python3 build/ma/tools/build_feed.py <base-url>"""
import os, subprocess, sys
tool = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "tools", "build_feed.py")
sys.exit(subprocess.call([sys.executable, tool, "ma"] + sys.argv[1:]))
