import argparse
import mimetypes
import os
import sys
from pathlib import Path
from google import genai
from google.genai import types

INSPIRATION_IMAGE_PATH = Path(__file__).parent / "inspiration.jpeg"


def save_binary_file(file_name, data):
    with open(file_name, "wb") as f:
        f.write(data)
    print(f"\n✅ Saved: {file_name}")


FIDELITY_RULE = (
    "CRITICAL FIDELITY RULE: You are remixing an existing garment, NOT designing a new one. "
    "Reproduce every visible design element from the source image(s) exactly as shown — "
    "fabric pattern, colour, trim, embroidery, buttons, silhouette. "
    "Do NOT add, remove, relocate, or alter any element. "
    "If the source shows buttons, reproduce that exact count, size, and spacing. "
    "If no buttons are visible, do NOT invent any."
)

TEXT_REMOVAL_RULE = (
    "TEXT & CLUTTER REMOVAL: Erase ALL visible text from the final image — this includes garment labels, "
    "brand tags, swing tags, size stickers, care instruction labels, and any text present in the background "
    "or environment (signage, writing on walls, printed objects, phone handsets with text, etc.). "
    "Also remove any non-product clutter from the background (cables, household objects, fixtures). "
    "The output must be entirely free of readable text and distracting background elements."
)

PROMPTS = {
    "folded-garment": (
        "Generate a high-quality e-commerce product image of the garment neatly FOLDED on a clean surface. "
        + FIDELITY_RULE
        + " FOLDED VIEW NOTE: When a garment is folded, fasteners like buttons are often tucked inside the fold — "
        "this is correct and expected. Do NOT force buttons or closures to be visible; only show them if they "
        "naturally appear in the folded configuration. "
        + TEXT_REMOVAL_RULE
        + " Match the surface texture and lighting mood of the inspiration image."
    ),
    "full-body-lifestyle": (
        "Generate a high-quality FULL-BODY LIFESTYLE e-commerce image of a model wearing the garment. "
        "The model's face must be BLURRED or cropped out of frame — show from mid-torso down or apply a soft blur above the shoulders. "
        + FIDELITY_RULE
        + " "
        + TEXT_REMOVAL_RULE
        + " Use the inspiration image for setting and ambient mood."
    ),
    "close-up-macro": (
        "Generate a high-quality CLOSE-UP MACRO shot of the garment laid flat, highlighting fabric texture, "
        "surface detail, and any trim or embroidery. "
        + FIDELITY_RULE
        + " "
        + TEXT_REMOVAL_RULE
        + " Match the lighting quality of the inspiration image."
    ),
    "spread-on-sofa": (
        "Generate a high-quality e-commerce product image of the garment naturally SPREAD OUT across a stylish sofa, "
        "fully open so the entire garment is visible. "
        + FIDELITY_RULE
        + " "
        + TEXT_REMOVAL_RULE
        + " Match the aesthetic mood of the inspiration image."
    ),
}


