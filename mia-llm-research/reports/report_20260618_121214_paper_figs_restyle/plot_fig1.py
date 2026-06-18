"""Fig 1 (v4) -- CurvMIA, concrete horizontal explainer (matplotlib, PNG only).

  1. Input    : a candidate sentence in quotes.
  2. Target LM : thin vertical layer-columns left->right
                 (embed l=0, layer 1, ..., layer l, ..., layer L); input feeds
                 the first (green) embeddings column; forward pass flows right.
  3. Curvature: perturb token t's state ALONG -g; the loss basin gives eta_c
                (where the loss returns to baseline); lambda_c = 2/eta_c.
                Members = wide/flat basin (large eta_c); non-members = sharp.
  4. Score    : per-token {lambda_c} -> keep the bottom-K% (smallest) -> average
                = s(x); low s(x) (flat basins) => member.

Variants: Whole (whole sentence -> its loss -> one sharpness/seq);
          Pertoken (per-token lambda_c at l=0); Deep (per-token lambda_c at l>0).
"""
from pathlib import Path

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

OUT = Path(__file__).parent
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 12})

INK, SOFT = "#2b2b2b", "#666666"
CARD, CARD_E = "#f3f7fc", "#b9cfe6"
GREY_F, GREY_E = "#eef1f6", "#9aa7b4"
# --- method identity colours (RESERVED: only ever mean a variant) ---
ORANGE = "#d3a017"          # CurvMIA-Whole
GREEN, GREEN_F = "#2e9c64", "#d6efe1"   # CurvMIA-Pertoken  (and its embed site)
BLUE,  BLUE_F  = "#3b6ea5", "#dbe8f7"   # CurvMIA-Deep      (and its layer site)
# --- membership semantics (separate axis, NOT a method colour) ---
VIO, VIO_F = "#178f8f", "#d8efef"       # member  (teal; pairs with red, not a method hue)
RED, RED_F = "#d1495b", "#f7dee2"       # non-member
# --- neutral accents ---
HL = "#e9ebf0"              # token-t highlight (neutral; ink outline)
LAM = "#2b2b2b"             # lambda_c is universal -> neutral ink

fig, ax = plt.subplots(figsize=(15.0, 5.7))
ax.set_xlim(0, 15.0); ax.set_ylim(0, 5.7); ax.axis("off")

YT, YB = 4.55, 2.05
H = YT - YB


def rbox(x, y, w, h, fc, ec, lw=1.5, z=3, rs=0.09):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle=f"round,pad=0.02,rounding_size={rs}",
                                facecolor=fc, edgecolor=ec, lw=lw, zorder=z))


def arrow(x1, y1, x2, y2, color=SOFT, lw=2.0, rad=0.0, ms=14):
    ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle="-|>", mutation_scale=ms,
                                 lw=lw, color=color, connectionstyle=f"arc3,rad={rad}", zorder=4))


def stage(x, n, label):
    ax.text(x, 5.42, f"{n}", fontsize=12.5, fontweight="bold", color="white", ha="center",
            va="center", zorder=6, bbox=dict(boxstyle="circle,pad=0.26", fc=INK, ec="none"))
    ax.text(x + 0.36, 5.42, label, fontsize=12, fontweight="bold", color=INK, ha="left", va="center")


# ----------------------------------------------------------------- 1. input
stage(0.5, "1", "Input")
ax.text(1.4, 4.05, "candidate text  $x$", fontsize=11, color=SOFT, ha="center", style="italic")
rbox(0.35, 3.05, 2.1, 0.85, CARD, CARD_E)
ax.text(1.4, 3.47, '"The cat sat\non the mat"', fontsize=12.5, color=INK, ha="center", va="center")
arrow(2.5, 3.47, 2.96, 3.47, color=GREEN, lw=2.2)
ax.text(2.73, 3.7, "embed", fontsize=8.3, color=GREEN, ha="center")

# ----------------------------------------------------------------- 2. LM: thin columns + two gaps
stage(3.0, "2", "Target LM   (frozen, forward pass)")
cw, step, cx0 = 0.46, 0.74, 2.98
cols = [("embed\n$\\ell{=}0$", GREEN_F, GREEN),
        ("layer 1", GREY_F, GREY_E),
        ("DOTS", None, None),
        ("layer $\\ell$", BLUE_F, BLUE),
        ("DOTS", None, None),
        ("layer $L$", GREY_F, GREY_E)]
