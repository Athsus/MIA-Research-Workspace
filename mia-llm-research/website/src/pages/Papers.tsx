import Math from '../components/Math'

function PaperCard({
  id,
  arxiv,
  title,
  authors,
  venue,
  children,
}: {
  id: string
  arxiv: string
  title: string
  authors: string
  venue: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="section-anchor" style={{ marginBottom: '3rem' }}>
      <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1rem', marginBottom: '1rem' }}>
        <h2 style={{ margin: '0 0 0.2rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-h)', lineHeight: 1.3 }}>
          {title}
        </h2>
        <p style={{ margin: '0.15rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {authors}
        </p>
        <p style={{ margin: '0.15rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {venue} ·{' '}
          <a href={`https://arxiv.org/abs/${arxiv}`} target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>
            arXiv:{arxiv} ↗
          </a>
        </p>
      </div>
      {children}
    </section>
  )
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <h4 style={{
        fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.07em',
        color: 'var(--text-muted)', margin: '0 0 0.4rem', fontWeight: 600,
      }}>
        {label}
      </h4>
      <div style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text)' }}>
        {children}
      </div>
    </div>
  )
}

export default function Papers() {
  return (
    <article className="report">
      <h1 id="top">Referenced Papers</h1>
      <p className="meta">
        Papers whose methods were directly applied or adapted in this project.
        Each entry covers what the authors did and specifically what we borrowed.
      </p>

      <nav className="toc">
        <h4>Contents</h4>
        <ul>
          <li><a href="#basin">Basin-Like Loss Landscape in LLMs (arXiv:2505.17646)</a></li>
          <li><a href="#critical-sharpness">Scalable Measure of Loss Landscape Curvature (arXiv:2601.16979)</a></li>
          <li><a href="#landscape-viz">Visualizing the Loss Landscape of Neural Nets (arXiv:1712.09913)</a></li>
        </ul>
      </nav>

      <hr className="section-div" />

      {/* ── Paper 1 ── */}
      <PaperCard
        id="basin"
        arxiv="2505.17646"
        title="Unveiling the Basin-Like Loss Landscape in Large Language Models"
        authors="Chen et al."
        venue="arXiv May 2025"
      >
        <Block label="What they did">
          <p>
            The paper investigates the geometry of the loss landscape in parameter space for
            pretrained LLMs. The core finding is that pretrained models converge to{' '}
            <em>wide, symmetric, basin-like minima</em>: the loss surface is flat in most
            directions and rises smoothly when parameters are displaced from the optimum.
          </p>
          <p>
            Their visualization method perturbs model parameters along two directions —
            one random Gaussian direction <Math tex="\delta_1 \sim \mathcal{N}(0,I)" /> and a
            second independent direction <Math tex="\delta_2" /> — and sweeps two scalars{' '}
            <Math tex="\alpha, \beta" /> to produce a 2D surface:
          </p>
          <Math display tex="L(\alpha,\beta) = L(\theta + \alpha\,\delta_1 + \beta\,\delta_2)" />
          <p>
            The resulting plots reveal that the loss bowl is nearly circular (isotropic basin),
            which the authors argue is a hallmark of large-scale pretraining on diverse data.
          </p>
        </Block>

        <Block label="What we applied">
          <p>
            We adopted the 2D plotting technique to visualise the loss landscape of Pythia models
            on MIMIR samples. Concretely, we:
          </p>
          <ul>
            <li>Perturbed the model's <em>input embeddings</em> rather than all parameters
              (making the sweep tractable on a single GPU), sweeping <Math tex="\alpha" /> along
              a single random or gradient-aligned direction.</li>
            <li>Generated 1D cross-section plots (<Math tex="L(\alpha)" />) and 2D surface plots
              to compare the curvature profile for member vs non-member sequences.</li>
            <li>Used this visualisation to build intuition for why embedding-space curvature
              differs between training and held-out data, motivating the curvature-based MIA signals
              developed in Sprint 4.</li>
          </ul>
          <p>
            The generated plots live in{' '}
            <code>reports/report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/</code>.
          </p>
        </Block>
      </PaperCard>

      <hr className="section-div" />

      {/* ── Paper 2 ── */}
      <PaperCard
        id="critical-sharpness"
        arxiv="2601.16979"
        title="A Scalable Measure of Loss Landscape Curvature for Analyzing the Training Dynamics of LLMs"
        authors="Kalra, Gagnon-Audet, Gromov, Mediratta, Niu, Miller, Shvartsman (Meta / UMD)"
        venue="arXiv February 2026"
      >
        <Block label="What they did">
          <p>
            Computing Hessian sharpness{' '}
            <Math tex="\lambda_{\max}^H" /> for LLMs requires Hessian-vector products via Power
            Iteration or Lanczos, which conflict with FlashAttention and are prohibitively slow
            for billion-parameter models.
          </p>
          <p>
            The paper proposes <strong>critical sharpness</strong>{' '}
            <Math tex="\lambda_c = 2 / \eta_c" />, where <Math tex="\eta_c" /> is the smallest
            learning rate that causes the loss to increase when stepping along the current
            optimizer update direction <Math tex="\Delta\theta" />:
          </p>
          <Math display tex="\eta_c = \inf\{\eta > 0 \mid L(\theta - \eta\,\Delta\theta) > L(\theta)\}" />
          <p>
            This requires only ~5–6 forward passes (exponential search + 4-step binary search)
            with no backward pass. Under a quadratic approximation, <Math tex="\lambda_c" />
            {' '}equals the gradient-factored directional sharpness:
          </p>
          <Math display tex="\lambda_{\mathrm{dir}} = \frac{\sum_i c_i^2\,\lambda_i^H}{\sum_i c_i^2}" />
          <p>
            where <Math tex="c_i = \langle \Delta\theta, v_i \rangle" /> are projections of the
            update direction onto Hessian eigenvectors. This is a{' '}
            <em>gradient-aligned weighted average of eigenvalues</em> — not the trace of the
            Hessian and not just the top eigenvalue.
          </p>
          <p>
            They use this to demonstrate progressive sharpening and Edge of Stability at scale
            (OLMo-2 up to 7B parameters), and introduce relative critical sharpness to guide
            data-mixing decisions during fine-tuning.
          </p>
        </Block>

        <Block label="What we applied">
          <p>
            We imported <Math tex="\lambda_c" /> as a per-sample MIA signal. For each input
            sequence, we compute the critical sharpness of the loss with respect to the model's
            embedding of that sequence. The hypothesis: training members sit in tighter loss
            bowls (higher <Math tex="\lambda_c" />) than held-out non-members.
          </p>
          <p>
            Key design decision borrowed from the paper: instead of using the Hessian trace
            (a uniform average over all directions), we use the gradient-factored eigenvalue
            sum. This means the signal automatically up-weights curvature in directions the
            model's gradient actually moves — a more informative probe of local geometry for
            a specific sample.
          </p>
          <p>
            In practice our implementation approximates <Math tex="\lambda_c" /> via the
            4-point Rademacher stencil (Hutchinson estimator in the update direction), which
            avoids any optimizer-state dependency and works for arbitrary input perturbations
            rather than parameter perturbations.
          </p>
        </Block>
      </PaperCard>

      <hr className="section-div" />

      {/* ── Paper 3 ── */}
      <PaperCard
        id="landscape-viz"
        arxiv="1712.09913"
        title="Visualizing the Loss Landscape of Neural Nets"
        authors="Li, Xu, Taylor, Studer, Goldstein (University of Maryland)"
        venue="NeurIPS 2018"
      >
        <Block label="What they did">
          <p>
            Earlier loss landscape plots were not comparable across architectures or training
            stages because the scale of weight perturbations is arbitrary relative to the
            weight norms. Li et al. introduced <strong>filter normalization</strong>: each
            perturbation vector <Math tex="\delta" /> is rescaled filter-by-filter so that
          </p>
          <Math display tex="\delta_{i,j} \leftarrow \frac{\delta_{i,j}}{\|\delta_{i,j}\|} \cdot \|\theta_{i,j}\|" />
          <p>
            where <Math tex="i" /> indexes a layer and <Math tex="j" /> a filter (or neuron).
            This makes the effective perturbation scale invariant to the magnitude of the
            weights, enabling apples-to-apples comparisons between different models.
          </p>
          <p>
            With this normalization, they show that residual connections dramatically flatten
            the loss landscape of image classification networks, explaining why ResNets train
            more reliably. They also produce 2D surface plots by sweeping two orthogonal
            normalized directions, revealing chaotic vs smooth landscape geometry.
          </p>
        </Block>

        <Block label="What we applied">
          <p>
            We followed their 2D surface visualization framework — two orthogonal random
            directions, grid sweep, contour / surface plot — to visualize the loss landscape
            of Pythia models on MIMIR sequences. The plots appear in:
          </p>
          <p>
            <code>reports/report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/</code>
          </p>
          <p>
            Specifically, <code>loss_landscape_member0.png</code> and{' '}
            <code>surface_curvature_member0.png</code> use the two-direction grid sweep from
            Li et al. to compare how member and non-member sequences sit in the embedding-space
            loss surface. Filter normalization was adapted to the embedding matrix: each token
            embedding vector is normalized relative to the corresponding row norm of the
            embedding table.
          </p>
        </Block>
      </PaperCard>
    </article>
  )
}
