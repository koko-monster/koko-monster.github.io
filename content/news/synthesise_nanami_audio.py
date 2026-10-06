#!/usr/bin/env python3
"""Create Nanami MP3s and word timings for demo narration and all vocab.

Requires `edge-tts` on PYTHONPATH. This is suitable for local prototype audio;
production deployment should use the project's licensed Azure Speech resource.
"""

from __future__ import annotations

import asyncio
import argparse
import json
from pathlib import Path

import edge_tts


ROOT = Path(__file__).resolve().parent
VOICE = "ja-JP-NanamiNeural"


async def synthesize(text: str, destination: Path, timing_path: Path | None = None) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    communicator = edge_tts.Communicate(text=text, voice=VOICE, rate="+0%", pitch="+0Hz")
    timing_events = []
    audio = bytearray()
    async for chunk in communicator.stream():
        if chunk["type"] == "audio":
            audio.extend(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            timing_events.append({
                "text": chunk["text"],
                "offsetMs": round(chunk["offset"] / 10_000, 3),
                "durationMs": round(chunk["duration"] / 10_000, 3),
            })
    destination.write_bytes(audio)
    if timing_path is not None:
        timing_path.write_text(json.dumps(timing_events, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="Regenerate every Nanami sentence and vocabulary track")
    args = parser.parse_args()
    jobs = []
    articles_by_id = {}
    for article_path in sorted((ROOT / "articles").glob("*.json")):
        article = json.loads(article_path.read_text(encoding="utf-8"))
        articles_by_id[int(article["id"])] = (article_path, article)
        for sentence in article["sentences"]:
            destination = (article_path.parent / sentence["audio"]["file"]).resolve()
            timing_path = (article_path.parent / sentence["audio"]["timings"]).resolve()
            if args.force or not destination.exists() or destination.stat().st_size == 0 or not timing_path.exists():
                jobs.append(synthesize(sentence.get("speechJa", sentence["ja"]), destination, timing_path))
        for vocab in article["vocabulary"]:
            destination = (article_path.parent / vocab["audio"]["file"]).resolve()
            if args.force or not destination.exists() or destination.stat().st_size == 0:
                jobs.append(synthesize(vocab.get("speechJa", vocab.get("reading", vocab["surface"])), destination))

    previews = json.loads((ROOT / "card-previews.json").read_text(encoding="utf-8"))
    for preview in previews:
        article_path, article = articles_by_id[int(preview["id"])]
        filename = f"KM-NEWS-{article['id']}-{article['slug']}-card-preview-ja-Nanami.mp3"
        destination = ROOT / "audio" / f"{article['id']}-{article['slug']}" / filename
        timing_path = destination.with_name(destination.stem + "-timings.json")
        # Card summaries are editorial copy and may change independently of the
        # article body, so always keep these short tracks in sync.
        jobs.append(synthesize(article["cardPreview"].get("speechJa", preview["ja"]), destination, timing_path))

    # Keep the public synthesis endpoint comfortable; run in small batches.
    completed = 0
    for start in range(0, len(jobs), 4):
        await asyncio.gather(*jobs[start:start + 4])
        completed += len(jobs[start:start + 4])
        print(f"Synthesised {completed}/{len(jobs)} tracks")


if __name__ == "__main__":
    asyncio.run(main())
