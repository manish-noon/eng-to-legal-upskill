#!/usr/bin/env python3
"""Write courses/ma/podcast/feed.xml (static RSS) for a given public base URL.
Usage: python3 build/ma/tools/build_feed.py https://manish-noon.github.io/eng-to-legal-upskill/courses/ma
"""
import json, os, sys, time
from xml.sax.saxutils import escape as x
base = sys.argv[1].rstrip("/")
pod = os.path.join(os.path.dirname(__file__), "..", "..", "..", "courses", "ma", "podcast")
eps = json.load(open(os.path.join(pod, "episodes.json")))
items = "".join(
    f'<item><title>{x(str(int(e["num"])) + ". " + e["title"])}</title>'
    f'<enclosure url="{base}/podcast/{e["file"]}" length="{e["bytes"]}" type="audio/mpeg"/>'
    f'<guid isPermaLink="false">calling-the-deal-ep{e["num"]}</guid><itunes:episode>{int(e["num"])}</itunes:episode>'
    f'<itunes:duration>{e["seconds"]}</itunes:duration>'
    f'<pubDate>{time.strftime("%a, %d %b %Y %H:%M:%S +0000", time.gmtime(1795000000 - int(e["num"]) * 60))}</pubDate></item>'
    for e in eps)
xml = (f'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">'
       f'<channel><title>Calling the Deal</title><link>{base}/podcast.html</link>'
       f'<description>Private M&amp;A for builders: a partner and an ex-CTO, one module per episode.</description>'
       f'<language>en</language><itunes:type>serial</itunes:type><itunes:author>Calling the Deal</itunes:author>{items}</channel></rss>')
open(os.path.join(pod, "feed.xml"), "w").write(xml)
print("wrote feed.xml with", len(eps), "episodes for", base)
