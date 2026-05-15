import Math from '../components/Math'

const R = (path: string) => `/reports/${path}`

function Fig({ src, caption, width }: { src: string; caption: string; width?: string }) {
  return (
    <figure className="fig">
      <img src={src} alt={caption} style={width ? { maxWidth: width } : undefined} />
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

function FigRow({ children }: { children: React.ReactNode }) {
  return <div className="fig-row">{children}</div>
}

function Callout({ type, title, children }: { type: 'warn' | 'info' | 'find'; title: string; children: React.ReactNode }) {
  return (
    <div className={`callout ${type}`}>
      <strong>{title}</strong>
      {children}
    </div>
  )
}

export default function Sprint3() {
  return (
    <article className="report">
      <h1 id="top">Sprint 3 · Landscape Foundations &amp; TAG &amp; TAB</h1>
      <p className="meta">Period: 2026-04-08 → 2026-04-17</p>

      <Callout type="warn" title="⚠ Lesson Learned">
        This sprint spent excessive compute on a high-precision ablation using <code>float64</code> and 100 perturbations
        per sample — orders of magnitude beyond what was needed. The h-ablation below required only ~10 samples in float32
        to reach the same conclusions. <strong>Do not repeat this pattern.</strong>
      </Callout>

      {/* TOC */}
      <nav className="toc">
        <h4>Contents</h4>
        <ul>
          <li><a href="#ch1">Chapter 1 · Visualising Loss Landscapes p.t. 1</a>
            <ul>
              <li><a href="#ch1-image">Image baseline (CIFAR-10)</a></li>
              <li><a href="#ch1-llm-method">LLM landscape — method derivation</a></li>
              <li><a href="#ch1-h-ablation">h-ablation results</a></li>
            </ul>
          </li>
          <li><a href="#ch2">Chapter 2 · TAG &amp; TAB</a></li>
          <li><a href="#ch3">Chapter 3 · Formal h-Ablation</a></li>
          <li><a href="#ch4">Chapter 4 · Per-token λ<sub>c</sub> · Min-K% Ablation</a>
            <ul>
              <li><a href="#ch4-data">Data &amp; saturation</a></li>
              <li><a href="#ch4-pools">Pool comparison</a></li>
              <li><a href="#ch4-findings">Findings</a></li>
            </ul>
          </li>
          <li><a href="/sprint4">Continue to Sprint 4 ↗</a></li>
        </ul>
      </nav>

      {/* ===================== CH1 ===================== */}
      <h2 id="ch1" className="section-anchor">Chapter 1 · Visualising Loss Landscapes p.t. 1</h2>
      <p className="meta">
        Report: <code>report_20260417_landscapes_n_h_ablation_pythia1d4B</code>{' '}
        (sub-folders <code>image_landscape/</code> and <code>llm_landscape/</code>)
      </p>

      <p>
        The first half of Sprint 3 was about <em>seeing</em> the loss landscape — both for an image
        classifier (sanity check) and for an LLM (the real target). The goal was simply to build
        a working pipeline for 1D / 2D loss-landscape visualisation that we could later reuse for
        curvature-based MIA signals. Sprint 4's <a href="/sprint4#ch1">p.t. 2</a> picks up from
        the same plotting infrastructure with random / Rademacher directions and the basin-like
        structure question.
      </p>

      {/* ── 1.1 image ── */}
      <h3 id="ch1-image" className="section-anchor">1.1 Image Baseline (CIFAR-10)</h3>
      <p>
        As a sanity check, we first visualised the loss landscape in pixel space for a ResNet
        trained on CIFAR-10. The 2D landscape is swept along two orthogonal directions
        (gradient <Math tex="\hat{g}" /> and a random direction <Math tex="\hat{d}" />) around the
        input. Cross-sections show that the loss is roughly parabolic along the gradient direction
        for members, and visibly flatter / less structured for non-members.
      </p>

      <FigRow>
        <Fig
          src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/image_landscape/cross_section_member0.png')}
          caption="Cross-section (member) — loss vs. α along gradient direction"
        />
        <Fig
          src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/image_landscape/cross_section_nonmember0.png')}
          caption="Cross-section (non-member)"
        />
      </FigRow>
      <FigRow>
        <Fig
          src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/image_landscape/surface_curvature_member0.png')}
          caption="2D surface: member — parabolic basin along gradient (vertical axis)"
        />
        <Fig
          src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/image_landscape/surface_curvature_nonmember0.png')}
          caption="2D surface: non-member — flatter, less structured"
        />
      </FigRow>

      <Callout type="info" title="Why start with images">
        Image classifiers have a clean notion of "loss at the training input" (a single label, a
        single forward pass), and the input space is low-dimensional enough that 2D sweeps are
        cheap. This let us validate the plotting pipeline end-to-end before facing the harder LLM
        case (high-dim embedding space, per-token loss, FlashAttention precision pitfalls).
      </Callout>

      {/* ── 1.2 LLM method ── */}
      <h3 id="ch1-llm-method" className="section-anchor">1.2 LLM Landscape — Method Derivation</h3>
      <p>
        Same analysis applied to <strong>pythia-1.4b-deduped</strong> in input-embedding space.
        For a member text from <code>github</code>, we sweep the loss along the gradient
        direction at five step sizes to find the numerically stable regime.
      </p>

      <h4>Step 1 — Define the embedding and gradient direction</h4>
      <p>
        Let <Math tex="e = E(x) \in \mathbb{R}^{T \times d}" /> be the input embeddings and{' '}
        <Math tex="L(e)" /> the mean cross-entropy loss. The unit gradient direction is:
      </p>
      <Math display tex="\hat{g} = \frac{\nabla_e L(e)}{\|\nabla_e L(e)\|}" />
      <Fig
        src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/diagrams/figure1_embedding_and_directions.png')}
        caption="Step 1: input-embedding space and the gradient direction ĝ"
        width="560px"
      />

      <h4>Step 2 — Place the α grid along ĝ</h4>
      <p>
        We sweep a scalar <Math tex="\alpha" /> over <Math tex="N" /> evenly-spaced points in{' '}
        <Math tex="[-h, +h]" />, step size <Math tex="\Delta = 2h/(N-1)" />:
      </p>
      <Math display tex="\alpha_k = -h + k\Delta, \quad k = 0, \ldots, N-1" />
      <Fig
        src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/diagrams/figure2_grid.png')}
        caption="Step 2: α grid along ĝ — the middle point k₀ = (N-1)/2 sits at α = 0"
        width="560px"
      />

      <h4>Step 3 — Evaluate loss at each point</h4>
      <p>For each grid point, shift the embeddings and run a forward pass:</p>
      <Math display tex="L_k = L(e + \alpha_k \hat{g})" />
      <pre><code>{`# N forward passes, no gradients needed
losses = []
for alpha in alphas:
    e_shifted = e + alpha * g_hat
    with torch.no_grad():
        loss = model(inputs_embeds=e_shifted).loss
    losses.append(loss.item())`}</code></pre>
      <Fig
        src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/diagrams/figure3_scattered_loss.png')}
        caption="Step 3: loss values sampled at each α point"
        width="560px"
      />

      <h4>Step 4 — Finite-difference derivatives</h4>
      <p>Central differences at the origin <Math tex="(k = k_0)" />:</p>
      <Math display tex="L'(0) \approx \frac{L_{k_0+1} - L_{k_0-1}}{2\Delta} = \|\nabla_e L\|" />
      <Math display tex="L''(0) \approx \frac{L_{k_0+1} - 2L_{k_0} + L_{k_0-1}}{\Delta^2} = \hat{g}^\top H_e\,\hat{g} = \lambda_c" />
      <Fig
        src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/diagrams/figure4_landscape.png')}
        caption="Step 4: assembled 1D landscape with L, L′, L″ overlaid"
        width="560px"
      />

      {/* ── 1.3 h ablation (informal single-sample) ── */}
      <h3 id="ch1-h-ablation" className="section-anchor">1.3 Informal h-Sweep on One Sample</h3>
      <p>
        First sanity check: pick a single member from <code>github</code> and sweep h over five
        step sizes to find the numerically stable regime.{' '}
        <Math tex="h \in \{10^{-7}, 10^{-6}, 10^{-5}, 5\times10^{-5}, 10^{-4}\}" />. Too small →
        float32 round-off dominates. Too large → truncation error swamps the second derivative.
        Eyeballing the curves, <Math tex="h \approx 10^{-5}" /> looks stable. This is informal
        (one sample, no AUROC); the formal ablation in <a href="#ch3">Chapter 3</a> nails it down.
      </p>
      <FigRow>
        <Fig
          src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/member_0_github/landscape.png')}
          caption="Member 0 (github) — h sweep. h = 10⁻⁵ gives clean parabolic shape."
        />
        <Fig
          src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/nonmember_0_github/landscape.png')}
          caption="Non-member 0 (github) — landscape shape differs subtly."
        />
      </FigRow>
      <Fig
        src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/loss_landscape_member0.png')}
        caption="Overlay of L, L′, L″ along gradient direction for member 0."
        width="600px"
      />
      <Fig
        src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/surface_curvature_member0.png')}
        caption="2D LLM surface (member 0, github) — gradient direction vs random direction."
        width="600px"
      />

      <Callout type="find" title="Take-away from p.t. 1">
        Pipeline works. <Math tex="h = 10^{-5}" /> is the stable regime in float32. Image and LLM
        landscapes are qualitatively similar at the member point (smooth basin). The interesting
        question — <em>is the landscape really basin-like across many random directions, or only
        along the gradient?</em> — is deferred to{' '}
        <a href="/sprint4#ch1">Sprint 4 p.t. 2</a>, which introduces random / Rademacher
        directions and the basin / UMAP analyses.
      </Callout>

      <hr className="section-div" />

      {/* ===================== CH2 ===================== */}
      <h2 id="ch2" className="section-anchor">Chapter 2 · TAG &amp; TAB</h2>
      <p className="meta">
        Reports: <code>report_20260409_tagtab_keyword_tfidf_ner_mimir</code>,{' '}
        <code>report_20260421_140854_tagtab_pertoken_curvature_comparison</code>
      </p>

      <Callout type="info" title="Placeholder">
        Write-up pending. This chapter will cover the TAG &amp; TAB keyword-selection method
        from <a href="https://arxiv.org/abs/2501.08454" target="_blank" rel="noreferrer">arXiv:2501.08454</a>,
        how we re-implemented entropy + NER token selection in <code>src.llm_utils</code>, and
        how filtering tokens by the TAG &amp; TAB mask affects per-token curvature distributions
        before it is consumed as an MIA signal downstream (Sprint 4 §A3 onwards).
      </Callout>

      <h3>Topics to cover</h3>
      <ul>
        <li>What TAG &amp; TAB selects: low-frequency content words (entropy) + NER spans.</li>
        <li>Implementation: <code>select_keywords_entropy_ner</code> and{' '}
          <code>get_keyword_positions</code> in <code>src/llm_utils.py</code>.</li>
        <li>Sanity check on MIMIR github / pile_cc / dm — typical keyword rate, overlap with
          Min-K%++ token selection.</li>
        <li>Effect on per-token curvature: do keyword tokens have systematically different
          λ<sub>c</sub> than function tokens?</li>
        <li>Why TAG &amp; TAB matters for Sprint 4 / 5: a principled, model-free token mask that
          we can apply <em>before</em> any curvature computation, isolating the most
          memorisation-relevant positions.</li>
      </ul>

      <hr className="section-div" />

      {/* ===================== CH3 ===================== */}
      <h2 id="ch3" className="section-anchor">Chapter 3 · Formal h-Ablation</h2>
      <p className="meta">
        Report: <code>report_20260417_landscapes_n_h_ablation_pythia1d4B/formal_ablation/</code>
      </p>

      <p>
        The one-sample sweep in §1.3 told us the right <em>scale</em> for h. The formal ablation
        nails it down with a proper AUROC measurement: a normalised Rademacher stencil at fixed{' '}
        <Math tex="\text{niter}=100" />, 50 members and 50 non-members on each of the three
        MIMIR subsets, sweeping{' '}
        <Math tex="h \in \{10^{-5},\,10^{-4},\,10^{-3},\,10^{-2},\,10^{-1}\}" />. For each
        sample, curvature is the mean across <Math tex="\text{niter}" /> stencil draws:
      </p>
      <Math display tex="\hat{\lambda}_h(x) = \frac{1}{N}\sum_{i=1}^{N} \frac{L(e + h v_i) - 2L(e) + L(e - h v_i)}{h^2}" />
      <p>
        Member vs non-member distributions are summarised by KDE + strip, and signal quality is
        reported via P-R curves (AP) and AUROC at each h.
      </p>

      <FigRow>
        <Fig
          src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/formal_ablation/ablation_kde.png')}
          caption="KDE + strip: per-sample curvature, member vs non-member, at each h, on github / pile_cc / dm."
        />
        <Fig
          src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/formal_ablation/ablation_pr.png')}
          caption="Precision–recall curves and AUROC / AP at each h, per dataset."
        />
      </FigRow>

      <Callout type="find" title="Take-away">
        Both ends of the h range are useless: tiny h is buried in round-off, large h drowns the
        second derivative in higher-order terms. The mid-decade values produce the cleanest
        separation. This is the empirical justification for the project default{' '}
        <Math tex="h = 10^{-2}" /> on <em>normalised</em> embedding perturbations (the
        4-point Rademacher stencil hides one factor of <Math tex="\|e\|" /> inside the
        normalisation — different convention than §1.3's raw-embedding sweep).
      </Callout>

      <hr className="section-div" />

      {/* ===================== CH4 ===================== */}
      <h2 id="ch4" className="section-anchor">Chapter 4 · Per-token λ<sub>c</sub> · Min-K% Ablation</h2>
      <p className="meta">
        Report: <code>report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta</code>{' '}
        · script <code>post_pertoken_minkpct.py</code>
      </p>

      <p>
        Once Sprint 4 produced sequence-level λ<sub>c</sub> (one bisection per sequence,
        AUROC 0.641 on github), the natural follow-up was to ask whether <em>per-token</em>{' '}
        λ<sub>c</sub> carries the same signal — and whether top-K% pooling (analogous to
        Min-K%++ on loss) beats the sequence-mean. The v3 batched per-token script produces
        one ~T-length vector per record; this chapter ablates pooling strategies on top of that
        cache.
      </p>

      {/* 4.1 data */}
      <h3 id="ch4-data" className="section-anchor">4.1 Data &amp; Saturation</h3>
      <ul>
        <li>600 records on github (300 members + 300 non-members), pythia-1.4b-deduped @ step143000.</li>
        <li>151,842 per-token values; 50 NaN; 151,792 finite.</li>
        <li>
          Saturation cap <Math tex="\hat{\lambda}_c^{\max} = 2.56\times 10^{8}" /> reached by
          {' '}<strong>8.06%</strong> of tokens — these are positions where the binary search
          hit the lower η bound. Treat them as "very large λ<sub>c</sub>" rather than censored.
        </li>
        <li>
          Per-record saturation rate: <strong>member 7.1%</strong> vs <strong>non-member 9.0%</strong>{' '}
          — non-members produce more saturated tokens, which is the opposite direction from
          Sprint 4's sequence-level finding.
        </li>
      </ul>

      <FigRow>
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/figures/pertoken_lambda_c/histogram_log.png')}
          caption="Per-token λ_c distribution (log10) across all 600 records. ~8% mass at the saturation cap."
        />
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/figures/pertoken_lambda_c/saturation_per_record.png')}
          caption="Saturation rate per record — non-members shifted right (more saturated tokens)."
        />
      </FigRow>

      {/* 4.2 pools */}
      <h3 id="ch4-pools" className="section-anchor">4.2 Pool Comparison</h3>
      <p>
        For each sample with per-token vector{' '}
        <Math tex="\lambda_c^{(1)},\dots,\lambda_c^{(T-1)}" />, six pool families are compared:
        sequence mean / median, the saturation rate (fraction at the cap), and top-K% / bottom-K%
        averages for <Math tex="K \in \{5, 10, 20, 30, 50, 100\}" />. AUROC is reported
        sign-invariantly — the direction column says which side of the score is the predicted
        member.
      </p>

      <table>
        <thead>
          <tr><th>Pool</th><th>AUROC</th><th>Direction</th></tr>
        </thead>
        <tbody>
          <tr className="highlight-row">
            <td>top-10% mean</td><td className="best">0.6640</td><td>higher = non-member</td>
          </tr>
          <tr><td>top-20% mean</td><td>0.6625</td><td>higher = non-member</td></tr>
          <tr><td>mean (Sprint 4 baseline)</td><td>0.6621</td><td>higher = non-member</td></tr>
          <tr><td>saturation_rate</td><td>0.6595</td><td>higher = non-member</td></tr>
          <tr><td>median</td><td>0.6462</td><td>higher = non-member</td></tr>
          <tr><td>bottom-50% mean</td><td>0.6436</td><td>higher = non-member</td></tr>
          <tr><td>top-5% mean</td><td>0.6029</td><td>higher = non-member</td></tr>
          <tr><td>bottom-5% mean</td><td>0.5597</td><td>higher = member</td></tr>
          <tr><td>bottom-10% mean</td><td>0.5228</td><td>higher = member</td></tr>
        </tbody>
      </table>

      <FigRow>
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/figures/pertoken_lambda_c/minkpct_auroc.png')}
          caption="AUROC vs K (log-spaced) for top-K% and bottom-K% pooling; dashed line is the sequence-mean baseline."
        />
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/figures/pertoken_lambda_c/median_member_vs_nonmember.png')}
          caption="Per-sample median λ_c, member vs non-member (log y-axis)."
        />
      </FigRow>

      {/* 4.3 findings */}
      <h3 id="ch4-findings" className="section-anchor">4.3 Findings</h3>
      <ol>
        <li>
          <strong>Top-10% is the optimum</strong> at AUROC 0.6640, but the gain over the
          sequence-mean baseline (0.6621) is marginal (+0.0019). Most of the signal already
          lives in the mean.
        </li>
        <li>
          <strong>Direction reversal vs Sprint 4.</strong> Sequence-level bisection said github
          members have higher λ<sub>c</sub>; per-token v3 says the opposite. The two
          measurements are not the same quantity (per-token gradient vs full-sequence
          gradient), so the reversal is plausible — but it has to be reconciled with Sprint 5
          §B3 (direction-of-signal bootstrap).
        </li>
        <li>
          <strong>Saturation rate alone is nearly free and almost as good (0.6595).</strong>{' '}
          A token "saturated" the lower η bound if and only if its loss rose at the smallest
          probed step — no full bisection needed. This is the cheapest curvature-derived MIA
          signal we have.
        </li>
        <li>
          <strong>Bottom-K carries no useful signal.</strong> The action is in the tail of the
          per-token distribution, not the body. Filtering tokens by lowest curvature destroys
          the signal entirely.
        </li>
      </ol>

      <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Next: <a href="/sprint4">Sprint 4 →</a>
      </p>
    </article>
  )
}
