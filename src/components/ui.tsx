import { Fragment } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { LevelOrNone } from '../types'

/* ---------- Icons ---------- */

const icon = (d: React.ReactNode) =>
  function Icon({ className = 'h-5 w-5' }: { className?: string }) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {d}
      </svg>
    )
  }

export const Icons = {
  close: icon(<path d="M6 6l12 12M18 6L6 18" />),
  back: icon(<path d="M15 5l-7 7 7 7" />),
  chevron: icon(<path d="M6 9l6 6 6-6" />),
  lock: icon(
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </>,
  ),
  search: icon(
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.5-4.5" />
    </>,
  ),
  play: icon(<path d="M7 5l12 7-12 7z" fill="currentColor" />),
  replay: icon(
    <>
      <path d="M4 12a8 8 0 108-8H8" />
      <path d="M10 1L7 4l3 3" />
    </>,
  ),
  learn: icon(
    <>
      <circle cx="7" cy="8" r="3" />
      <path d="M14 6l5 5M19 6l-5 5M5 18c4 0 9-2 13-6" />
    </>,
  ),
  rulebook: icon(
    <>
      <path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3z" />
      <path d="M5 17a3 3 0 013-3h11" />
    </>,
  ),
  practice: icon(
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </>,
  ),
  profile: icon(
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
    </>,
  ),
  plus: icon(<path d="M12 5v14M5 12h14" />),
  check: icon(<path d="M5 12l5 5 9-10" />),
}

/* ---------- Text ---------- */

/** Renders ==phrase== with a yellow underline. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/==(.+?)==/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 ? (
          <span key={i} className="key font-semibold text-ink">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}

/* ---------- Mastery ---------- */

const SQUARE: Record<LevelOrNone, string> = {
  none: 'border border-line-2',
  attempted: 'border border-dashed border-muted',
  familiar: 'bg-familiar',
  proficient: 'bg-proficient',
  mastered: 'bg-mastered',
}

export function MasterySquare({ level, current, size = 18 }: { level: LevelOrNone; current?: boolean; size?: number }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-[4px] ${SQUARE[level]} ${current ? 'outline outline-2 outline-offset-2 outline-flag' : ''}`}
      style={{ width: size, height: size }}
      aria-hidden
    />
  )
}

/* ---------- Scoreboard ---------- */

export function Scoreboard({ cells, header, compact }: { cells: { label: string; value: React.ReactNode }[]; header?: string; compact?: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-[#0A0E14]">
      {header && <div className="border-b border-line bg-panel py-1.5 text-center font-label text-[12px] font-bold uppercase tracking-[0.3em] text-flag">{header}</div>}
      <div className="grid divide-x divide-line" style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}>
        {cells.map((c) => (
          <div key={c.label} className={`text-center ${compact ? 'px-2.5 py-1' : 'px-2 py-3'}`}>
            <div className={`font-display font-black tabular-nums leading-none text-ink ${compact ? 'text-[18px]' : 'text-[34px]'}`}>{c.value}</div>
            <div className={`font-label font-bold uppercase tracking-label text-muted ${compact ? 'mt-0.5 text-[9px]' : 'mt-1.5 text-[11px]'}`}>{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Bits ---------- */

export function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-line-2 px-2.5 py-0.5 font-label text-[12px] font-bold uppercase tracking-label text-muted">{children}</span>
}

export function Segments({ states }: { states: ('todo' | 'current' | 'done' | 'good' | 'bad')[] }) {
  const color = { todo: 'bg-line', current: 'bg-flag', done: 'bg-ink/70', good: 'bg-good', bad: 'bg-bad' }
  return (
    <div className="flex gap-1" role="progressbar" aria-valuemin={0} aria-valuemax={states.length} aria-valuenow={states.filter((s) => s !== 'todo').length}>
      {states.map((s, i) => (
        <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${color[s]}`} />
      ))}
    </div>
  )
}

export function Modal({ open, title, body, actions, onClose }: { open: boolean; title: string; body?: string; actions: React.ReactNode; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="absolute inset-0 z-50 flex items-end bg-black/60 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={onClose}>
          <motion.div
            role="dialog"
            aria-modal
            aria-label={title}
            className="w-full rounded-2xl border border-line bg-panel p-5"
            initial={{ y: 24 }}
            animate={{ y: 0 }}
            exit={{ y: 24 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="title text-[30px]">{title}</h2>
            {body && <p className="mt-2 text-[15px] text-muted">{body}</p>}
            <div className="mt-5 grid gap-2">{actions}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-1.5 font-display text-[22px] font-black lowercase leading-none tracking-tight">
      <span className="inline-block h-3 w-3 -skew-x-12 rounded-[2px] bg-flag" aria-hidden />
      athlearn
    </span>
  )
}

export function ScreenHeader({ eyebrow, title, right }: { eyebrow?: string; title: string; right?: React.ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-3 px-5 pb-4 pt-6">
      <div>
        {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
        <h1 className="title text-[40px]">{title}</h1>
      </div>
      {right}
    </header>
  )
}

export const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`
export const fmtNum = (n: number) => n.toLocaleString('en-US')
