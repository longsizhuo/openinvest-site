#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
make_tables.py — render the paper's three tables as standalone PNG images
(CJK content, header shading, borders, automatic per-cell text wrapping).

Cell text is read verbatim from the original .docx so the images cannot drift
from the source tables.

Usage:
    python make_tables.py --src <original.docx> --out ./figures
"""
import argparse
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from matplotlib import font_manager
from docx import Document

# ---- CJK font (load directly via FontProperties for reliable .ttc handling) ----
_REG = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
_BLD = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
FP_REG = font_manager.FontProperties(fname=_REG) if os.path.exists(_REG) else None
FP_BLD = font_manager.FontProperties(fname=_BLD) if os.path.exists(_BLD) else FP_REG
plt.rcParams["axes.unicode_minus"] = False

HEADER_FILL = "#2F6DB5"
HEADER_TXT = "white"
ROW_ALT = "#F2F5F9"
BORDER = "#C9D2DC"
TXT = "#202428"

TITLES = {
    0: "表 1　主要多智能体金融框架的实证基础对比",
    1: "表 2　校准层预注册拟合 / 样本外验收结果（拟合 2007–2017，样本外 2018–2026）",
    2: "表 3　五阶段预注册架构实验设计",
}
# relative column widths per table
COLW = {
    0: [1.5, 0.8, 2.2, 2.2, 1.2, 1.1],
    1: [1.0, 2.6, 2.6, 1.3],
    2: [0.6, 1.9, 4.2, 2.2, 3.0],
}
FIGW = {0: 11.5, 1: 9.5, 2: 14.0}
FONTSZ = {0: 12.5, 1: 13.5, 2: 11.5}


def disp_units(s):
    """Approx display width: CJK/full-width = 1.0, ASCII = 0.56."""
    w = 0.0
    for ch in s:
        w += 0.56 if ord(ch) < 0x2E80 else 1.0
    return w


def wrap_cell(text, max_units):
    """Greedy wrap honoring explicit breaks; CJK can break anywhere, ASCII words kept."""
    out_lines = []
    for hard in text.split("\n"):
        line = ""
        lw = 0.0
        token = ""

        def flush_token(line, lw, token):
            tw = disp_units(token)
            if token and lw + tw > max_units and line:
                out_lines.append(line)
                return token, tw
            return line + token, lw + tw

        for ch in hard:
            if ord(ch) < 0x2E80 and not ch.isspace():
                token += ch
                continue
            # boundary: flush pending ascii token first
            if token:
                line, lw = flush_token(line, lw, token)
                token = ""
            cw = disp_units(ch)
            if lw + cw > max_units and line:
                out_lines.append(line)
                line, lw = "", 0.0
            if ch == " " and not line:
                continue
            line += ch
            lw += cw
        if token:
            line, lw = flush_token(line, lw, token)
        out_lines.append(line)
    return out_lines or [""]


def render(rows, tidx, outpath):
    ncol = len(rows[0])
    cw = COLW[tidx]
    tot = sum(cw)
    fig_w = FIGW[tidx]
    fs = FONTSZ[tidx]
    pad = 0.5  # display-units padding inside a cell
    # max units per column from inches
    col_in = [fig_w * c / tot for c in cw]
    max_units = [max(4, ci * 72 / fs - 2 * pad) for ci in col_in]

    # wrap all cells, compute row line counts
    wrapped = []
    for r in rows:
        wr = [wrap_cell(str(c), max_units[j]) for j, c in enumerate(r)]
        wrapped.append(wr)
    line_h = fs * 1.5 / 72.0  # inches per text line
    row_h = [max(len(c) for c in wr) * line_h + 0.18 for wr in wrapped]
    title_h = 0.55
    fig_h = sum(row_h) + title_h + 0.2

    fig = plt.figure(figsize=(fig_w, fig_h), dpi=200)
    ax = fig.add_axes([0, 0, 1, 1]); ax.axis("off")
    ax.set_xlim(0, fig_w); ax.set_ylim(0, fig_h)

    # title
    ax.text(fig_w / 2, fig_h - 0.30, TITLES[tidx], ha="center", va="center",
            fontsize=fs + 2.5, color=TXT, fontproperties=FP_BLD)

    # column x positions
    xedges = [0.0]
    for c in cw:
        xedges.append(xedges[-1] + fig_w * c / tot)

    y = fig_h - title_h
    for i, wr in enumerate(wrapped):
        h = row_h[i]
        y0 = y - h
        is_header = (i == 0)
        for j in range(ncol):
            x0, x1 = xedges[j], xedges[j + 1]
            if is_header:
                fc = HEADER_FILL
            else:
                fc = ROW_ALT if (i % 2 == 0) else "white"
            ax.add_patch(Rectangle((x0, y0), x1 - x0, h, facecolor=fc,
                                   edgecolor=BORDER, linewidth=1.0, zorder=1))
            lines = wr[j]
            n = len(lines)
            txt = "\n".join(lines)
            tcol = HEADER_TXT if is_header else TXT
            # center vertically
            ax.text(x0 + 0.12, y0 + h / 2, txt, ha="left", va="center",
                    fontsize=fs, color=tcol,
                    fontproperties=(FP_BLD if is_header else FP_REG),
                    linespacing=1.35, zorder=2)
        y = y0
    fig.savefig(outpath, dpi=200, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print("wrote", outpath, f"({fig_w:.1f}x{fig_h:.1f} in)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True)
    ap.add_argument("--out", default="./figures")
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)
    doc = Document(args.src)
    for tidx, tbl in enumerate(doc.tables):
        rows = [[c.text.strip() for c in row.cells] for row in tbl.rows]
        render(rows, tidx, os.path.join(args.out, f"table{tidx+1}_{['frameworks','calibration','fivestage'][tidx]}.png"))


if __name__ == "__main__":
    main()
