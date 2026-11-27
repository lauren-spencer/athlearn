import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { Keyframe, Play, PlayerSpec, Pt, Scene, Tone } from '../types'
import { resolveArt } from '../content/art'
import { BallMark, CallMark, SURFACE_BG, Surface, type View } from './Surfaces'

export const W = 360
export const H = 210

const TONE: Record<Tone, string> = {
  flag: '#FFC531',
  ink: '#F2F4F8',
  bad: '#FF5A5F',
  good: '#2BD07F',
}

/* ---------- Field ---------- */

function ZoomField({ endzone }: { endzone?: Scene['endzone'] }) {
  const lines = [0, 35, 70, 105, 140, 175, 210]
  const ticks: number[] = []
  for (let y = 7; y < H; y += 7) if (y % 35) ticks.push(y)
  const ez = endzone === 'bottom' ? 'bottom' : endzone ? 'top' : null
  const top = ez === 'bottom' ? 175 : 0
  const goal = ez === 'bottom' ? 175 : ez === 'top' ? 35 : -1
  return (
    <g>
      {ez && (
        <g>
          <defs>
            <pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#F2F4F8" strokeOpacity="0.08" strokeWidth="4" />
            </pattern>
          </defs>
          <rect x="0" y={top} width={W} height="35" fill="url(#hatch)" />
          <text x={W / 2} y={top + 23} textAnchor="middle" className="font-label" fontSize="12" fontWeight="700" letterSpacing="3" fill="#F2F4F8" fillOpacity="0.35">
            END ZONE
          </text>
        </g>
      )}
      {lines.map((y) => (
        <line key={y} x1="0" x2={W} y1={y} y2={y} stroke="#F2F4F8" strokeOpacity={y === goal ? 0.55 : 0.14} strokeWidth={y === goal ? 2.5 : 1} />
      ))}
      {ticks.map((y) => (
        <g key={y} stroke="#F2F4F8" strokeOpacity="0.12">
          <line x1="147" x2="153" y1={y} y2={y} />
          <line x1="207" x2="213" y1={y} y2={y} />
        </g>
      ))}
    </g>
  )
}

function FullField() {
  const yards = Array.from({ length: 21 }, (_, i) => 30 + i * 15)
  return (
    <g>
      <rect x="0" y="0" width={W} height="25" fill="#000" fillOpacity="0.25" />
      <rect x="0" y="185" width={W} height="25" fill="#000" fillOpacity="0.25" />
      <rect x="0" y="25" width="30" height="160" fill="#F2F4F8" fillOpacity="0.05" />
      <rect x="330" y="25" width="30" height="160" fill="#F2F4F8" fillOpacity="0.05" />
      <line x1="0" x2={W} y1="25" y2="25" stroke="#F2F4F8" strokeOpacity="0.5" strokeWidth="2" />
      <line x1="0" x2={W} y1="185" y2="185" stroke="#F2F4F8" strokeOpacity="0.5" strokeWidth="2" />
      {yards.map((x, i) => (
        <line key={x} x1={x} x2={x} y1="25" y2="185" stroke="#F2F4F8" strokeOpacity={i === 0 || i === 20 ? 0.55 : i % 2 ? 0.07 : 0.16} strokeWidth={i === 0 || i === 20 ? 2 : 1} />
      ))}
      {[10, 20, 30, 40, 50, 40, 30, 20, 10].map((n, i) => (
        <text key={i} x={60 + i * 30} y="172" textAnchor="middle" fontSize="11" fontWeight="700" className="font-label" fill="#F2F4F8" fillOpacity="0.3">
          {n}
        </text>
      ))}
      {yards.slice(1, -1).map((x) => (
        <g key={x} stroke="#F2F4F8" strokeOpacity="0.15">
          <line x1={x} x2={x} y1="92" y2="97" />
          <line x1={x} x2={x} y1="113" y2="118" />
        </g>
      ))}
    </g>
  )
}

/* ---------- Marks ---------- */

function Player({ p }: { p: PlayerSpec }) {
  const r = p.size ?? 7
  const op = p.dim ? 0.4 : 1
  if (p.side === 'X') {
    const d = r * 0.85
    return (
      <g opacity={op} stroke="#FF5A5F" strokeWidth={r > 10 ? 4 : 2.6} strokeLinecap="round">
        <line x1={p.x - d} y1={p.y - d} x2={p.x + d} y2={p.y + d} />
        <line x1={p.x + d} y1={p.y - d} x2={p.x - d} y2={p.y + d} />
      </g>
    )
  }
  const filled = p.filled ?? p.label === 'QB'
  return (
    <g opacity={op}>
      <circle cx={p.x} cy={p.y} r={r} fill={filled ? '#F2F4F8' : 'var(--pb-bg)'} stroke="#F2F4F8" strokeWidth={r > 10 ? 4 : 2.4} />
      {p.label && r <= 10 && (
        <text x={p.x} y={p.y + r + 11} textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="1" className="font-label" fill="#F2F4F8" fillOpacity="0.75">
          {p.label}
        </text>
      )}
    </g>
  )
}

