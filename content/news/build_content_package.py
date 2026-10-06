#!/usr/bin/env python3
"""Build the local Kokomonster news-reader content package.

The script intentionally does not publish anything. It merges the preserved
Kokomonster API snapshots, editorial translations, and three demo articles.
"""

from __future__ import annotations

import html
import json
from pathlib import Path
from urllib.parse import quote


ROOT = Path(__file__).resolve().parent
SITE_ROOT = ROOT.parent.parent
ARTICLE_ROOT = ROOT / "articles"
SCRIPT_ROOT = ROOT / "scripts"
AUDIO_ROOT = ROOT / "audio"

BASE_URL = "https://kokomonster.com"
VOICE = "ja-JP-NanamiNeural"
SOURCE_IDS = [7648, 7642, 7611, 7606, 7605, 7596, 7594, 7581, 7567, 7561, 7542]

# Full-article Nanami narration, rounded up to the next whole minute. These
# values were measured from the generated sentence tracks, not estimated from
# the card copy.
READING_MINUTES = {
    7542: 2,
    7561: 2,
    7567: 2,
    7581: 1,
    7594: 2,
    7596: 1,
    7605: 2,
    7606: 1,
    7611: 1,
    7642: 2,
    7648: 2,
    9991: 1,
    9992: 1,
    9993: 1,
}

CATEGORY_LABELS = {
    "Global": {"ja": "国際", "en": "Global", "zhHant": "國際"},
    "Business": {"ja": "ビジネス", "en": "Business", "zhHant": "商業"},
    "Environment": {"ja": "環境", "en": "Environment", "zhHant": "環境"},
    "Sports": {"ja": "スポーツ", "en": "Sports", "zhHant": "體育"},
}

COVERS = {
    7648: "royal-letter.png",
    9991: "sumo-yokozuna.png",
    9992: "suica-mascot-vote.png",
    9993: "earthquake-preparedness.png",
    7642: "un-world-map.png",
    7611: "mountain-landslide.png",
    7606: "ukraine-response.png",
    7605: "tibet-landslide.png",
    7596: "border-flash-flood.png",
    7594: "royal-return.png",
    7581: "iran-women.png",
    7567: "trade-talks.png",
    7561: "housing-construction.png",
    7542: "aircraft-carrier.png",
}

# Speech-only substitutions. Display copy remains untouched; these strings are
# passed to Nanami so product names, initials and decimal magnitudes are read
# consistently. Article vocabulary readings are applied in addition to these.
SPEECH_OVERRIDES = {
    "ヨルダン川西岸地区": "ヨルダンがわせいがんちく",
    "米東部時間": "べいとうぶじかん",
    "カリフォルニア州": "カリフォルニアしゅう",
    "国連総会": "こくれんそうかい",
    "英内務省": "えいないむしょう",
    "シガツェ市": "シガツェし",
    "青森県": "あおもりけん",
    "キーウ州": "キーウしゅう",
    "米空母": "べいくうぼ",
    "米軍": "べいぐん",
    "米国": "べいこく",
    "英国": "えいこく",
    "Suica": "スイカ",
    "IC": "アイシー",
    "SNS": "エスエヌエス",
    "10月19日": "じゅうがつじゅうくにち",
    "8月13日": "はちがつじゅうさんにち",
    "2022年": "にせんにじゅうにねん",
    "午前0時": "ごぜんれいじ",
    "50％": "ごじゅっぱーせんと",
    "26日": "にじゅうろくにち",
    "31日": "さんじゅういちにち",
    "21日": "にじゅういちにち",
    "18日": "じゅうはちにち",
    "7日": "なのか",
    "4日": "よっか",
    "3月": "さんがつ",
    "7.5": "ななてんご",
}


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def speech_text(text: str, vocabulary: list[dict]) -> str:
    """Return pronunciation-safe synthesis text without changing UI copy."""
    replacements = {
        **SPEECH_OVERRIDES,
        **{item["surface"]: item["reading"] for item in vocabulary},
    }
    spoken = text
    for surface, reading in sorted(replacements.items(), key=lambda item: len(item[0]), reverse=True):
        spoken = spoken.replace(surface, reading)
    return spoken