NCELL = 6
centers = []
for i, (name, fc, ec) in enumerate(cols):
    x = cx0 + i * step
    centers.append(x + cw / 2)
    if name == "DOTS":
        ax.text(x + cw / 2, (YB + YT) / 2, "$\\cdots$", fontsize=15, color="#aab2bb", ha="center", va="center")
        continue
    rbox(x, YB, cw, H, fc, ec, lw=1.6)
    for j in range(1, NCELL):
        yy = YB + j * H / NCELL
        ax.plot([x, x + cw], [yy, yy], color=ec, lw=0.6, alpha=0.55, zorder=4)
    ax.text(x + cw / 2, YB - 0.27, name, fontsize=9.3, color=INK, ha="center", va="center")
    if name.startswith("embed") or name.startswith("layer $\\ell$"):
        cyy = YT - 1.5 * H / NCELL
        rbox(x + 0.05, cyy - H / NCELL / 2 + 0.03, cw - 0.10, H / NCELL - 0.06, HL, INK, lw=1.4, z=5)
        ax.text(x + cw / 2, cyy, "$t$", fontsize=8.2, color=INK, ha="center", va="center", zorder=6)
for a, b in zip(centers[:-1], centers[1:]):
    arrow(a + cw / 2 - 0.02, 3.3, b - cw / 2 + 0.02, 3.3, color=SOFT, lw=1.4, ms=10)
ax.text(centers[0], 4.74, "Pertoken", color=GREEN, fontsize=9.3, fontweight="bold", ha="center")
arrow(centers[0], 4.62, centers[0], YT + 0.02, color=GREEN, lw=1.2, ms=9)
ax.text(centers[3], 4.74, "Deep", color=BLUE, fontsize=9.3, fontweight="bold", ha="center")
arrow(centers[3], 4.62, centers[3], YT + 0.02, color=BLUE, lw=1.2, ms=9)

# ----------------------------------------------------------------- 3. curvature basin
stage(8.05, "3", "Per-token curvature")
# layer L outputs the loss into the basin (the loss is read at the model output)
arrow(centers[5] + cw / 2 + 0.02, YT - 0.12, 7.92, YT + 0.04, color=SOFT, lw=1.6, rad=-0.32, ms=12)
# ax.text(7.35, YT + 0.30, "loss  $\\ell_t$", fontsize=8.8, color=SOFT, ha="center", va="center")
# # the per-token probe is shared (perturb at l=0 or l>0), NOT Deep-only
# ax.text(8.05, 5.06, "perturb step shared by", fontsize=8.6, color=SOFT, ha="left", va="center")
# ax.text(10.02, 5.06, "Pertoken", fontsize=8.6, color=GREEN, ha="left", va="center", fontweight="bold")
# ax.text(10.02, 4.84, "&  Deep", fontsize=8.6, color=BLUE, ha="left", va="center", fontweight="bold")

bx = ax.inset_axes([7.45, YB, 3.05, H + 0.05], transform=ax.transData)
eta = np.linspace(0, 1.25, 300)
base = 1.0
etac_m, etac_n = 1.05, 0.42
loss_m = base + 1.55 * eta * (eta - etac_m)
loss_n = base + 7.5 * eta * (eta - etac_n)
y_axis = base - 1.55
bx.axhline(base, color="#b9b9b9", lw=1.0, ls="--", zorder=1)
bx.plot(eta, loss_m, color=VIO, lw=2.6, zorder=3)
bx.plot(eta, loss_n, color=RED, lw=2.6, zorder=3)
bx.fill_between(eta, loss_m, base, where=(loss_m < base), color=VIO, alpha=0.10)
bx.fill_between(eta, loss_n, base, where=(loss_n < base), color=RED, alpha=0.10)
# eta_c: marker on baseline, dotted line down to the -g axis, label upper-left of the foot
for etac, col in [(etac_n, RED), (etac_m, VIO)]:
    bx.plot(etac, base, "o", color=col, ms=6.5, mec="white", mew=1.2, zorder=5)
    bx.plot([etac, etac], [y_axis, base], color=col, lw=1.0, ls=":", zorder=2)
    bx.text(etac - 0.03, y_axis + 0.08, "$\\eta_c$", color=col, fontsize=12,
            ha="right", va="bottom", fontweight="bold")
