#!/usr/bin/env python3
"""Generate reusable reader-token metadata for the static news package.

This editorial helper is intentionally separate from the normal site build.
It needs fugashi + unidic-lite, pykakasi and jamdict + jamdict-data. The
generated JSON is committed, so the browser and regular content build do not
need those Python packages.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

from fugashi import Tagger
from jamdict import Jamdict
from pykakasi import kakasi


ROOT = Path(__file__).resolve().parent
PUNCTUATION = re.compile(r"^[、。！？,.!?「」『』（）()：:；;・…]+$")
HAS_RUBY_TEXT = re.compile(r"[一-龯々ァ-ヶー]")
MERGE_PATTERNS = sorted((
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

# Context-sensitive fragments are safer and clearer when curated than when a
# dictionary guesses from a one-character lookup.
GRAMMAR = {
    "は": ("wa", "topic marker", "主題助詞"),
    "が": ("ga", "subject marker", "主語助詞"),
    "を": ("o", "object marker", "受詞助詞"),
    "に": ("ni", "to; at; in", "向；在；於"),
    "で": ("de", "at; by; with", "在；以；用"),
    "と": ("to", "and; with; that", "和；與；表示引用"),
    "へ": ("e", "toward; to", "往；向"),
    "の": ("no", "of; possessive marker", "的；所有格助詞"),
    "も": ("mo", "also; too", "也；亦"),
    "から": ("kara", "from; because", "從；因為"),
    "まで": ("made", "until; as far as", "直到；至"),
    "より": ("yori", "than; from", "比；從"),
    "や": ("ya", "and; such as", "和；例如"),
    "など": ("nado", "and so on", "等等"),
    "ため": ("tame", "for; because of", "為了；由於"),
    "こと": ("koto", "thing; nominalizer", "事情；名詞化"),
    "もの": ("mono", "thing; person", "事物；人"),
    "よう": ("you", "way; so that", "方式；以便"),
    "です": ("desu", "is; polite copula", "是；禮貌判斷詞"),
    "ます": ("masu", "polite verb ending", "禮貌動詞詞尾"),
    "まし": ("mashi", "polite verb ending", "禮貌動詞詞尾"),
    "た": ("ta", "past-tense ending", "過去式詞尾"),
    "て": ("te", "linking verb ending", "連接動詞詞尾"),
    "ない": ("nai", "not; negative ending", "不；否定詞尾"),
    "なかっ": ("nakatta", "negative past stem", "否定過去式詞幹"),
    "れる": ("reru", "passive; potential ending", "被動；可能詞尾"),
    "れ": ("re", "passive verb ending", "被動動詞詞尾"),
    "し": ("shi", "do; verb stem", "做；動詞詞幹"),
    "しまし": ("shimashi", "did; polite verb stem", "做了；禮貌動詞詞幹"),
    "なり": ("nari", "become; verb stem", "成為；動詞詞幹"),
    "なっ": ("na", "became; verb stem", "成為；動詞詞幹"),
    "あり": ("ari", "exist; verb stem", "有；存在的動詞詞幹"),
    "いる": ("iru", "to be; to exist", "在；存在"),
    "い": ("i", "verb ending", "動詞詞尾"),
    "する": ("suru", "to do", "做；進行"),
    "だ": ("da", "is; plain copula", "是；普通體判斷詞"),
    "な": ("na", "linking ending", "連接詞尾"),
    "ば": ("ba", "if; when", "如果；當"),
    "ず": ("zu", "without; not", "不；沒有"),
    "ら": ("ra", "plural suffix", "複數詞尾"),
}

SPECIAL_GLOSSES = {
    "ジョージ": ("George", "喬治"), "ハリー": ("Harry", "哈里"),
    "リンカーン": ("Lincoln", "林肯"), "メルカトル": ("Mercator", "麥卡托"),
    "カーニー": ("Carney", "卡尼"), "シガツェ": ("Shigatse", "日喀則"),
    "メーガン": ("Meghan", "梅根"), "メガン": ("Meghan", "梅根"),
    "マラッカ": ("Malacca", "馬六甲"), "エイブラハム": ("Abraham", "亞伯拉罕"),
    "チャールズ": ("Charles", "查理斯"), "ヘンリー": ("Harry", "哈里"),
    "国王": ("king", "國王"), "妃": ("princess; consort", "王妃"),
    "就かない": ("does not take office", "不就任；不擔任"), "であると": ("is; that", "是；表示引用"),
    "表明した": ("stated; announced", "表示；宣布"), "述べた": ("stated; said", "表示；說明"),
    "トカチェンコ": ("Tkachenko", "特卡琴科"),
    "ゼレンスキー": ("Zelenskyy", "澤連斯基"), "サセックス": ("Sussex", "薩塞克斯"),
    "ウィリアム": ("William", "威廉"), "ミア": ("Mia", "米婭"),
    "プーラ": ("Pura", "普拉"), "エリザベス": ("Elizabeth", "伊利沙伯"),
    "Suica": ("Suica transit card", "Suica交通卡"), "特": ("especially", "特別"),
    "超え": ("exceeding; more than", "超過"), "よっ": ("due to; by", "由於；根據"),
    "よれ": ("according to", "根據"), "引き起こし": ("causing; triggering", "引發"),
}

READING_OVERRIDES = {
    "13日": "じゅうさんにち", "18日": "じゅうはちにち", "19日": "じゅうくにち",
    "23": "にじゅうさん", "33人": "さんじゅうさんにん", "37人": "さんじゅうななにん",
    "164": "ひゃくろくじゅうよん", "177人": "ひゃくななじゅうななにん",
    "261人": "にひゃくろくじゅういちにん", "320人": "さんびゃくにじゅうにん",
    "546人": "ごひゃくよんじゅうろくにん", "675人": "ろっぴゃくななじゅうごにん",
    "700人": "ななひゃくにん", "900人": "きゅうひゃくにん", "903人": "きゅうひゃくさんにん",
    "1200戸": "せんにひゃくこ", "1300人": "せんさんびゃくにん",
    "2498人": "にせんよんひゃくきゅうじゅうはちにん", "4247人": "よんせんにひゃくよんじゅうななにん",
    "4800人": "よんせんはっぴゃくにん", "70万人": "ななじゅうまんにん",
    "280億": "にひゃくはちじゅうおく", "0人以上": "れいにんいじょう",
}


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def katakana_to_hiragana(value: str) -> str:
    return "".join(chr(ord(char) - 0x60) if "ァ" <= char <= "ヶ" else char for char in value)


def compact_gloss(entry) -> str:
    if not entry or not entry.senses:
        return ""
    glosses = [str(value) for value in entry.senses[0].gloss]
    return "; ".join(glosses[:2])


def numeric_gloss(surface: str) -> tuple[str, str] | None:
    match = re.fullmatch(r"(\d+)(人以上|万人|人|戸|日|月|年|％|億)?", surface)
    if not match:
        return None
    number, suffix = match.groups()
    labels = {
        None: ("", ""), "人": (" people", "人"), "人以上": (" or more people", "人以上"),
        "万人": ("0,000 people", "萬人"), "戸": (" households", "戶"),
        "日": ("th day; date", "日；日期"), "月": (" month", "月"),
        "年": (" year", "年"), "％": (" percent", "%"), "億": (" hundred million", "億"),
    }
    en_suffix, zh_suffix = labels[suffix]
    return f"{number}{en_suffix}", f"{number}{zh_suffix}"


def merge_timing_items(items: list[dict]) -> list[dict]:
    words = [item for item in items if not PUNCTUATION.fullmatch(item["text"])]
    merged = []
    index = 0
    while index < len(words):
        match_length = 0
        for pattern in MERGE_PATTERNS:
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
        if match_length:
            group = words[index:index + match_length]
            merged.append({"text": "".join(item["text"] for item in group)})
            index += match_length
        else:
            merged.append({"text": words[index]["text"]})
            index += 1
    return merged


def main() -> None:
    tagger = Tagger()
    converter = kakasi()
    dictionary = Jamdict()
    vocabulary = {}
    surfaces = set()
    audit_path = ROOT / "pronunciation-audit.json"
    pronunciation_overrides = read_json(audit_path).get("globalOverrides", {}) if audit_path.exists() else {}

    for article_path in sorted((ROOT / "articles").glob("*.json")):
        article = read_json(article_path)
        for item in article["vocabulary"]:
            vocabulary.setdefault(item["surface"], item)
        for sentence in article["sentences"]:
            timing_path = (article_path.parent / sentence["audio"]["timings"]).resolve()
            for timing in merge_timing_items(read_json(timing_path)):
                surfaces.add(timing["text"])

    lexicon = {}
    for index, surface in enumerate(sorted(surfaces), start=1):
        curated = vocabulary.get(surface)
        words = list(tagger(surface))
        reading = "".join(
            katakana_to_hiragana(getattr(word.feature, "kana", "") or word.surface)
            for word in words
        )
        romaji = "".join(part["hepburn"] for part in converter.convert(reading or surface))

        if curated:
            reading = curated["reading"]
            romaji = "".join(part["hepburn"] for part in converter.convert(reading))
            en = curated["en"]
            zh = curated["zhHant"]
        elif surface in GRAMMAR:
            romaji, en, zh = GRAMMAR[surface]
        elif surface in SPECIAL_GLOSSES:
            en, zh = SPECIAL_GLOSSES[surface]
        elif numeric_gloss(surface):
            en, zh = numeric_gloss(surface)
        else:
            result = dictionary.lookup(surface)
            entry = result.entries[0] if result.entries else None
            if not entry and words:
                lemma = getattr(words[0].feature, "lemma", "") or ""
                lemma = lemma.split("-")[0]
                if lemma and lemma != surface:
                    result = dictionary.lookup(lemma)
                    entry = result.entries[0] if result.entries else None
            en = compact_gloss(entry) or "see sentence translation"
            zh = "參閱句子翻譯"

        reading = READING_OVERRIDES.get(surface, pronunciation_overrides.get(surface, reading))
        if surface not in GRAMMAR:
            romaji = "".join(part["hepburn"] for part in converter.convert(reading or surface))

        lexicon[surface] = {
            "reading": reading,
            "romaji": romaji,
            "en": en,
            "zhHant": zh,
            "showRuby": bool(HAS_RUBY_TEXT.search(surface)),
        }
        if index % 100 == 0:
            print(f"Processed {index}/{len(surfaces)} tokens")

    overrides = read_json(ROOT / "word-token-overrides.json")
    for surface, override in overrides.items():
        lexicon[surface] = {**lexicon.get(surface, {}), **override}
    destination = ROOT / "word-token-lexicon.json"
    destination.write_text(json.dumps(lexicon, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(lexicon)} token entries to {destination}")


if __name__ == "__main__":
    main()