def ssml_for(text: str) -> str:
    escaped = html.escape(text)
    return (
        '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" '
        'xml:lang="ja-JP">\n'
        f'  <voice name="{VOICE}">\n'
        '    <prosody rate="0%" pitch="0%">'
        f'{escaped}</prosody>\n'
        '  </voice>\n'
        '</speak>\n'
    )


def source_articles() -> dict[int, dict]:
    combined = []
    for filename in ("kokomonster-api-ja-page-1.json", "kokomonster-api-ja-page-2.json"):
        combined.extend(read_json(ROOT / "source" / filename)["data"])
    return {int(article["id"]): article for article in combined if int(article["id"]) in SOURCE_IDS}


def local_cover(article_id: int) -> str:
    return f"../../../assets/news-covers/{COVERS[article_id]}"


def build_source_article(raw: dict, overlay: dict, keyword_expansions: dict) -> dict:
    article_id = int(raw["id"])
    slug = overlay["slug"]
    category_key = raw["category"]["key"]
    pieces = sorted(raw["newsPieces"], key=lambda value: int(value["order"]))
    translated = overlay["sentences"]
    if len(pieces) != len(translated):
        raise ValueError(f"Translation count mismatch for {article_id}: {len(pieces)} != {len(translated)}")

    article_dir = f"{article_id}-{slug}"
    vocabulary = [
        *overlay["vocabulary"],
        *keyword_expansions.get(str(article_id), []),
    ]
    sentences = []
    for index, (piece, translation) in enumerate(zip(pieces, translated), start=1):
        audio_name = f"KM-NEWS-{article_id}-{slug}-sentence-{index:02d}-ja-Nanami.mp3"
        source_audio_name = f"KM-NEWS-{article_id}-{slug}-sentence-{index:02d}-ja-source.mp3"
        sentences.append({
            "id": f"s{index:02d}",
            "sourcePieceId": piece["id"],
            "sourceOrder": piece["order"],
            "ja": piece["content"],
            "speechJa": speech_text(piece["content"], vocabulary),
            "en": translation["en"],
            "zhHant": translation["zhHant"],
            "tokens": [],
            "audio": {
                "file": f"../audio/{article_dir}/{audio_name}",
                "voice": VOICE,
                "timings": f"../audio/{article_dir}/{audio_name[:-4]}-timings.json",
            },
            "sourceAudio": {
                "file": f"../audio/{article_dir}/{source_audio_name}",
                "sourceUrl": piece.get("audioFileUrl"),
                "voice": "Kokomonster source narration",
                "tokens": [
                    {"text": token["text"], "offsetMs": token["offset"]}
                    for token in piece.get("wordBoundaryArray", [])
                ],
            },
        })

    encoded_title = quote(raw["title"], safe="")
    reserved_path = f"/ja/news/{category_key}/{slug}-{article_id}"
    source_url = f"{BASE_URL}/ja/news/{category_key}/{encoded_title}-{article_id}"
    return {
        "schemaVersion": 1,
        "id": article_id,
        "slug": slug,
        "sourceType": "kokomonster-existing",
        "demoOnly": False,
        "date": raw["date"],
        "level": overlay["level"],
        "category": {"key": category_key, **CATEGORY_LABELS[category_key]},
        "reservedPath": reserved_path,
        "reservedUrl": f"{BASE_URL}{reserved_path}",
        "sourceUrl": source_url,
        "title": {"ja": raw["title"], **overlay["title"]},
        "summary": {"ja": raw["summary"], **overlay["summary"]},
        "cover": {
            "file": local_cover(article_id),
            "sourceUrl": raw["cover"]["fileUrl"],
        },
        "sentences": sentences,
        "vocabulary": add_vocab_audio(article_id, slug, vocabulary),
        "readingMinutes": READING_MINUTES[article_id],
        "keywordCount": len(vocabulary),
        "playbackRates": [0.8, 1.0, 1.2],
        "audioPolicy": "Play Nanami sentence files sequentially; do not pitch-shift. Use each timing JSON at the selected playback rate. Source narration is retained only as an editorial backup.",
    }