export function Tag({ x, y, text, tone = 'flag', opacity = 1 }: { x: number; y: number; text: string; tone?: Tone; opacity?: number }) {
  const label = text.toUpperCase()
  const w = label.length * 5.9 + 14
  const left = Math.min(Math.max(x - w / 2, 4), W - w - 4)
  return (
    <g opacity={opacity}>
      <rect x={left} y={y - 9} width={w} height="18" rx="3" fill="#0D1117" fillOpacity="0.9" stroke={TONE[tone]} strokeWidth="1.2" />
      <text x={left + w / 2} y={y + 3.5} textAnchor="middle" fontSize="10.5" fontWeight="700" letterSpacing="1.1" className="font-label" fill={TONE[tone]}>
        {label}
      </text>
    </g>
  )
}

function Arrow({ from, to, via, dashed, tone = 'flag', id }: { from: Pt; to: Pt; via?: Pt; dashed?: boolean; tone?: Tone; id: string }) {
  const d = via ? `M${from[0]},${from[1]} Q${via[0]},${via[1]} ${to[0]},${to[1]}` : `M${from[0]},${from[1]} L${to[0]},${to[1]}`
  return (
    <g>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={TONE[tone]} />
        </marker>
      </defs>
      <path d={d} fill="none" stroke={TONE[tone]} strokeWidth="2.2" strokeLinecap="round" strokeDasharray={dashed ? '5 5' : undefined} markerEnd={`url(#${id})`} />
    </g>
  )
}

function Ring({ x, y, r = 18, opacity = 1, scale = 1 }: { x: number; y: number; r?: number; opacity?: number; scale?: number }) {
  return <circle cx={x} cy={y} r={r * scale} fill="none" stroke="#FFC531" strokeWidth="2.6" opacity={opacity} />
}

function SceneLayer({ scene, uid }: { scene: Scene; uid: string }) {
  const view = scene.view ?? 'zoom'
  return (
    <g>
      {scene.zones?.map((z, i) => (
        <g key={i}>
          <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="4" fill={TONE[z.tone ?? 'flag']} fillOpacity="0.14" stroke={TONE[z.tone ?? 'flag']} strokeOpacity="0.7" strokeDasharray="4 3" />
          {z.label && <Tag x={z.x + z.w / 2} y={z.y + 12} text={z.label} tone={z.tone} />}
        </g>
      ))}
      {scene.los !== undefined && <line x1="0" x2={W} y1={scene.los} y2={scene.los} stroke="#F2F4F8" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="6 5" />}
      {scene.lineToGain !== undefined && <line x1="0" x2={W} y1={scene.lineToGain} y2={scene.lineToGain} stroke="#FFC531" strokeWidth="2.2" />}
      {scene.arrows?.map((a, i) => <Arrow key={i} {...a} id={`${uid}-a${i}`} />)}
      {scene.players?.map((p, i) => <Player key={i} p={p} />)}
      {scene.ball && <BallMark view={view} x={scene.ball[0]} y={scene.ball[1]} />}
      {scene.rings?.map((r, i) => <Ring key={i} {...r} />)}
      {scene.flag && <CallMark view={view} x={scene.flag[0]} y={scene.flag[1]} />}
      {scene.tags?.map((t, i) => <Tag key={i} {...t} />)}
    </g>
  )
}

/* ---------- Static diagram ---------- */

let uidCounter = 0
function useUid() {
  const ref = useRef<string>()
  if (!ref.current) ref.current = `pb${++uidCounter}`
  return ref.current
}

function Frame({ view = 'zoom', endzone, children, className = '', title }: { view?: View; endzone?: Scene['endzone']; children: React.ReactNode; className?: string; title?: string }) {
  const bg = SURFACE_BG[view]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`block w-full rounded-xl ${className}`} style={{ background: bg, ['--pb-bg' as string]: bg }} role="img" aria-label={title ?? 'Play diagram'}>
      {view === 'zoom' ? <ZoomField endzone={endzone} /> : view === 'full' ? <FullField /> : <Surface view={view} />}
      {children}
    </svg>
  )
}

export function Playbook({ art, className, title }: { art: string | Scene; className?: string; title?: string }) {
  const scene = resolveArt(art)
  const uid = useUid()
  return (
    <Frame view={scene.view} endzone={scene.endzone} className={className} title={title}>
      <SceneLayer scene={scene} uid={uid} />
    </Frame>
  )
}

