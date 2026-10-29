import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { getLesson } from '../content'
import type { CardStep, PlayStep } from '../types'
import { PlayDiagram, Playbook } from './Playbook'
import { Icons, MasterySquare, RichText, Scoreboard } from './ui'

/**
 * Self-running tour of the core loop for first-time visitors: a card, a play, the call, mastery.
 * Built from the real Holding lesson so it never drifts from the app. Tap to skip ahead.
 */

const lesson = getLesson('holding')!
const card = lesson.steps.find((s) => s.type === 'card' && s.art === 'grab') as CardStep
const play = lesson.steps.find((s) => s.type === 'play') as PlayStep
const unit = ['false-start', 'holding', 'roughing'].map((id) => getLesson(id)!)

const SCENES = [
  { caption: 'Learn one rule at a time', sub: 'Six quick cards, a few minutes a lesson', ms: 4200 },
  { caption: 'Watch a real play', sub: 'Every lesson ends on the field', ms: (play.play.duration + 1.4) * 1000 },
  { caption: 'Make the call', sub: "You're the ref. Right or wrong, you learn why.", ms: 4800 },
  { caption: 'Level up as you go', sub: 'Mastery, streaks and points on every lesson', ms: 4200 },
]

export function Demo() {
  const reduce = useReducedMotion()
  const [scene, setScene] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [paused, setPaused] = useState(!!reduce)
  const last = useRef<number>()

  useEffect(() => {
    if (paused) return
    let raf = 0
    last.current = undefined
    const tick = (now: number) => {
      const dt = last.current === undefined ? 0 : Math.min(now - last.current, 100)
      last.current = now
      setElapsed((e) => e + dt)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [paused])

  useEffect(() => {
    if (elapsed >= SCENES[scene].ms) next()
  })

  function next() {
    setScene((s) => (s + 1) % SCENES.length)
    setElapsed(0)
  }

  // With reduced motion, each scene shows its finished state and the viewer taps through.
  const t = paused && reduce ? Infinity : elapsed

  return (
    <section aria-label="App preview" className="select-none">
      <div className="relative">
        <button onClick={next} className="block w-full overflow-hidden rounded-2xl border border-line bg-panel text-left" aria-label="Next preview">
          <div className="flex gap-1 py-1 pl-3 pr-11 pt-3">
            {SCENES.map((s, i) => (
              <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                <span className="block h-full bg-flag" style={{ width: i < scene ? '100%' : i > scene ? '0%' : `${Math.min(100, (elapsed / s.ms) * 100)}%` }} />
              </span>
            ))}
          </div>
          <div className="relative h-[330px]" aria-hidden>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={scene} className="absolute inset-0 px-4 pt-3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                {scene === 0 && <CardScene />}
                {scene === 1 && <PlayScene t={t} />}
                {scene === 2 && <CallScene t={t} />}
                {scene === 3 && <MasteryScene t={t} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </button>
        <button
          onClick={() => setPaused((p) => !p)}
          className="absolute right-2 top-1.5 grid h-8 w-8 place-items-center rounded-full bg-app/80 text-muted hover:text-ink"
          aria-label={paused ? 'Play preview' : 'Pause preview'}
        >
          {paused ? <Icons.play className="h-3.5 w-3.5" /> : <Icons.pause className="h-4 w-4" />}
        </button>
      </div>
      <div className="mt-3 flex items-baseline gap-2.5" aria-live="polite">
        <span className="font-display text-[22px] font-black leading-none text-flag">{scene + 1}</span>
        <div>
          <div className="font-label text-[17px] font-bold uppercase leading-tight tracking-[0.06em]">{SCENES[scene].caption}</div>
          <div className="text-[14px] text-muted">{SCENES[scene].sub}</div>
        </div>
      </div>
    </section>
  )
}

function CardScene() {
  return (
    <>
      <div className="eyebrow text-[11px] text-flag">Lesson · {lesson.title}</div>
      <div className="title mt-0.5 text-[26px]">{card.title}</div>
      <Playbook art={card.art} className="mt-3" />
      <p className="mt-3 line-clamp-3 text-[13px] leading-snug text-ink/90">
        <RichText text={card.body} />
      </p>
    </>
  )
}

function PlayScene({ t }: { t: number }) {
  return (
    <>
      <div className="eyebrow text-[11px] text-flag">Make the call</div>
      <div className="title mt-0.5 text-[24px]">{play.prompt}</div>
      <div className="mt-3">
        <PlayDiagram play={play.play} t={Math.min(play.play.duration, Math.max(0, t / 1000 - 0.3))} />
      </div>
    </>
  )
}

function CallScene({ t }: { t: number }) {
  const picked = t > 900
  const revealed = t > 1900
  return (
    <>
      <div className="title text-[20px]">{play.prompt}</div>
      <div className="mt-2.5 grid gap-1.5">
        {play.options.map((opt, i) => {
          const right = i === play.answer
          const style = revealed ? (right ? 'border-good bg-good/10' : 'border-line opacity-50') : picked && right ? 'border-flag bg-panel-2' : 'border-line'
          return (
            <div key={i} className={`flex items-center gap-2 rounded-lg border-2 px-2.5 py-1.5 text-[13px] transition-colors duration-200 ${style}`}>
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded border border-line-2 font-label text-[11px] font-bold text-muted">{i + 1}</span>
              {opt}
            </div>
          )
        })}
      </div>
      <AnimatePresence>
        {revealed && (
          <motion.div className="absolute inset-x-0 bottom-0 border-t-[3px] border-good bg-panel-2 px-4 pb-3 pt-2.5" initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
            <div className="flex items-center gap-1.5 text-good">
              <Icons.check className="h-5 w-5" />
              <span className="title text-[22px]">Call confirmed</span>
            </div>
            <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-muted">{play.explain}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function MasteryScene({ t }: { t: number }) {
  const up = t > 1000
  const k = Math.min(1, Math.max(0, (t - 1000) / 800))
  const levels = ['proficient', up ? 'proficient' : 'familiar', 'none'] as const
  return (
    <>
      <div className="eyebrow text-[11px]">Unit 3 · {lesson.unit}</div>
      <div className="mt-2 grid gap-1.5">
        {unit.map((l, i) => (
          <div key={l.id} className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${i === 1 && up ? 'border-flag/60 bg-panel-2' : 'border-line'}`}>
            <motion.span animate={i === 1 && up ? { scale: [1, 1.35, 1] } : {}} transition={{ duration: 0.4 }}>
              <MasterySquare level={levels[i]} current={i === 2} />
            </motion.span>
            <span className="flex-1 font-label text-[15px] font-bold uppercase tracking-[0.06em]">{l.title}</span>
            <span className="text-[11px] uppercase tracking-label text-muted">{levels[i] === 'none' ? 'Up next' : levels[i]}</span>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <Scoreboard
          compact
          cells={[
            { label: 'Streak', value: up ? 4 : 3 },
            { label: 'Points', value: Math.round(340 + 100 * k) },
            { label: 'Mastery', value: `${up ? 21 : 17}%` },
          ]}
        />
      </div>
      <AnimatePresence>
        {up && t < 3600 && (
          <motion.div className="mt-3 text-center font-label text-[15px] font-bold uppercase tracking-label text-flag" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            +100 points · Holding is now Proficient
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