def add_vocab_audio(article_id: int, slug: str, vocabulary: list[dict]) -> list[dict]:
    article_dir = f"{article_id}-{slug}"
    enriched = []
    for index, item in enumerate(vocabulary, start=1):
        audio_name = f"KM-NEWS-{article_id}-{slug}-vocab-{index:02d}-ja-Nanami.mp3"
        enriched.append({
            "id": f"v{index:02d}",
            **item,
            "speechJa": item["reading"],
            "audio": {
                "file": f"../audio/{article_dir}/{audio_name}",
                "voice": VOICE,
            },
        })
    return enriched


def build_demo_article(raw: dict, keyword_expansions: dict) -> dict:
    article_id = int(raw["id"])
    slug = raw["slug"]
    article_dir = f"{article_id}-{slug}"
    reserved_path = f"/ja/news/{raw['category']['key']}/{slug}-{article_id}"
    vocabulary = [
        *raw["vocabulary"],
        *keyword_expansions.get(str(article_id), []),
    ]
    sentences = []
    for index, sentence in enumerate(raw["sentences"], start=1):
        audio_name = f"KM-NEWS-{article_id}-{slug}-sentence-{index:02d}-ja-Nanami.mp3"
        sentences.append({
            "id": f"s{index:02d}",
            **sentence,
            "speechJa": speech_text(sentence["ja"], vocabulary),
            "tokens": [],
            "audio": {
                "file": f"../audio/{article_dir}/{audio_name}",
                "voice": VOICE,
                "timings": f"../audio/{article_dir}/{audio_name[:-4]}-timings.json",
            },
        })
    return {
        "schemaVersion": 1,
        "id": article_id,
        "slug": slug,
        "sourceType": "kokomonster-demo",
        "demoOnly": True,
        "editorialNote": "Demo copy for interface development; verify the event and date before publication.",
        "date": raw["date"],
        "level": raw["level"],
        "category": raw["category"],
        "reservedPath": reserved_path,
        "reservedUrl": f"{BASE_URL}{reserved_path}",
        "sourceUrl": None,
        "title": raw["title"],
        "summary": raw["summary"],
        "cover": {"file": raw["cover"], "sourceUrl": None},
        "sentences": sentences,
        "vocabulary": add_vocab_audio(article_id, slug, vocabulary),
        "readingMinutes": READING_MINUTES[article_id],
        "keywordCount": len(vocabulary),
        "playbackRates": [0.8, 1.0, 1.2],
        "audioPolicy": "Use one Nanami track per sentence and scale playback speed in the UI. Use timing JSON for word highlighting.",
    }


def write_scripts(article: dict) -> None:
    prefix = f"KM-NEWS-{article['id']}-{article['slug']}"
    display_text = "\n".join(sentence["ja"] for sentence in article["sentences"])
    speech_text_value = "\n".join(sentence["speechJa"] for sentence in article["sentences"])
    (SCRIPT_ROOT / f"{prefix}-ja-script.txt").write_text(display_text + "\n", encoding="utf-8")
    (SCRIPT_ROOT / f"{prefix}-ja-speech-script.txt").write_text(speech_text_value + "\n", encoding="utf-8")
    (SCRIPT_ROOT / f"{prefix}-ja-Nanami.ssml").write_text(ssml_for(speech_text_value), encoding="utf-8")