/* ---------- Keyframe player ---------- */

export function interp(path: Keyframe[], t: number): Pt {
  if (t <= path[0][0]) return [path[0][1], path[0][2]]
  for (let i = 1; i < path.length; i++) {
    const [t1, x1, y1] = path[i]
    if (t <= t1) {
      const [t0, x0, y0] = path[i - 1]
      const k = t1 === t0 ? 1 : (t - t0) / (t1 - t0)
      return [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k]
    }
  }
  const last = path[path.length - 1]
  return [last[1], last[2]]
}

function trailPoints(path: Keyframe[], t: number) {
  const pts = path.filter((k) => k[0] < t).map((k) => `${k[1]},${k[2]}`)
  const [x, y] = interp(path, t)
  return [...pts, `${x},${y}`].join(' ')
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

function tickClock(clock: string, t: number) {
  const m = clock.match(/(\d+):(\d{2})\s*$/)
  if (!m) return clock
  const total = Math.max(0, Number(m[1]) * 60 + Number(m[2]) - Math.floor(t))
  const next = `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
  return clock.slice(0, m.index) + next
}

export function usePlayback(duration: number) {
  const reduce = useReducedMotion()
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [watched, setWatched] = useState(false)
  const raf = useRef<number>()

  const stop = () => {
    if (raf.current) cancelAnimationFrame(raf.current)
  }
  useEffect(() => stop, [])

  const play = useCallback(() => {
    stop()
    if (reduce) {
      setT(duration)
      setWatched(true)
      return
    }
    setPlaying(true)
    const start = performance.now()
    const tick = (now: number) => {
      const next = Math.min(duration, (now - start) / 1000)
      setT(next)
      if (next < duration) raf.current = requestAnimationFrame(tick)
      else {
        setPlaying(false)
        setWatched(true)
      }
    }
    setT(0)
    raf.current = requestAnimationFrame(tick)
  }, [duration, reduce])

  return { t, playing, watched, play, setWatched }
}

export function PlayDiagram({ play, t }: { play: Play; t: number }) {
  const uid = useUid()
  const base = play.scene ? resolveArt(play.scene) : {}
  const pos = (id: string, at: number) => (play.actors[id] ? interp(play.actors[id].path, at) : ([W / 2, H / 2] as Pt))
  const tagEvents = play.events.filter((e) => e.tag)
  const ringEvent = play.events.find((e) => e.ring)
  const ringAt = ringEvent ? centroid(ringEvent.ring!.map((id) => pos(id, ringEvent.at))) : ([W / 2, H / 2] as Pt)

  return (
    <Frame view={base.view} endzone={base.endzone} title="Animated play">
      <SceneLayer scene={{ ...base, players: base.players?.map((p) => ({ ...p, dim: true })) }} uid={uid} />

      {Object.entries(play.actors).map(([id, a]) =>
        a.trail && t > a.path[0][0] ? (
          <polyline key={`${id}-trail`} points={trailPoints(a.path, t)} fill="none" stroke={a.side === 'X' ? '#FF5A5F' : '#F2F4F8'} strokeOpacity="0.7" strokeWidth="2" strokeDasharray="4 4" />
        ) : null,
      )}
      {Object.entries(play.actors).map(([id, a]) => {
        const [x, y] = interp(a.path, t)
        return <Player key={id} p={{ side: a.side, x, y, label: a.label }} />
      })}
      {play.ball && (() => {
        const [x, y] = interp(play.ball, t)
        return <BallMark view={base.view ?? 'zoom'} x={x} y={y} />
      })()}

      {play.events.map((e, i) => {
        if (e.ring && t >= e.at) {
          const k = clamp01((t - e.at) / 0.18)
          return <Ring key={i} x={ringAt[0]} y={ringAt[1]} r={20} opacity={k} scale={1.4 - 0.4 * k} />
        }
        if (e.flag && t >= e.at) {
          const k = clamp01((t - e.at) / 0.4)
          const fx = ringAt[0] + 26
          const fy = ringAt[1] + 10
          return <CallMark key={i} view={base.view ?? 'zoom'} x={fx} y={fy - (1 - k) * 60} opacity={Math.min(1, k * 3)} />
        }
        return null
      })}

      {play.clock && <Tag x={40} y={16} text={tickClock(play.clock, t)} tone="ink" />}
      {tagEvents.map((e, i) =>
        t >= e.at ? <Tag key={i} x={W - 52} y={H - 16 - (tagEvents.length - 1 - i) * 22} text={e.tag!} tone={e.tone ?? 'flag'} opacity={clamp01((t - e.at) / 0.15)} /> : null,
      )}
    </Frame>
  )
}

function centroid(pts: Pt[]): Pt {
  const n = pts.length || 1
  return [pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n]
}
