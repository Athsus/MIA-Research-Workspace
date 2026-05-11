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
      <h1 id="top">Sprint 3 · Ablation Study</h1>
      <p className="meta">Period: 2026-04-17</p>

      <Callout type="warn" title="⚠ Lesson Learned">
        This sprint spent excessive compute on a high-precision ablation using <code>float64</code> and 100 perturbations
        per sample — orders of magnitude beyond what was needed. The h-ablation below required only ~10 samples in float32
        to reach the same conclusions. <strong>Do not repeat this pattern.</strong>
      </Callout>

      <h2 id="image" className="section-anchor">Image Landscape (CIFAR-10)</h2>
      <p>
        As a sanity-check, we first visualized the loss landscape in pixel space for a ResNet trained on CIFAR-10.
        The 2D landscape is swept along two orthogonal directions (gradient <Math tex="\hat{g}" /> and a random
        direction <Math tex="\hat{d}" />) around the input.
        Cross-sections show that the loss is roughly parabolic along the gradient direction for members.
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

      <h2 id="llm" className="section-anchor">LLM Loss Landscape</h2>
      <p>
        The same analysis applied to <strong>pythia-1.4b-deduped</strong> in input-embedding space.
        For a member text from <code>github</code>, we sweep the loss along the gradient direction
        at five step sizes to find the numerically stable regime.
      </p>

      <h3>Step 1 — Define the embedding and gradient direction</h3>
      <p>
        Let <Math tex="e = E(x) \in \mathbb{R}^{T \times d}" /> be the input embeddings and
        <Math tex="L(e)" /> the mean cross-entropy loss. The unit gradient direction is:
      </p>
      <Math display tex="\hat{g} = \frac{\nabla_e L(e)}{\|\nabla_e L(e)\|}" />
      <Fig
        src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/diagrams/figure1_embedding_and_directions.png')}
        caption="Step 1: input-embedding space and the gradient direction ĝ"
        width="560px"
      />

      <h3>Step 2 — Place the α grid along ĝ</h3>
      <p>
        We sweep a scalar <Math tex="\alpha" /> over <Math tex="N" /> evenly-spaced points in <Math tex="[-h, +h]" />,
        step size <Math tex="\Delta = 2h/(N-1)" />:
      </p>
      <Math display tex="\alpha_k = -h + k\Delta, \quad k = 0, \ldots, N-1" />
      <Fig
        src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/diagrams/figure2_grid.png')}
        caption="Step 2: α grid along ĝ — the middle point k₀ = (N-1)/2 sits at α = 0"
        width="560px"
      />

      <h3>Step 3 — Evaluate loss at each point</h3>
      <p>
        For each grid point, shift the embeddings and run a forward pass:
      </p>
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

      <h3>Step 4 — Finite-difference derivatives</h3>
      <p>
        Central differences at the origin <Math tex="(k = k_0)" />:
      </p>
      <Math display tex="L'(0) \approx \frac{L_{k_0+1} - L_{k_0-1}}{2\Delta} = \|\nabla_e L\|" />
      <Math display tex="L''(0) \approx \frac{L_{k_0+1} - 2L_{k_0} + L_{k_0-1}}{\Delta^2} = \hat{g}^\top H_e\,\hat{g} = \lambda_c" />
      <Fig
        src={R('report_20260417_landscapes_n_h_ablation_pythia1d4B/llm_landscape/diagrams/figure4_landscape.png')}
        caption="Step 4: assembled 1D landscape with L, L′, L″ overlaid"
        width="560px"
      />

      <h3>Results — h ablation</h3>
      <p>
        Five step sizes tested: <Math tex="h \in \{10^{-7}, 10^{-6}, 10^{-5}, 5\times10^{-5}, 10^{-4}\}" />.
        Too small → float32 round-off dominates. Too large → truncation error.
        Optimal: <Math tex="h \approx 10^{-5}" />.
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

      <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Next: <a href="/sprint4">Sprint 4 →</a>
      </p>
    </article>
  )
}
