#!/usr/bin/env python3
"""Download the original Kokomonster sentence narration for existing stories."""

from __future__ import annotations

import json
import time
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parent


def main() -> None:
    downloaded = 0
    skipped = 0
    for article_path in sorted((ROOT / "articles").glob("*.json")):
        article = json.loads(article_path.read_text(encoding="utf-8"))
        if article["sourceType"] != "kokomonster-existing":
            continue
        article_audio = ROOT / "audio" / f"{article['id']}-{article['slug']}"
        article_audio.mkdir(parents=True, exist_ok=True)
        for sentence in article["sentences"]:
            source_url = sentence["sourceAudio"].get("sourceUrl")
            destination = (article_path.parent / sentence["sourceAudio"]["file"]).resolve()
            if not source_url:
                raise ValueError(f"Missing source audio URL: {article['id']} {sentence['id']}")
            if destination.exists() and destination.stat().st_size > 0:
                skipped += 1
                continue
            request = urllib.request.Request(source_url, headers={"User-Agent": "Kokomonster-local-content-builder/1.0"})
            with urllib.request.urlopen(request, timeout=30) as response:
                destination.write_bytes(response.read())
            downloaded += 1
            time.sleep(0.03)
    print(f"Downloaded {downloaded} source tracks; skipped {skipped} existing tracks")


if __name__ == "__main__":
    main()
