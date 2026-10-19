#!/usr/bin/env python3
"""Build the fourteen static reserved news-reader routes from one template."""

from __future__ import annotations

import json
import html
import re
from pathlib import Path
from urllib.parse import urlparse


SITE_ROOT = Path(__file__).resolve().parents[2]
CONTENT_ROOT = Path(__file__).resolve().parent


def main() -> None:
    manifest = json.loads((CONTENT_ROOT / "manifest.json").read_text(encoding="utf-8"))
    template = (SITE_ROOT / "news-reader.html").read_text(encoding="utf-8")
    for article in manifest["articles"]:
        article_data = json.loads((CONTENT_ROOT / article["dataFile"]).read_text(encoding="utf-8"))
        title = article_data["title"]["ja"]
        english_title = article_data["title"]["en"]
        description = article_data["summary"]["en"]
        canonical_path = urlparse(article_data["reservedUrl"]).path.rstrip("/")
        canonical = f"https://koko-monster.github.io{canonical_path}/"
        published = article_data["date"]
        section = article_data["category"]["en"]
        cover_name = Path(article_data["cover"]["file"]).name
        if int(article["id"]) == 9991:
            social_image = "https://koko-monster.github.io/assets/social/og-news-onosato-9991.jpg?v=20261020-2"
            social_image_type = "image/jpeg"
        else:
            social_image = f"https://koko-monster.github.io/assets/news-covers/{cover_name}?v=20261020-2"
            social_image_type = "image/webp"
        document_title = f"{title} | Kokomonster Easy News"
        meta_values = {
            "title": document_title,
            "description": description,
            "canonical": canonical,
            "og:title": document_title,
            "og:description": description,
            "og:url": canonical,
            "og:image": social_image,
            "og:image:secure_url": social_image,
            "og:image:type": social_image_type,
            "og:image:alt": f"Kokomonster Easy News: {english_title}",
            "article:published_time": published,
            "article:section": section,
            "twitter:title": document_title,
            "twitter:description": description,
            "twitter:image": social_image,
            "twitter:image:alt": f"Kokomonster Easy News: {english_title}",
        }
        rendered = re.sub(
            r'data-story-id="\d+"',
            f'data-story-id="{article["id"]}"',
            template,
            count=1,
        )
        rendered = re.sub(r"<title>.*?</title>", f"<title>{html.escape(meta_values['title'])}</title>", rendered, count=1)
        rendered = re.sub(
            r'<link rel="canonical" href="[^"]*">',
            f'<link rel="canonical" href="{html.escape(meta_values["canonical"], quote=True)}">',
            rendered,
            count=1,
        )
        for key, value in meta_values.items():
            if key in {"title", "canonical"}:
                continue
            attribute = "property" if key.startswith("og:") or key.startswith("article:") else "name"
            pattern = rf'<meta {attribute}="{re.escape(key)}" content="[^"]*">'
            replacement = f'<meta {attribute}="{key}" content="{html.escape(value, quote=True)}">'
            rendered = re.sub(pattern, replacement, rendered, count=1)
        destination = SITE_ROOT / article["reservedPath"].lstrip("/") / "index.html"
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(rendered, encoding="utf-8")
        print(destination.relative_to(SITE_ROOT))


if __name__ == "__main__":
    main()
