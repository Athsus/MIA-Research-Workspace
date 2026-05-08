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

function AurocBadge({ v }: { v: string }) {
  return <span className="auroc-badge">{v}</span>
}

export default function Sprint4() {
  return (
    <article className="report">
      <h1 id="top">Sprint 4 — White-Box Curvature Signals for Membership Inference</h1>
      <p className="meta">
        Period: 2026-04-22 → 2026-05-07 &nbsp;·&nbsp;
        Models: pythia-160m-deduped, pythia-1.4b-deduped &nbsp;·&nbsp;
        Datasets: github, pile_cc, dm (MIMIR, 1000+1000)
      </p>

      {/* TOC */}
      <nav className="toc">
        <h4>Contents</h4>
        <ul>
          <li><a href="#pt1">Part 1 · Previous Sprint: Ablation Study</a>
            <ul>
              <li><a href="#pt1-image">Image Landscape (CIFAR-10)</a></li>
              <li><a href="#pt1-llm">LLM Loss Landscape</a></li>
            </ul>
          </li>
          <li><a href="#ch1">Chapter 1 · Loss Landscape &amp; Basin-Like Structure</a>
            <ul>
              <li><a href="#ch1-paper">Root Paper (Chen et al. 2505.17646)</a></li>
              <li><a href="#ch1-random">Random-Direction Replication</a></li>
              <li><a href="#ch1-gradient">Gradient-Direction Slice</a></li>
              <li><a href="#ch1-delta">Δ-Loss Landscape Variant</a></li>
            </ul>
          </li>
          <li><a href="#ch2">Chapter 2 · λ<sub>c</sub>: Critical Sharpness</a>
            <ul>
              <li><a href="#ch2-def">Definition &amp; Derivation</a></li>
              <li><a href="#ch2-results">Results: 160m vs 1.4b</a></li>
              <li><a href="#ch2-polca">POLCA Signal</a></li>
              <li><a href="#ch2-spectrum">Spectral Analysis (SLQ)</a></li>
              <li><a href="#ch2-ref">Reference Model Attacks</a></li>
              <li><a href="#ch2-product">Product Signals</a></li>
            </ul>
          </li>
          <li><a href="#ch3">Chapter 3 · Layer-Specific MLP Curvature</a></li>
          <li><a href="#summary">Summary &amp; Open Questions</a></li>
        </ul>
      </nav>

      {/* ===================== PT1 ===================== */}
      <h2 id="pt1" className="section-anchor">Part 1 · Previous Sprint: Ablation Study</h2>
      <p className="meta">Report: <code>report_20260417_landscapes_n_h_ablation_pythia1d4B</code></p>

      <Callout type="warn" title="⚠ Lesson Learned">
        This sprint spent excessive compute on a high-precision ablation using <code>float64</code> and 100 perturbations
        per sample — orders of magnitude beyond what was needed. The h-ablation below required only ~10 samples in float32
        to reach the same conclusions. <strong>Do not repeat this pattern.</strong>
      </Callout>

      <h3 id="pt1-image" className="section-anchor">Image Landscape (CIFAR-10)</h3>
      <p>
        As a sanity-check, we first visualized the loss landscape in pixel space for a ResNet trained on CIFAR-10.
        The 2D landscape is swept along two orthogonal directions (gradient <Math tex="\hat{g}" /> and a random
        direction <Math tex="\hat{d}" />) around the input embedding.
        Cross-sections show that the loss is roughly parabolic along the gradient direction for members,
        consistent with the basin-like picture in Chen et al.
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
          caption="2D surface: member — clear parabolic basin along gradient (vertical axis)"
        />
        <Fig
          src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/image_landscape/surface_curvature_nonmember0.png')}
          caption="2D surface: non-member — flatter, less structured"
        />
      </FigRow>

      <h3 id="pt1-llm" className="section-anchor">LLM Loss Landscape</h3>
      <p>
        The same analysis was applied to <strong>pythia-1.4b-deduped</strong> in input-embedding space.
        For a single member text from <code>github</code>, we sweep:
      </p>
      <Math display tex="L(\alpha) = \mathcal{L}(e + \alpha \hat{g}), \quad \hat{g} = \frac{\nabla_e L}{\|\nabla_e L\|}" />
      <p>
        at five step sizes <Math tex="h \in \{10^{-7}, 10^{-6}, 10^{-5}, 5\times10^{-5}, 10^{-4}\}" /> to find the
        regime where finite-difference curvature is numerically stable.
      </p>

      <FigRow>
        <Fig
          src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/member_0_github/landscape.png')}
          caption="Member 0 (github) — h sweep. h = 10⁻⁵ shows clean parabolic shape."
        />
        <Fig
          src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/nonmember_0_github/landscape.png')}
          caption="Non-member 0 (github) — landscape shape differs subtly."
        />
      </FigRow>
      <Fig
        src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/loss_landscape_member0.png')}
        caption="LLM landscape overlay — L, L′, L″ along gradient direction for member 0."
        width="600px"
      />

      <p>
        The key diagrams explaining the method geometry:
      </p>
      <FigRow>
        <Fig src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/diagrams/figure1_embedding_and_directions.png')} caption="Figure 1: input-embedding space and gradient direction" />
        <Fig src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/diagrams/figure2_grid.png')} caption="Figure 2: α grid along ĝ" />
        <Fig src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/diagrams/figure3_scattered_loss.png')} caption="Figure 3: sampled loss values" />
        <Fig src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/diagrams/figure4_landscape.png')} caption="Figure 4: assembled 1D landscape" />
      </FigRow>

      <hr className="section-div" />

      {/* ===================== CH1 ===================== */}
      <h2 id="ch1" className="section-anchor">Chapter 1 · Loss Landscape &amp; Basin-Like Structure</h2>
      <p className="meta">
        Reports: <code>report_20260502_122900_PLOT-CORRECTLY</code> &amp; <code>report_20260505_132527_DELTA-LOSS-LANDSCAPE</code>
      </p>

      <h3 id="ch1-paper" className="section-anchor">1.1 Root Paper — Chen et al. (arXiv:2505.17646)</h3>
      <p>
        Chen et al. show that pretrained LLMs converge to <em>wide, symmetric minima</em> in parameter space.
        Their method: perturb parameters <Math tex="\theta" /> with a random Gaussian direction <Math tex="\delta \sim \mathcal{N}(0, I)" />
        and sweep a scalar:
      </p>
      <Math display tex="L(\alpha) = \mathcal{J}(\theta + \alpha\,\delta)" />
      <p>
        The resulting 1D slice is always a smooth, symmetric basin — the loss rises in every direction from the minimum.
        They use this to argue LLMs are well-conditioned and generalize.
      </p>
      <p>
        <strong>Our twist:</strong> replace the random direction with the <em>sample-specific gradient</em> in
        <em>input-embedding space</em> (not parameter space). This is lower-dimensional and directly MIA-relevant,
        since the gradient encodes what makes the model's predictions uncertain on this particular text.
      </p>

      <h3 id="ch1-random" className="section-anchor">1.2 Random-Direction Replication (浅尝辄止)</h3>
      <p>
        We replicated Chen et al. in both parameter space and input-embedding space, then tested 10 independent
        random directions per sample.
      </p>

      <FigRow>
        <Fig
          src={R('report_20260502_122900_PLOT-CORRECTLY/combined_param_vs_input_n21.png')}
          caption="Parameter space vs. input-embedding space, random direction. Member and non-member curves are indistinguishable."
        />
        <Fig
          src={R('report_20260502_122900_PLOT-CORRECTLY/input_space_K10_n21_a0p05.png')}
          caption="10 independent random directions in input space. All 10 curves overlap — no separation."
        />
      </FigRow>

      <Callout type="info" title="Why random directions fail">
        For any unit vector <Math tex="\hat{u} \in \mathbb{R}^n" /> with <Math tex="n = T \cdot d \approx 4.5 \times 10^5" />:
        <Math display tex="\mathbb{E}[\hat{u}^\top H_e \hat{u}] = \frac{\text{tr}(H_e)}{n}" />
        Even if memorization concentrates curvature on a low-rank subspace with <Math tex="\lambda_{\max} \sim O(1)" />,
        a random probe captures only <Math tex="O(1/n) \sim 10^{-5}" /> of it.
        This <em>1/n dilution</em> makes random directions useless for MIA.
      </Callout>

      <h3 id="ch1-gradient" className="section-anchor">1.3 Gradient-Direction Loss Slice (深入探索链)</h3>
      <h4>Mathematical Setup</h4>
      <p>
        Let <Math tex="M" /> be the frozen LM, <Math tex="e = E(x) \in \mathbb{R}^{T \times d}" /> the input embeddings.
        The mean cross-entropy loss is:
      </p>
      <Math display tex="L(e) = -\frac{1}{T-1} \sum_{t=1}^{T-1} \log p_M(x_{t+1} \mid x_{1:t},\, e)" />
      <p>
        Define the unit gradient direction:
      </p>
      <Math display tex="\hat{g} = \frac{\nabla_e L(e)}{\|\nabla_e L(e)\|} \in \mathbb{R}^{T \times d}" />
      <p>
        The 1D loss slice along this direction, with step-size grid <Math tex="\Delta = h / (N-1)" />:
      </p>
      <Math display tex="L(\alpha_k) := L(e + \alpha_k\,\hat{g}), \quad \alpha_k \in \{-h, \ldots, +h\}" />
      <p>
        Finite-difference derivatives at the origin:
      </p>
      <Math display tex="L'(0) \approx \frac{L_{k_0+1} - L_{k_0-1}}{2\Delta} = \|\nabla_e L\|" />
      <Math display tex="L''(0) \approx \frac{L_{k_0+1} - 2L_{k_0} + L_{k_0-1}}{\Delta^2} = \hat{g}^\top H_e\,\hat{g} = \lambda_c" />
      <p>
        So the second derivative at the origin is exactly <Math tex="\lambda_c" /> — the Rayleigh quotient of the
        input Hessian along the gradient. Grid: <Math tex="h = 0.1,\; N = 41,\; \Delta = 0.005" />.
      </p>

      <p>Method diagrams from the report:</p>
      <FigRow>
        <Fig src={R('report_20260502_122900_PLOT-CORRECTLY/landscapes_100plus100/diagrams/figure1_direction_principle.png')} caption="Direction principle: sweep along ĝ in embedding space" />
        <Fig src={R('report_20260502_122900_PLOT-CORRECTLY/landscapes_100plus100/diagrams/figure2_sampling_points.png')} caption="Sampling grid on the α axis" />
        <Fig src={R('report_20260502_122900_PLOT-CORRECTLY/landscapes_100plus100/diagrams/figure3_loss_at_points.png')} caption="Loss evaluated at each α point" />
        <Fig src={R('report_20260502_122900_PLOT-CORRECTLY/landscapes_100plus100/diagrams/figure4_finite_diff.png')} caption="Finite-difference stencil for L′ and L″" />
      </FigRow>

      <h4>Results: Population Overlays (100+100 per dataset)</h4>
      <FigRow>
        <Fig
          src={R('report_20260502_122900_PLOT-CORRECTLY/landscapes_100plus100/overlay_dm.png')}
          caption="dm — Members sit lower in centred loss. L″(0): M ≈ 10.4 vs NM ≈ 6.0 (~1.7× separation)."
        />
        <Fig
          src={R('report_20260502_122900_PLOT-CORRECTLY/landscapes_100plus100/overlay_github.png')}
          caption="github — Negligible separation in L and L″. Signal comes from token-level NLL granularity, not basin geometry."
        />
        <Fig
          src={R('report_20260502_122900_PLOT-CORRECTLY/landscapes_100plus100/overlay_pile_cc.png')}
          caption="pile_cc — L″(0) ≈ 1 for both classes (nearly linear landscape). Consistent with PETAL AUROC ≈ 0.54."
        />
      </FigRow>

      <Callout type="find" title="Key Finding">
        The gradient direction reveals curvature separation on <strong>dm</strong> (1.7× ratio) but not on github or pile_cc.
        dm's math problems are individually distinct — members sit in sharper basins than non-members.
        On github, the loss signal matters but the landscape geometry does not discriminate at the global level.
      </Callout>

      <h3 id="ch1-delta" className="section-anchor">1.4 Δ-Loss Landscape Variant (浅尝辄止)</h3>
      <p>
        Inspired by reference-model attacks, we tried a <em>differential landscape</em> signal: perturb input embeddings
        along the target model's gradient direction and measure how the surrogate model's loss changes:
      </p>
      <Math display tex="\text{score}(x) = L_{\text{surrogate}}(e + \beta\,\hat{g}) - L_{\text{target}}(e + \beta\,\hat{g})" />
      <p>
        Surrogate: <code>gpt2-xl</code>. Target: <code>pythia-1.4b-deduped</code>. Tested on github 100+100.
      </p>
      <FigRow>
        <Fig
          src={R('report_20260505_132527_DELTA-LOSS-LANDSCAPE/overlay_github.png')}
          caption="Δ-loss overlay — member vs non-member curves across β values."
        />
        <Fig
          src={R('report_20260505_132527_DELTA-LOSS-LANDSCAPE/auroc_summary.png')}
          caption="AUROC summary: base signal 0.553, perturbed variants weaker."
        />
      </FigRow>
      <p>
        The flat <Math tex="\beta = 0" /> (pure reference-loss difference) achieves AUROC = 0.553.
        Perturbation along the gradient does not improve it — the perturbation conflates loss magnitude with curvature.
        <strong>Not pursued further.</strong>
      </p>

      <Callout type="info" title="UMAP Exploration">
        <em>(TODO — planned but not yet run)</em> UMAP projection of per-sample gradient vectors to visualize
        whether members and non-members cluster in gradient space.
      </Callout>

      <hr className="section-div" />

      {/* ===================== CH2 ===================== */}
      <h2 id="ch2" className="section-anchor">Chapter 2 · λ<sub>c</sub>: Critical Sharpness</h2>
      <p className="meta">
        Report: <code>report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta</code>
      </p>

      <h3 id="ch2-def" className="section-anchor">2.1 Definition &amp; Derivation</h3>
      <p>
        <strong>λ<sub>c</sub></strong> is the directional curvature of the loss in the gradient direction — equivalently,
        the Rayleigh quotient of the input-embedding Hessian <Math tex="H_e" /> along <Math tex="\hat{g}" />:
      </p>
      <Math display tex="\lambda_c = \hat{g}^\top H_e\,\hat{g} = \frac{\nabla_e L^\top H_e\,\nabla_e L}{\|\nabla_e L\|^2}" />
      <p>
        This equals <Math tex="L''(0)" /> from the gradient-direction slice. Geometrically, it measures how quickly
        the loss steepens as you move along the gradient — the curvature of the descent path at the current point.
      </p>

      <h4>Efficient Computation via Learning-Rate Bisection</h4>
      <p>
        Direct Hessian-vector products are expensive. Instead, we exploit a classical connection to <em>critical learning rates</em>:
        if gradient descent diverges for step size <Math tex="\eta" />, then <Math tex="\eta > 2/\lambda_c" />.
        So we binary-search for the smallest <Math tex="\eta_c" /> that causes the loss to increase after one gradient step:
      </p>
      <Math display tex="\lambda_c \approx \frac{2}{\eta_c}, \quad \eta_c = \min\{\eta : L(e - \eta\,\nabla_e L) > L(e)\}" />
      <p>
        Cost: ~1 backward pass + 6–10 forward passes per sample. Implementation:
      </p>
      <pre><code>{`from src.curvature import compute_input_critical_sharpness

cs = compute_input_critical_sharpness(model, input_ids, tol_power=4, lr_guess=lr_guess)
# Returns: lambda_c, eta_c, grad_norm, embed_norm, base_loss, T, d_model, n_iters, converged

# Warm-start: use previous eta_c as next guess
next_lr = cs["eta_c"] if cs["converged"] and cs["eta_c"] > 0 else lr_guess`}</code></pre>

      <h4>Relation to POLCA</h4>
      <p>
        Let <Math tex="\{(\lambda_j, v_j)\}" /> be the eigenpairs of <Math tex="H_e" />, and <Math tex="c_j = v_j^\top \hat{g}" />.
        Then:
      </p>
      <Math display tex="\lambda_c = \sum_j \lambda_j c_j^2 / \|\hat{g}\|^2 \quad \text{(eigenvalue-weighted sum)}" />
      <Math display tex="\text{POLCA} = \sum_{j \in \text{top-}k} c_j^2 / \|\hat{g}\|^2 \quad \text{(equal-weight fraction)}" />
      <p>
        λ<sub>c</sub> retains eigenvalue magnitude information (important for MIA); POLCA trades this for numerical stability.
        Empirically, λ<sub>c</sub> outperforms POLCA on github by ~6 AUROC points.
      </p>

      <h3 id="ch2-results" className="section-anchor">2.2 Results: 160m vs 1.4b, 1000+1000</h3>

      <table>
        <thead>
          <tr><th>Signal</th><th>github</th><th>pile_cc</th><th>dm</th><th>Model</th></tr>
        </thead>
        <tbody>
          <tr className="highlight-row">
            <td>loss (baseline)</td>
            <td className="best">0.670</td><td>0.504</td><td>0.507</td><td>160m</td>
          </tr>
          <tr className="highlight-row">
            <td>λ<sub>c</sub> (critical sharpness)</td>
            <td className="best">0.641</td><td>0.489</td><td>0.486</td><td>160m</td>
          </tr>
          <tr>
            <td>loss</td>
            <td className="best">0.670</td><td>0.504</td><td>0.510</td><td>1.4b</td>
          </tr>
          <tr>
            <td>λ<sub>c</sub></td>
            <td>0.602</td><td>0.505</td><td>0.534</td><td>1.4b</td>
          </tr>
          <tr>
            <td>POLCA (top-5 eigenvecs)</td>
            <td>0.608</td><td>0.558</td><td>0.512</td><td>160m</td>
          </tr>
        </tbody>
      </table>

      <FigRow>
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/figures/lambda_c_distributions.png')}
          caption="λ_c distributions — members vs non-members on github (pythia-160m). Member distribution shifted right (higher curvature)."
        />
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/figures/lambda_c_distributions_pythia-1.4b-deduped_step143000.png')}
          caption="λ_c distributions — pythia-1.4b. Signal weakens (0.602) vs 160m (0.641)."
        />
      </FigRow>
      <Fig
        src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/figures/roc_comparison.png')}
        caption="ROC curves — λ_c vs loss vs gnorm on 3 datasets (pythia-160m, 1000+1000)."
        width="650px"
      />

      <Callout type="find" title="Direction Reversal">
        On <strong>github</strong>: members have <em>higher</em> λ<sub>c</sub> (sharper landscape) — the model
        has memorized specific syntactic patterns and the gradient direction hits a sharp ridge.
        On <strong>dm</strong>: members have <em>lower</em> λ<sub>c</sub> — the model generalizes math operations
        well, so members sit in smoother basins. <strong>No universal direction exists across datasets.</strong>
      </Callout>

      <h3 id="ch2-polca" className="section-anchor">2.3 POLCA Signal</h3>
      <p>
        POLCA (Projection Of Loss-gradient onto Curvature Axes) projects the loss gradient onto the top-k
        eigenvectors of <Math tex="H_e" /> and measures the fraction of gradient energy captured:
      </p>
      <Math display tex="\text{POLCA}(k) = \frac{\|P_k\,\hat{g}\|^2}{\|\hat{g}\|^2}, \quad P_k = \sum_{j=1}^k v_j v_j^\top" />
      <p>
        Eigenvectors computed via <code>scipy.sparse.linalg.eigsh</code> (ARPACK, <code>n_lanczos=50</code>).
        We discovered a <em>ghost eigenvalue bug</em> in manual Lanczos (no reorthogonalization produced duplicate
        Ritz values); ARPACK fixes this.
      </p>
      <Fig
        src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/new_findings/polca_projection/results.png')}
        caption="POLCA AUROC across datasets and k values. github: 0.608; pile_cc: 0.558; dm: 0.512."
        width="600px"
      />

      <h3 id="ch2-spectrum" className="section-anchor">2.4 Spectral Analysis — Hessian ESD (SLQ)</h3>
      <p>
        We estimated the Empirical Spectral Distribution (ESD) of <Math tex="H_e" /> via Stochastic Lanczos
        Quadrature (SLQ): 10 random probe vectors, 50 Lanczos steps, producing Ritz eigenvalue estimates.
      </p>

      <h4>ESD: member vs non-member</h4>
      <FigRow>
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/new_findings/spectrum_lambda/esd_pdf/esd_pdf_github.png')}
          caption="ESD — github. Member and non-member distributions nearly identical."
        />
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/new_findings/spectrum_lambda/esd_pdf/esd_pdf_dm.png')}
          caption="ESD — dm. Also nearly identical."
        />
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/new_findings/spectrum_lambda/esd_pdf/esd_pdf_pile_cc.png')}
          caption="ESD — pile_cc. No visible separation."
        />
      </FigRow>

      <h4>Top-k Ritz Values as MIA Signal</h4>
      <Fig
        src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/new_findings/spectrum_lambda/ranks/rank_auroc_github.png')}
        caption="AUROC vs eigenvalue rank — github. λ_max (rank-1) achieves 0.592; rank-2 gives 0.593."
        width="600px"
      />
      <Callout type="find" title="Surprising Direction">
        On github, <strong>non-members have larger top eigenvalues</strong> (AUROC direction: lower = member).
        This is opposite to λ<sub>c</sub> (where member has higher directional curvature).
        The global worst-case curvature (λ<sub>max</sub>) and the gradient-directional curvature (λ<sub>c</sub>)
        encode different information — non-members trigger a rougher global landscape but smoother gradient descent path.
      </Callout>

      <h4>Spectral Window Fishing</h4>
      <FigRow>
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/new_findings/spectrum_lambda/fishing/fishing_abs_esd_github.png')}
          caption="Sliding window AUROC scan — github. Best window ~0.59."
        />
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/new_findings/spectrum_lambda/fishing/fishing_heatmap_github.png')}
          caption="AUROC heatmap vs window [lo, hi]. Signal concentrated near top eigenvalues."
        />
      </FigRow>

      <h3 id="ch2-ref" className="section-anchor">2.5 Reference Model Attacks</h3>

      <h4>ΔL Attack (MIMIR-style)</h4>
      <p>
        Score: <Math tex="\Delta L = L_{\text{ref}}(x) - L_{\text{target}}(x)" />.
        Surrogate: <code>stablelm-base-alpha-3b-v2</code>. Target: <code>pythia-160m</code>.
      </p>
      <table>
        <thead><tr><th>Signal</th><th>github</th><th>pile_cc</th><th>dm</th></tr></thead>
        <tbody>
          <tr><td>loss (bare)</td><td>0.670</td><td>0.504</td><td>0.507</td></tr>
          <tr><td>ΔL (stablelm3b ref)</td><td>0.577</td><td><span className="best">0.529</span></td><td>0.514</td></tr>
          <tr><td>Δλ<sub>c</sub> (curvature ref)</td><td>0.458</td><td>0.513</td><td>0.481</td></tr>
        </tbody>
      </table>
      <FigRow>
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/figures/post_ref_attack_auroc_pythia160m_stablelm3b.png')}
          caption="Reference attack ROC curves — pythia-160m vs stablelm3b."
        />
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/figures/auroc_surrogate_pythia160m_stablelm3b.png')}
          caption="AUROC comparison: bare vs reference attack. pile_cc benefits most."
        />
      </FigRow>
      <Callout type="find" title="Findings">
        pile_cc benefits most from reference normalization (0.504 → 0.529). The Δλ<sub>c</sub> attack <em>hurts</em> on
        github (0.641 → 0.458): stablelm and pythia have incompatible λ<sub>c</sub> scales, and normalization
        introduces noise that destroys the signal.
      </Callout>

      <h4>Same-Family Reference: pythia-70m → pythia-1.4b</h4>
      <Fig
        src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/figures/post_ref_attack_auroc_pythia-1.4b-deduped_step143000_target_pythia-160m-deduped_step99000.png')}
        caption="Same-family reference (70m→1.4b): delta_loss 0.431, delta_lambda_c 0.427 — both worse than bare loss."
        width="500px"
      />
      <p>
        The same-family reference does not help λ<sub>c</sub>. Hypothesis: the "unusual difficulty" signal that
        ΔL exploits (member is easy for target, hard for ref) is shared between pythia-70m and pythia-1.4b — so
        subtracting them cancels the signal.
      </p>

      <h3 id="ch2-product" className="section-anchor">2.6 Product Signals</h3>
      <p>
        Hypothesis: combine loss and curvature multiplicatively — high loss + high curvature ↔ non-member.
      </p>
      <table>
        <thead><tr><th>Signal</th><th>github AUROC</th><th>Note</th></tr></thead>
        <tbody>
          <tr><td>loss alone</td><td className="best">0.670</td><td>baseline</td></tr>
          <tr><td>λ<sub>c</sub> alone</td><td>0.641</td><td></td></tr>
          <tr><td>(-L) × λ<sub>c</sub></td><td>0.499</td><td>worse than both</td></tr>
          <tr><td>(-L) × κ (stencil)</td><td>0.602</td><td>better than κ, worse than loss</td></tr>
        </tbody>
      </table>
      <Fig
        src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/figures/post_product_signals_auroc.png')}
        caption="Product signal AUROC comparison. Naive products do not outperform individual signals."
        width="500px"
      />
      <Callout type="find" title="Why Products Fail">
        A 2D quadrant analysis (median split by loss and λ<sub>c</sub>) shows the high-loss + high-λ<sub>c</sub>
        quadrant is ~65% non-member on github. However, the multiplicative product <em>collapses all four quadrants</em>
        into a single scalar, destroying the quadrant structure. Linear combination or a learned classifier is needed.
      </Callout>

      <hr className="section-div" />

      {/* ===================== CH3 ===================== */}
      <h2 id="ch3" className="section-anchor">Chapter 3 · Layer-Specific MLP Curvature (浅尝辄止)</h2>
      <p className="meta">Report: <code>report_20260507_073000_layer_curvature_probe</code></p>

      <p>
        Motivation: global λ<sub>c</sub> integrates across all 12 transformer layers. Membership fingerprints may
        be localized — mechanistic interpretability suggests layers 9–10 are "fact retrieval" MLP layers.
        We probe curvature in <em>layer-space</em> w.r.t. the MLP output activations using zero-order finite differences.
      </p>

      <h3>Method</h3>
      <p>
        For each layer <Math tex="\ell" />, let <Math tex="h^{(\ell)}" /> be the MLP output. Define a Rademacher
        random vector <Math tex="\delta \sim \text{Rad}(\pm 1)" /> of the same shape. Three scalar probes:
      </p>
      <ul>
        <li><strong>norm_mean:</strong> <Math tex="\mathbb{E}[\|\delta\|] \approx \text{mean curvature}" /> proxy</li>
        <li><strong>norm_max:</strong> <Math tex="\max_j |(\text{perturbed output})_j|" /> — peak activation after perturbation</li>
        <li><strong>pseudo_loss:</strong> <Math tex="(f(h+\delta v)+f(h-\delta v)-2f(h))/\delta^2" /> — ZO curvature of NLL w.r.t. <Math tex="h^{(\ell)}" /></li>
      </ul>
      <p>
        Parameters: <Math tex="h = 0.001" />, <code>niter=100</code>, layers 8–11 hooked simultaneously (single forward
        pass per perturbation). Run on github 100+100.
      </p>

      <h3>Results</h3>
      <table>
        <thead>
          <tr><th>Variant</th><th>Layer</th><th>AUROC</th><th>Direction</th></tr>
        </thead>
        <tbody>
          <tr className="highlight-row">
            <td>norm_max</td><td>L9</td><td className="best">0.618</td><td>lower = member</td>
          </tr>
          <tr>
            <td>pseudo_loss</td><td>L9</td><td>0.565</td><td>lower = member</td>
          </tr>
          <tr>
            <td>norm_mean</td><td>L10</td><td>0.551</td><td>lower = member</td>
          </tr>
          <tr>
            <td>norm_max</td><td>L8</td><td>0.551</td><td>higher = member</td>
          </tr>
          <tr>
            <td>norm_mean</td><td>L9</td><td>0.501</td><td>lower = member</td>
          </tr>
        </tbody>
      </table>

      <FigRow>
        <Fig
          src={R('report_20260507_073000_layer_curvature_probe/layer_curvature_github.png')}
          caption="Layer curvature probe — github 100+100. norm_max at L9 achieves AUROC 0.618."
        />
        <Fig
          src={R('report_20260507_073000_layer_curvature_probe/layer_curvature_all.png')}
          caption="All datasets (github / pile_cc / dm). Signal is dataset-dependent — github L9 stands out."
        />
      </FigRow>

      <Callout type="find" title="Interpretation">
        Non-members trigger <em>larger peak MLP activations</em> at layer 9 (norm_max lower for members).
        Hypothesis: members have been seen → specific "knowledge neurons" fire quietly and precisely.
        Non-members cause the fact-retrieval MLP to search broadly → higher peak norm.
        Note: at 0.618, this does not outperform λ<sub>c</sub> global (0.641) and is substantially
        below the PETAL target of 0.83–0.88. Classification as <em>inconclusive</em>.
      </Callout>

      <hr className="section-div" />

      {/* ===================== SUMMARY ===================== */}
      <h2 id="summary" className="section-anchor">Summary &amp; Open Questions</h2>

      <h3>Cross-Cutting Findings</h3>
      <table>
        <thead><tr><th>Dimension</th><th>Observation</th></tr></thead>
        <tbody>
          <tr><td>Dataset difficulty</td><td>github is the only "easy" dataset. All curvature signals work on github; pile_cc and dm near-random.</td></tr>
          <tr><td>Direction reversal</td><td>github: member has HIGHER λ<sub>c</sub>; dm: member has LOWER λ<sub>c</sub>. No universal direction.</td></tr>
          <tr><td>λ<sub>c</sub> vs λ<sub>max</sub></td><td>On github: λ<sub>c</sub> 0.641 {'>'} λ<sub>max</sub> 0.592. Directional curvature (along gradient) is more informative than global worst-case.</td></tr>
          <tr><td>Model scale</td><td>loss: 0.670 (160m) = 0.670 (1.4b). λ<sub>c</sub>: 0.641 → 0.602 — slightly weaker at larger scale.</td></tr>
          <tr><td>Best overall signal</td><td>loss / NLL remains hardest to beat as a standalone (0.670 on github). λ<sub>c</sub> is the best curvature-only signal (0.641).</td></tr>
          <tr><td>PETAL gap</td><td>PETAL achieves 0.83–0.88 on github. All signals explored here are 0.5–0.67 — gap remains large.</td></tr>
        </tbody>
      </table>

      <h3>Open Questions</h3>
      <ol>
        <li>Does <strong>per-token λ<sub>c</sub></strong> (currently running) improve over global λ<sub>c</sub> when combined with Min-K%++ token selection?</li>
        <li>Do layer probes extend to <strong>pile_cc / dm</strong>? (Full 300+300 × 3 datasets pending.)</li>
        <li>Is the curvature signal in <strong>attention</strong> or <strong>MLP</strong> activations at layer 9?</li>
        <li>Why does <strong>norm_max &gt; norm_mean</strong> at L9? Peak activation ↔ specific knowledge neuron?</li>
        <li>Can <strong>layer probe + loss</strong> be combined? Products failed; learned combination?</li>
        <li>Does the L9 pattern hold in the <strong>1.4b</strong> model (different layer index)?</li>
      </ol>

      <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Last updated: 2026-05-08 &nbsp;·&nbsp;
        <a href="https://github.com/Athsus/Membership-Inference-Attack-Ao" target="_blank" rel="noreferrer">GitHub ↗</a>
      </p>
    </article>
  )
}
