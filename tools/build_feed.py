#!/usr/bin/env python3
"""Write courses/<id>/podcast/feed.xml (static RSS) from episodes.json for a public base URL.
Usage: python3 tools/build_feed.py <course-id> https://<user>.github.io/<repo>/courses/<id>
Show title/description come from build/<id>/podcast.json ("show", "feed_description", "guid_prefix").
"""
import json, os, sys, time
from xml.sax.saxutils import escape as x

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from env import ROOT  # noqa: E402

cid, base = sys.argv[1], sys.argv[2].rstrip("/")
cfg = json.load(open(os.path.join(ROOT, "build", cid, "podcast.json")))
pod = os.path.join(ROOT, "courses", cid, "podcast")
eps = json.load(open(os.path.join(pod, "episodes.json")))
show, desc, gp = cfg["show"], cfg.get("feed_description", cfg["show"]), cfg.get("guid_prefix", cid)
items = "".join(
    '<item><title>%s</title><enclosure url="%s/podcast/%s" length="%d" type="audio/mpeg"/>'
    '<guid isPermaLink="false">%s-ep%s</guid><itunes:episode>%d</itunes:episode><itunes:duration>%d</itunes:duration>'
    '<pubDate>%s</pubDate></item>' % (
        x("%d. %s" % (int(e["num"]), e["title"])), base, e["file"], e["bytes"], gp, e["num"], int(e["num"]), e["seconds"],
        time.strftime("%a, %d %b %Y %H:%M:%S +0000", time.gmtime(1795000000 - int(e["num"]) * 60)))
    for e in eps)
xml = ('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">'
       '<channel><title>%s</title><link>%s/podcast.html</link><description>%s</description>'
       '<language>en</language><itunes:type>serial</itunes:type><itunes:author>%s</itunes:author>%s</channel></rss>'
       % (x(show), base, x(desc), x(show), items))
open(os.path.join(pod, "feed.xml"), "w").write(xml)
print("wrote feed.xml with", len(eps), "episodes for", base)
