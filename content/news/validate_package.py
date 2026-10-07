#!/usr/bin/env python3
"""Validate local article, cover, localization, and audio integrity."""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

from build_content_package import merge_timing_tokens


ROOT = Path(__file__).resolve().parent


def checksum(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
    errors: list[str] = []
    audio_entries = []
    seen_ids = set()
    seen_urls = set()

    for item in manifest["articles"]:
        if item["id"] in seen_ids:
            errors.append(f"Duplicate ID: {item['id']}")
        if item["reservedUrl"] in seen_urls:
            errors.append(f"Duplicate URL: {item['reservedUrl']}")
        seen_ids.add(item["id"])
        seen_urls.add(item["reservedUrl"])

        article_path = ROOT / item["dataFile"]
        if not article_path.exists():
            errors.append(f"Missing article: {article_path}")
            continue
        article = json.loads(article_path.read_text(encoding="utf-8"))
        cover_path = (article_path.parent / article["cover"]["file"]).resolve()
        if not cover_path.exists():
            errors.append(f"Missing cover: {cover_path}")

        for language in ("ja", "en", "zhHant"):
            if not article["title"].get(language) or not article["summary"].get(language):
                errors.append(f"Missing {language} title/summary: {article['id']}")

        for sentence in article["sentences"]:
            for language in ("ja", "en", "zhHant"):
                if not sentence.get(language):
                    errors.append(f"Missing {language}: {article['id']} {sentence['id']}")
            speech_ja = sentence.get("speechJa", "")
            if not speech_ja:
                errors.append(f"Missing pronunciation-safe speechJa: {article['id']} {sentence['id']}")
            elif re.search(r"[A-Za-z]", speech_ja):
                errors.append(f"Unresolved Latin text in speechJa: {article['id']} {sentence['id']} {speech_ja}")
            audio_path = (article_path.parent / sentence["audio"]["file"]).resolve()
            if not audio_path.exists() or audio_path.stat().st_size < 500:
                errors.append(f"Missing/empty audio: {audio_path}")
            else:
                audio_entries.append({
                    "articleId": article["id"],
                    "kind": "sentence",
                    "itemId": sentence["id"],
                    "file": str(audio_path.relative_to(ROOT)),
                    "bytes": audio_path.stat().st_size,
                    "sha256": checksum(audio_path),
                })
            timing_file = sentence["audio"].get("timings")
            if timing_file:
                timing_path = (article_path.parent / timing_file).resolve()
                if not timing_path.exists():
                    errors.append(f"Missing timings: {timing_path}")
                else:
                    timings = json.loads(timing_path.read_text(encoding="utf-8"))
                    if not timings or any(not item.get("text") for item in timings):
                        errors.append(f"Empty/invalid timings: {timing_path}")
                    timed_words = merge_timing_tokens(timings)
                    tokens = sentence.get("tokens", [])
                    if len(tokens) != len(timed_words):
                        errors.append(
                            f"Token/timing mismatch: {article['id']} {sentence['id']} "
                            f"{len(tokens)} != {len(timed_words)}"
                        )
                    for token in tokens:
                        required = ("text", "reading", "romaji", "en", "zhHant", "offsetMs", "durationMs")
                        if any(token.get(field) in (None, "") for field in required):
                            errors.append(
                                f"Incomplete word token: {article['id']} {sentence['id']} {token.get('text')}"
                            )
            source_audio = sentence.get("sourceAudio")
            if source_audio:
                source_path = (article_path.parent / source_audio["file"]).resolve()
                if not source_path.exists() or source_path.stat().st_size < 500:
                    errors.append(f"Missing/empty source audio: {source_path}")
                else:
                    audio_entries.append({
                        "articleId": article["id"],
                        "kind": "source-sentence",
                        "itemId": sentence["id"],
                        "file": str(source_path.relative_to(ROOT)),
                        "bytes": source_path.stat().st_size,
                        "sha256": checksum(source_path),
                    })

        preview = article.get("cardPreview")
        if not preview or not preview.get("ja"):
            errors.append(f"Missing card preview: {article['id']}")
        else:
            if not preview.get("speechJa") or re.search(r"[A-Za-z]", preview["speechJa"]):
                errors.append(f"Missing/invalid card preview speechJa: {article['id']}")
            preview_audio = (article_path.parent / preview["audio"]).resolve()
            preview_timings = (article_path.parent / preview["timings"]).resolve()
            if not preview_audio.exists() or preview_audio.stat().st_size < 500:
                errors.append(f"Missing/empty card preview audio: {preview_audio}")
            else:
                audio_entries.append({
                    "articleId": article["id"],
                    "kind": "card-preview",
                    "itemId": "card-preview",
                    "file": str(preview_audio.relative_to(ROOT)),
                    "bytes": preview_audio.stat().st_size,
                    "sha256": checksum(preview_audio),
                })
            if not preview_timings.exists():
                errors.append(f"Missing card preview timings: {preview_timings}")
            else:
                timing_values = json.loads(preview_timings.read_text(encoding="utf-8"))
                if not timing_values:
                    errors.append(f"Empty card preview timings: {preview_timings}")

        for vocab in article["vocabulary"]:
            for field in ("surface", "reading", "en", "zhHant"):
                if not vocab.get(field):
                    errors.append(f"Missing vocabulary {field}: {article['id']} {vocab['id']}")
            if vocab.get("speechJa") != vocab.get("reading"):
                errors.append(f"Vocabulary speechJa does not match approved reading: {article['id']} {vocab['id']}")
            audio_path = (article_path.parent / vocab["audio"]["file"]).resolve()
            if not audio_path.exists() or audio_path.stat().st_size < 500:
                errors.append(f"Missing/empty vocab audio: {audio_path}")
            else:
                audio_entries.append({
                    "articleId": article["id"],
                    "kind": "vocabulary",
                    "itemId": vocab["id"],
                    "file": str(audio_path.relative_to(ROOT)),
                    "bytes": audio_path.stat().st_size,
                    "sha256": checksum(audio_path),
                })

    if len(manifest["articles"]) != 14:
        errors.append(f"Expected 14 articles, found {len(manifest['articles'])}")
    if not (ROOT / "pronunciation-audit.json").exists():
        errors.append("Missing pronunciation-audit.json")

    audio_manifest = {
        "schemaVersion": 1,
        "trackCount": len(audio_entries),
        "tracks": audio_entries,
    }
    (ROOT / "audio-manifest.json").write_text(
        json.dumps(audio_manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    if errors:
        print("Validation failed:")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)

    print(f"Validated {len(manifest['articles'])} articles")
    print(f"Validated {len(audio_entries)} audio files")
    print("No missing covers, localizations, pronunciation-safe speech, audio files, or word-timing files")


if __name__ == "__main__":
    main()
