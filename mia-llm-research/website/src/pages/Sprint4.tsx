import Math from '../components/Math'
import confusionImg from '../assets/confusion.png'

const R = (path: string) => `${import.meta.env.BASE_URL}reports/${path}`

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

function TocNode({ href, num, title, summary, from }: {
  href: string
  num: string
  title: React.ReactNode
  summary: React.ReactNode
  from?: string
}) {
  return (
    <a href={href} className="toc-node">
      <div className="toc-node-header">
        <span className="toc-node-num">{num}</span>
        <span className="toc-node-title">{title}</span>
      </div>
      <div className="toc-node-summary">{summary}</div>
      {from && <div className="toc-node-from">↳ {from}</div>}
    </a>
  )
}

export default function Sprint4() {
  return (
    <article className="report">
      <h1 id="top">Sprint 4: Exploration on Curvature Signals for Membership Inference and Landscapes</h1>
      <p className="meta">
        Period: 2026-04-22 → 2026-05-08, source: https://athsus.github.io/MIA-Research-Workspace/#/sprint4
      </p>

      {/* TOC */}
      <div className="toc-tree">
        {/* Chapter Rail */}
        <div className="toc-chapter-rail">
          <a href="#ch1" className="toc-ch-card">
            <div className="toc-ch-badge">Chapter 1</div>
            <div className="toc-ch-title">Loss Landscapes &amp; UMAP</div>
            <div className="toc-ch-summary">1/n dilution → gradient direction; basin structure, Rademacher UMAP</div>
          </a>
          <a href="#ch2" className="toc-ch-card">
            <div className="toc-ch-badge">Chapter 2</div>
            <div className="toc-ch-title">λ<sub>c</sub>: Critical Sharpness</div>
            <div className="toc-ch-summary">λ<sub>c</sub> = 2/η<sub>c</sub> via bisection · AUROC 0.641 on github</div>
            <div className="toc-derives">↳ from §1.4</div>
          </a>
          <a href="#ch3" className="toc-ch-card">
            <div className="toc-ch-badge">Chapter 3</div>
            <div className="toc-ch-title">Layer-Specific MLP Curvature</div>
            <div className="toc-ch-summary">norm_max L9 = 0.618 · non-members trigger broader fact-retrieval</div>
            <div className="toc-derives">↳ from §2.1 stencil</div>
          </a>
          <a href="#summary" className="toc-ch-card">
            <div className="toc-ch-badge">Summary</div>
            <div className="toc-ch-title">Findings &amp; Open Questions</div>
            <div className="toc-ch-summary">github only · λ<sub>c</sub> 0.641 · PETAL gap 0.83–0.88 remains</div>
          </a>
        </div>

        {/* Ch1 sub-items — left: main chain / right: derived branches */}
        <div className="toc-section-block">
          <div className="toc-block-label">Ch1 · Loss Landscapes</div>
          <div className="toc-sub-grid">
            <div className="toc-sub-col">
              <TocNode href="#ch1-paper"      num="§1.1" title="Inspiration — Chen et al."
                summary="Wide/symmetric minima in θ-space (param. perturbation)" />
              <TocNode href="#ch1-inputspace" num="§1.2" title="Input-Embedding Space"
                summary={<>Fix θ, perturb <Math tex="e \in \mathbb{R}^{T\times d}" /> — sample-specific</>}
                from="§1.1" />
              <TocNode href="#ch1-random"     num="§1.3" title="Random-Direction Replication"
                summary="50+50: 1/n dilution washes all signal"
                from="§1.2" />
              <TocNode href="#ch1-gradient"   num="§1.4" title="Gradient-Direction Slice"
                summary={<><Math tex="L''(0) = \hat g^\top H_e \hat g = \lambda_c" /> — active direction</>}
                from="§1.3 (contrast)" />
            </div>
            <div className="toc-sub-col">
              <TocNode href="#ch1-delta"           num="§1.5" title="Δ-Loss Landscape Variant"
                summary="Surrogate ΔL score: AUROC 0.553, not pursued"
                from="§1.4" />
              <TocNode href="#ch1-umap"            num="§1.6" title="UMAP of Gradient Vectors"
                summary="PCA(50) → UMAP(2) of ∇L — no M/NM clustering"
                from="§1.4" />
              <TocNode href="#ch1-rademacher-umap" num="§1.7" title="Rademacher UMAP"
                summary="201 stencil pts → UMAP landscape; visual ✓ but KDE overlap"
                from="§1.3 stencil + §1.6" />
            </div>
          </div>
        </div>

        {/* Ch2 sub-items */}
        <div className="toc-section-block">
          <div className="toc-block-label">Ch2 · λ<sub>c</sub> Critical Sharpness</div>
          <div className="toc-sub-grid">
            <div className="toc-sub-col">
              <TocNode href="#ch2-def"      num="§2.1" title="Definition &amp; Derivation"
                summary={<><Math tex="\lambda_c = 2/\eta_c" /> via bisection — forward-pass only</>}
                from="§1.4" />
              <TocNode href="#ch2-results"  num="§2.2" title="Results: 160m vs 1.4b"
                summary="github 0.641; pile_cc / dm near-random"
                from="§2.1" />
              <TocNode href="#ch2-polca"    num="§2.3" title="POLCA Signal"
                summary={<><Math tex="\sum c_j^2 / \|g\|^2" /> — gradient energy in top-k eigenvecs</>}
                from="§2.1 eigenvecs" />
            </div>
            <div className="toc-sub-col">
              <TocNode href="#ch2-spectrum" num="§2.4" title="Spectral Analysis (SLQ)"
                summary={<><Math tex="\lambda_{\max}" /> AUROC 0.592 — direction reversed vs λ<sub>c</sub></>}
                from="§2.1 Hessian" />
              <TocNode href="#ch2-ref"      num="§2.5" title="Reference Model Attacks"
                summary="Δλ_c hurts on github: 0.641 → 0.458"
                from="§2.2" />
              <TocNode href="#ch2-product"  num="§2.6" title="Product Signals"
                summary="(-L)×λ_c = 0.499 — product collapses quadrant structure"
                from="§2.2 + §1.4 loss" />
            </div>
          </div>
        </div>

        {/* Ch3 + Summary */}
        <div className="toc-sub-grid">
          <div>
            <div className="toc-block-label">Ch3 · Layer Probes</div>
            <TocNode href="#ch3" num="§3" title="Layer-Specific MLP Curvature"
              summary="norm_max L9 = 0.618 · layers 8–11 hooked, github 100+100"
              from="§2.1 stencil" />
          </div>
          <div>
            <div className="toc-block-label">Summary · §4</div>
            <TocNode href="#summary" num="§4" title="Summary &amp; Open Questions"
              summary="Cross-cutting findings · PETAL gap · next directions" />
          </div>
        </div>
      </div>

      {/* ===================== CH1 ===================== */}
      <h2 id="ch1" className="section-anchor">Chapter 1 · Visualising Loss Landscapes p.t. 2, Basin-Like Structure? &amp; UMAP?</h2>
      <p className="meta">
        Reports: <code>report_20260502_122900_PLOT-CORRECTLY</code> &amp; <code>report_20260505_132527_DELTA-LOSS-LANDSCAPE</code>
      </p>

      <h3 id="ch1-paper" className="section-anchor">1.1 Inspiration — Chen et al. (arXiv:2505.17646)</h3>
      <p>
        Chen et al. (<a href="https://arxiv.org/abs/2505.17646" target="_blank" rel="noopener noreferrer">arXiv:2505.17646</a>) show that pretrained LLMs converge to <em>wide, symmetric minima</em> in <em>parameter</em> space.
   
        Their method: perturb parameters <Math tex="\theta" /> with a random Gaussian direction{' '}
        <Math tex="\delta \sim \mathcal{N}(0, I)" /> and sweep a scalar:
      </p>
      <Math display tex="L(\alpha) = L(\theta + \alpha\,\delta)" />
      <details className="callout info" style={{ margin: '0.75rem 0' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
          What does δ look like?
        </summary>
        <div style={{ marginTop: '0.75rem' }}>
          <p style={{ margin: '0 0 0.5rem' }}>
            <Math tex="\delta \sim \mathcal{N}(0, I)" /> means: every element of δ is drawn
            independently from a standard normal. In practice, for a parameter vector of size{' '}
            <Math tex="P" />:
          </p>
          <pre style={{ margin: '0.5rem 0' }}><code>{`# parameter space (P ~ 1e9 for a 1B model)
delta = torch.randn(P)  # each entry ~ N(0,1), independent`}</code></pre>
          <p style={{ margin: '0.5rem 0' }}>
            I is the <strong>identity matrix</strong>. It means every pair
            of dimensions is uncorrelated (covariance = 0) and every dimension has variance 1.
            The resulting vector has no preferred direction; it is isotropic in{' '}
            <Math tex="\mathbb{R}^P" />.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', margin: '1rem 0' }}>
        <figure className="fig" style={{ flex: '1 1 0', margin: 0 }}>
          <img
            src={R('report_20260502_122900_PLOT-CORRECTLY/delta_heatmap.png')}
            alt="δ ~ N(0, I) heatmap"
            style={{ width: '100%' }}
          />
          <figcaption>δ ~ N(0, I) in input-embedding space (T=256, d=2048). Each cell is an independent draw from N(0,1) — pure noise, no structure.</figcaption>
        </figure>
        {/* <div style={{ fontSize: '6rem', lineHeight: 1, paddingTop: '1.5rem', flexShrink: 0 }}>📺</div> */}
      </div>
      </details>

      <details className="callout info" style={{ margin: '0.75rem 0' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
          Rademacher vs Gaussian — concerns about the choice of random direction and comparisons.
        </summary>
        <div style={{ marginTop: '0.75rem' }}>
          <p style={{ margin: '0 0 0.5rem' }}>
            A <strong>Rademacher</strong> vector draws each entry from <Math tex="\{+1,\,-1\}" /> with equal probability:
          </p>
          <pre style={{ margin: '0.5rem 0' }}><code>{`v = torch.randint(0, 2, (n,)) * 2 - 1  # ±1 uniformly`}</code></pre>
          <p style={{ margin: '0.5rem 0' }}>
            Like Gaussian, it satisfies <Math tex="\mathbb{E}[v_i]=0" /> and <Math tex="\mathbb{E}[v_i^2]=1" />,
            so both are valid isotropic directions. The difference shows up in <strong>Hutchinson's trace estimator</strong>.
          </p>

          <p style={{ margin: '0.75rem 0 0.25rem', fontWeight: 600 }}>Hutchinson (1990) property</p>
          <p style={{ margin: '0 0 0.5rem' }}>
            For any symmetric matrix <Math tex="A" /> and any <Math tex="v" /> with i.i.d. entries,
            {' '}<Math tex="\mathbb{E}[v_i]=0,\;\mathbb{E}[v_i^2]=1" />:
          </p>
          <Math display tex="\mathbb{E}_v\bigl[v^\top A\,v\bigr] = \operatorname{tr}(A)" />
          <p style={{ margin: '0.5rem 0' }}>
            We used this for zero-order curvature estimation via finite differences:
          </p>
          <Math display tex="\frac{L(e+hv)+L(e-hv)-2L(e)}{h^2} \;\approx\; v^\top H_e\,v" />
          <p style={{ margin: '0.5rem 0' }}>
            In practice we use (<code>compute_scalar_curvature</code> in llm.py):
          </p>
          <Math display tex="\kappa_k = \frac{L(e{+}u{+}v)-L(e{-}u{+}v)-L(e{+}u{-}v)+L(e{-}u{-}v)}{4h},\quad \text{curvature} = \frac{1}{K}\sum_{k=1}^K |\kappa_k|" />
          <p style={{ margin: '0.25rem 0 0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <Math tex="\kappa_k" /> is the scalar curvature estimate from the <Math tex="k" />-th random pair <Math tex="(u_k, v_k)" />.
            We average the absolute values over <Math tex="K" /> probes (<code>niter=100</code> by default).
          </p>

          <p style={{ margin: '0.75rem 0 0.25rem', fontWeight: 600 }}>These two random sampling methods are seen used for two different purposes. Why? Differences?</p>
          <p style={{ margin: '0 0 0.5rem' }}>
            In <code>normalised_rademacher</code>, the raw ±1 vector is rescaled so{' '}
            <Math tex="\|u\| = h\|e\|" />. Each entry becomes{' '}
            <Math tex="u_i = \pm\,c" /> where <Math tex="c = h\|e\|/\sqrt{T d}" /> — a <strong>single constant</strong>.
            Only the sign differs across dimensions; every entry has the same absolute value.
          </p>
          <p style={{ margin: '0 0 0.5rem' }}>
            This matters for the 4-point stencil: the cross-term is{' '}
            <Math tex="u_i v_j = \pm c^2" />, exactly two possible values.
            Every <Math tex="(i,j)" /> pair contributes with <strong>equal weight</strong> to{' '}
            <Math tex="u^\top H_e v = c^2\sum_{ij} H_{ij}\,\mathrm{sign}(u_i)\,\mathrm{sign}(v_j)" />.
            No dimension dominates.
          </p>
          <p style={{ margin: '0 0 0.5rem' }}>
            Gaussian <Math tex="\delta \sim \mathcal{N}(0,I)" /> is continuous — each entry has a different magnitude.
            Products <Math tex="\delta_i\delta_j" /> span a wide range; large entries dominate the sum and inflate variance.
            Unbiased still, but noisier per probe.
          </p>
          <p style={{ margin: '0 0 0' }}>
            For the <strong>1D landscape</strong> we only need one random direction to sweep along —
            equal-weight across dimensions is not required. Gaussian is natural and produces a smooth continuous direction.
            For <strong>ZO curvature</strong> we average many <Math tex="|\kappa_k|" /> probes, so per-probe variance
            compounds; the equal-weight property of normalised Rademacher keeps it controlled.
          </p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <strong>Empirically:</strong> for the 1D landscape we sample multiple Gaussian directions, but each is analysed
            independently — we sweep <Math tex="\alpha" /> left and right along that single vector and look at the loss curve.
            For the curvature stencil we need to evaluate <Math tex="e \pm u \pm v" /> at four corners simultaneously;
            this requires adding and subtracting a <em>fixed magnitude</em> per element. Normalised Rademacher
            guarantees every element contributes exactly <Math tex="\pm c" />, making the four evaluations symmetric
            by construction. A Gaussian vector has unequal entry magnitudes, so the four corners are no longer
            balanced — some dimensions get perturbed more than others within the same probe.
          </p>
        </div>
      </details>
      
      <ul style={{ margin: '0 0 1rem 1.25rem' }}>
        <li style={{ marginBottom: '0.2rem' }}>
          The resulting 1D slice is always a smooth, symmetric basin.
        </li>
        <li>
          The loss rises in every direction from the minimum &mdash; they use this to argue LLMs are well-conditioned and generalize.
        </li>
      </ul>
 
      <h3 id="ch1-inputspace" className="section-anchor">1.2 From Parameter Space to Input-Embedding Space</h3>
 
      <p>
        Chen et al. perturb the full parameter vector <Math tex="\theta \in \mathbb{R}^P" /> (<Math tex="P \sim 10^9" /> for a 1B model):
      </p>
      <Math display tex="L_\theta(\alpha) = L(\theta + \alpha\,\delta), \quad \delta \sim \mathcal{N}(0, I_P)" />
      <p>
        This tells us about the global geometry of the TRAINING objective, but it is not what we're discussing right now. We'll explore 
        sample-specific — the same landscape applies to every input.
      </p>
      <p>
        We instead fix <Math tex="\theta" /> and perturb the <strong>input embeddings</strong>{' '}
        <Math tex="e = E(x) \in \mathbb{R}^{T \times d}" /> of a single sample <Math tex="x" />:
      </p>
      <Math display tex="L_e(\alpha) = L(e + \alpha\,\delta_e), \quad \delta_e \sim \mathcal{N}(0, I_{T \times d})" />
      <p>
        The dimension drops from <Math tex="P \sim 10^9" /> to <Math tex="T \cdot d \sim 10^5" />, and crucially
        the landscape now depends on <Math tex="x" />.
        A sample the model has memorized will sit in a different basin than one it has never seen —
        this is the signal we exploit for membership inference.
      </p>

      <h3 id="ch1-random" className="section-anchor">1.3 Random-Direction Replication — A Simple Try</h3>
      <p>
        We replicated Chen et al. in both parameter space and input-embedding space, then tested 10 independent
        random directions per sample.
      </p>

      <Fig
        src={R('report_20260502_122900_PLOT-CORRECTLY/combined_param_vs_input_n21.png')}
        caption="Parameter space (left) vs. input-embedding space (right), one random Gaussian direction. Note that the parameter-space landscape depends only on θ, not on which input x is used.
        It's just a visualisation of the landscape we're plotting."
      />
      <Fig
        src={R('report_20260502_122900_PLOT-CORRECTLY/input_space_K10_n21_a0p05.png')}
        caption="10 independent random directions in input space. All 10 curves overlap — no separation."
      />

      <p>
        The single-sample result already shows that 10 independent random directions produce
        overlapping curves — the landscape is isotropic in random directions.
        To further confirm that random directions cannot separate members from non-members,
        we ran a 50+50 experiment: <strong>50 member + 50 non-member</strong> GitHub samples
        (Pythia-1.4B, 256 tokens each), each swept along one random
        direction <Math tex="\delta \sim \mathcal{N}(0, I)" /> in the
        input-embedding space, <Math tex="\alpha \in [-0.05,\, 0.05]" /> with 21 steps.
        All 100 curves are plotted below (orange = member, blue = non-member) with
        mean ± SEM overlay, plus <Math tex="L'(\alpha)" /> and <Math tex="L''(\alpha)" /> via finite differences.
      </p>

      <Fig
        src={R('report_20260502_122900_PLOT-CORRECTLY/random_dir_overlay_github.png')}
        caption="50 member (orange) + 50 non-member (blue) loss landscapes along random directions. Mean L''(0): M = 414, N = 372 — the distributions overlap completely."
      />

      <Callout type="info" title="Why random directions fail">
        <p style={{ margin: '0 0 0.5rem' }}>
          The input Hessian decomposes as{' '}
          <Math tex="H_e = \sum_i \lambda_i v_i v_i^\top" />, where each <Math tex="\lambda_i" /> is the curvature
          along eigenvector <Math tex="v_i" />. If memorization sharpens only a few directions(We guess),
          the large <Math tex="\lambda_i" /> are confined to a low-dimensional subspace{' '}
          <Math tex="\mathrm{span}\{v_1,\ldots,v_k\}" /> (<Math tex="k \ll n" />)(We'll estimate this later).
          Its orthogonal complement — an <Math tex="(n-k)" />-dimensional near-hyperplane — is flat.
          A random direction lands in this flat complement with probability <Math tex="\approx 1 - k/n \approx 1" />.
        </p>
        <p style={{ margin: '0 0 0.4rem' }}>
          Formally, for any unit vector <Math tex="\hat{u} \in \mathbb{R}^n" />,{' '}
          <Math tex="n = T \cdot d \approx 4.5 \times 10^5" />:
        </p>
        <Math display tex="\hat{u}^\top H_e \hat{u} = \sum_i \lambda_i\,(\hat{u}^\top v_i)^2 \;\approx\; \frac{\operatorname{tr}(H_e)}{n}" />
        <p style={{ margin: '0.25rem 0 0.5rem' }}>
          By concentration of measure, <Math tex="(\hat{u}^\top v_i)^2 \approx 1/n" /> for a random <Math tex="\hat{u}" /> and any fixed <Math tex="v_i" />.
          So even if <Math tex="\lambda_{\max} \sim O(1)" /> (a finite constant — the signal itself is not small),
          the random probe only sees <Math tex="\lambda_{\max}/n \sim 10^{-5}" />.
          The <em>1/n dilution</em> is not about <Math tex="\lambda" /> being small —
          it is about the projection <Math tex="\hat{u}^\top v_1" /> being tiny in high dimensions,
          spreading the eigenvalue budget evenly across all <Math tex="n" /> directions.
        </p>
        <Fig
          src={R('report_20260502_122900_PLOT-CORRECTLY/random_vs_gradient_concept.png')}
          caption="Conceptual diagram: most random directions (blue) land in flat regions of the loss landscape. The gradient direction (orange) points where loss changes most — the only direction that carries a membership signal."
        />
      </Callout>

      <h3 id="ch1-gradient" className="section-anchor">1.4 Gradient-Direction Loss Slice — Active Direction</h3>
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

      <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>How the slice is constructed — step by step:</p>
      <Fig src={R('report_20260502_122900_PLOT-CORRECTLY/landscapes_100plus100/diagrams/figure1_direction_principle.png')} caption="Step 1 — Direction principle: choose the gradient direction ĝ in embedding space" />
      <Fig src={R('report_20260502_122900_PLOT-CORRECTLY/landscapes_100plus100/diagrams/figure2_sampling_points.png')} caption="Step 2 — Place a uniform grid of α values along ĝ" />
      <Fig src={R('report_20260502_122900_PLOT-CORRECTLY/landscapes_100plus100/diagrams/figure3_loss_at_points.png')} caption="Step 3 — Evaluate L(e + α ĝ) at each grid point" />
      <Fig src={R('report_20260502_122900_PLOT-CORRECTLY/landscapes_100plus100/diagrams/figure4_finite_diff.png')} caption="Step 4 — Apply the finite-difference stencil to read off L′(0) and L″(0) = λ_c" />

      <h4>Results: Population Overlays (100+100 per dataset)</h4>
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

      <Callout type="find" title="Key Finding">
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li><strong>Random directions are useless.</strong> Both single-sample (K=10) and multi-sample (50+50) experiments confirm that random <Math tex="\delta \sim \mathcal{N}(0,I)" /> cannot separate members from non-members — the 1/n dilution washes out any signal.</li>
          <li><strong>Gradient direction works on dm but weak, need to try AUROC.</strong> <Math tex="\langle L''(0)\rangle" /> shows a 1.7× member/non-member ratio — dm's individually distinct math problems sit in sharper basins.</li>
          <li><strong>Gradient direction fails on github and pile_cc.</strong> The curvature distributions overlap completely — the landscape geometry does not discriminate at the global level on these subsets.</li>
          <li><strong>Loss level still matters.</strong> On github, raw loss separates M/NM even though the landscape <em>shape</em> does not.</li>
        </ul>
      </Callout>

      <h3 id="ch1-delta" className="section-anchor">1.5 Δ-Loss Landscape Variant — A Simple Try</h3>
      <p>
        Inspired by reference-model attacks, we tried a <em>differential landscape</em> signal: perturb input embeddings
        along the target model's gradient direction and measure how the surrogate model's loss changes:
      </p>
      <Math display tex="\text{score}(x) = L_{\text{surrogate}}(e + \beta\,\hat{g}_{\text{target}}) - L_{\text{target}}(e + \beta\,\hat{g}_{\text{target}})" />
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

      <h3 id="ch1-umap" className="section-anchor">1.6 UMAP of Gradient Vectors</h3>
      <p>
        Each sample produces a gradient vector <Math tex="\nabla_e L(e) \in \mathbb{R}^{T \times d}" /> (~5×10⁵ dims).
        We collect these for members and non-members, then project to 2D to ask:
        do the two classes occupy different regions of gradient space?
      </p>

      <details className="callout info" style={{ margin: '0.75rem 0' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
          What is PCA?
        </summary>
        <div style={{ marginTop: '0.5rem' }}>
          <p>
            Empirically: PCA finds <Math tex="k" /> mutually orthogonal directions in the gradient matrix,
            then projects each gradient vector onto them —
            compressing each sample from ~5×10⁵ dims down to 50.
          </p>
          <p style={{ fontFamily: 'monospace', fontSize: '0.9rem', margin: '0.4rem 0 0.75rem',
                      color: '#f59e0b', textAlign: 'center' }}>
            (200, 5×10⁵) — PCA → (200, 50)
          </p>
          <p>
            Formally: centre the data matrix <Math tex="X \in \mathbb{R}^{2N \times D}" /> (D ≈ 5×10⁵),
            form the covariance matrix:
          </p>
          <Math display tex="C = \frac{1}{2N} X^\top X \in \mathbb{R}^{D \times D}" />
          <p>
            Eigendecompose: <Math tex="C = V \Lambda V^\top" />, columns of <Math tex="V" /> are eigenvectors
            sorted by <Math tex="\lambda_1 \geq \lambda_2 \geq \cdots" />.
            Keep top <Math tex="k" /> eigenvectors <Math tex="V_k \in \mathbb{R}^{D \times k}" /> and project:
          </p>
          <Math display tex="Z = X V_k \in \mathbb{R}^{2N \times k}" />
          <p>
            The scree plot shows an elbow where adding more PCs gives diminishing returns —
            choose <Math tex="k" /> there. We use <Math tex="k = 50" />.
          </p>
          <Fig
            src={R('report_20260502_122900_PLOT-CORRECTLY/UMAP/pca_intuition.png')}
            caption="Left: 2D intuition — PC1 points along maximum variance, each sample projects onto it. Right: scree plot — variance drops off fast; choose k at the elbow."
          />
        </div>
      </details>

      <details className="callout info" style={{ margin: '0.75rem 0' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
          What is UMAP?
        </summary>
        <div style={{ marginTop: '0.5rem' }}>
          <p>
            Empirically: UMAP takes the 50-dim PCA output and finds a 2D layout where
            samples that were <em>close neighbours</em> in 50D stay close in 2D.
            The xy coordinates have no physical meaning — only relative distances matter.
          </p>
          <p style={{ fontFamily: 'monospace', fontSize: '0.9rem', margin: '0.4rem 0 0.75rem',
                      color: '#f59e0b', textAlign: 'center' }}>
            (200, 50) — UMAP → (200, 2)
          </p>
          <p>
            Unlike PCA (linear projection), UMAP can capture curved structure.
            If members and non-members form separate clusters, their gradient vectors
            carry a geometric membership signal not visible in any single linear direction.
          </p>
        </div>
      </details>

      <p style={{ margin: '0.75rem 0', color: '#888', fontStyle: 'italic' }}>
        Pipeline: (2N, 5×10⁵) —PCA→ (2N, 50) —UMAP→ (2N, 2) — scatter coloured by member / non-member.
      </p>

      <Fig
        src={R('report_20260502_122900_PLOT-CORRECTLY/UMAP/umap_github_3d.png')}
        caption="3D scatter — github 100+100. xy = UMAP(PCA(g_e, k=50)), z = base loss, colour = |L″(0)|. ○ member  △ non-member. Top-10 PCs explain 23.8% variance."
      />
      <p>
        UMAP is a manifold-based dimensionality reduction: it preserves local neighbourhood
        structure in gradient space, pulling samples with similar gradient directions close
        together on the 2D plane. The z-axis adds loss as a third dimension, making the
        loss landscape geometry directly readable. Curvature (|L″(0)|, encoded as colour)
        is harder to interpret visually — it is a scalar computed per sample along that
        sample's own gradient direction, so two nearby points on the UMAP can carry very
        different curvatures depending on where their individual gradients point. The colour
        therefore reflects local sharpness, but not the geometry of the embedding itself.
      </p>

      <h3 id="ch1-rademacher-umap" className="section-anchor">1.7 Rademacher UMAP — When Stencil Points Get Plotted</h3>
      <p>
        In the stencil curvature estimator (Section 2 / Chapter 2), we sample Rademacher perturbation vectors{' '}
        <Math tex="u, v \sim \{\pm 1\}^d / \|u\|" /> and evaluate the loss at four corners{' '}
        <Math tex="e \pm u \pm v" /> to estimate <Math tex="\kappa = v^\top H_e\, u / h^2" />.
        We average <Math tex="|\kappa_k|" /> over <Math tex="K = 100" /> such probes — treating each probe as a
        black-box scalar and discarding the geometry.
      </p>
      <p>
        A natural question: <strong>what do these 201 perturbed points actually look like in low-dimensional space?</strong>{' '}
        We run PCA(50) on all 201 points (base + 200 Rademacher perturbations) then UMAP(2), centering the base
        point ★ at the origin. The colour encodes{' '}
        <Math tex="\Delta L = L(e + \delta) - L(e)" /> — how much the loss shifts at each perturbed point.
      </p>

      <Fig
        src={R('report_20260502_122900_PLOT-CORRECTLY/UMAP/Rademacher/rademacher_umap_github.png')}
        caption="Local Rademacher UMAP — one member (left) vs one non-member (right). Top: 3D surface. Middle: ΔL heatmap. Bottom: Laplacian(smooth ΔL) with scalar value at ★. Model: pythia-160m, github, h=1e-2, 201 pts."
      />

      <p>
        Each sample has its own character — you cannot generalise from one to another.
        The member landscape is rugged with multiple peaks and valleys; the non-member sits in a flatter region
        with one dominant valley. <strong>At the single-sample level this matches intuition:</strong> the model
        has memorised the member, so nearby perturbations push into sharp territory; the non-member lies in a
        smoother part of the loss surface.
      </p>
      <p>
        The Laplacian values (bottom row) are derived by smoothing the <Math tex="\Delta L" /> grid with a
        Gaussian filter (<Math tex="\sigma = 2.5" /> pixels) and then applying a discrete Laplacian.
        Interpolating at the origin gives a scalar{' '}
        <Math tex="\nabla^2(\Delta L)|_\star" /> — a curvature proxy that does not require any analytical
        Hessian computation.
      </p>
      <p>
        This raises an obvious follow-up: <strong>can we use this Laplacian scalar as an MIA signal?</strong>{' '}
        We computed it for 300 members + 300 non-members and plotted the population distributions.
      </p>

      <Fig
        src={R('report_20260502_122900_PLOT-CORRECTLY/UMAP/Rademacher/rademacher_curvature_pdf_github.png')}
        caption="Rademacher Laplacian curvature PDF — github, n=300+300. Member mean 3.45×10⁻⁶ vs non-member mean 2.67×10⁻⁶. KDE distributions nearly identical."
      />

      <Callout type="warn" title="Still doesn't work">
        <p style={{ margin: 0 }}>
          The two KDE curves are almost perfectly overlapping. Member mean{' '}
          <Math tex="3.45 \times 10^{-6}" />, non-member mean{' '}
          <Math tex="2.67 \times 10^{-6}" /> — a ratio of ~1.3×, but both standard deviations
          (~4–7×10⁻⁵) are an order of magnitude larger than the means. The signal-to-noise ratio is too poor for MIA.
        </p>
        <p style={{ margin: '0.6rem 0 0' }}>
          Likely reasons: (1) UMAP does not preserve metric distances, so the Laplacian in UMAP coordinates
          has no physical meaning; (2) the smoothing sigma is an arbitrary hyperparameter that dominates the result;
          (3) 201 points are far too sparse to reconstruct a reliable curvature field in 50D PCA space.
        </p>
      </Callout>

      <hr className="section-div" />

      {/* ===================== CH2 ===================== */}
      <h2 id="ch2" className="section-anchor">Chapter 2 · λ<sub>c</sub>: Critical Sharpness</h2>
      <p className="meta">
        Report: <code>report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta</code>
      </p>

      <h3 id="ch2-def" className="section-anchor">2.1 Definition &amp; Derivation</h3>
      <p className="meta">
        Method: <a href="https://arxiv.org/abs/2501.16979" target="_blank" rel="noopener">arXiv:2501.16979</a>
        {' '}adapted to input-embedding space.
      </p>

      <h4>Exact value: λ<sub>dir</sub></h4>
      <p>
        The exact directional sharpness is the Rayleigh quotient of <Math tex="H_e" /> at the gradient direction:
      </p>
      <Math display tex="\lambda_{\text{dir}} = \hat{g}^\top H_e\,\hat{g} = \frac{g^\top H_e\,g}{\|g\|^2} = \sum_j \lambda_j\,c_j^2, \quad c_j = v_j^\top \hat{g}" />
      <p>
        Geometrically: decompose the gradient into eigenvectors of <Math tex="H_e" />. Each eigenvalue <Math tex="\lambda_j" />
        is weighted by <Math tex="c_j^2" /> — how much the gradient "points along" that eigenvector.
        The resulting sum is the curvature of the 1D loss slice along the descent path.
        Computing it exactly requires a Hessian-vector product (HVP): 1 forward + 2 backward passes.
      </p>

      <h4>Why the 1D slice has curvature λ<sub>dir</sub></h4>
      <p>
        Taylor-expand <Math tex="L(e - \eta\,g)" /> along the step direction:
      </p>
      <Math display tex="L(e - \eta\,g) \;\approx\; L(e) \;-\; \eta\,\|g\|^2 \;+\; \tfrac{1}{2}\,\eta^2\,g^\top H_e\,g" />
      <p>
        This is a quadratic in <Math tex="\eta" />, with curvature coefficient <Math tex="g^\top H_e g = \lambda_{\text{dir}}\|g\|^2" />.
        The loss increases once the quadratic term dominates — exactly when <Math tex="\eta > 2\|g\|^2/(g^\top H_e g) = 2/\lambda_{\text{dir}}" />.
        The bisection finds this <em>tipping point</em> empirically, without ever materialising <Math tex="H_e" />.
      </p>

      <h4>Approximate value: λ<sub>c</sub> via bisection</h4>
      <p>
        We define <Math tex="\eta_c" /> as the smallest step size at which the loss actually increases, and set:
      </p>
      <Math display tex="\lambda_c = \frac{2}{\eta_c}, \qquad \eta_c = \min\bigl\{\eta : L(e - \eta\,g) > L(e)\bigr\}" />
      <p>
        Under local quadratic approximation, <Math tex="\lambda_c \to \lambda_{\text{dir}}" />.
        In practice, higher-order terms shift <Math tex="\eta_c" /> slightly, so{' '}
        <Math tex="\lambda_c \approx \lambda_{\text{dir}}" /> rather than equality.
        The advantage: only forward passes are needed — no second-order autodiff.
      </p>

      <details className="callout info" style={{ margin: '0.75rem 0' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
          Connection: geometry ↔ weighted eigenvalue sum
        </summary>
        <div style={{ marginTop: '0.5rem' }}>
          <p>
            A symmetric matrix <Math tex="H_e" /> can be decomposed into its eigenpairs{' '}
            <Math tex="\{(\lambda_j,\, v_j)\}" />:
          </p>
          <Math display tex="H_e = \sum_j \lambda_j\, v_j v_j^\top" />
          <p>
            Each term <Math tex="\lambda_j v_j v_j^\top" /> is a rank-1 "slab" — a direction{' '}
            <Math tex="v_j" /> (an axis of the loss bowl) scaled by its steepness <Math tex="\lambda_j" />.
            Summing all slabs reconstructs the full curvature of the bowl.
          </p>
          <p>
            Substituting into the Rayleigh quotient:
          </p>
          <Math display tex="\hat{g}^\top H_e\,\hat{g} = \hat{g}^\top \Bigl(\sum_j \lambda_j\, v_j v_j^\top\Bigr)\hat{g} = \sum_j \lambda_j\,(\hat{g}^\top v_j)^2 = \sum_j \lambda_j\, c_j^2" />
          <p>
            The weight <Math tex="c_j^2 = (\hat{g}^\top v_j)^2" /> is the squared projection of the
            (unit) gradient onto the <Math tex="j" />-th bowl axis.
            So <Math tex="\lambda_{\text{dir}}" /> is the answer to:{' '}
            <em>"how steep is the bowl along the gradient direction?"</em> —
            each axis contributes its steepness <Math tex="\lambda_j" />, scaled by how much the gradient
            faces that axis.
          </p>
          <p>
            This is exactly the curvature of the 1D loss slice <Math tex="L(e - \eta\,g)" />,
            which is what the bisection measures empirically.
            The two views — geometric (1D slice) and algebraic (weighted sum) — describe the same quantity.
          </p>
        </div>
      </details>

      <p>
        Cost: ~1 backward pass + 6–10 forward passes per sample.
        Implementation (<code>mia-llm-research/src/curvature/llm.py</code>):
      </p>
      <pre><code>{`# src/curvature/llm.py  —  compute_input_critical_sharpness
def compute_input_critical_sharpness(model, input_ids,
                                     tol_power=4, lr_guess=1.0, max_exp_iters=40):
    labels = input_ids[:, 1:].contiguous()

    # 1. One backward pass → g_e = ∂L/∂e
    with torch.enable_grad():
        e = get_input_embeds(model, input_ids).detach().requires_grad_(True)
        logits = model(inputs_embeds=e, labels=None).logits[:, :-1, :]
        loss0 = F.cross_entropy(logits.reshape(-1, logits.size(-1)),
                                labels.reshape(-1), reduction="mean")
        base_loss = loss0.item()
        (g_e,) = torch.autograd.grad(loss0, e)
    e, g_e = e.detach(), g_e.detach()

    @torch.no_grad()
    def probe(lr): return forward_ce(model, e - lr * g_e, labels).item()

    # 2. Exponential search to bracket η_c
    lr = max(lr_guess, 1e-12)
    if probe(lr) > base_loss:          # above η_c → halve to find lower bound
        lr_upper, lr_lower = lr, 0.0
        for _ in range(max_exp_iters):
            lr /= 2.0
            if probe(lr) <= base_loss: lr_lower = lr; break
    else:                              # below η_c → double to find upper bound
        lr_lower = lr
        for _ in range(max_exp_iters):
            lr *= 2.0
            if probe(lr) > base_loss:  lr_upper = lr; break

    # 3. Binary search  (tol_power + 2 steps → ≤ 1/2^tol_power relative error)
    for _ in range(tol_power + 2):
        mid = (lr_lower + lr_upper) / 2.0
        if probe(mid) > base_loss: lr_upper = mid
        else:                       lr_lower = mid

    eta_c    = (lr_lower + lr_upper) / 2.0
    lambda_c = 2.0 / eta_c
    return {"lambda_c": lambda_c, "eta_c": eta_c, "base_loss": base_loss,
            "grad_norm": g_e.flatten().norm().item(), "converged": True, ...}`}</code></pre>
      <Fig
        src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/figures/bisection_animated.gif')}
        caption="Bisection algorithm on a 2D loss contour. Phase 1: exponential search doubling outward until L > L₀ (red dot = upper bound). Phase 2: binary search midpoints converge to η_c (purple diamond). λ_c = 2/η_c."
        width="700px"
      />

      <h3 id="ch2-results" className="section-anchor">2.2 Results: 160m vs 1.4b, 1000+1000</h3>
      <p className="meta">
        Dataset: <code>hf_ngram13_0.8</code> (MIMIR mirror, 13-gram filtered at threshold 0.8) ·
        1000 members + 1000 non-members per subset ·
        <code>max_length=256</code> tokens · seed 42.
      </p>

      <table>
        <thead>
          <tr><th>Signal</th><th>github</th><th>pile_cc</th><th>dm</th><th>Model</th></tr>
        </thead>
        <tbody>
          <tr className="highlight-row">
            <td>loss (baseline)</td>
            <td>0.650</td><td>0.501</td><td>0.507</td><td>160m</td>
          </tr>
          <tr className="highlight-row">
            <td>λ<sub>c</sub> (critical sharpness) <img src={confusionImg} alt="" style={{ height: '2em', verticalAlign: 'middle', marginLeft: '0.4em' }} /></td>
            <td className="best">0.641</td><td>0.512</td><td>0.514</td><td>160m</td>
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
      <p style={{ fontSize: '0.78rem', color: '#666', margin: '0.3rem 0 1.2rem', lineHeight: 1.5 }}>
        Note: MIMIR paper uses full-length sequences; PETAL evaluates on WikiMIA (default 32-word prefix,{' '}
        <code style={{ fontSize: '0.76rem' }}>text.split()[:32]</code>) — dataset, domain, and sequence length all differ;
        AUROC numbers are not directly comparable.
      </p>

      <FigRow>
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/figures/lambda_c_distributions.png')}
          caption="λ_c distributions — github (pythia-160m). ⚠ Direction reversed: members are shifted right (sharper, higher λ_c), contrary to naive expectation. MIA scores with −λ_c."
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

      <Callout type="find" title="λ_c gives no useful signal on github or dm">
        λ<sub>c</sub> underperforms the loss baseline on both <strong>github</strong> (0.641 vs 0.650)
        and <strong>dm</strong> (0.514 vs 0.507) — effectively no signal.
        On github the direction is also reversed: naively, non-members should be sharper
        (model never fit them → rougher landscape), but members actually have higher λ<sub>c</sub>
        (mean 4.98 vs 2.44). Reason unknown.
        On dm, both signals are near random.
      </Callout>

      <h3 id="ch2-polca" className="section-anchor">2.3 POLCA Signal</h3>
      <p className="meta">
        Method: <a href="https://arxiv.org/abs/2506.15872" target="_blank" rel="noopener">arXiv:2506.15872</a>
      </p>
      <p>
        POLCA (Projection Of Loss-gradient onto Curvature Axes) asks: <em>how much of the gradient
        lives inside the top-k curvature directions?</em> Formally, project <Math tex="g_e" /> onto
        the subspace spanned by the top-k eigenvectors of <Math tex="H_e" /> and measure the
        captured energy fraction:
      </p>
      <Math display tex="\text{POLCA}(k) = \frac{\|P_k\,g_e\|^2}{\|g_e\|^2} = \frac{\displaystyle\sum_{j=1}^k c_j^2}{\|g_e\|^2}, \quad c_j = v_j^\top g_e,\quad P_k = \sum_{j=1}^k v_j v_j^\top" />
      <Fig
        src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/figures/polca_diagram.png')}
        caption="POLCA intuition (k=2 toy example). Left: gradient g_e decomposed onto the top-2 eigenvectors v₁, v₂ of H_e. Right: fraction of ‖g_e‖² captured at k=1 vs k=2."
        width="750px"
      />
      <p style={{ fontSize: '0.88rem', color: '#aaa', margin: '0.2rem 0 1rem', lineHeight: 1.65 }}>
        <strong>How it works in practice (k=5).</strong>{' '}
        We run Lanczos (via ARPACK <code>eigsh</code>) to extract the top-<Math tex="k" /> eigenvectors{' '}
        <Math tex="v_1,\ldots,v_k" /> of <Math tex="H_e" /> — the directions of sharpest curvature.
        We then project the gradient onto each:{' '}
        <Math tex="c_j = v_j^\top g_e" /> (scalar length along direction <Math tex="j" />).
        POLCA is the fraction of <strong>gradient energy</strong> that falls inside this top-<Math tex="k" /> subspace:
      </p>
      <Math display tex="\text{POLCA}(k) = \frac{c_1^2 + c_2^2 + \cdots + c_k^2}{\|g_e\|^2}" />
      <p style={{ fontSize: '0.88rem', color: '#aaa', margin: '0.3rem 0 1rem', lineHeight: 1.65 }}>
        No eigenvalue weighting — each <Math tex="c_j^2" /> counts equally regardless of how large <Math tex="\lambda_j" /> is.
        A POLCA close to 1 means the <strong>gradient direction</strong> is nearly contained in the sharp subspace;
        close to 0 means it points mostly into the flat directions.
        With embedding dimension <Math tex="D \approx 500{,}000" />, even <Math tex="k=5" /> covers a tiny slice of the full space.
      </p>
      <p>
        POLCA ∈ [0, 1]. A value near 1 means the gradient is almost entirely aligned with the sharpest
        curvature directions; near 0 means the gradient is orthogonal to them.
        The MIA intuition: members, being well-fit, have gradients that align more with the flat directions
        (low POLCA); non-members' gradients point more into the sharp subspace (high POLCA).
      </p>

      <h4>What is k — and why is it a problem?</h4>
      <p>
        <Math tex="k" /> is the number of top eigenvectors used. It is a <strong>free hyperparameter</strong>
        with no principled choice:
      </p>
      <ul style={{ margin: '0.4rem 0 0.6rem 1.2rem', lineHeight: 1.7 }}>
        <li><Math tex="k=1" />: only the sharpest direction — misses signal from the next few axes.</li>
        <li>Large <Math tex="k" />: captures more of the gradient, but the subspace grows to fill everything
            and POLCA → 1 for all samples (signal collapses).</li>
        <li>The "right" <Math tex="k" /> depends on how spiked the spectrum is, which varies per model and dataset.</li>
      </ul>
      <p>
        Cost: eigsh computes top-k eigenvectors via ARPACK, each requiring ~<Math tex="2k{+}10" /> Hessian-vector
        products (HVPs). Each HVP = 1 extra backward pass through the model.
        Total: <strong>~(2k + 10) × backward passes</strong> per sample — far more expensive than λ<sub>c</sub>'s
        6–10 forward passes.
      </p>

      <h4>Implementation (<code>src/curvature/llm.py</code>)</h4>
      <pre><code>{`# compute_polca_signal(model, input_ids, k=5)
# 1. backward with create_graph=True → g_e + matvec closure
(g_e,) = torch.autograd.grad(loss, e, create_graph=True)
matvec = lambda v: torch.autograd.grad((g_e * v).sum(), e, retain_graph=True)[0]

# 2. top-k eigenvectors via ARPACK (handles reorthogonalisation)
linop = LinearOperator((n, n), matvec=matvec_np)
eigs, V_topk = eigsh(linop, k=k, which="LM")   # V_topk: (n, k)

# 3. project gradient onto top-k subspace
c = V_topk.T @ g_flat          # c_j = v_j^T g_e
signal = c @ c / ||g_e||²      # POLCA ∈ [0, 1]`}</code></pre>

      <h4>Results: AUROC vs k</h4>
      <Fig
        src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/new_findings/polca_projection/results.png')}
        caption="POLCA AUROC across datasets and k values. github: 0.608 (flat across k); pile_cc: 0.558; dm: 0.512. The signal is insensitive to k on github but never beats the loss baseline."
        width="600px"
      />

      <h4>Relation to λ<sub>c</sub></h4>
      <p>
        Let <Math tex="\{(\lambda_j, v_j)\}" /> be the eigenpairs of <Math tex="H_e" />, and <Math tex="c_j = v_j^\top \hat{g}" />.
        Both signals decompose the gradient energy along eigenvectors of <Math tex="H_e" />:
      </p>
      <Math display tex="\lambda_c = \sum_j \lambda_j\,c_j^2 \,/\, \|\hat{g}\|^2 \quad \text{(eigenvalue-weighted sum)}" />
      <Math display tex="\text{POLCA}(k) = \sum_{j=1}^k c_j^2 \,/\, \|\hat{g}\|^2 \quad \text{(unweighted top-}k\text{ fraction)}" />
      <p>
        λ<sub>c</sub> retains eigenvalue magnitude (larger eigenvalues contribute more);
        POLCA discards the magnitude and only asks how much gradient energy lands in the top-k subspace.
        Empirically, λ<sub>c</sub> outperforms POLCA on github by ~6 AUROC points,
        suggesting the eigenvalue magnitude carries meaningful MIA signal.
      </p>

      <h3 id="ch2-spectrum" className="section-anchor">2.4 Spectral Analysis — Hessian ESD (SLQ)</h3>
      <p className="meta">
        Method: Stochastic Lanczos Quadrature —{' '}
        <a href="https://arxiv.org/abs/1901.10159" target="_blank" rel="noopener">arXiv:1901.10159</a>
      </p>
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
      <FigRow>
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/new_findings/spectrum_lambda/ranks/rank_auroc_github.png')}
          caption="AUROC vs eigenvalue rank — github. λ_max (rank-1) achieves 0.592; rank-2 gives 0.593."
        />
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/new_findings/spectrum_lambda/ranks/rank_auroc_dm.png')}
          caption="AUROC vs eigenvalue rank — dm. Rank-1 signal very weak; lower ranks near random."
        />
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/new_findings/spectrum_lambda/ranks/rank_auroc_pile_cc.png')}
          caption="AUROC vs eigenvalue rank — pile_cc. Signal marginally above chance at rank-1."
        />
      </FigRow>
      <Callout type="find" title="Surprising Direction">
        On github, <strong>non-members have larger top eigenvalues</strong> (AUROC direction: lower = member).
        This is opposite to λ<sub>c</sub> (where member has higher directional curvature).
        The global worst-case curvature (λ<sub>max</sub>) and the gradient-directional curvature (λ<sub>c</sub>)
        encode different information — non-members trigger a rougher global landscape but smoother gradient descent path.
      </Callout>

      <h4>Spectral Window Fishing</h4>
      <p>
        The initial ESD plots revealed that in some <em>eigenvalue windows</em>, the member and non-member spectra
        appear to separate. Intuition: if a <em>fixed</em> spectral window [λ<sub>lo</sub>, λ<sub>hi</sub>]
        can be found where members consistently have more (or fewer) Ritz values than non-members,
        the count inside that window becomes a model-specific MIA signal.
        We scanned all windows via a sliding heatmap to test this hypothesis.
      </p>
      <p>
        <strong>Sad Conclusion: no robust window found.</strong> The best-window AUROC on github (~0.59) only
        matches λ<sub>max</sub> alone, and it does not transfer to dm or pile_cc —
        suggesting the separation is dataset-specific noise rather than a stable geometric property.
      </p>
      <FigRow>
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/new_findings/spectrum_lambda/fishing/fishing_abs_esd_github.png')}
          caption="Window scan — github. Best window AUROC ~0.59."
        />
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/new_findings/spectrum_lambda/fishing/fishing_heatmap_github.png')}
          caption="AUROC heatmap [lo, hi] — github. Signal concentrated near top eigenvalues only."
        />
      </FigRow>
      <FigRow>
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/new_findings/spectrum_lambda/fishing/fishing_abs_esd_dm.png')}
          caption="Window scan — dm. No window above chance."
        />
        <Fig
          src={R('report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/new_findings/spectrum_lambda/fishing/fishing_abs_esd_pile_cc.png')}
          caption="Window scan — pile_cc. Flat across all windows."
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
      <h2 id="ch3" className="section-anchor">Chapter 3 · Layer-Specific MLP Curvature — A Simple Try</h2>
      <p className="meta">Report: <code>report_20260507_073000_layer_curvature_probe</code></p>

      <p>
        Motivation: global λ<sub>c</sub> integrates across all 12 transformer layers. Membership fingerprints may
        be localized — mechanistic interpretability suggests layers 9–10 are "fact retrieval" MLP layers.
        We probe curvature in <em>layer-space</em> w.r.t. the MLP output activations using zero-order finite differences.
      </p>

      <h3 id="ch3-method" className="section-anchor">3.1 Method</h3>
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

      <h3 id="ch3-results" className="section-anchor">3.2 Results</h3>
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
      <h2 id="summary" className="section-anchor">§4 · Summary &amp; Open Questions</h2>

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
