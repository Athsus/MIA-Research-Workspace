"""Fig 2 (roc_ngram13) restyle — Curvature-Clues Fig-4 aesthetic.

Re-draws the ngram13_0.8 ROC figure with the changes requested:
  1. no figure suptitle (title removed)
  2. no per-panel subtitle inside the axes (subset names go in the LaTeX caption;
     panels are labelled (a)-(d) only)
  3. a single SHARED legend for all four panels (method -> colour), with the
     per-panel AUROC shown as a small colour-coded text block instead
  4. overall style matched to Curvature Clues (Ravikumar et al. 2024) Fig. 4:
     a low-FPR ROC on LOG-LOG axes, thin diagonal reference, light grid,
     muted palette, clean spines.

Data: per-token lambda_c + PETAL caches from the formal baseline report
(1000+1000 ngram13_0.8, pythia-70m-deduped @ step143000; PETAL on dm only).
Reuses the exact orientation / best-pooling logic of that report's plot_rocs.py.
"""
import json
from pathlib import Path

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from sklearn.metrics import roc_auc_score, roc_curve

# ----------------------------------------------------------------------------- data
BASELINE = Path(
    "/home/aoyu/repli/Curvature-Clues/mia-llm-research/reports/"
    "report_20260524_111521_baseline_PETAL_formal_method_performance"
)
CACHE = BASELINE / "cache"
CACHE_LC = CACHE / "pertoken_lambda_c"
MODEL_TAG = "pythia-70m-deduped_step143000"

OUT = Path(__file__).parent
SUBSETS = ["dm", "github", "hackernews", "pile_cc"]          # panel order
DISP = {"dm": "DM Mathematics", "github": "GitHub",
        "hackernews": "HackerNews", "pile_cc": "Pile-CC"}    # clean panel headers


def signed(labels, raw):
    a = roc_auc_score(labels, raw)
    return (raw, a) if a >= 0.5 else (-raw, 1 - a)


def bot_k(per_token, frac):
    a = np.asarray(per_token, dtype=np.float64)
    a = a[np.isfinite(a)]
    if a.size == 0:
        return float("nan")
    k = max(1, int(np.ceil(len(a) * frac)))
    return float(np.sort(a)[:k].mean())


def best_lc(recs, labels):
    cands = {
        "mean": np.array([r["mean_lambda_c"] for r in recs]),
        "max": np.array([r["max_lambda_c"] for r in recs]),
    }
    for frac in [0.05, 0.10, 0.20, 0.50]:
        cands[f"bot-{int(frac*100)}%"] = np.array(
            [bot_k(r["per_token_lambda_c"], frac) for r in recs]
        )
    best = None
    for name, raw in cands.items():
        mask = np.isfinite(raw)
        if mask.sum() < 10:
            continue
        score = -raw
        a = roc_auc_score(labels[mask], score[mask])
        if a < 0.5:
            score = -score
            a = 1 - a
        if best is None or a > best[2]:
            best = (name, score, a)
    return best


def load_lc(subset):
    fp = CACHE_LC / f"{subset}_{MODEL_TAG}.jsonl"
    return [json.loads(l) for l in fp.open()]


def load_petal(subset):
    """Return PETAL records ONLY if the cache is complete (both classes, ~2000).
    A mid-run, partially-written cache is treated as absent so the panel falls
    back to PPL + lambda_c rather than rendering a single-class / NaN ROC."""
    fp = CACHE / f"petal_{subset}_{MODEL_TAG}_vs_gpt2-xl.jsonl"
    if not fp.exists():
        return None
    recs = []
    for line in fp.open():
        line = line.strip()
        if not line:
            continue
        try:
            recs.append(json.loads(line))          # skip a torn last line (live append)
        except json.JSONDecodeError:
            continue
    labs = [r["label"] for r in recs]
    if len(recs) < 1950 or labs.count(0) < 900 or labs.count(1) < 900:
        return None                                # still running -> not usable yet
    return recs


def gather(subset):
    lc = load_lc(subset)
    pet = load_petal(subset)
    if pet is not None:
        lc_by = {(r["label"], r["idx"]): r for r in lc}
        pt_by = {(r["label"], r["idx"]): r for r in pet}
        common = sorted(set(lc_by) & set(pt_by))
        labels = np.array([k[0] for k in common])
        petal_raw = np.array([pt_by[k]["petal_score"] for k in common])
        loss_raw = np.array([lc_by[k]["base_loss"] for k in common])
        lc_aligned = [lc_by[k] for k in common]
        s_pet, _ = signed(labels, petal_raw)
    else:
        labels = np.array([r["label"] for r in lc])
        loss_raw = np.array([r["base_loss"] for r in lc])
        lc_aligned = lc
        s_pet = None
    s_ppl, _ = signed(labels, -loss_raw)
    name, s_lc, _ = best_lc(lc_aligned, labels)
    return {"labels": labels, "ppl": s_ppl, "petal": s_pet, "lc_name": name, "lc": s_lc}


