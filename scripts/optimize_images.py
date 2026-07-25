"""Resize and compress presentation images for faster loading."""

from __future__ import annotations

import io
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "ai_images"
OUT = ROOT / "assets" / "images"

# max_width, webp_quality, optional max_height
PROFILES: dict[str, tuple[int, int, int | None]] = {
    "hero_slayd.png": (1920, 82, None),
    "vision.png": (1280, 82, None),
    "trust.png": (1280, 80, 480),
    "ecosystem.png": (960, 85, None),
    "shops.png": (1200, 82, None),
    "control_mobile_app.jpg": (592, 85, 1280),
    "parking.png": (1280, 82, None),
    "security.png": (1280, 80, None),
    "navigation.png": (960, 85, None),
    "investment.png": (960, 82, None),
    "innovations.png": (960, 82, None),
    "led screend adverstment.png": (1280, 82, None),
}

OUTPUT_NAMES = {
    "hero_slayd.png": "hero-market.webp",
    "vision.png": "vision.webp",
    "trust.png": "trust.webp",
    "ecosystem.png": "ecosystem.webp",
    "shops.png": "shops.webp",
    "control_mobile_app.jpg": "control-app.webp",
    "parking.png": "parking.webp",
    "security.png": "security-monitor.webp",
    "navigation.png": "map.webp",
    "investment.png": "investment.webp",
    "innovations.png": "future.webp",
    "led screend adverstment.png": "advertising.webp",
}


def fit_size(width: int, height: int, max_w: int, max_h: int | None) -> tuple[int, int]:
    ratio = min(max_w / width, (max_h / height) if max_h else 1.0, 1.0)
    if ratio >= 1:
        return width, height
    return max(1, int(width * ratio)), max(1, int(height * ratio))


def save_webp(img: Image.Image, dest: Path, quality: int) -> None:
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA" if "A" in img.getbands() else "RGB")

    # Flatten semi-transparent PNG onto cream background for smaller files
    if img.mode == "RGBA":
        alpha = img.split()[-1]
        if alpha.getextrema()[0] < 255:
            bg = Image.new("RGB", img.size, (245, 245, 247))
            bg.paste(img, mask=alpha)
            img = bg
        else:
            img = img.convert("RGB")
    elif img.mode != "RGB":
        img = img.convert("RGB")

    img.save(dest, "WEBP", quality=quality, method=6)


def optimize_one(src_name: str) -> dict:
    src_path = SRC / src_name
    out_name = OUTPUT_NAMES[src_name]
    out_path = OUT / out_name
    max_w, quality, max_h = PROFILES[src_name]

    with Image.open(src_path) as img:
        orig_w, orig_h = img.size
        new_w, new_h = fit_size(orig_w, orig_h, max_w, max_h)
        if (new_w, new_h) != (orig_w, orig_h):
            img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        save_webp(img, out_path, quality)

    return {
        "source": src_name,
        "output": out_name,
        "from_kb": round(src_path.stat().st_size / 1024, 1),
        "to_kb": round(out_path.stat().st_size / 1024, 1),
        "size": f"{new_w}x{new_h}",
    }


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    results = [optimize_one(name) for name in PROFILES]
    total_from = sum(r["from_kb"] for r in results)
    total_to = sum(r["to_kb"] for r in results)
    print(f"Optimized {len(results)} images -> {OUT}")
    for r in results:
        saved = round(100 - (r["to_kb"] / r["from_kb"] * 100), 1)
        print(f"  {r['source']:26} {r['from_kb']:7.1f} KB -> {r['to_kb']:6.1f} KB ({saved}% saved) [{r['size']}]")
    print(f"Total: {total_from:.1f} KB -> {total_to:.1f} KB ({round(100 - total_to/total_from*100, 1)}% saved)")


if __name__ == "__main__":
    main()
