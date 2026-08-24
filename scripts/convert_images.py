from pathlib import Path

from PIL import Image, ImageOps


SOURCE = Path(__file__).resolve().parent.parent / "assets" / "images"
TARGET = Path(__file__).resolve().parent.parent / "assets" / "media"
MAX_WIDTH = 1800


def convert(source: Path) -> tuple[Path, int]:
    target = TARGET / f"{source.stem}.webp"
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)
        if image.width > MAX_WIDTH:
            height = round(image.height * MAX_WIDTH / image.width)
            image = image.resize((MAX_WIDTH, height), Image.Resampling.LANCZOS)
        if image.mode not in {"RGB", "RGBA"}:
            image = image.convert("RGB")
        image.save(target, "WEBP", quality=82, method=6)
    return target, target.stat().st_size


def main() -> None:
    TARGET.mkdir(parents=True, exist_ok=True)
    total = 0
    files = sorted(path for path in SOURCE.iterdir() if path.is_file())
    for source in files:
        target, size = convert(source)
        total += size
        print(f"{source.name} -> {target.name} ({size:,} bytes)")
    print(f"Converted {len(files)} files ({total:,} bytes total)")


if __name__ == "__main__":
    main()