def generate_product_images(
    source_image_path: str,
    output_directory: str,
    detail_image_path: str = None,
    target_style: str = None,
    high_thinking: bool = False,
):
    print("🍌 Initializing image generation with gemini-3.1-flash-image-preview...")
    print(f"📸 Source: {source_image_path}")
    if detail_image_path:
        print(f"🔍 Detail: {detail_image_path}")
    print(f"✨ Inspiration: {INSPIRATION_IMAGE_PATH}")

    os.makedirs(output_directory, exist_ok=True)

    if not os.environ.get("GEMINI_API_KEY"):
        print("❌ GEMINI_API_KEY not set. Run: export GEMINI_API_KEY='your_key'")
        sys.exit(1)

    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

    def read_image(path):
        with open(path, "rb") as f:
            data = f.read()
        mime = mimetypes.guess_type(path)[0] or "image/jpeg"
        return data, mime

    try:
        source_bytes, source_mime = read_image(source_image_path)
        inspiration_bytes, inspiration_mime = read_image(INSPIRATION_IMAGE_PATH)
        detail_bytes, detail_mime = read_image(detail_image_path) if detail_image_path else (None, None)
    except Exception as e:
        print(f"❌ Error reading images: {e}")
        return

    if target_style:
        if target_style in PROMPTS:
            prompts_to_run = {target_style: PROMPTS[target_style]}
        else:
            try:
                idx = int(target_style) - 1
                keys = list(PROMPTS.keys())
                if 0 <= idx < len(keys):
                    key = keys[idx]
                    prompts_to_run = {key: PROMPTS[key]}
                else:
                    print(f"❌ Invalid index: {target_style} (valid: 1-{len(keys)})")
                    return
            except ValueError:
                print(f"❌ Style '{target_style}' not found. Available: {', '.join(PROMPTS)}")
                return
    else:
        prompts_to_run = PROMPTS

    thinking_level = "HIGH" if high_thinking else "MINIMAL"
    if high_thinking:
        print("🧠 High thinking mode enabled.")
    config = types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_level=thinking_level),
        image_config=types.ImageConfig(aspect_ratio="1:1", image_size="1K"),
        response_modalities=["IMAGE", "TEXT"],
    )

    image_label = (
        "Attached images:\n"
        "  Image 1: Front view of the product (primary source — use this for garment fidelity).\n"
        + (
            "  Image 2: Detail/close-up of the product (secondary source — use for precise texture and fastener detail).\n"
            "  Image 3: Style reference / inspiration (use only for setting, lighting, and mood).\n"
            if detail_image_path
            else "  Image 2: Style reference / inspiration (use only for setting, lighting, and mood).\n"
        )
    )

    print(f"\n⏳ Generating {len(prompts_to_run)} style(s)...")

    for title, specific_prompt in prompts_to_run.items():
        print(f"\n--- {title.replace('-', ' ').title()} ---")

        parts = [types.Part.from_bytes(data=source_bytes, mime_type=source_mime)]
        if detail_bytes:
            parts.append(types.Part.from_bytes(data=detail_bytes, mime_type=detail_mime))
        parts.append(types.Part.from_bytes(data=inspiration_bytes, mime_type=inspiration_mime))
        parts.append(types.Part.from_text(text=f"{image_label}\n{specific_prompt}"))

        contents = [types.Content(role="user", parts=parts)]

        try:
            for chunk in client.models.generate_content_stream(
                model="gemini-3.1-flash-image-preview",
                contents=contents,
                config=config,
            ):
                if not chunk.parts:
                    continue
                for part in chunk.parts:
                    if part.inline_data and part.inline_data.data:
                        ext = mimetypes.guess_extension(part.inline_data.mime_type) or ".jpg"
                        out_path = os.path.join(output_directory, f"generated-product-{title}{ext}")
                        save_binary_file(out_path, part.inline_data.data)
                    elif part.text:
                        print(part.text, end="")
        except Exception as e:
            print(f"\n❌ Failed to generate {title}: {e}")

    print(f"\n\n🎉 Done! Images saved to: {output_directory}")


def main():
    parser = argparse.ArgumentParser(
        description="Generate lifestyle product images using Gemini."
    )
    parser.add_argument("source", help="Path to primary product image (front view)")
    parser.add_argument(
        "output_dir",
        nargs="?",
        default="./output-images",
        help="Output directory (default: ./output-images)",
    )
    parser.add_argument(
        "--detail",
        metavar="IMAGE",
        help="Optional detail/close-up image for improved fidelity",
    )
    parser.add_argument(
        "--style",
        metavar="STYLE",
        help="Generate only one style: folded-garment | full-body-lifestyle | close-up-macro | spread-on-sofa | 1-4",
    )
    parser.add_argument(
        "--high-thinking",
        action="store_true",
        help="Use HIGH thinking level for better text removal and spatial reasoning (slower)",
    )

    args = parser.parse_args()

    if not INSPIRATION_IMAGE_PATH.exists():
        print(f"⚠️  inspiration.jpeg not found at {INSPIRATION_IMAGE_PATH}")

    generate_product_images(args.source, args.output_dir, args.detail, args.style, args.high_thinking)


if __name__ == "__main__":
    main()
