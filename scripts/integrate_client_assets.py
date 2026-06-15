#!/usr/bin/env python3
"""Copy client-assets into the Astro project and report missing files."""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CLIENT = ROOT / "client-assets"
ASSETS_IMAGES = ROOT / "src" / "assets" / "images"
BRAND = ROOT / "src" / "assets" / "brand"
GALLERY_PUBLIC = ROOT / "public" / "images" / "gallery"

ALL_FILES = [
    "logo.png",
    "hero-home.jpg",
    "roofing-completed.jpg",
    "roofing-install.jpg",
    "windows-double-hung.jpg",
    "windows-brick.jpg",
    "windows-garden.jpg",
    "windows-install.jpg",
    "windows-provia.jpg",
    "doors-entry.jpg",
    "doors-sliding.jpg",
    "siding-bay.jpg",
    "siding-upper.jpg",
    "remodeling-bath.jpg",
    "remodeling-interior.jpg",
]

GALLERY_JPGS = [f for f in ALL_FILES if f.endswith(".jpg") and f != "hero-home.jpg"]


def copy_file(src: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)


def main() -> int:
    missing: list[str] = []
    copied = 0

    for name in ALL_FILES:
        src = CLIENT / name
        if not src.is_file():
            missing.append(name)
            continue

        if name == "logo.png":
            copy_file(src, BRAND / name)
            copy_file(src, ROOT / "public" / "logo.png")
            copied += 1
            continue

        copy_file(src, ASSETS_IMAGES / name)
        if name in GALLERY_JPGS:
            copy_file(src, GALLERY_PUBLIC / name)
        copied += 1

    print(f"Copied {copied} file(s) from {CLIENT}")
    if missing:
        print(f"Missing ({len(missing)}):")
        for name in missing:
            print(f"  - {name}")
        print("\nSee client-assets/README.md for expected filenames.")
        return 1 if copied == 0 else 0

    print("All client assets integrated.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