# original loss  e = l_t(0)  at the root (eta=0) of both curves
bx.plot(0, base, "o", color=INK, ms=4.5, zorder=6)
bx.text(0.07, base + 0.34, "$e=\\ell_t(0)$  (original loss)", color=INK, fontsize=8.2, ha="left", va="center")
# L-shaped axes: vertical = loss, horizontal = step along -g
bx.annotate("", xy=(0.0, base + 0.55), xytext=(0.0, y_axis), arrowprops=dict(arrowstyle="-|>", color=INK, lw=1.5))
bx.annotate("", xy=(1.22, y_axis), xytext=(0.0, y_axis), arrowprops=dict(arrowstyle="-|>", color=INK, lw=1.5))
bx.text(1.22, y_axis - 0.2, "$-g$", color=INK, fontsize=11, ha="right", va="top", fontweight="bold")
bx.text(0.0, y_axis - 0.2, "step $\\eta$ along $-g$  (move $\\eta\\|g\\|$)", color=SOFT, fontsize=7.7,
        ha="left", va="top")
# member / non-member key: empty lower band
bx.text(0.46, base - 0.74, "member  (flat)", color=VIO, fontsize=9.0, va="center", fontweight="bold")
bx.text(0.46, base - 1.0, "non-member  (sharp)", color=RED, fontsize=9.0, va="center", fontweight="bold")
bx.set_xlim(-0.05, 1.27); bx.set_ylim(y_axis - 0.5, base + 0.62)
bx.set_ylabel("loss", fontsize=10)
bx.set_xticks([]); bx.set_yticks([])
for s in bx.spines.values():
    s.set_visible(False)
ax.text(8.97, 1.72, "$\\lambda_c^{(t)} = 2/\\eta_c$   (sharp $\\Rightarrow$ large $\\lambda_c$)",
        fontsize=11, color=LAM, ha="center", fontweight="bold")

# ----------------------------------------------------------------- 4. score: pooling, explicit
stage(11.35, "4", "Membership score")
arrow(10.6, 3.55, 11.15, 3.55, color=SOFT, lw=1.8)
# per-token lambda_c bars (sorted ascending); bottom-K% = smallest, highlighted
heights = np.array([0.20, 0.27, 0.36, 0.52, 0.66, 0.83, 1.02, 1.22]) * 0.82
bw, bg, bx0, by0 = 0.20, 0.075, 11.45, 3.15
K = 3
bcx = bx0 + 4 * (bw + bg)                      # bar-group centre
for i, h in enumerate(heights):
    x = bx0 + i * (bw + bg)
    col = VIO if i < K else "#c9d2dc"
    rbox(x, by0, bw, h, col, VIO if i < K else GREY_E, lw=1.0, rs=0.04)
ax.text(bcx, by0 + 1.18, "per-token $\\{\\lambda_c^{(t)}\\}$, sorted", fontsize=9.5, color=INK, ha="center")
# bracket under the bottom-K%
brx1, brx2 = bx0, bx0 + K * (bw + bg) - bg
ax.plot([brx1, brx1, brx2, brx2], [by0 - 0.10, by0 - 0.20, by0 - 0.20, by0 - 0.10], color=VIO, lw=1.3)
ax.text((brx1 + brx2) / 2, by0 - 0.38, "bottom-$K\\%$ (smallest)", fontsize=8.6, color=VIO,
        ha="center", va="center", fontweight="bold")
ax.text(bcx, by0 - 0.66, "mean of bottom-$K\\%$  $=\\ s(x)$", fontsize=10, color=INK,
        ha="center", va="center", fontweight="bold")
