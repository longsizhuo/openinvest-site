#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
normalize_posts.py — fit every figure + table onto a uniform 1080x1350 (4:5)
white canvas for Xiaohongshu (RED). 4:5 is RED's standard portrait ratio, so
the whole carousel stays consistent with no cropping. Images are centered and
scaled to fit with a small margin.

Usage:
    python normalize_posts.py --figs ./figures --out ./xiaohongshu_png
"""
import argparse
import os
from PIL import Image

CANVAS_W, CANVAS_H = 1080, 1350      # 4:5
MARGIN = 36
BG = (255, 255, 255)

# posting order: conceptual frame -> results -> tables
ORDER = [
    ("figure1_mechanisms.png",          "01_thesis_three_mechanisms"),
    ("figure2_verifiability.png",        "02_why_returns_untestable"),
    ("figure3_era_regime_heatmap.png",   "03_coverage_heatmap"),
    ("figure4_spurious_precision.png",   "04_spurious_precision"),
    ("figure5_brier_by_era.png",         "05_brier_by_era"),
    ("figure6_coverage_by_window.png",   "06_calibration_before_after"),
    ("figure7_confidence_distribution.png", "07_llm_overconfidence"),
    ("table1_frameworks.png",            "08_table_frameworks"),
    ("table2_calibration.png",           "09_table_calibration"),
    ("table3_fivestage.png",             "10_table_five_stage"),
]


def fit_canvas(src_path, dst_path):
    im = Image.open(src_path)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, BG + (255,))
        im = Image.alpha_composite(bg, im).convert("RGB")
    else:
        im = im.convert("RGB")
    avail_w, avail_h = CANVAS_W - 2 * MARGIN, CANVAS_H - 2 * MARGIN
    scale = min(avail_w / im.width, avail_h / im.height)
    new = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))),
                    Image.LANCZOS)
    canvas = Image.new("RGB", (CANVAS_W, CANVAS_H), BG)
    canvas.paste(new, ((CANVAS_W - new.width) // 2, (CANVAS_H - new.height) // 2))
    canvas.save(dst_path, "PNG")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--figs", default="./figures")
    ap.add_argument("--out", default="./xiaohongshu_png")
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)
    n = 0
    for src, name in ORDER:
        sp = os.path.join(args.figs, src)
        if not os.path.exists(sp):
            print("MISSING:", sp); continue
        fit_canvas(sp, os.path.join(args.out, name + ".png"))
        n += 1
    print(f"wrote {n} post-ready PNGs ({CANVAS_W}x{CANVAS_H}) to {args.out}")


if __name__ == "__main__":
    main()
