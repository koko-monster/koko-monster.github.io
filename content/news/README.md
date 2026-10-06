# Kokomonster news content package

This directory is the local source-of-truth for the fourteen news-reader demos.

- `manifest.json` reserves the final public URL for every article.
- `articles/<id>-<slug>.json` contains reader-ready Japanese, English, and Traditional Chinese content, vocabulary, cover references, and sentence-level audio/timing references.
- `source/` preserves the Kokomonster API snapshots used for the eleven existing articles.
- `scripts/` contains Japanese narration scripts and Azure SSML. Existing articles retain their source narration; demo articles use `ja-JP-NanamiNeural`.
- `audio/<id>-<slug>/` contains a Nanami MP3 and timing JSON per sentence, plus a Nanami MP3 for each clickable vocabulary item. Existing articles also retain their original Kokomonster sentence MP3 as a source backup. The player should use the Nanami files and their timing JSON.

`generate_word_timings.py` scales the original word boundaries for imported stories and uses Japanese tokenisation for demo copy. These timing files drive the visual karaoke highlight; they are not transcript evidence.

Naming convention:

`KM-NEWS-<id>-<english-slug>-<asset>.<ext>`

The three demo-only IDs are reserved as `9991`, `9992`, and `9993`. Existing Kokomonster stories keep their original numeric IDs.
