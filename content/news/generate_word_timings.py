#!/usr/bin/env python3
"""Create UI word timing JSON for Nanami tracks.

Japanese Edge narration exposes sentence boundaries but not word boundaries.
For existing articles, original Kokomonster word starts are scaled to the new
Nanami duration. For demo articles, Janome segmentation is distributed across
the measured MP3 duration. These timings are for visual highlighting only.
"""

from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

from janome.tokenizer import Tokenizer


ROOT = Path(__file__).resolve().parent
TOKENIZER = Tokenizer()
PUNCTUATION = set("、。！？・「」『』（）()[]【】…—―,:;!?")


def audio_duration_ms(path: Path) -> float:
    result = subprocess.run(["afinfo", str(path)], check=True, capture_output=True, text=True)
    match = re.search(r"estimated duration:\s*([0-9.]+) sec", result.stdout)
    if not match:
        raise RuntimeError(f"Could not read duration: {path}")
    return float(match.group(1)) * 1000


def segment(text: str) -> list[str]:
    values = [token.surface for token in TOKENIZER.tokenize(text) if token.surface.strip()]
    return values or [text]


def merge_terms(tokens: list[str], terms: list[str]) -> list[str]:
    """Merge tokenizer fragments that form an editorial vocabulary term."""
    output = []
    index = 0
    ordered_terms = sorted((term for term in terms if term), key=len, reverse=True)
    while index < len(tokens):
        matched = None
        matched_count = 0
        for term in ordered_terms:
            combined = ""
            for end in range(index, len(tokens)):
                combined += tokens[end]
                if combined == term:
                    matched = term
                    matched_count = end - index + 1
                    break
                if not term.startswith(combined):
                    break
            if matched:
                break
        if matched:
            output.append(matched)
            index += matched_count
        else:
            output.append(tokens[index])
            index += 1
    return output


def distribute(tokens: list[str], duration_ms: float) -> list[dict]:
    start_pad = min(100.0, duration_ms * 0.03)
    end_pad = min(180.0, duration_ms * 0.05)
    usable = max(1.0, duration_ms - start_pad - end_pad)
    weights = [max(0.25, sum(0.25 if char in PUNCTUATION else 1.0 for char in token)) for token in tokens]
    unit = usable / sum(weights)
    output = []
    cursor = start_pad
    for token, weight in zip(tokens, weights):
        token_duration = unit * weight
        output.append({
            "text": token,
            "offsetMs": round(cursor, 3),
            "durationMs": round(token_duration, 3),
        })
        cursor += token_duration
    return output


def scale_source(tokens: list[dict], duration_ms: float) -> list[dict]:
    if not tokens:
        return []
    starts = [float(token["offsetMs"]) for token in tokens]
    source_end = max(starts[-1] + 350.0, 1.0)
    usable_end = max(duration_ms - 120.0, 1.0)
    scale = usable_end / source_end
    output = []
    for index, token in enumerate(tokens):
        start = starts[index] * scale
        next_start = starts[index + 1] * scale if index + 1 < len(starts) else usable_end
        output.append({
            "text": token["text"],
            "offsetMs": round(start, 3),
            "durationMs": round(max(45.0, next_start - start), 3),
        })
    return output


def main() -> None:
    written = 0
    articles_by_id = {}
    for article_path in sorted((ROOT / "articles").glob("*.json")):
        article = json.loads(article_path.read_text(encoding="utf-8"))
        articles_by_id[int(article["id"])] = article
        for sentence in article["sentences"]:
            audio_path = (article_path.parent / sentence["audio"]["file"]).resolve()
            timing_path = (article_path.parent / sentence["audio"]["timings"]).resolve()
            duration_ms = audio_duration_ms(audio_path)
            source_tokens = sentence.get("sourceAudio", {}).get("tokens", [])
            timings = scale_source(source_tokens, duration_ms)
            if not timings:
                terms = [item["surface"] for item in article.get("vocabulary", [])]
                timings = distribute(merge_terms(segment(sentence["ja"]), terms), duration_ms)
            timing_path.write_text(json.dumps(timings, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            written += 1
    previews = json.loads((ROOT / "card-previews.json").read_text(encoding="utf-8"))
    for preview in previews:
        article = articles_by_id[int(preview["id"])]
        filename = f"KM-NEWS-{article['id']}-{article['slug']}-card-preview-ja-Nanami.mp3"
        audio_path = ROOT / "audio" / f"{article['id']}-{article['slug']}" / filename
        timing_path = audio_path.with_name(audio_path.stem + "-timings.json")
        terms = [item["surface"] for item in article.get("vocabulary", [])]
        timings = distribute(merge_terms(segment(preview["ja"]), terms), audio_duration_ms(audio_path))
        timing_path.write_text(json.dumps(timings, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        written += 1
    print(f"Wrote {written} word-timing files")


if __name__ == "__main__":
    main()
