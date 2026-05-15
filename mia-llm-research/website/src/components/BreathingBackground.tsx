import { useEffect, useRef } from 'react'

interface Props {
  tileSize?: number
  gapRatio?: number
  wavelength?: number
  speed?: number
  loading?: boolean
  color?: [number, number, number]
  accentColor?: [number, number, number]
}

const N_BUCKETS = 14
const SKIP_THRESHOLD = 0.015

export default function BreathingBackground({
  tileSize = 16,
  gapRatio = 4,
  wavelength = 240,
  speed = 0.00042,
  loading = false,
  color = [255, 0, 196],
  accentColor = [80, 230, 255],
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Stash live tunables in refs so the RAF loop doesn't restart on parent re-render.
  const cfgRef = useRef({ tileSize, gapRatio, wavelength, speed, loading, color, accentColor })
  cfgRef.current = { tileSize, gapRatio, wavelength, speed, loading, color, accentColor }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const cnv: HTMLCanvasElement = canvas
    const ctxMaybe = cnv.getContext('2d', { alpha: true })
    if (!ctxMaybe) return
    const ctx: CanvasRenderingContext2D = ctxMaybe

    let raf = 0
    let stopped = false
    let W = 0
    let H = 0
    let dpr = 1

    // Reusable bucket buffers — grown on resize, not per frame
    let cap = 0
    const bucketX: Float32Array[] = []
    const bucketY: Float32Array[] = []
    const bucketH: Float32Array[] = []  // per-tile height level (0..1) for undulation
    const bucketLen: Int32Array = new Int32Array(N_BUCKETS)
    for (let i = 0; i < N_BUCKETS; i++) {
      bucketX.push(new Float32Array(0))
      bucketY.push(new Float32Array(0))
      bucketH.push(new Float32Array(0))
    }

    const readBgIsDark = () => {
      const cs = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
      const hex = /^#([0-9a-f]{6})$/i.exec(cs)
      if (!hex) return false
      const n = parseInt(hex[1], 16)
      const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
      return r + g + b < 384
    }
    let isDark = readBgIsDark()

    function ensureCapacity(needed: number) {
      if (needed <= cap) return
      cap = Math.ceil(needed * 1.25)
      for (let i = 0; i < N_BUCKETS; i++) {
        bucketX[i] = new Float32Array(cap)
        bucketY[i] = new Float32Array(cap)
        bucketH[i] = new Float32Array(cap)
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      W = window.innerWidth
      H = window.innerHeight
      cnv.width = Math.floor(W * dpr)
      cnv.height = Math.floor(H * dpr)
      cnv.style.width = W + 'px'
      cnv.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const ts = Math.max(2, cfgRef.current.tileSize)
      const cols = Math.ceil(W / ts) + 3
      const rows = Math.ceil(H / ts) + 3
      ensureCapacity(cols * rows)
    }
    resize()
    window.addEventListener('resize', resize)

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onTheme = () => { isDark = readBgIsDark() }
    mq.addEventListener('change', onTheme)

    // Visibility — pause RAF when tab hidden (huge battery / cpu win)
    let hidden = document.hidden
    const onVis = () => { hidden = document.hidden }
    document.addEventListener('visibilitychange', onVis)

    const start = performance.now()
    const TWO_PI = Math.PI * 2

    function draw(now: number) {
      if (stopped) return
      if (hidden) { raf = requestAnimationFrame(draw); return }

      const t = now - start
      const cfg = cfgRef.current
      const ts = Math.max(4, cfg.tileSize)
      // gapRatio: < 1 → fraction of tile, >= 1 → absolute pixels. Always clamped.
      const rawGap = cfg.gapRatio < 1 ? ts * cfg.gapRatio : cfg.gapRatio
      const gap = Math.min(ts - 2, Math.max(1, rawGap))
      const tw = ts - gap
      const halfTile = ts / 2

      ctx.clearRect(0, 0, W, H)

      // Extrusion direction (60° from horizontal toward lower-left).
      // Magnitude is per-bucket: cubes rise on wave peaks, flatten in troughs → undulation.
      const DIR_X = 0.5
      const DIR_Y = 0.866
      const maxDepth = Math.max(1.8, Math.min(gap - 0.4, tw * 0.55))
      const minDepth = Math.max(0.5, maxDepth * 0.15)
      const depthRange = maxDepth - minDepth
      const rim = Math.max(0.6, tw * 0.06)
      const seam = Math.max(0.8, tw * 0.07)

      const startRow = -1
      const endRow = Math.ceil(H / ts) + 1
      const startCol = -1
      const endCol = Math.ceil(W / ts) + 1

      const breathT = 0.5 + 0.5 * Math.sin(t * 0.00055)
      const loadBoost = cfg.loading ? 1 : 0
      const effSpeed = cfg.speed * (1 + loadBoost * 1.6)
      const effWavelength = cfg.wavelength * (1 - loadBoost * 0.25)
      const invWavelength = 1 / effWavelength
      const tSpeed = t * effSpeed
      // Independent height field — different direction (TL → BR), slower, longer wavelength.
      // Decouples physical undulation from the light ripple.
      const heightInvWavelength = 1 / (effWavelength * 1.7)
      const heightTSpeed = t * effSpeed * 0.45
      // Secondary wave for organic feel (cross-direction, prime-ish ratio)
      const heightInvWavelength2 = 1 / (effWavelength * 1.1)
      const heightTSpeed2 = t * effSpeed * 0.3

      // Outer wall fill — dimmer, falls off away from top face
      const sideBase = isDark ? 0.015 : 0.01
      const sidePeak = isDark ? 0.38 : 0.3
      // Inner seam — the lit edge where top face meets the wall (strongest convex cue)
      const seamBase = isDark ? 0.04 : 0.028
      const seamPeak = isDark ? 0.95 : 0.7
      // Cyan rim on TOP + RIGHT of top face — light strikes from upper-right
      const rimBase = isDark ? 0.03 : 0.018
      const rimPeak = isDark ? 0.7 : 0.52
      const outlineBase = isDark ? 0.012 : 0.008
      const outlinePeak = isDark ? 0.14 : 0.1

      for (let i = 0; i < N_BUCKETS; i++) bucketLen[i] = 0

      // Bucketing pass: classify tiles by intensity
      for (let r = startRow; r < endRow; r++) {
        const y = r * ts
        const cy = y + halfTile
        const rowPhaseY = (H - cy)
        const offsetX = ((r & 1) === 1) ? halfTile : 0

        for (let c = startCol; c < endCol; c++) {
          const x = c * ts + offsetX
          const cx = x + halfTile

          const phase = (cx + rowPhaseY) * invWavelength - tSpeed
          const wave = Math.sin(phase * TWO_PI)
          if (wave <= 0) continue
          const sharp = wave * wave * wave
          const intensity = sharp * 0.9 + breathT * 0.1 * wave
          if (intensity < SKIP_THRESHOLD) continue

          // Independent height field: two summed sines in different directions
          // → bricks rise and fall on their own schedule, not bound to the light
          const ph1 = (cx - cy) * heightInvWavelength - heightTSpeed
          const ph2 = (cx + cy * 0.6) * heightInvWavelength2 - heightTSpeed2
          const heightWave = Math.sin(ph1 * TWO_PI) * 0.6 + Math.sin(ph2 * TWO_PI) * 0.4
          // Normalize to 0..1 (combined amp = 1.0)
          const heightLevel = (heightWave + 1) * 0.5

          let b = (intensity * N_BUCKETS) | 0
          if (b >= N_BUCKETS) b = N_BUCKETS - 1
          const idx = bucketLen[b]
          bucketX[b][idx] = x
          bucketY[b][idx] = y
          bucketH[b][idx] = heightLevel
          bucketLen[b] = idx + 1
        }
      }

      const [R, G, B] = cfg.color
      const [aR, aG, aB] = cfg.accentColor

      // Inner seam strips — bright magenta along the cube's two upper-front edges
      const seamLeftW = seam
      const seamLeftH = tw
      const seamBottomY = tw - seam
      const seamBottomW = tw
      const seamBottomH = seam
      // Cyan rim on TOP + RIGHT of the top face (upper-right corner highlight)
      const rimTopW = tw - 0.4
      const rimTopH = rim
      const rimRightX = tw - rim
      const rimRightH = tw - 0.4
      const outRectW = tw
      const outRectH = tw

      // Per-bucket batched render
      for (let b = 0; b < N_BUCKETS; b++) {
        const len = bucketLen[b]
        if (len === 0) continue

        const intensity = (b + 0.5) / N_BUCKETS
        const sA = sideBase + intensity * (sidePeak - sideBase)
        const seamA = seamBase + intensity * (seamPeak - seamBase)
        const rA = rimBase + intensity * (rimPeak - rimBase)
        const outA = outlineBase + intensity * (outlinePeak - outlineBase)

        const xs = bucketX[b]
        const ys = bucketY[b]
        const hs = bucketH[b]

        // Side walls — two parallelograms extruded down-left at 60°.
        // LEFT wall  : (top-left of top face) → extruded → extruded-bot → (bot-left of top face)
        // BOTTOM wall: (bot-left of top face) → extruded-bot-left → extruded-bot-right → (bot-right of top face)
        // They share the cube's front-bottom-left edge — that's the protruding tip.
        ctx.fillStyle = `rgba(${R},${G},${B},${sA.toFixed(3)})`
        ctx.beginPath()
        for (let i = 0; i < len; i++) {
          const x = xs[i], y = ys[i]
          // Per-tile depth from independent height wave (smoothstep eased)
          const h = hs[i]
          const eh = h * h * (3 - 2 * h)
          const depth = minDepth + depthRange * eh
          const dx = depth * DIR_X
          const dy = depth * DIR_Y
          // LEFT wall
          ctx.moveTo(x, y)
          ctx.lineTo(x - dx, y + dy)
          ctx.lineTo(x - dx, y + tw + dy)
          ctx.lineTo(x, y + tw)
          ctx.closePath()
          // BOTTOM wall
          ctx.moveTo(x, y + tw)
          ctx.lineTo(x - dx, y + tw + dy)
          ctx.lineTo(x + tw - dx, y + tw + dy)
          ctx.lineTo(x + tw, y + tw)
          ctx.closePath()
        }
        ctx.fill()

        // Bright inner seam — the lit corner edges along top face's left & bottom sides
        ctx.fillStyle = `rgba(${R},${G},${B},${seamA.toFixed(3)})`
        for (let i = 0; i < len; i++) {
          const x = xs[i], y = ys[i]
          ctx.fillRect(x, y, seamLeftW, seamLeftH)
          ctx.fillRect(x, y + seamBottomY, seamBottomW, seamBottomH)
        }

        // Cyan rim along TOP + RIGHT of top face — upper-right corner specular
        ctx.fillStyle = `rgba(${aR},${aG},${aB},${rA.toFixed(3)})`
        for (let i = 0; i < len; i++) {
          const x = xs[i], y = ys[i]
          ctx.fillRect(x + 0.4, y + 0.3, rimTopW, rimTopH)
          ctx.fillRect(x + rimRightX, y + 0.4, rim, rimRightH)
        }

        // Top-face outline — single path, single stroke for whole bucket
        ctx.strokeStyle = `rgba(${R},${G},${B},${outA.toFixed(3)})`
        ctx.lineWidth = 1
        ctx.beginPath()
        for (let i = 0; i < len; i++) {
          ctx.rect(xs[i] + 0.5, ys[i] + 0.5, outRectW, outRectH)
        }
        ctx.stroke()
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      mq.removeEventListener('change', onTheme)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  )
}