def main() -> None:
    ARTICLE_ROOT.mkdir(parents=True, exist_ok=True)
    SCRIPT_ROOT.mkdir(parents=True, exist_ok=True)
    AUDIO_ROOT.mkdir(parents=True, exist_ok=True)

    overlays = read_json(ROOT / "localization-overlay.json")
    keyword_expansions = read_json(ROOT / "keyword-expansions.json")
    sources = source_articles()
    if set(SOURCE_IDS) - set(sources):
        raise ValueError(f"Missing source IDs: {sorted(set(SOURCE_IDS) - set(sources))}")

    articles = [
        build_source_article(sources[article_id], overlays[str(article_id)], keyword_expansions)
        for article_id in SOURCE_IDS
    ]
    articles.extend(
        build_demo_article(article, keyword_expansions)
        for article in read_json(ROOT / "demo-articles.json")
    )

    previews = {int(item["id"]): item for item in read_json(ROOT / "card-previews.json")}
    for article in articles:
        preview = previews[article["id"]]
        filename = f"KM-NEWS-{article['id']}-{article['slug']}-card-preview-ja-Nanami.mp3"
        article["cardPreview"] = {
            "ja": preview["ja"],
            "speechJa": speech_text(preview["ja"], article["vocabulary"]),
            "audio": f"../audio/{article['id']}-{article['slug']}/{filename}",
            "timings": f"../audio/{article['id']}-{article['slug']}/{filename[:-4]}-timings.json",
            "voice": VOICE,
        }

    display_order = [7648, 9991, 9992, 9993, 7642, 7611, 7606, 7605, 7596, 7594, 7581, 7567, 7561, 7542]
    by_id = {article["id"]: article for article in articles}
    articles = [by_id[article_id] for article_id in display_order]

    manifest = {
        "schemaVersion": 1,
        "baseUrl": BASE_URL,
        "routePattern": "/ja/news/{category}/{english-slug}-{id}",
        "voice": {
            "demoNarration": VOICE,
            "rate": "0%",
            "format": "audio-24khz-160kbitrate-mono-mp3",
            "uiPlaybackRates": [0.8, 1.0, 1.2],
        },
        "articles": [
            {
                "id": article["id"],
                "sourceType": article["sourceType"],
                "category": article["category"]["key"],
                "slug": article["slug"],
                "title": article["title"],
                "readingMinutes": article["readingMinutes"],
                "keywordCount": article["keywordCount"],
                "reservedPath": article["reservedPath"],
                "reservedUrl": article["reservedUrl"],
                "dataFile": f"articles/{article['id']}-{article['slug']}.json",
            }
            for article in articles
        ],
    }
    write_json(ROOT / "manifest.json", manifest)

    for article in articles:
        write_json(ARTICLE_ROOT / f"{article['id']}-{article['slug']}.json", article)
        write_scripts(article)
        (AUDIO_ROOT / f"{article['id']}-{article['slug']}").mkdir(parents=True, exist_ok=True)

    pronunciation_audit = {
        "voice": VOICE,
        "policy": "Display Japanese is preserved. Nanami receives speechJa with approved vocabulary readings and speech-only overrides.",
        "globalOverrides": SPEECH_OVERRIDES,
        "articles": [
            {
                "id": article["id"],
                "slug": article["slug"],
                "vocabularyReadings": {
                    item["surface"]: item["reading"] for item in article["vocabulary"]
                },
                "changedSentences": [
                    {
                        "id": sentence["id"],
                        "display": sentence["ja"],
                        "speech": sentence["speechJa"],
                    }
                    for sentence in article["sentences"]
                    if sentence["ja"] != sentence["speechJa"]
                ],
            }
            for article in articles
        ],
    }
    write_json(ROOT / "pronunciation-audit.json", pronunciation_audit)

    print(f"Built {len(articles)} articles")
    print(f"Sentence count: {sum(len(article['sentences']) for article in articles)}")
    print(f"Vocabulary count: {sum(len(article['vocabulary']) for article in articles)}")


if __name__ == "__main__":
    main()
