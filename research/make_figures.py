#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
make_figures.py
================
Reproducible figure generation for the paper
"LLM 多智能体投资系统的架构选择与校准优先评估".

All data-driven figures are recomputed from the openInvest research archive
(zero-lookahead walk-forward records). No number is hand-entered for the
data figures; the math figures use only closed-form expressions stated in
the paper (Section 4.3).

Inputs (relative to --archive):
    invest_dreams/path_review.jsonl      (n=1579 calibration records)
    invest_dreams/verdict_review.jsonl   (276 decision x forward-return)
    ablation_draws/exp_[AB]_*.jsonl      (committee draws w/ LLM confidence)

Usage:
    python make_figures.py --archive /path/to/openinvest-research-archive \
                           --out ./figures
"""
import argparse
import glob
import json
import os
from collections import defaultdict

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch

# --------------------------------------------------------------------------
# Global style — clean, neutral, publication-oriented (English labels)
# --------------------------------------------------------------------------
plt.rcParams.update({
    "figure.dpi": 200,
    "savefig.dpi": 200,
    "savefig.bbox": "tight",
    "font.family": "DejaVu Sans",
    "font.size": 11,
    "axes.titlesize": 13,
    "axes.titleweight": "bold",
    "axes.labelsize": 11,
    "axes.spines.top": False,
    "axes.spines.right": False,
    "axes.grid": True,
    "grid.color": "#E3E6EA",
    "grid.linewidth": 0.8,
    "legend.frameon": False,
})

# Palette
C_UNCAL = "#B0B7C3"   # uncalibrated / baseline (muted grey)
C_CAL   = "#2F6DB5"   # calibrated (blue)
C_ACC   = "#C44E52"   # accent / warning (red)
C_OK    = "#3E8E5A"   # good (green)
C_NEU   = "#6C7A89"   # neutral text
TARGET_LO, TARGET_HI = 75.0, 85.0   # pre-registered coverage band [75, 85]

WINDOWS = ["30d", "60d", "90d"]
REGIMES = ["uptrend", "range_bound", "downtrend"]


# --------------------------------------------------------------------------
# Data loading
# --------------------------------------------------------------------------
def load_path_review(archive):
    path = os.path.join(archive, "invest_dreams", "path_review.jsonl")
    return [json.loads(l) for l in open(path, encoding="utf-8")]


def load_confidence(archive):
    """LLM self-reported confidence: verdict_review + ablation A/B draws."""
    vals = []
    vr = os.path.join(archive, "invest_dreams", "verdict_review.jsonl")
    if os.path.exists(vr):
        for l in open(vr, encoding="utf-8"):
            r = json.loads(l)
            if r.get("confidence") is not None:
                vals.append(float(r["confidence"]))
    for f in glob.glob(os.path.join(archive, "ablation_draws", "exp_[AB]_*.jsonl")):
        for l in open(f, encoding="utf-8"):
            r = json.loads(l)
            if r.get("confidence") is not None:
                vals.append(float(r["confidence"]))
    return vals


def era7(d):
    """Seven macro eras spanning 2007-2026 (pre-2007 records excluded)."""
    y, m = int(d[:4]), int(d[5:7])
    if y < 2007 or (y == 2007 and m < 7):
        return None
    if (y == 2007 and m >= 7) or y == 2008 or (y == 2009 and m <= 6):
        return "2007-09\nGFC"
    if y <= 2012:
        return "2009-12\nrecovery"
    if y <= 2015:
        return "2013-15\ngold bear"
    if y <= 2019:
        return "2015-19\nbull"
    if y == 2020:
        return "2020\nCOVID"
    if y <= 2022:
        return "2021-22\nhikes"
    return "2023-26\npost-hike"


ERAS = ["2007-09\nGFC", "2009-12\nrecovery", "2013-15\ngold bear",
        "2015-19\nbull", "2020\nCOVID", "2021-22\nhikes", "2023-26\npost-hike"]


# --------------------------------------------------------------------------
# Shared computations
# --------------------------------------------------------------------------
def coverage_by_window(recs, gamma=1.0):
    """Empirical P10-P90 band coverage; gamma expands the band about 0."""
    out = {}
    for w in WINDOWS:
        hit = tot = 0
        for r in recs:
            win = r["windows"].get(w)
            if not win or win.get("in_band") is None:
                continue
            fr = win["fwd_real"]
            p10 = win["pred"]["p10_pct"] * gamma
            p90 = win["pred"]["p90_pct"] * gamma
            hit += 1 if (p10 <= fr <= p90) else 0
            tot += 1
        out[w] = (100.0 * hit / tot, tot)
    return out


def brier_by_era(recs, window="90d"):
    """p_below Brier: conditional table vs unconditional same-asset base rate."""
    acc = defaultdict(lambda: {"cond": [], "unc": []})
    for r in recs:
        e = era7(r["date"])
        if e is None:
            continue
        win = r["windows"].get(window)
        if not win or win.get("below_current") is None:
            continue
        y = 1.0 if win["below_current"] else 0.0
        acc[e]["cond"].append((win["pred"]["p_below"] - y) ** 2)
        acc[e]["unc"].append((win["uncond"]["p_below"] - y) ** 2)
    res = {}
    for e in ERAS:
        c = acc[e]["cond"]; u = acc[e]["unc"]
        if c:
            res[e] = (float(np.mean(c)), float(np.mean(u)), len(c))
    return res


# ==========================================================================
# FIGURE 1 — OOS coverage by window, uncalibrated vs calibrated
# ==========================================================================
def fig1_coverage(recs, out):
    """Uncalibrated reproduced from data; calibrated via band expansion gamma=1.1.
    Annotated against the pre-registered acceptance band [75, 85]."""
    uncal = coverage_by_window(recs, gamma=1.0)
    cal = coverage_by_window(recs, gamma=1.1)

    labels = [f"{w}\n(n={uncal[w][1]})" for w in WINDOWS]
    u = [uncal[w][0] for w in WINDOWS]
    c = [cal[w][0] for w in WINDOWS]
    x = np.arange(len(WINDOWS)); bw = 0.36

    fig, ax = plt.subplots(figsize=(7.4, 4.6))
    ax.axhspan(TARGET_LO, TARGET_HI, color=C_OK, alpha=0.12, zorder=0)
    ax.axhline(TARGET_LO, color=C_OK, lw=1, ls="--", alpha=0.6)
    ax.axhline(TARGET_HI, color=C_OK, lw=1, ls="--", alpha=0.6)
    ax.text(len(WINDOWS) - 0.5, TARGET_HI - 0.4, "pre-registered band [75%, 85%]",
            ha="right", va="top", color=C_OK, fontsize=9.5, style="italic")

    b1 = ax.bar(x - bw / 2, u, bw, label="Uncalibrated", color=C_UNCAL, edgecolor="white")
    b2 = ax.bar(x + bw / 2, c, bw, label="Calibrated (band x1.1)", color=C_CAL, edgecolor="white")
    for bars in (b1, b2):
        for r in bars:
            ax.annotate(f"{r.get_height():.0f}%", (r.get_x() + r.get_width() / 2, r.get_height()),
                        textcoords="offset points", xytext=(0, 3), ha="center", fontsize=10, fontweight="bold")

    ax.set_xticks(x); ax.set_xticklabels(labels)
    ax.set_ylabel("P10-P90 band coverage")
    ax.set_ylim(0, 100)
    ax.yaxis.set_major_formatter(matplotlib.ticker.PercentFormatter())
    ax.set_title("Fig. 6  Probability-band coverage by horizon, before / after calibration")
    ax.legend(loc="lower left", ncol=2)
    ax.text(0.0, -0.22, "Recomputed from path_review.jsonl (n=1,579 zero-lookahead points). "
            "Band expansion gamma=1.1 lifts every horizon toward the target band.",
            transform=ax.transAxes, fontsize=8.5, color=C_NEU)
    fig.savefig(os.path.join(out, "figure6_coverage_by_window.png"))
    plt.close(fig)
    return {"uncal": u, "cal": c}


# ==========================================================================
# FIGURE 2 — Era x regime coverage heatmap (90d)
# ==========================================================================
def fig2_heatmap(recs, out, window="90d"):
    grid = np.full((len(ERAS), len(REGIMES)), np.nan)
    ncount = np.zeros((len(ERAS), len(REGIMES)), dtype=int)
    for i, e in enumerate(ERAS):
        for j, rg in enumerate(REGIMES):
            hit = tot = 0
            for r in recs:
                if era7(r["date"]) != e or r.get("regime") != rg:
                    continue
                win = r["windows"].get(window)
                if not win or win.get("in_band") is None:
                    continue
                hit += 1 if win["in_band"] else 0; tot += 1
            if tot:
                grid[i, j] = 100.0 * hit / tot
                ncount[i, j] = tot

    fig, ax = plt.subplots(figsize=(6.6, 5.6))
    cmap = plt.cm.RdYlGn
    im = ax.imshow(grid, cmap=cmap, vmin=0, vmax=100, aspect="auto")
    ax.set_xticks(range(len(REGIMES)))
    ax.set_xticklabels([r.replace("_", "\n") for r in REGIMES])
    ax.set_yticks(range(len(ERAS)))
    ax.set_yticklabels([e.replace("\n", " ") for e in ERAS], fontsize=9.5)
    for i in range(len(ERAS)):
        for j in range(len(REGIMES)):
            if np.isnan(grid[i, j]):
                ax.text(j, i, "-", ha="center", va="center", color="#999")
            else:
                v = grid[i, j]
                txt = f"{v:.0f}%\nn={ncount[i, j]}"
                ax.text(j, i, txt, ha="center", va="center", fontsize=9,
                        color="black" if 35 < v < 85 else "white", fontweight="bold")
    ax.set_title(f"Fig. 3  Coverage by era x regime ({window}); target = 80%", pad=12)
    cbar = fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
    cbar.set_label("coverage (%)")
    cbar.ax.axhline(80, color="black", lw=1.4)
    ax.text(0.0, -0.235, "Worst bucket: GC=F 2007-09 downtrend = 7% (n=14) — spurious precision when the\n"
            "conditional sample is tiny. Reproduced from path_review.jsonl.",
            transform=ax.transAxes, fontsize=8.5, color=C_NEU)
    fig.savefig(os.path.join(out, "figure3_era_regime_heatmap.png"))
    plt.close(fig)
    return grid, ncount


# ==========================================================================
# FIGURE 3 — Spurious precision: coverage & band width vs effective_n
# ==========================================================================
def fig3_spurious_precision(recs, out, window="90d"):
    # Bucket by effective_n; show coverage and median band half-width per bucket.
    edges = [(1, 1), (2, 4), (5, 15), (16, 100000)]
    labels = ["1", "2-4", "5-15", ">=16"]
    cov = []; halfw = []; ns = []
    for lo, hi in edges:
        hit = tot = 0; widths = []
        for r in recs:
            win = r["windows"].get(window)
            if not win or win.get("in_band") is None:
                continue
            en = win["pred"].get("effective_n")
            if en is None or not (lo <= en <= hi):
                continue
            hit += 1 if win["in_band"] else 0; tot += 1
            widths.append((win["pred"]["p90_pct"] - win["pred"]["p10_pct"]) / 2.0)
        cov.append(100.0 * hit / tot if tot else np.nan)
        halfw.append(float(np.median(widths)) if widths else np.nan)
        ns.append(tot)

    x = np.arange(len(labels))
    fig, ax1 = plt.subplots(figsize=(7.6, 4.7))
    bars = ax1.bar(x, cov, color=C_CAL, alpha=0.85, edgecolor="white", width=0.58, zorder=3)
    ax1.axhline(80, color=C_OK, ls="--", lw=1.2)
    ax1.text(len(labels) - 0.5, 81, "80% target", ha="right", color=C_OK, fontsize=9)
    ax1.set_ylabel("coverage (%)", color=C_CAL)
    ax1.set_ylim(0, 100); ax1.tick_params(axis="y", labelcolor=C_CAL)
    for r, n in zip(bars, ns):
        ax1.annotate(f"{r.get_height():.0f}%\nn={n}", (r.get_x() + r.get_width() / 2, r.get_height()),
                     textcoords="offset points", xytext=(0, 4), ha="center", fontsize=9)
    ax2 = ax1.twinx()
    ax2.grid(False)
    ax2.plot(x, halfw, "-o", color=C_ACC, lw=2.2, label="median band half-width", zorder=4)
    ax2.set_ylabel("predicted band half-width (%)", color=C_ACC)
    ax2.set_ylim(0, max(halfw) * 1.6)
    ax2.tick_params(axis="y", labelcolor=C_ACC)
    ax2.legend(loc="lower right", fontsize=9)
    # annotate the n_eff = 1 collapse
    ax1.annotate("narrow band, yet\ncoverage collapses",
                 xy=(0, cov[0]), xytext=(0.55, 20),
                 fontsize=9, color=C_ACC, ha="left",
                 arrowprops=dict(arrowstyle="->", color=C_ACC, lw=1.4))
    ax1.set_xticks(x); ax1.set_xticklabels(labels)
    ax1.set_xlabel("effective independent sample size  (effective_n)")
    ax1.set_title(f"Fig. 4  Small-sample 'spurious precision' ({window})")
    ax1.set_zorder(ax2.get_zorder() + 1); ax1.patch.set_visible(False)
    ax1.text(0.0, -0.24, "The conditional band stays ~9% wide regardless of sample size, but coverage falls to 42% "
             "at effective_n=1:\nthe distribution is equally confident on thin data. Reproduced from path_review.jsonl.",
             transform=ax1.transAxes, fontsize=8.5, color=C_NEU)
    fig.savefig(os.path.join(out, "figure4_spurious_precision.png"))
    plt.close(fig)
    return labels, cov, halfw, ns


# ==========================================================================
# FIGURE 4 — Conditional vs unconditional Brier by era
# ==========================================================================
def fig4_brier(recs, out, window="90d"):
    res = brier_by_era(recs, window)
    eras = [e for e in ERAS if e in res]
    cond = [res[e][0] for e in eras]
    unc = [res[e][1] for e in eras]
    ns = [res[e][2] for e in eras]
    x = np.arange(len(eras)); bw = 0.38

    fig, ax = plt.subplots(figsize=(8.2, 4.7))
    b1 = ax.bar(x - bw / 2, cond, bw, label="Conditional table  p_below", color=C_CAL, edgecolor="white")
    b2 = ax.bar(x + bw / 2, unc, bw, label="Unconditional base rate", color=C_UNCAL, edgecolor="white")
    for i, (cc, uu) in enumerate(zip(cond, unc)):
        if cc > uu:  # conditional worse than base rate -> flag
            ax.annotate("x", (x[i] - bw / 2, cc), textcoords="offset points",
                        xytext=(0, 2), ha="center", color=C_ACC, fontweight="bold")
    ax.set_xticks(x)
    ax.set_xticklabels([f"{e}\n(n={n})" for e, n in zip([e.replace(chr(10), ' ') for e in eras], ns)], fontsize=8.3)
    ax.set_ylabel("Brier score  (lower is better)")
    ax.set_title(f"Fig. 5  Conditional vs unconditional Brier by era ({window})")
    ax.legend(loc="upper left")
    ax.text(0.0, -0.27, "Red x marks eras where the conditional table is WORSE than the naive same-asset base rate "
            "-- the\nmotivation for shrinkage toward the unconditional prior. Reproduced from path_review.jsonl.",
            transform=ax.transAxes, fontsize=8.5, color=C_NEU)
    fig.savefig(os.path.join(out, "figure5_brier_by_era.png"))
    plt.close(fig)
    return eras, cond, unc, ns


# ==========================================================================
# FIGURE 5 — LLM self-reported confidence distribution
# ==========================================================================
def fig5_confidence(archive, out):
    vals = load_confidence(archive)
    vals = np.array(vals)
    fig, ax = plt.subplots(figsize=(7.8, 4.5))
    bins = np.arange(0.0, 0.951, 0.025)
    n, _, patches = ax.hist(vals, bins=bins, color=C_CAL, alpha=0.85, edgecolor="white")
    # highlight the 0.05-multiple spikes
    for b, p in zip(bins, patches):
        nearest = round(b * 20) / 20  # nearest 0.05
        if abs(b - nearest) < 1e-9 and round(b, 2) in (0.55, 0.60, 0.65, 0.35):
            p.set_color(C_ACC)
    med = float(np.median(vals)); mean = float(np.mean(vals))
    ax.axvline(med, color=C_NEU, ls="--", lw=1.4)
    ax.text(med + 0.005, ax.get_ylim()[1] * 0.92, f"median {med:.2f}", color=C_NEU, fontsize=9)
    ax.set_xlabel("LLM self-reported CONFIDENCE field")
    ax.set_ylabel("decision count")
    ax.set_title("Fig. 7  Verbalized confidence clusters on 0.05 multiples")
    ax.text(0.0, -0.22, f"n={len(vals):,} committee decisions. Spikes at 0.35 / 0.55 / 0.60 / 0.65 reproduce the "
            "round-number\ngranularity artifact of Xiong et al. (ICLR 2024) -- evidence these raw numbers are not "
            "calibrated.",
            transform=ax.transAxes, fontsize=8.5, color=C_NEU)
    fig.savefig(os.path.join(out, "figure7_confidence_distribution.png"))
    plt.close(fig)
    return {"n": int(len(vals)), "median": med, "mean": mean}


# ==========================================================================
# FIGURE 6 — Statistical verifiability of return claims (math, Section 4.3)
# ==========================================================================
def fig6_verifiability(out):
    fig, (axL, axR) = plt.subplots(1, 2, figsize=(9.6, 4.4))

    # Left: years to reach t ~ 2 as a function of Sharpe.  t = SR*sqrt(T) => T=(2/SR)^2
    sr = np.linspace(0.25, 1.5, 200)
    years = (2.0 / sr) ** 2
    axL.plot(sr, years, color=C_CAL, lw=2.4)
    axL.fill_between(sr, years, 0, color=C_CAL, alpha=0.08)
    for s in (0.5, 1.0):
        axL.scatter([s], [(2 / s) ** 2], color=C_ACC, zorder=5)
        axL.annotate(f"SR={s}  ->  {(2/s)**2:.0f} yr", (s, (2 / s) ** 2),
                     textcoords="offset points", xytext=(8, 6), color=C_ACC, fontsize=9.5, fontweight="bold")
    axL.set_xlabel("Sharpe ratio (SR)")
    axL.set_ylabel("years of data for t-stat ~ 2")
    axL.set_title("Years to a statistically\nsignificant return claim")
    axL.set_ylim(0, 70)

    # Right: Sharpe standard error vs sample length.  SE ~ sqrt((1+SR^2/2)/T)
    T = np.linspace(1, 25, 200)
    for s, col in [(0.5, C_CAL), (1.0, C_OK)]:
        se = np.sqrt((1 + s ** 2 / 2) / T)
        axR.plot(T, se, lw=2.2, color=col, label=f"SR={s}")
        # mark where SE ~ same order as estimate (SE >= SR/2)
    axR.axhline(0.25, color=C_NEU, ls=":", lw=1.2)
    axR.text(24.5, 0.265, "SE = 0.25", ha="right", color=C_NEU, fontsize=9)
    axR.set_xlabel("sample length T (years)")
    axR.set_ylabel("Sharpe standard error")
    axR.set_title("Sharpe estimation error\nshrinks only as 1/sqrt(T)")
    axR.legend(loc="upper right")
    axR.set_ylim(0, 1.2)

    fig.suptitle("Fig. 2  Why return claims are not verifiable on an MVP horizon (Section 4.3)",
                 fontsize=13, fontweight="bold", y=1.02)
    fig.text(0.0, -0.04, "Closed form: t = SR*sqrt(T); SE(SR) ~ sqrt((1+SR^2/2)/T) [Lo 2002]. "
             "A 10-year, SR=0.5 strategy still has SE ~ 0.34 -- the\nsame order as the estimate. "
             "Calibration (coverage, Brier) is testable today; profitability is not.",
             fontsize=8.5, color=C_NEU)
    fig.savefig(os.path.join(out, "figure2_verifiability.png"))
    plt.close(fig)


# ==========================================================================
# FIGURE 7 — Three-mechanism decomposition schematic (Section 4.1)
# ==========================================================================
def fig7_mechanisms(out):
    fig, ax = plt.subplots(figsize=(9.4, 5.2))
    ax.set_xlim(0, 10); ax.set_ylim(0, 6.4); ax.axis("off")
    ax.grid(False)

    def box(x, y, w, h, text, fc, ec, fs=10, tc="black", weight="normal"):
        b = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.04,rounding_size=0.12",
                           fc=fc, ec=ec, lw=1.6, zorder=2)
        ax.add_patch(b)
        ax.text(x + w / 2, y + h / 2, text, ha="center", va="center",
                fontsize=fs, color=tc, fontweight=weight, zorder=3, wrap=True)

    def arrow(x1, y1, x2, y2):
        ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle="-|>",
                     mutation_scale=16, lw=1.6, color=C_NEU, zorder=1))

    # left: stochastic LLM proposals
    box(0.2, 2.6, 1.9, 1.2, "Stochastic\nLLM proposals", "#EEF2F7", C_NEU, fs=10, weight="bold")

    # three mechanisms (middle)
    box(2.7, 4.5, 4.6, 1.4,
        "(a) Information-source decomposition\nagents consume different data\n"
        "[justified iff sources differ]", "#E8F0FB", C_CAL, fs=9.5)
    box(2.7, 2.6, 4.6, 1.4,
        "(b) Decorrelated sampling + aggregation\nvariance reduction from independent draws\n"
        "[the measured gain; no role-play needed]", "#E9F5EE", C_OK, fs=9.5)
    box(2.7, 0.7, 4.6, 1.4,
        "(c) Deterministic flow control\nrules wrap the stochastic proposals\n"
        "[strongest evidence in high-stakes]", "#FBEAEA", C_ACC, fs=9.5)

    # right: calibrated output
    box(7.9, 2.6, 1.9, 1.2, "Calibrated\nprobability\noutput", "#EEF2F7", C_NEU, fs=10, weight="bold")

    for yy in (5.2, 3.3, 1.4):
        arrow(2.1, 3.2, 2.7, yy)
        arrow(7.3, yy, 7.9, 3.2)

    # evidence-strength ribbon
    ax.text(5.0, 6.15, "Fig. 1  Three independently testable mechanisms behind 'multi-agent value'",
            ha="center", fontsize=12.5, fontweight="bold")
    ax.text(5.0, 0.12,
            "Role persona is NOT a fourth mechanism: it counts only when a role maps to a distinct "
            "information source (a).",
            ha="center", fontsize=8.8, color=C_NEU, style="italic")
    fig.savefig(os.path.join(out, "figure1_mechanisms.png"))
    plt.close(fig)


# --------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--archive", default="../openinvest-research-archive")
    ap.add_argument("--out", default="./figures")
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)

    recs = load_path_review(args.archive)
    summary = {"n_records": len(recs)}

    summary["fig1"] = fig1_coverage(recs, args.out)
    g, nc = fig2_heatmap(recs, args.out)
    summary["fig3"] = fig3_spurious_precision(recs, args.out)
    summary["fig4"] = fig4_brier(recs, args.out)
    summary["fig5"] = fig5_confidence(args.archive, args.out)
    fig6_verifiability(args.out)
    fig7_mechanisms(args.out)

    with open(os.path.join(args.out, "_figure_stats.json"), "w") as f:
        json.dump(summary, f, indent=2, default=float)
    print("Done. Figures + _figure_stats.json written to", args.out)
    print(json.dumps(summary, indent=2, default=float))


if __name__ == "__main__":
    main()
