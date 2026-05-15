import Math from '../components/Math'

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

function Callout({ type, title, children }: { type: 'warn' | 'info' | 'find'; title: string; children: React.ReactNode }) {
  return (
    <div className={`callout ${type}`}>
      <strong>{title}</strong>
      {children}
    </div>
  )
}

function VariantCard({
  id,
  num,
  title,
  status,
  children,
}: {
  id: string
  num: string
  title: string
  status: 'planned' | 'running' | 'done' | 'shelved'
  children: React.ReactNode
}) {
  const statusColor = {
    planned: { bg: 'rgba(148,163,184,0.12)', fg: '#94a3b8', label: 'PLANNED' },
    running: { bg: 'rgba(59,130,246,0.12)', fg: '#3b82f6', label: 'RUNNING' },
    done: { bg: 'var(--accent-bg)', fg: 'var(--accent)', label: 'DONE' },
    shelved: { bg: 'rgba(245,158,11,0.10)', fg: '#f59e0b', label: 'SHELVED' },
  }[status]
  return (
    <section id={id} className="section-anchor" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {num}
        </span>
        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-h)', flex: 1 }}>
          {title}
        </h3>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: '0.7rem', fontWeight: 700,
          padding: '0.15em 0.5em', borderRadius: '3px',
          background: statusColor.bg, color: statusColor.fg, letterSpacing: '0.05em',
        }}>
          {statusColor.label}
        </span>
      </div>
      <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: '1rem', fontSize: '0.95rem' }}>
        {children}
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '0.6rem' }}>
      <span style={{
        display: 'inline-block', minWidth: '110px',
        fontFamily: 'var(--mono)', fontSize: '0.78rem',
        color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        {label}
      </span>
      <span>{children}</span>
    </div>
  )
}

