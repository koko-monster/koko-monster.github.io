#!/usr/bin/env python3
"""Build the fourteen static reserved news-reader routes from one template."""

from __future__ import annotations

import json
import re
from pathlib import Path


SITE_ROOT = Path(__file__).resolve().parents[2]
CONTENT_ROOT = Path(__file__).resolve().parent


def main() -> None:
    manifest = json.loads((CONTENT_ROOT / "manifest.json").read_text(encoding="utf-8"))
    template = (SITE_ROOT / "news-reader.html").read_text(encoding="utf-8")
    for article in manifest["articles"]:
        rendered = re.sub(
            r'data-story-id="\d+"',
            f'data-story-id="{article["id"]}"',
            template,
            count=1,
        )
        rendered = re.sub(
            r"<title>.*?</title>",
            f'<title>{article["title"]["ja"]} — Kokomonster Easy News</title>',
            rendered,
            count=1,
        )
        destination = SITE_ROOT / article["reservedPath"].lstrip("/") / "index.html"
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(rendered, encoding="utf-8")
        print(destination.relative_to(SITE_ROOT))


if __name__ == "__main__":
    main()