# ----------------------------------------------------------------------------- style
# Curvature-Clues Fig.4 inspired: muted palette, log-log, light grid, clean spines.
plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "font.size": 11,
    "axes.linewidth": 0.8,
    "axes.edgecolor": "#444444",
})
COLORS = {"PPL": "#3b6ea5", "PETAL": "#c44e52", "lambda_c": "#4c9f50"}
PRETTY = {"PPL": "PPL (loss)", "PETAL": "PETAL", "lambda_c": r"$\lambda_c$ (curvature)"}
XLIM = (1e-3, 1.0)
YLIM = (1e-3, 1.0)


def draw_panel(ax, d, title, logy=True):
    labels = d["labels"]
    series = [("PPL", d["ppl"], d.get("ppl_name"))]
    if d["petal"] is not None:
        series.append(("PETAL", d["petal"], None))
    series.append(("lambda_c", d["lc"], d["lc_name"]))

    annot = []
    for key, score, sub in series:
        mask = np.isfinite(score)
        fpr, tpr, _ = roc_curve(labels[mask], score[mask])
        auc = roc_auc_score(labels[mask], score[mask])
        ax.plot(fpr, tpr, color=COLORS[key], lw=1.9, solid_capstyle="round", zorder=3)
        for f_t, mk in [(0.01, "o"), (0.05, "s")]:
            t_t = float(np.interp(f_t, fpr, tpr))
            ax.plot(f_t, t_t, mk, color=COLORS[key], ms=6, mec="white", mew=1.1, zorder=4)
        tag = {"PPL": "PPL", "PETAL": "PETAL", "lambda_c": r"$\lambda_c$"}[key]
        suff = f" ({sub})" if (key == "lambda_c" and sub) else ""
        annot.append((f"{tag}{suff}", auc, COLORS[key]))

    # diagonal reference
    ax.set_xscale("log"); ax.set_xlim(*XLIM)
    if logy:
        ax.plot(XLIM, YLIM, ls=(0, (4, 4)), color="#999999", lw=0.9, zorder=1)
        ax.set_yscale("log"); ax.set_ylim(*YLIM)
    else:
        ax.plot(XLIM, (XLIM[0], XLIM[1]), ls=(0, (4, 4)), color="#999999", lw=0.9, zorder=1)
        ax.set_ylim(-0.02, 1.02)
    ax.set_xlabel("False positive rate")
    ax.grid(True, which="both", color="#cfcfcf", lw=0.5, alpha=0.55, zorder=0)
    ax.tick_params(length=3, width=0.7)

    # clean domain header (MIMIR-style); AUROC sits in the empty lower-right
    ax.set_title(title, fontsize=12.5, fontweight="bold", color="#2b2b2b", pad=7)
    y0 = 0.035
    for name, auc, col in reversed(annot):
        ax.text(0.965, y0, f"{name}  {auc:.3f}", transform=ax.transAxes,
                fontsize=8.8, color=col, va="bottom", ha="right")
        y0 += 0.072


def render(rows, logy, stem):
    fig, axes = plt.subplots(1, 4, figsize=(16.0, 3.6))
    for ax, s in zip(axes, SUBSETS):
        draw_panel(ax, rows[s], DISP[s], logy=logy)
    axes[0].set_ylabel("True positive rate")

    # single shared legend, ONE ENTRY PER ROW, to the right of the panels
    handles = [Line2D([0], [0], color=COLORS[k], lw=2.6, label=PRETTY[k])
               for k in ["PPL", "PETAL", "lambda_c"]]
    handles += [
        Line2D([0], [0], marker="o", color="#555555", lw=0, mec="white", mew=1.1,
               ms=8, label="TPR @ 1% FPR"),
        Line2D([0], [0], marker="s", color="#555555", lw=0, mec="white", mew=1.1,
               ms=8, label="TPR @ 5% FPR"),
    ]
    fig.legend(handles=handles, loc="center left", bbox_to_anchor=(0.885, 0.5),
               ncol=1, frameon=False, fontsize=10.5, handletextpad=0.6,
               labelspacing=1.0)
    fig.tight_layout(rect=(0, 0, 0.875, 1))
    fp = OUT / f"{stem}.png"
    fig.savefig(fp, dpi=200, bbox_inches="tight")
    print("saved", fp)
    plt.close(fig)


def main():
    rows = {s: gather(s) for s in SUBSETS}
    render(rows, logy=True, stem="fig2_roc_ngram13_restyle")           # log-log (Curvature Clues Fig.4)

    # also dump the numbers behind the figure (provenance)
    summary = {}
    for s in SUBSETS:
        d = rows[s]
        rec = {
            "n_mem": int((d["labels"] == 1).sum()),
            "n_non": int((d["labels"] == 0).sum()),
            "AUROC_PPL": float(roc_auc_score(d["labels"], d["ppl"])),
            "AUROC_lambda_c": float(roc_auc_score(d["labels"], d["lc"])),
            "lambda_c_pooling": d["lc_name"],
        }
        if d["petal"] is not None:
            rec["AUROC_PETAL"] = float(roc_auc_score(d["labels"], d["petal"]))
        summary[s] = rec
    (OUT / "fig2_summary.json").write_text(json.dumps(summary, indent=2))
    print("saved", OUT / "fig2_summary.json")


if __name__ == "__main__":
    main()
