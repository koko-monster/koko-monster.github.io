#!/usr/bin/env python3
"""Build the local Kokomonster news-reader content package.

The script intentionally does not publish anything. It merges the preserved
Kokomonster API snapshots, editorial translations, and three demo articles.
"""

from __future__ import annotations

import html
import json
import re
from pathlib import Path
from urllib.parse import quote


ROOT = Path(__file__).resolve().parent
SITE_ROOT = ROOT.parent.parent
ARTICLE_ROOT = ROOT / "articles"
SCRIPT_ROOT = ROOT / "scripts"
AUDIO_ROOT = ROOT / "audio"
TOKEN_PUNCTUATION = re.compile(r"^[、。！？,.!?「」『』（）()：:；;・…]+$")
TOKEN_INLINE_PUNCTUATION = re.compile(r"[、。！？,.!?「」『』（）()：:；;・…\s]+")
TOKEN_MERGE_PATTERNS = sorted((
    ("に", "つい", "て"), ("に", "よっ", "て"), ("に", "よれ", "ば"),
    ("と", "して"), ("で", "ある", "と"), ("で", "は", "ない"),
    ("エイ", "ブラハム"), ("ティ", "ムール"), ("グリーン", "ランド"),
    ("イコール", "アース"), ("インド", "洋"), ("英", "内務省"),
    ("米", "東部", "時間"), ("土石", "流"), ("数", "百人"),
    ("特", "に"), ("さら", "に"), ("共", "に"), ("対し", "て"),
    ("通じ", "て"), ("始ま", "る"), ("使い", "やすい"),
    ("お", "受け", "します"), ("屈し", "て", "い", "ない"),
    ("復帰", "せ", "ず"), ("行わ", "れています"), ("発生", "しました"),
    ("お", "受け", "し", "ます"), ("選ば", "れ", "た"), ("発表", "さ", "れ", "ます"),
    ("確認", "し", "て", "い", "ます"), ("テーマ", "に", "し", "て", "い", "ます"),
    ("交通", "系"), ("IC", "カード"), ("好き", "な"), ("登場", "する"),
    ("専門", "家"), ("一", "人"), ("一", "日"), ("一", "回"),
), key=len, reverse=True)

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
    7648: "royal-letter.webp",
    9991: "sumo-yokozuna.webp",
    9992: "suica-mascot-vote.webp",
    9993: "earthquake-preparedness.webp",
    7642: "un-world-map.webp",
    7611: "mountain-landslide.webp",
    7606: "ukraine-response.webp",
    7605: "tibet-landslide.webp",
    7596: "border-flash-flood.webp",
    7594: "royal-return.webp",
    7581: "iran-women.webp",
    7567: "trade-talks.webp",
    7561: "housing-construction.webp",
    7542: "aircraft-carrier.webp",
}

INLINE_IMAGES = {
    7648: [
        {
            "afterSentence": 2,
            "file": "../../../assets/news-covers/royal-letter-newsroom.webp",
            "alt": "Koko and Gohanko examine the official royal letter at a newsroom desk",
        },
        {
            "afterSentence": 6,
            "file": "../../../assets/news-covers/royal-status-explainer.webp",
            "alt": "Boombear and Rabbit explain royal duties and the move to North America",
        },
    ],
}

STORYBOARDS = {
    9991: "onosato-storyboard.webp",
    9992: "suica-mascot-storyboard.webp",
    9993: "aomori-earthquake-storyboard.webp",
    7642: "un-world-map-storyboard.webp",
    7611: "nepal-china-landslide-storyboard.webp",
    7606: "ukraine-response-storyboard.webp",
    7605: "nepal-tibet-landslide-storyboard.webp",
    7596: "border-flash-flood-storyboard.webp",
    7594: "royal-return-storyboard.webp",
    7581: "iran-women-storyboard.webp",
    7567: "trade-talks-storyboard.webp",
    7561: "housing-construction-storyboard.webp",
    7542: "aircraft-carrier-storyboard.webp",
}