export default function Sprint5() {
  return (
    <article className="report">
      <h1 id="top">Sprint 5 · Per-Token Curvature &amp; Signal Fusion</h1>
      <p className="meta">
        Period: 2026-05-07 → 2026-06-12 (planned) &nbsp;·&nbsp; Carry-over from{' '}
        <a href="/sprint4#summary">Sprint 4 open questions</a>
      </p>

      <Callout type="info" title="Scope">
        Sprint 4 produced a best curvature-only signal of <Math tex="\lambda_c = 0.641" /> AUROC on
        github, still well below the PETAL target of 0.83–0.88. Sprint 5 attacks the gap along three
        axes: (a) <strong>token-level resolution</strong> (Min-K% / TAG &amp; TAB filtering on
        per-token λ<sub>c</sub>), (b) <strong>dataset generality</strong> (pile_cc / dm where
        Sprint 4 signals collapsed to near-random), and (c) <strong>signal fusion</strong> (loss +
        λ<sub>c</sub> + L9 norm via learned or hand-tuned combinations).
      </Callout>

      {/* TOC */}
      <div className="toc-tree">
        {/* Chapter Rail */}
        <div className="toc-chapter-rail">
          <a href="#thesis" className="toc-ch-card">
            <div className="toc-ch-badge">§0</div>
            <div className="toc-ch-title">Sprint 5 Thesis</div>
            <div className="toc-ch-summary">Direction matters more than magnitude · sequence-mean dilutes signal</div>
          </a>
          <a href="#ch1" className="toc-ch-card">
            <div className="toc-ch-badge">Chapter 1</div>
            <div className="toc-ch-title">Per-token λ<sub>c</sub> · Formalisation</div>
            <div className="toc-ch-summary">Min-K% pooling · 1.4b f64 done (top-10% 0.6640) · 160m × 3 running</div>
            <div className="toc-derives">↳ from Sprint 4 §2</div>
          </a>
          <a href="#ch2" className="toc-ch-card">
            <div className="toc-ch-badge">Chapter 2</div>
            <div className="toc-ch-title">Dataset Generality</div>
            <div className="toc-ch-summary">pile_cc / dm · direction-of-signal bootstrap</div>
            <div className="toc-derives">↳ from Ch1 cache</div>
          </a>
          <a href="#ch3" className="toc-ch-card">
            <div className="toc-ch-badge">Chapter 3</div>
            <div className="toc-ch-title">Signal Fusion</div>
            <div className="toc-ch-summary">linear · logistic stacker · PETAL residual λ<sub>c</sub></div>
            <div className="toc-derives">↳ from Ch1 + Sprint 4 §3</div>
          </a>
          <a href="#ch4" className="toc-ch-card">
            <div className="toc-ch-badge">Chapter 4</div>
            <div className="toc-ch-title">Mechanism Probes</div>
            <div className="toc-ch-summary">attn vs MLP at L9 · scale transfer 160m → 1.4b → 2.8b</div>
            <div className="toc-derives">↳ from Sprint 4 §3 + Ch1</div>
          </a>
          <a href="#scoreboard" className="toc-ch-card">
            <div className="toc-ch-badge">Scoreboard</div>
            <div className="toc-ch-title">Live Tracker</div>
            <div className="toc-ch-summary">target gap to PETAL 0.83–0.88 · decision gate at AUROC 0.72</div>
          </a>
        </div>

        {/* Ch1 sub-items — left: derivation / right: experiments */}
        <div className="toc-section-block">
          <div className="toc-block-label">Ch1 · Per-token λ<sub>c</sub></div>
          <div className="toc-sub-grid">
            <div className="toc-sub-col">
              <TocNode href="#a-idea"    num="§1.1" title="Idea &amp; Inspiration"
                summary="Sequence-mean dilutes signal — Min-K%++ / TAG&amp;TAB precedent on loss" />
              <TocNode href="#a-decomp"  num="§1.2" title="Per-token Decomposition"
                summary={<>Why it works: <Math tex="L = \sum_t L_t / (T{-}1)" />, gradients separable</>}
                from="§1.1" />
              <TocNode href="#a-def"     num="§1.3" title="Per-token Critical Sharpness"
                summary={<><Math tex="\lambda_c^{(t)} = 2/\eta_c^{(t)}" /> via per-token bisection</>}
                from="§1.2" />
              <TocNode href="#a-compute" num="§1.4" title="Computation Pipeline (v3)"
                summary="Phase 1 batched Jacobian · Phase 2 batched diagonal forward"
                from="§1.3" />
            </div>
            <div className="toc-sub-col">
              <TocNode href="#a-pool"    num="§1.5" title="Pooling Strategies"
                summary="mean · median · sat-rate · top-K% · bottom-K%"
                from="§1.3 per-token vector" />
              <TocNode href="#a-setup"   num="§1.6" title="Setups &amp; Hyper-parameters"
                summary="1.4b f64 done · 160m × 3 f32 running · 1.4b × 2 deferred"
                from="§1.4" />
              <TocNode href="#a-results" num="§1.7" title="Results (prelim + placeholder)"
                summary="github · 1.4b: top-10% 0.6640 (higher = non-mem) · others TBD"
                from="§1.5 + §1.6" />
            </div>
          </div>
        </div>

        {/* Ch2 sub-items */}
        <div className="toc-section-block">
          <div className="toc-block-label">Ch2 · Dataset Generality</div>
          <div className="toc-sub-grid">
            <div className="toc-sub-col">
              <TocNode href="#v-b1" num="§2.1" title="Per-token λ_c on pile_cc / dm"
                summary="Test whether token-level resolution recovers Sprint 4 collapse"
                from="Ch1 pipeline" />
              <TocNode href="#v-b2" num="§2.2" title="Layer-probe sweep beyond github"
                summary="L9 norm_max generality — extend to 1.4b &amp; other datasets" />
            </div>
            <div className="toc-sub-col">
              <TocNode href="#v-b3" num="§2.3" title="Direction-of-signal diagnostic"
                summary="Bootstrap AUROC sign — confirm/refute Sprint 4 vs §1.7 reversal"
                from="§1.7 reversal" />
            </div>
          </div>
        </div>

        {/* Ch3 sub-items */}
        <div className="toc-section-block">
          <div className="toc-block-label">Ch3 · Signal Fusion</div>
          <div className="toc-sub-grid">
            <div className="toc-sub-col">
              <TocNode href="#v-c1" num="§3.1" title="Hand-tuned linear combination"
                summary={<><Math tex="w_1\,\mathrm{loss} + w_2\,\lambda_c + w_3\,\mathrm{norm\_max}" /></>}
                from="§1.7 + Sprint 4 §3" />
              <TocNode href="#v-c2" num="§3.2" title="Logistic-regression stacker"
                summary="Shadow-model supervised weights · transfer to target"
                from="§3.1" />
            </div>
            <div className="toc-sub-col">
              <TocNode href="#v-c3" num="§3.3" title="PETAL + λ_c residual signal"
                summary="Is λ_c orthogonal to PETAL? Most informative single experiment."
                from="§1.7 + PETAL baseline" />
            </div>
          </div>
        </div>

        {/* Ch4 + Scoreboard */}
        <div className="toc-sub-grid">
          <div>
            <div className="toc-block-label">Ch4 · Mechanism Probes</div>
            <TocNode href="#v-d1" num="§4.1" title="Attention vs MLP λ_c at L9"
              summary="Hook attn / MLP / residual separately — locate signal source"
              from="Sprint 4 §3" />
            <TocNode href="#v-d2" num="§4.2" title="Scale transfer 160m → 1.4b → 2.8b"
              summary="Is curvature MIA monotone with scale? Decision rule for the program."
              from="§1.7 setups" />
          </div>
          <div>
            <div className="toc-block-label">Scoreboard</div>
            <TocNode href="#scoreboard" num="Live" title="AUROC tracker · decision gate"
              summary="Fill in as variants complete · pivot threshold at 0.72 on github" />
          </div>
        </div>
      </div>

      {/* ===================== THESIS ===================== */}
      <h2 id="thesis" className="section-anchor">§0 · Sprint 5 Thesis</h2>
      <p>
        Two facts from Sprint 4 drive Sprint 5:
      </p>
      <ol>
        <li>
          <strong>Direction matters more than magnitude.</strong>{' '}
          On github, λ<sub>c</sub> (directional curvature, gradient-aligned) beat λ<sub>max</sub>
          {' '}(0.641 vs 0.592). So a single scalar per sequence is leaving information on the
          table — token-level locality should help.
        </li>
        <li>
          <strong>Sequence-level scoring dilutes the signal.</strong>{' '}
          A 256-token sequence averages curvature over many uninformative tokens. Min-K%++ wins on
          loss-based MIA for exactly this reason; the same principle should apply to λ<sub>c</sub>.
        </li>
      </ol>
      <p>
        Hypothesis: <strong>top-K per-token λ<sub>c</sub></strong> (with K ≈ 10–20% of tokens, or
        a TAG &amp; TAB keyword mask) recovers a substantial portion of the PETAL gap on github
        and produces non-trivial AUROC on pile_cc / dm.
      </p>

      <hr className="section-div" />

      {/* ===================== CH1 ===================== */}
      <h2 id="ch1" className="section-anchor">Chapter 1 · Per-token λ<sub>c</sub> · Formalisation &amp; Min-K% Pooling</h2>
      <p className="meta">
        Report: <code>report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta</code>{' '}
        · scripts <code>run_pertoken_lambda_c_v3.py</code>,{' '}
        <code>run_pertoken_lambda_c_sweep.py</code>,{' '}
        <code>post_pertoken_minkpct.py</code>
      </p>

      {/* ── 1.1 Idea ── */}
      <h3 id="a-idea" className="section-anchor">1.1 Idea &amp; Inspiration</h3>
      <p>
        Sprint 4 computed one scalar λ<sub>c</sub> per sequence by bisecting a single critical
        learning rate η<sub>c</sub> for the full-sequence loss. That scalar averages the curvature
        signal over every token in the sequence — most of which are uninformative function tokens
        or boilerplate. AUROC on github plateaued at <strong>0.641</strong>, far below the PETAL
        target band <strong>0.83–0.88</strong>.
      </p>
      <p>
        The MIA literature has a well-trodden remedy for exactly this dilution problem on the
        loss signal: <strong>Min-K%++</strong> (Shi et al. 2024) and <strong>TAG &amp; TAB</strong>{' '}
        (arXiv:2501.08454) drop sequence-wise averaging in favour of token-wise selection — keeping
        only the lowest-probability or most-informative tokens before pooling. The empirical lift
        on loss is consistently in the 5–10 AUROC-point range. We borrow exactly that idea and
        ask the analogous question for curvature:
      </p>
      <Callout type="info" title="Sprint 5 Chapter 1 question">
        Can we measure λ<sub>c</sub><sup>(t)</sup> <em>per token</em>, and does pooling the top-K%
        of those values (or masking by TAG &amp; TAB) recover the PETAL gap on github — and
        produce non-trivial signal on pile_cc / dm, where Sprint 4's sequence-level signal
        collapsed to near-random?
      </Callout>
      <p>
        Why this is plausible <em>a priori</em>:
      </p>
      <ul>
        <li>
          Per-token cross-entropy <Math tex="L_t" /> already decomposes the loss into
          independent token contributions. The gradient and Hessian-vector products do too.
          Nothing about the architecture requires us to scalarise before measuring curvature.
        </li>
        <li>
          Memorisation is a <em>local</em> phenomenon — typically concentrated on rare entities,
          identifiers, or surface forms — so the signal it generates in λ<sub>c</sub><sup>(t)</sup>
          should also be local. Averaging hides it.
        </li>
        <li>
          The cost is modest. Per-token bisection runs <em>in parallel</em> across all{' '}
          <Math tex="T-1" /> positions in one batched forward per η, so the total work is roughly
          the Sprint 4 cost times the batch dimension <Math tex="T" /> — not <Math tex="T^2" />.
        </li>
      </ul>

      {/* ── 1.2 Decomposition ── */}
      <h3 id="a-decomp" className="section-anchor">1.2 Per-token Decomposition — Why You <em>Can</em> Do This</h3>
      <p>
        Let <Math tex="x = (x_1,\dots,x_T)" /> be the token sequence, <Math tex="e = E(x) \in \mathbb{R}^{T\times d}" />{' '}
        its input embedding matrix, and <Math tex="\ell_t \in \mathbb{R}^V" /> the logits at
        position <Math tex="t" /> for predicting token <Math tex="x_{t+1}" />. The standard
        causal-LM training loss is the mean of per-token cross-entropy losses:
      </p>
      <Math display tex="L(e) = \frac{1}{T-1}\sum_{t=1}^{T-1} L_t(e), \qquad L_t(e) = \mathrm{CE}\!\big(\ell_t(e),\,x_{t+1}\big)" />
      <p>
        Two facts make per-token analysis well-defined:
      </p>
      <ol>
        <li>
          <strong>The summands are independent functions of <Math tex="e" />.</strong>{' '}
          <Math tex="L_t" /> depends on <Math tex="e" /> only through the forward pass that
          produces <Math tex="\ell_t" />. Its gradient is well-defined on its own; we don't need
          to "split" the model.
        </li>
        <li>
          <strong>Curvature is linear in the loss.</strong> The Hessian{' '}
          <Math tex="H_e[L] = \sum_t H_e[L_t] / (T-1)" /> is the average of per-token Hessians;
          directional sharpness inherits this linearity. So a per-token directional sharpness
          <Math tex="\hat g_t^\top H_e[L_t] \hat g_t" /> is a legitimate object, just one we
          haven't measured before.
        </li>
      </ol>
      <p>
        Define the unit per-token gradient direction:
      </p>
      <Math display tex="\hat g_t = \frac{\nabla_e L_t(e)}{\|\nabla_e L_t(e)\|_F}, \qquad J[t] := \nabla_e L_t(e) \in \mathbb{R}^{T\times d}" />
      <p>
        Note that <Math tex="J[t]" /> is generally <em>not</em> sparse on the <Math tex="t" />-th
        row — gradients flow through self-attention, so perturbing position <Math tex="t" />'s
        embedding also moves earlier positions' logits. But it is <em>localised</em>: the bulk
        of <Math tex="\|J[t]\|_F" /> sits at positions <Math tex="\leq t" /> (causal mask) and
        decays with distance.
      </p>

      {/* ── 1.3 λ_c definition ── */}
      <h3 id="a-def" className="section-anchor">1.3 Per-token Critical Sharpness — Definition</h3>
      <p>
        Following Kalra et al. (<a href="/papers#critical-sharpness">arXiv:2601.16979</a>), we
        define per-token critical sharpness as the gradient-aligned directional curvature,
        measured via the same one-shot bisection used in Sprint 4 — but applied independently
        at each position:
      </p>
      <Math display tex="\eta_c^{(t)} = \inf\!\big\{\eta > 0 \;\big|\; L_t\!\big(e - \eta\,J[t]\big) > L_t(e)\big\}" />
      <Math display tex="\lambda_c^{(t)} = \frac{2}{\eta_c^{(t)}}" />
      <p>
        Two-line reading: <Math tex="\eta_c^{(t)}" /> is the smallest learning rate that makes
        token <Math tex="t" />'s loss <em>increase</em> after one gradient-direction step;{' '}
        <Math tex="\lambda_c^{(t)}" /> is the corresponding effective curvature. Under a local
        quadratic approximation,
      </p>
      <Math display tex="\lambda_c^{(t)} \;=\; \frac{\hat g_t^\top H_e[L_t]\,\hat g_t}{\|\nabla_e L_t\|_F} \;=\; \mathrm{directional\ sharpness\ of\ } L_t \mathrm{\ along\ } \hat g_t" />
      <p>
        Sprint 4's signal <Math tex="\lambda_c" /> is exactly the same construction at the
        sequence level (one bisection on <Math tex="L" /> instead of <Math tex="T-1" /> bisections
        on <Math tex="L_1,\dots,L_{T-1}" />). The per-token version is a strict refinement: by
        construction, if we average <Math tex="\lambda_c^{(t)}" /> over <Math tex="t" /> we
        recover something close to (but not equal to) Sprint 4's scalar.
      </p>

      {/* ── 1.4 Computation pipeline ── */}
      <h3 id="a-compute" className="section-anchor">1.4 Computation Pipeline (v3 batched)</h3>
      <p>
        Naive implementation: <Math tex="T-1" /> independent gradient computations and{' '}
        <Math tex="T-1" /> independent bisections, each requiring ~6 forward passes — total cost{' '}
        <Math tex="O(T)" /> times Sprint 4. v3 fuses both phases into batched ops:
      </p>

      <h4>Phase 1 — Jacobian via batched backward</h4>
      <p>
        We need the full per-token gradient tensor{' '}
        <Math tex="J \in \mathbb{R}^{(T-1)\times T \times d}" />. Computing it as{' '}
        <Math tex="T-1" /> separate backward passes is wasteful. PyTorch's{' '}
        <code>is_grads_batched=True</code> lets us specify a stack of cotangent vectors and
        produce all gradients in a single backward graph traversal. We chunk along the token
        axis (<code>JACOBIAN_CHUNK</code>) to control activation memory:
      </p>
      <pre><code>{`# cotangent[k, t] = 1 iff k indexes the same token as t inside this chunk
cotangent = torch.zeros(chunk_size, T_minus_1, ...)
for k in range(chunk_size):
    cotangent[k, start + k] = 1.0

(g_chunk,) = torch.autograd.grad(
    per_token_ce, e,
    grad_outputs=cotangent,
    is_grads_batched=True,
)
# g_chunk: [chunk_size, 1, T, d] — chunk_size gradients in ONE backward`}</code></pre>
      <p>
        Cost: <Math tex="\lceil (T-1)/\text{JACOBIAN\_CHUNK}\rceil" /> backward passes per
        sample — <Math tex="\approx 16" /> backward passes for <Math tex="T=256" />.
      </p>

      <h4>Phase 2 — Per-token bisection in batched forward</h4>
      <p>
        For each token <Math tex="t" />, we maintain its own bracket{' '}
        <Math tex="[\eta_{\mathrm{lo}}^{(t)}, \eta_{\mathrm{hi}}^{(t)}]" /> on the binary search.
        At each iteration, all tokens probe their respective <Math tex="\eta_{\mathrm{mid}}" />{' '}
        in a single batched forward over the stacked perturbations:
      </p>
      <Math display tex="\tilde e_t = e - \eta_{\mathrm{mid}}^{(t)}\cdot J[t], \qquad \text{stack } \{\tilde e_t\}_{t=1}^{T-1} \in \mathbb{R}^{(T-1)\times T\times d}" />
      <pre><code>{`# batched_forward_diagonal:
# Run model on [chunk, T, d], read off CE only at the diagonal token t.
e_batch = e.expand(chunk, T, d) - etas.view(-1,1,1) * J[start:end]
logits = model(inputs_embeds=e_batch).logits[:, :-1, :]
L_t = F.cross_entropy(logits[idx, t_idx, :], labels[start:end], reduction="none")`}</code></pre>
      <p>
        We chunk along the token axis (<code>FORWARD_CHUNK</code>) for memory. The grid scan
        sweeps a log-spaced grid <code>ETA_GRID</code> to bracket the crossover; bisection
        refines for up to <code>BISECT_ITERS</code> rounds or until the relative bracket width
        falls below <code>BISECT_TOL</code>.
      </p>
      <p>
        Total cost per sample: roughly{' '}
        <Math tex="(\text{grid steps} + \text{bisect iters}) \times \lceil (T-1)/\text{FORWARD\_CHUNK}\rceil" />{' '}
        batched forwards — <Math tex="\approx 35 \times 8 = 280" /> chunked forwards for{' '}
        <Math tex="T=256" />.
      </p>

      <h4>Saturation handling</h4>
      <p>
        If the loss is monotonically <em>decreasing</em> across all probed η in{' '}
        <code>ETA_GRID</code>, no crossover is found and we set{' '}
        <Math tex="\eta_c^{(t)} = \min(\text{ETA\_GRID})" />, equivalently{' '}
        <Math tex="\lambda_c^{(t)} = 2/\min(\text{ETA\_GRID})" />. With{' '}
        <code>ETA_GRID</code> bottoming out at <Math tex="10^{-8}" />, the saturation cap on the
        observed sample matches the empirical maximum{' '}
        <Math tex="\hat\lambda_c^{\max} = 2.56\times 10^{8}" />. ~8% of tokens hit this cap on
        the 1.4b github cache; we treat them as "very large but finite" rather than censoring.
      </p>

      {/* ── 1.5 Pooling ── */}
      <h3 id="a-pool" className="section-anchor">1.5 Pooling Strategies</h3>
      <p>
        Given the per-token vector{' '}
        <Math tex="\boldsymbol\lambda(x) = (\lambda_c^{(1)},\dots,\lambda_c^{(T-1)})" /> for an
        input <Math tex="x" />, a pooling strategy is a map{' '}
        <Math tex="\pi : \mathbb{R}^{T-1}\to\mathbb{R}" /> that yields the per-sample MIA score.
        We compare five families:
      </p>
      <table>
        <thead>
          <tr><th>Pool</th><th>Definition</th><th>What it captures</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>mean</strong></td>
            <td><Math tex="\pi_{\mathrm{mean}} = \frac{1}{T-1}\sum_t \lambda_c^{(t)}" /></td>
            <td>Sprint 4 baseline (sequence-level signal recovered).</td>
          </tr>
          <tr>
            <td><strong>median</strong></td>
            <td><Math tex="\pi_{\mathrm{med}} = \mathrm{median}_t\, \lambda_c^{(t)}" /></td>
            <td>Robust to the saturated tail.</td>
          </tr>
          <tr>
            <td><strong>top-K%</strong></td>
            <td><Math tex="\pi_{\mathrm{top}\,K} = \frac{1}{|S_K|}\sum_{t\in S_K}\lambda_c^{(t)},\;S_K = \arg\!\text{top-K}_t\,\lambda_c^{(t)}" /></td>
            <td>Min-K%++-style; preserves only the highest-curvature tokens.</td>
          </tr>
          <tr>
            <td><strong>bottom-K%</strong></td>
            <td><Math tex="\pi_{\mathrm{bot}\,K} = \frac{1}{|S_K|}\sum_{t\in S_K}\lambda_c^{(t)},\;S_K = \arg\!\text{bot-K}_t\,\lambda_c^{(t)}" /></td>
            <td>Negative control — the body of the distribution.</td>
          </tr>
          <tr>
            <td><strong>sat-rate</strong></td>
            <td><Math tex="\pi_{\mathrm{sat}} = \frac{1}{T-1}\sum_t \mathbf{1}\!\left[\lambda_c^{(t)} \geq 0.99\,\hat\lambda_c^{\max}\right]" /></td>
            <td>Fraction of tokens at the saturation cap (essentially free — no bisection).</td>
          </tr>
        </tbody>
      </table>
      <p>
        AUROC is reported sign-invariantly — for each pool we report{' '}
        <Math tex="\max(\mathrm{AUROC}, 1-\mathrm{AUROC})" /> together with the score direction
        (higher = member vs higher = non-member), so that direction reversals are surfaced
        rather than hidden.
      </p>

      {/* ── 1.6 Setup table ── */}
      <h3 id="a-setup" className="section-anchor">1.6 Setups &amp; Hyper-parameters</h3>
      <p>
        Per the project naming convention, every cache / results / figures artifact is tagged{' '}
        <code>{`{subset}_{model}_{rev}`}</code>. Shared algorithm hyper-parameters (identical
        across all setups unless noted):
      </p>
      <table>
        <thead><tr><th>Hyper-parameter</th><th>Value</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>MAX_LENGTH</code></td><td>256</td><td>Token cap per sample (truncation).</td></tr>
          <tr><td><code>N_PER_LABEL</code></td><td>300</td><td>300 members + 300 non-members per subset.</td></tr>
          <tr><td><code>ETA_GRID</code></td><td><Math tex="\{10^{-x/2}\}_{x=16}^{-3}" /></td><td>Half-decade log-spaced grid from <Math tex="10^{-8}" /> to <Math tex="10^{1.5}" /> (20 points).</td></tr>
          <tr><td><code>BISECT_ITERS</code></td><td>15</td><td>Max bisection refinement iterations.</td></tr>
          <tr><td><code>BISECT_TOL</code></td><td><Math tex="10^{-4}" /></td><td>Stop when relative bracket width drops below this.</td></tr>
          <tr><td><code>JACOBIAN_CHUNK</code></td><td>16</td><td>Tokens per batched backward (Phase 1 memory).</td></tr>
          <tr><td><code>FORWARD_CHUNK</code></td><td>32</td><td>Tokens per batched forward (Phase 2 memory).</td></tr>
          <tr><td>Saturation cap <Math tex="\hat\lambda_c^{\max}" /></td><td><Math tex="2.56\times 10^8" /></td><td>Effective max from <code>ETA_GRID</code> floor — emergent, not enforced.</td></tr>
        </tbody>
      </table>

      <p>Per-setup parameters:</p>
      <table>
        <thead>
          <tr><th>Setup tag</th><th>Subset</th><th>Model</th><th>Rev</th><th>dtype</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr className="highlight-row">
            <td><code>github_pythia-1.4b-deduped_step143000</code></td>
            <td>github</td><td>pythia-1.4b-deduped</td><td>step143000</td>
            <td>float64</td><td>done (600 records)</td>
          </tr>
          <tr>
            <td><code>github_pythia-160m-deduped_step143000</code></td>
            <td>github</td><td>pythia-160m-deduped</td><td>step143000</td>
            <td>float32</td><td>running</td>
          </tr>
          <tr>
            <td><code>pile_cc_pythia-160m-deduped_step143000</code></td>
            <td>pile_cc</td><td>pythia-160m-deduped</td><td>step143000</td>
            <td>float32</td><td>queued</td>
          </tr>
          <tr>
            <td><code>dm_pythia-160m-deduped_step143000</code></td>
            <td>dm</td><td>pythia-160m-deduped</td><td>step143000</td>
            <td>float32</td><td>queued</td>
          </tr>
          <tr style={{ color: 'var(--text-muted)' }}>
            <td><code>pile_cc_pythia-1.4b-deduped_step143000</code></td>
            <td>pile_cc</td><td>pythia-1.4b-deduped</td><td>step143000</td>
            <td>—</td><td>deferred</td>
          </tr>
          <tr style={{ color: 'var(--text-muted)' }}>
            <td><code>dm_pythia-1.4b-deduped_step143000</code></td>
            <td>dm</td><td>pythia-1.4b-deduped</td><td>step143000</td>
            <td>—</td><td>deferred</td>
          </tr>
        </tbody>
      </table>

      <Callout type="warn" title="dtype caveat">
        The Sprint 4 / existing 1.4b cache uses <code>float64</code>. New 160m runs use{' '}
        <code>float32</code> for ~3–5× speedup; the v3 algorithm is mathematically identical, but
        the <Math tex="\eta_c" /> binary search becomes round-off-limited at very small η. The
        saturation cap is therefore reached <em>slightly</em> more often in float32. Cross-dtype
        comparisons should account for this — direction-of-signal conclusions are robust;
        absolute AUROC ±0.01 is not.
      </Callout>

      {/* ── 1.7 Results ── */}
      <h3 id="a-results" className="section-anchor">1.7 Results — Preliminary &amp; Placeholders</h3>
      <p>
        The 1.4b github cache (600 records, float64) was processed first to validate the pooling
        pipeline. The other four setups (160m × {'{'}github, pile_cc, dm{'}'}, and the deferred
        1.4b runs) currently show placeholders that will fill in as the launcher progresses.
      </p>

      <table>
        <thead>
          <tr>
            <th>Setup</th><th>mean</th><th>median</th><th>sat-rate</th>
            <th>top-5%</th><th>top-10%</th><th>top-20%</th>
            <th>Direction</th>
          </tr>
        </thead>
        <tbody>
          <tr className="highlight-row">
            <td>github · 1.4b · f64</td>
            <td>0.6621</td><td>0.6462</td><td>0.6595</td>
            <td>0.6029</td><td className="best">0.6640</td><td>0.6625</td>
            <td>higher = non-member</td>
          </tr>
          <tr><td>github · 160m · f32</td>
            <td>TBD</td><td>TBD</td><td>TBD</td>
            <td>TBD</td><td>TBD</td><td>TBD</td><td>TBD</td>
          </tr>
          <tr><td>pile_cc · 160m · f32</td>
            <td>TBD</td><td>TBD</td><td>TBD</td>
            <td>TBD</td><td>TBD</td><td>TBD</td><td>TBD</td>
          </tr>
          <tr><td>dm · 160m · f32</td>
            <td>TBD</td><td>TBD</td><td>TBD</td>
            <td>TBD</td><td>TBD</td><td>TBD</td><td>TBD</td>
          </tr>
          <tr style={{ color: 'var(--text-muted)' }}>
            <td>pile_cc · 1.4b · f64 (deferred)</td>
            <td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td>
          </tr>
          <tr style={{ color: 'var(--text-muted)' }}>
            <td>dm · 1.4b · f64 (deferred)</td>
            <td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td>
          </tr>
        </tbody>
      </table>

      <Callout type="find" title="Preliminary finding (1.4b github only)">
        Top-10% pool wins at AUROC 0.6640 — but the margin over the sequence-mean baseline (0.6621)
        is only +0.0019. Most of the signal is already captured by the mean.{' '}
        <strong>Direction reversal vs Sprint 4</strong>: per-token v3 says higher per-token
        λ<sub>c</sub> = non-member, while Sprint 4 sequence-level bisection found the opposite.
        Plausible (different gradient direction → different curvature object) but needs Sprint 5
        §2.3 (bootstrap direction-of-signal) to confirm. Detailed analysis &amp; figures:{' '}
        <a href="/sprint3#ch4">Sprint 3 · Chapter 4</a>.
      </Callout>

      <hr className="section-div" />

      {/* ===================== AXIS A LEGACY VARIANTS ===================== */}
      <h3 className="section-anchor">1.8 Downstream variants (carried over)</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Original variant cards from the planning draft. A1 is now formalised above; A2 and A3 remain
        the natural ablations once the four-setup cache lands.
      </p>

      <VariantCard id="v-a1" num="A1" title="Per-token λ_c v3 (fully batched)" status="running">
        <Field label="Goal">
          Compute λ<sub>c</sub> separately for every token position in a sequence, then ablate
          pooling strategies (mean / median / top-K / TAG&amp;TAB-masked) downstream.
        </Field>
        <Field label="Method">
          <Math tex="\lambda_c^{(t)} = 2 / \eta_c^{(t)}" />, where{' '}
          <Math tex="\eta_c^{(t)}" /> is the smallest learning rate causing token-t's loss to
          rise when the embedding is perturbed along the per-token gradient direction. Phase 1
          uses <code>is_grads_batched=True</code> for all T−1 gradients in one backward pass;
          phase 2 stacks <Math tex="[T-1, T, d]" /> perturbations for one forward per η.
        </Field>
        <Field label="Config">
          pythia-1.4b-deduped @ step143000, float64, github, target 300+300 samples,
          <code>ETA_GRID = [10^(-x/2) for x in range(16,-4,-1)]</code>, 15 bisection iterations,
          tol 1e-4.
        </Field>
        <Field label="Entry">
          <code>reports/report_20260422_142833_scalable_max_eigenvalue_signal_could_help_meta/run_pertoken_lambda_c_v3.py</code>
        </Field>
        <Field label="Output">
          <code>pertoken_lambda_c_v3.jsonl</code> — one record per sample with{' '}
          <code>{`{label, idx, lambda_c_per_token: [T-1]}`}</code>. Downstream variants reload this
          file rather than recomputing.
        </Field>
        <Field label="Status">
          v3 batching merged; full 300+300 run pending GPU time.
        </Field>
      </VariantCard>

      <VariantCard id="v-a2" num="A2" title="Min-K% pooling over per-token λ_c" status="planned">
        <Field label="Goal">
          Replace the sequence-mean with the average of the top-K per-token λ<sub>c</sub> values.
          Sweep K ∈ {'{'}5, 10, 20, 30, 50, 100{'}'}%.
        </Field>
        <Field label="Method">
          For each sequence with per-token vector <Math tex="\lambda_c^{(1)},\dots,\lambda_c^{(T-1)}" />,
          take top-K by magnitude and average:
          <Math display tex="s_K(x) = \frac{1}{|S_K|}\sum_{t \in S_K}\lambda_c^{(t)}, \quad S_K = \arg\text{top-K}_t \,\lambda_c^{(t)}" />
        </Field>
        <Field label="Hypothesis">
          AUROC peaks near K=10–20% (mirroring Min-K%++ on loss). At K=100% this collapses to
          the Sprint 4 sequence-mean baseline (0.641 on github).
        </Field>
        <Field label="Depends on">A1 output file.</Field>
      </VariantCard>

      <VariantCard id="v-a3" num="A3" title="TAG & TAB-masked per-token λ_c" status="planned">
        <Field label="Goal">
          Score only TAG&amp;TAB keyword tokens (low-frequency content words + NER spans) and
          ignore stopwords / function tokens.
        </Field>
        <Field label="Method">
          Apply <code>select_keywords_entropy_ner</code> mask from <code>src.llm_utils</code>, then
          average λ<sub>c</sub><sup>(t)</sup> over masked positions only.
        </Field>
        <Field label="Hypothesis">
          Comparable or slightly better than Min-K% on github (keywords ≈ high-curvature tokens
          by hand-tuned prior). Larger gain on pile_cc where the Min-K% magnitude selection may
          pick up noise.
        </Field>
        <Field label="Reference">
          Builds on{' '}
          <code>report_20260423_143405_scalable_max_eigenvalue_tag_tab_masked</code> (full-token
          λ<sub>c</sub> with TAG&amp;TAB filter; per-token version is new).
        </Field>
      </VariantCard>

      <hr className="section-div" />

      {/* ===================== CH2 ===================== */}
      <h2 id="ch2" className="section-anchor">Chapter 2 · Dataset Generality</h2>

      <VariantCard id="v-b1" num="B1" title="Per-token λ_c on pile_cc / dm" status="planned">
        <Field label="Goal">
          Rerun A1 + A2 + A3 on pile_cc and dm. Sprint 4 showed all sequence-level curvature
          signals collapse to near-random on these datasets — find out whether token-level
          resolution recovers signal.
        </Field>
        <Field label="Hypothesis">
          Per-token + Min-K% on dm: AUROC 0.55–0.65 (target). pile_cc remains hardest; expect
          only marginal lift.
        </Field>
        <Field label="Diagnostic">
          If still near-random, the bottleneck is <em>not</em> token aggregation — likely the
          embedding-space curvature itself does not carry membership info on these distributions,
          and the route forward is parameter-space (K-FAC, gradient norm) or output-space (rank,
          probability ratio) signals.
        </Field>
      </VariantCard>

      <VariantCard id="v-b2" num="B2" title="Layer-probe sweep on pile_cc / dm" status="planned">
        <Field label="Goal">
          Extend the Sprint 4 layer probe (norm_max @ L9 = 0.618 on github) to pile_cc / dm and
          to the 1.4b model.
        </Field>
        <Field label="Method">
          Forward-pass once, capture per-layer MLP output norm statistics (mean, max, std), score
          AUROC at each layer for each pooling.
        </Field>
        <Field label="Open Q">
          Does the "L9 peak" survive at 1.4b (more layers, different relative depth)? If yes,
          examine the corresponding relative-depth layer.
        </Field>
      </VariantCard>

      <VariantCard id="v-b3" num="B3" title="Direction-of-signal diagnostic" status="planned">
        <Field label="Goal">
          Sprint 4 found that on github, member has HIGHER λ<sub>c</sub>, but on dm, member has
          LOWER λ<sub>c</sub>. Determine whether this reversal is statistically robust or sample-noise.
        </Field>
        <Field label="Method">
          Bootstrap 1000+ subsamples of 50+50 from each dataset, plot histogram of AUROC-with-sign
          across resamples. If &gt;95% land on one side, reversal is real.
        </Field>
        <Field label="Implication">
          A real reversal kills any universal classifier and forces per-dataset calibration —
          which is expensive and undermines the practical story. We need to know.
        </Field>
      </VariantCard>

      <hr className="section-div" />

      {/* ===================== CH3 ===================== */}
      <h2 id="ch3" className="section-anchor">Chapter 3 · Signal Fusion</h2>

      <VariantCard id="v-c1" num="C1" title="Hand-tuned linear combination" status="planned">
        <Field label="Goal">
          Find weights <Math tex="w_1, w_2, w_3" /> in{' '}
          <Math tex="s(x) = w_1\,\text{loss}(x) + w_2\,\lambda_c(x) + w_3\,\text{norm\_max}_{L9}(x)" />
          {' '}that beats any single signal.
        </Field>
        <Field label="Method">
          Standardize each signal (z-score on calibration set, e.g. wikitext). Sweep weights on
          simplex with grid step 0.1. Evaluate AUROC.
        </Field>
        <Field label="Note">
          Sprint 4 already ruled out{' '}
          <strong>multiplicative</strong> products (ch2-product). Sums on standardized signals
          are different — they don't penalize zero-magnitude in any one component.
        </Field>
      </VariantCard>

      <VariantCard id="v-c2" num="C2" title="Logistic-regression stacker" status="planned">
        <Field label="Goal">
          Same idea as C1 but with learned weights via shadow-model supervision.
        </Field>
        <Field label="Method">
          Train logistic regression on shadow-model member/non-member labels using features:
          loss, λ<sub>c</sub>, λ<sub>max</sub>, neg_rank, self_sim, norm_max@L9. Apply learned
          weights to target model. Report AUROC.
        </Field>
        <Field label="Risk">
          Shadow → target transfer is the well-known hard part. Expect overfit unless shadow data
          mirrors target distribution closely.
        </Field>
      </VariantCard>

      <VariantCard id="v-c3" num="C3" title="PETAL + λ_c residual signal" status="planned">
        <Field label="Goal">
          Test whether λ<sub>c</sub> adds anything <em>conditional on</em> PETAL — i.e. is the
          curvature signal redundant with PETAL or complementary?
        </Field>
        <Field label="Method">
          Regress λ<sub>c</sub> on PETAL, take residual. Score AUROC of residual. If &gt; 0.55,
          λ<sub>c</sub> carries orthogonal information and a stacker can improve over PETAL alone.
        </Field>
        <Field label="Why it matters">
          This is the most informative single experiment in Sprint 5. A negative result (residual
          AUROC ≈ 0.5) means the entire curvature program is subsumed by PETAL on github and we
          should redirect.
        </Field>
      </VariantCard>

      <hr className="section-div" />

      {/* ===================== CH4 ===================== */}
      <h2 id="ch4" className="section-anchor">Chapter 4 · Mechanism Probes</h2>

      <VariantCard id="v-d1" num="D1" title="Attention vs MLP λ_c at L9" status="planned">
        <Field label="Goal">
          Sprint 4 found norm_max @ L9 (MLP output) gives 0.618. Is the signal in the MLP, in
          attention output, or in the residual sum?
        </Field>
        <Field label="Method">
          Hook L9 attention output, MLP output, and residual stream separately. Compute norm_max
          on each. Compare AUROCs.
        </Field>
      </VariantCard>

      <VariantCard id="v-d2" num="D2" title="Scale transfer 160m → 1.4b → 2.8b" status="planned">
        <Field label="Goal">
          Sprint 4 saw λ<sub>c</sub> degrade slightly with scale (0.641 → 0.602). Is this a
          monotonic trend, a calibration issue, or random?
        </Field>
        <Field label="Method">
          Run the best Sprint 5 pipeline (likely A2 or A3) on pythia-160m, pythia-1.4b,
          pythia-2.8b on a common 200+200 github subset. Report AUROC and η<sub>c</sub>
          distribution per model.
        </Field>
        <Field label="Decision rule">
          Monotonic decay → curvature MIA does not scale to frontier-size models, redirect.
          Flat or noisy → continue.
        </Field>
      </VariantCard>

      <hr className="section-div" />

      {/* ===================== SCOREBOARD ===================== */}
      <h2 id="scoreboard" className="section-anchor">Scoreboard</h2>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Live target tracker — fill in as variants complete. Baselines from Sprint 4 shown in grey.
      </p>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Variant</th><th>github</th><th>pile_cc</th><th>dm</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ color: 'var(--text-muted)' }}>
            <td>—</td><td>loss (Sprint 4 baseline)</td><td>0.670</td><td>~0.51</td><td>~0.53</td><td>baseline</td>
          </tr>
          <tr style={{ color: 'var(--text-muted)' }}>
            <td>—</td><td>λ<sub>c</sub> global (Sprint 4)</td><td>0.641</td><td>~0.50</td><td>~0.49</td><td>baseline</td>
          </tr>
          <tr style={{ color: 'var(--text-muted)' }}>
            <td>—</td><td>PETAL (target)</td><td>0.83–0.88</td><td>0.54–0.55</td><td>0.92–0.96</td><td>target</td>
          </tr>
          <tr><td>A2</td><td>per-token λ<sub>c</sub> Min-K%</td><td>TBD</td><td>TBD</td><td>TBD</td><td>planned</td></tr>
          <tr><td>A3</td><td>per-token λ<sub>c</sub> TAG&amp;TAB</td><td>TBD</td><td>TBD</td><td>TBD</td><td>planned</td></tr>
          <tr><td>B2</td><td>layer norm_max @ best L</td><td>0.618 (L9)</td><td>TBD</td><td>TBD</td><td>partial</td></tr>
          <tr><td>C1</td><td>hand-tuned linear fusion</td><td>TBD</td><td>TBD</td><td>TBD</td><td>planned</td></tr>
          <tr><td>C2</td><td>logistic stacker</td><td>TBD</td><td>TBD</td><td>TBD</td><td>planned</td></tr>
          <tr><td>C3</td><td>PETAL residual λ<sub>c</sub></td><td>TBD</td><td>TBD</td><td>TBD</td><td>planned</td></tr>
        </tbody>
      </table>

      <Callout type="warn" title="Decision gate at end of sprint">
        If after A1–A3 + C3 the best AUROC on github is still &lt; 0.72 (within striking distance
        of PETAL), the curvature program does not have a path to SOTA on its own and we pivot to
        fusion / orthogonality results as the main contribution.
      </Callout>

      <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Last updated: 2026-05-14 &nbsp;·&nbsp;
        <a href="https://github.com/Athsus/Membership-Inference-Attack-Ao" target="_blank" rel="noreferrer">GitHub ↗</a>
      </p>
    </article>
  )
}