# decision
arrow(bcx, by0 - 0.86, bcx, 2.12, color=SOFT, lw=1.8)
rbox(bcx - 1.55, 1.15, 3.1, 0.92, VIO_F, VIO)
ax.text(bcx, 1.78, "low $s(x)$  $\\Rightarrow$  member", fontsize=10.2, color=VIO, ha="center", fontweight="bold")
ax.text(bcx, 1.44, "high $s(x)$  $\\Rightarrow$  non-member", fontsize=10.2, color=RED, ha="center")

# ----------------------------------------------------------------- variant comparison (bottom)
ax.add_patch(FancyBboxPatch((0.35, 0.12), 10.35, 1.55, boxstyle="round,pad=0.02,rounding_size=0.06",
                            facecolor="#fafafa", edgecolor="#e4e4e4", lw=1.0, zorder=1))
ax.text(0.58, 1.52, "Three variants — what each produces:", fontsize=10.0, color=INK,
        fontweight="bold", va="center")
for dvx in (3.85, 7.25):                                   # faint dividers
    ax.plot([dvx, dvx], [0.28, 1.30], color="#e0e0e0", lw=1.0, zorder=1)


def mini_cells(x0, y0, col, fcol, n=6, dot_h=0.18):
    """n token cells with a per-token lambda_c value (bar) above each."""
    cw_ = 0.20
    for k in range(n):
        x = x0 + k * (cw_ + 0.05)
        rbox(x, y0, cw_, 0.26, fcol, col, lw=0.9, rs=0.03)
        hh = dot_h * (0.5 + 0.5 * ((k * 7) % 5) / 4.0)     # varied heights
        ax.add_patch(FancyBboxPatch((x + 0.05, y0 + 0.30), cw_ - 0.10, hh,
                                    boxstyle="square,pad=0", facecolor=col, edgecolor="none", zorder=5))
    return x0 + n * (cw_ + 0.05)


# -- Whole: one bar (whole sentence) -> ONE sharpness
ax.text(0.55, 1.18, "●", color=ORANGE, fontsize=10, va="center")
ax.text(0.78, 1.18, "CurvMIA-Whole", color=ORANGE, fontsize=9.3, fontweight="bold", va="center")
rbox(0.6, 0.62, 1.5, 0.30, "#fbe8d2", ORANGE, lw=1.0)
ax.text(1.35, 0.77, "whole sentence", fontsize=7.0, color="#8a5a00", ha="center", va="center")
arrow(2.18, 0.77, 2.58, 0.77, color=ORANGE, lw=1.4, ms=10)
ax.plot(2.78, 0.77, "o", color=ORANGE, ms=17, zorder=5)
ax.text(2.78, 0.77, "$\\lambda_c$", fontsize=8, color="white", ha="center", va="center", zorder=6)
ax.text(0.6, 0.36, "one sharpness for the whole sentence", fontsize=8.0, color=SOFT, va="center")

# -- Pertoken: per-token lambda_c at embeddings (l=0)
ax.text(4.05, 1.18, "●", color=GREEN, fontsize=10, va="center")
ax.text(4.28, 1.18, "CurvMIA-Pertoken", color=GREEN, fontsize=9.3, fontweight="bold", va="center")
mini_cells(4.08, 0.62, GREEN, GREEN_F)
ax.text(4.08, 0.36, "one $\\lambda_c$ per token   (embeddings, $\\ell{=}0$)", fontsize=8.0, color=SOFT, va="center")

# -- Deep: per-token lambda_c at a hidden layer (l>0), via that layer's Jacobian
ax.text(7.45, 1.18, "●", color=BLUE, fontsize=10, va="center")
ax.text(7.68, 1.18, "CurvMIA-Deep", color=BLUE, fontsize=9.3, fontweight="bold", va="center")
end = mini_cells(7.48, 0.62, BLUE, BLUE_F)
for d in range(2):                                          # faint "deeper" layers under the cells
    ax.plot([7.48, end - 0.05], [0.56 - d * 0.05] * 2, color="#cfdae8", lw=1.0, zorder=2)
ax.text(7.48, 0.30, "one $\\lambda_c$ per token   (hidden layer, $\\ell{>}0$)", fontsize=8.0, color=SOFT, va="center")

fig.tight_layout()
fp = OUT / "fig1.png"
fig.savefig(fp, dpi=200, bbox_inches="tight")
print("saved", fp)
plt.close(fig)