def inline_images(article_id: int, sentence_count: int) -> list[dict]:
    if article_id in INLINE_IMAGES:
        return INLINE_IMAGES[article_id]
    filename = STORYBOARDS[article_id]
    first = max(1, sentence_count // 3)
    second = max(first + 1, (sentence_count * 2) // 3)
    return [
        {
            "afterSentence": first,
            "file": f"../../../assets/news-covers/{filename}",
            "crop": "top",
            "alt": "First supporting Kokomonster scene for this news story",
        },
        {
            "afterSentence": second,
            "file": f"../../../assets/news-covers/{filename}",
            "crop": "bottom",
            "alt": "Second supporting Kokomonster scene for this news story",
        },
    ]

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
            "readerGroups": source_reader_groups(piece),
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
        "inlineImages": inline_images(article_id, len(sentences)),
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


def source_reader_groups(piece: dict) -> list[dict]:
    """Preserve the source editor's contextual word groups and translations."""
    def annotation_reading(item: dict) -> str:
        sentence = TOKEN_INLINE_PUNCTUATION.sub("", item.get("Sentence", ""))
        furigana = TOKEN_INLINE_PUNCTUATION.sub("", item.get("Furigana", ""))
        if not furigana:
            return sentence
        parts = re.split(r"([一-龯々]+)", sentence)
        inserted = False
        output = []
        for part in parts:
            if not part:
                continue
            if re.fullmatch(r"[一-龯々]+", part):
                if not inserted:
                    output.append(furigana)
                    inserted = True
            else:
                output.append(part)
        return "".join(output) if inserted else sentence

    groups = []
    for raw_group in piece.get("furiganaMeta", []):
        if not isinstance(raw_group, dict):
            continue
        annotations = [item for item in raw_group.get("annotations", []) if isinstance(item, dict)]
        surface = "".join(item.get("Sentence", "") for item in annotations)
        surface = TOKEN_INLINE_PUNCTUATION.sub("", surface)
        if not surface:
            continue
        reading = "".join(annotation_reading(item) for item in annotations)
        translations = {
            item.get("code") or "romaji": item.get("content", "")
            for item in raw_group.get("translations", [])
            if isinstance(item, dict)
        }
        groups.append({
            "text": surface,
            "reading": reading,
            "romaji": translations.get("romaji", ""),
            "en": translations.get("en", ""),
            "zhHant": translations.get("zh-TW", ""),
            "showRuby": bool(re.search(r"[一-龯々]", surface)),
        })
    return groups


def merge_source_reader_groups(items: list[dict], groups: list[dict], overrides: dict[str, dict]) -> list[dict] | None:
    """Align editorial word groups with narration timings; fall back if source data disagrees."""
    if not groups:
        return None
    words = [item for item in items if not TOKEN_PUNCTUATION.fullmatch(item["text"])]
    timing_text = "".join(item["text"] for item in words)
    group_text = "".join(item["text"] for item in groups)
    if timing_text != group_text:
        return None
    spans = []
    character_cursor = 0
    for word in words:
        length = max(1, len(word["text"]))
        spans.append((character_cursor, character_cursor + length, word))
        character_cursor += length

    def time_at(position: int) -> float:
        if position >= character_cursor:
            last = words[-1]
            return float(last["offsetMs"]) + float(last["durationMs"])
        start, end, word = next(span for span in spans if span[0] <= position < span[1])
        fraction = (position - start) / max(1, end - start)
        return float(word["offsetMs"]) + float(word["durationMs"]) * fraction

    merged = []
    group_cursor = 0
    for group in groups:
        start = time_at(group_cursor)
        group_cursor += len(group["text"])
        end = time_at(group_cursor)
        metadata = {**group, **overrides.get(group["text"], {})}
        if any(not metadata.get(field) for field in ("reading", "romaji", "en", "zhHant")):
            return None
        merged.append({**metadata, "offsetMs": start, "durationMs": end - start})
    return merged


def add_word_tokens(article: dict, lexicon: dict[str, dict], overrides: dict[str, dict]) -> None:
    """Attach stable display metadata to each timed narration word."""
    article_path = ARTICLE_ROOT / f"{article['id']}-{article['slug']}.json"
    for sentence in article["sentences"]:
        timing_path = (article_path.parent / sentence["audio"]["timings"]).resolve()
        raw_timings = read_json(timing_path) if timing_path.exists() else []
        source_groups = merge_source_reader_groups(raw_timings, sentence.pop("readerGroups", []), overrides)
        timings = source_groups or merge_timing_tokens(raw_timings)
        sentence["tokens"] = [
            timing if source_groups else {
                "text": timing["text"],
                "offsetMs": timing["offsetMs"],
                "durationMs": timing["durationMs"],
                **lexicon.get(timing["text"], {
                    "reading": "",
                    "romaji": "",
                    "en": "see sentence translation",
                    "zhHant": "參閱句子翻譯",
                    "showRuby": False,
                }),
                "showRuby": bool(re.search(r"[一-龯々]", timing["text"])),
            }
            for timing in timings
        ]


def merge_timing_tokens(items: list[dict]) -> list[dict]:
    words = [item for item in items if not TOKEN_PUNCTUATION.fullmatch(item["text"])]
    merged = []
    index = 0
    while index < len(words):
        match_length = 0
        for pattern in TOKEN_MERGE_PATTERNS:
            if tuple(item["text"] for item in words[index:index + len(pattern)]) == pattern:
                match_length = len(pattern)
                break
        if not match_length:
            following = [item["text"] for item in words[index + 1:index + 4]]
            if following[:3] in (["し", "まし", "た"], ["れ", "まし", "た"], ["て", "い", "ます"]):
                match_length = 4
            elif following[:2] in (["まし", "た"], ["なかっ", "た"], ["て", "いる"], ["し", "た"]):
                match_length = 3
            elif following[:1] in (["ます"], ["ない"], ["れる"], ["た"]):
                match_length = 2
        group = words[index:index + match_length] if match_length else [words[index]]
        start = float(group[0]["offsetMs"])
        end = float(group[-1]["offsetMs"]) + float(group[-1]["durationMs"])
        merged.append({
            "text": "".join(item["text"] for item in group),
            "offsetMs": start,
            "durationMs": end - start,
        })
        index += match_length or 1
    return merged


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
        "inlineImages": inline_images(article_id, len(sentences)),
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
    token_lexicon = read_json(ROOT / "word-token-lexicon.json")
    token_overrides = read_json(ROOT / "word-token-overrides.json")
    for surface, override in token_overrides.items():
        token_lexicon[surface] = {**token_lexicon.get(surface, {}), **override}
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
        add_word_tokens(article, token_lexicon, token_overrides)
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
