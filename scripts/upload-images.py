#!/usr/bin/env python3
"""Upload product images and update database.
Usage:
  python3 scripts/upload-images.py          # real run
  python3 scripts/upload-images.py --dry-run  # preview only
"""

import os, sys, json, sqlite3, shutil, re

DRY_RUN = "--dry-run" in sys.argv
SRC = "/Users/mikewang/WorkBuddy/2026-05-12-task-1/product_images"
DST = "public/images/products"
DB_PATH = "data/teao.db"

# Map image directory name → database model(s)
DIR_MAP: dict[str, list[str]] = {
    "RD-T028_V028": ["RD-T028"],
    "RD-T068_V068": ["RD-T068"],
}

# Directories to skip entirely
SKIP_DIRS = {".DS_Store", "RD-16", "RD-R018"}

# Typo fixes: original filename → fixed filename
TYPO_MAP = {"mian.png": "main.png"}

# Recognized file categories by stem
MAIN_NAMES = {"main"}
PHOTO_NAMES = {"photo"}
DIM_NAMES = {"size"}
CURVE_NAMES = {"curve"}    # rotation curve
CURVE2_NAMES = {"curve2"}  # temperature curve


def classify_file(fname: str) -> str:
    """Classify a filename: 'main', 'photo', 'size', 'curve', 'curve2', or 'other'."""
    stem = os.path.splitext(fname)[0].lower()
    if stem in MAIN_NAMES:
        return "main"
    if stem.startswith("photo"):
        return "photo"
    if stem in DIM_NAMES:
        return "size"
    if stem in CURVE_NAMES:
        return "curve"
    if stem in CURVE2_NAMES:
        return "curve2"
    return "other"


def is_chinese_name(fname: str) -> bool:
    """Check if filename contains Chinese characters."""
    return bool(re.search(r'[一-鿿]', fname))


def get_db_models() -> dict[str, int]:
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute("SELECT id, model FROM products").fetchall()
    conn.close()
    return {row[1]: row[0] for row in rows}


def main():
    db_models = get_db_models()
    os.makedirs(DST, exist_ok=True)

    total = 0
    skipped = 0
    no_main = []

    for dir_name in sorted(os.listdir(SRC)):
        src_dir = os.path.join(SRC, dir_name)
        if not os.path.isdir(src_dir) or dir_name in SKIP_DIRS:
            continue

        targets = DIR_MAP.get(dir_name, [dir_name])

        for model in targets:
            if model not in db_models:
                print(f"  SKIP {dir_name} → {model}: not in database")
                skipped += 1
                continue

            model_lower = model.lower()
            dst_dir = os.path.join(DST, model_lower)
            os.makedirs(dst_dir, exist_ok=True)

            # Collect and classify source files
            src_files = [f for f in os.listdir(src_dir) if os.path.isfile(os.path.join(src_dir, f))]
            classified: dict[str, list[str]] = {"main": [], "photo": [], "size": [], "curve": [], "curve2": [], "other": []}

            for fname in src_files:
                fixed = TYPO_MAP.get(fname, fname)
                cat = classify_file(fixed)
                classified[cat].append(fixed)

            # Rename Chinese-named files to photo_N
            photo_idx = len(classified["photo"]) + 1
            renamed: dict[str, str] = {}  # original → final name
            for fname in src_files:
                fixed = TYPO_MAP.get(fname, fname)
                cat = classify_file(fixed)
                if cat == "other" and is_chinese_name(fixed):
                    ext = os.path.splitext(fixed)[1]
                    new_name = f"photo_{photo_idx}{ext}"
                    photo_idx += 1
                    renamed[fname] = new_name
                    classified["photo"].append(new_name)
                else:
                    renamed[fname] = fixed

            # Determine main image: use main.* if available, else first photo
            main_file = None
            if classified["main"]:
                main_file = classified["main"][0]
            elif classified["photo"]:
                main_file = classified["photo"][0]

            # Copy files
            for fname in src_files:
                src_file = os.path.join(src_dir, fname)
                dst_name = renamed[fname]
                dst_file = os.path.join(dst_dir, dst_name)
                if not DRY_RUN:
                    shutil.copy2(src_file, dst_file)

            base_url = f"/images/products/{model_lower}"

            # Main image URL
            image = f"{base_url}/{main_file}" if main_file else ""

            # Gallery: main first, then all photos
            gallery_urls = []
            seen = set()
            if main_file:
                gallery_urls.append(main_file)
                seen.add(main_file)
            for f in sorted(classified["photo"]):
                if f not in seen:
                    gallery_urls.append(f)
                    seen.add(f)
            gallery = [{"url": f"{base_url}/{f}", "alt": f"{model} {os.path.splitext(f)[0]}"} for f in gallery_urls]

            # Dimension drawing
            dim_file = classified["size"][0] if classified["size"] else None
            dimension_drawing = f"{base_url}/{dim_file}" if dim_file else None

            # Performance charts
            rotation_curve = f"{base_url}/{classified['curve'][0]}" if classified["curve"] else None
            temperature_curve = f"{base_url}/{classified['curve2'][0]}" if classified["curve2"] else None
            performance_charts = None
            if rotation_curve or temperature_curve:
                performance_charts = {}
                if rotation_curve:
                    performance_charts["rotation_curve"] = rotation_curve
                if temperature_curve:
                    performance_charts["temperature_curve"] = temperature_curve

            # Update database
            if not DRY_RUN:
                conn = sqlite3.connect(DB_PATH)
                conn.execute(
                    """UPDATE products
                       SET image = ?, images = ?, dimension_drawing = ?, performance_charts = ?
                       WHERE model = ?""",
                    (
                        image,
                        json.dumps(gallery, ensure_ascii=False),
                        dimension_drawing,
                        json.dumps(performance_charts, ensure_ascii=False) if performance_charts else None,
                        model,
                    ),
                )
                conn.commit()
                conn.close()

            if not main_file:
                no_main.append(model)

            total += 1
            print(f"  OK {model}: main={'photo-fallback' if main_file and not classified['main'] else main_file}, "
                  f"gallery={len(gallery)}, dim={bool(dim_file)}, "
                  f"curve={bool(rotation_curve)}, curve2={bool(temperature_curve)}")

    print(f"\nDone. Updated: {total}, Skipped: {skipped}")
    if no_main:
        print(f"No main image (used photo fallback): {no_main}")
    # List products not in image dirs
    db_set = set(db_models.keys())
    img_models = set()
    for d in os.listdir(SRC):
        if d in SKIP_DIRS or not os.path.isdir(os.path.join(SRC, d)):
            continue
        for m in DIR_MAP.get(d, [d]):
            img_models.add(m)
    missing = db_set - img_models
    if missing:
        print(f"Products with NO images at all: {sorted(missing)}")


if __name__ == "__main__":
    if DRY_RUN:
        print("[DRY-RUN MODE] No files will be copied or DB modified.\n")
    main()
