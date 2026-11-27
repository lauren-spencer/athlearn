import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { SPORTS, firstArt, lessonsFor, unitsFor } from '../content'
import { liveStreak, useProgress } from '../state/progress'
import { LEVEL_LABEL, LEVEL_ORDER, courseMastery, isUnlocked, levelOf, upNext } from '../lib/mastery'
import { Playbook } from '../components/Playbook'
import { Icons, MasterySquare, Pill, Scoreboard, Wordmark, fmtNum } from '../components/ui'
import type { Lesson } from '../types'

export default function Learn() {
  const { progress } = useProgress()
  const sport = SPORTS.find((s) => s.id === progress.sport) ?? SPORTS[0]
  const lessons = lessonsFor(sport.id)
  const units = unitsFor(sport.id)
  const next = upNext(progress, lessons)
  const pct = courseMastery(progress.levels, lessons)
  const [open, setOpen] = useState<string | null>(next?.unit ?? units[0]?.name ?? null)
  const started = lessons.some((l) => progress.levels[l.id])

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between px-5 pt-5">
        <Wordmark />
        <Scoreboard
          compact
          cells={[
            { label: 'Streak', value: liveStreak(progress) },
            { label: 'Points', value: fmtNum(progress.points) },
          ]}
        />
      </div>

      <div className="px-5 pt-5">
        <p className="text-[15px] text-muted">{started ? `Welcome back${progress.name ? `, ${progress.name}` : ''}.` : `Welcome${progress.name ? `, ${progress.name}` : ''}. Let's start with the basics.`}</p>
        <SportSwitcher current={sport.name} />
        <h1 className="title mt-3 text-[44px]">{sport.course}</h1>
      </div>

      {/* Course mastery */}
      <section className="mx-5 mt-4 rounded-xl border border-line bg-panel p-4" aria-label="Course mastery">
        <div className="flex items-end justify-between">
          <div>
            <div className="eyebrow">Course mastery</div>
            <div className="font-display text-[56px] font-black leading-none">
              {pct}
              <span className="text-[30px] text-muted">%</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-1.5 pb-1" style={{ maxWidth: 180 }}>
            {lessons.map((l) => (
              <MasterySquare key={l.id} level={levelOf(progress, l.id)} current={l.id === next?.id} />
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 border-t border-line pt-3">
          {LEVEL_ORDER.map((lv) => (
            <span key={lv} className="flex items-center gap-1.5 font-label text-[11px] font-bold uppercase tracking-label text-muted">
              <MasterySquare level={lv} size={11} />
              {LEVEL_LABEL[lv]} <span className="text-ink">{lessons.filter((l) => levelOf(progress, l.id) === lv).length}</span>
            </span>
          ))}
        </div>
      </section>

      {/* Up next for you */}
      {next ? <UpNext lesson={next} /> : <CourseDone />}

      {/* Units */}
      <div className="mt-6 px-5">
        <div className="eyebrow mb-2">Units</div>
        <div className="grid gap-2">
          {units.map((u) => {
            const isOpen = open === u.name
            return (
              <div key={u.name} className="overflow-hidden rounded-xl border border-line bg-panel">
                <button className="flex w-full items-center gap-3 p-3 text-left" onClick={() => setOpen(isOpen ? null : u.name)} aria-expanded={isOpen}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-panel-2 font-display text-[22px] font-black">{String(u.order).padStart(2, '0')}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-label text-[18px] font-bold uppercase tracking-[0.06em]">{u.name}</span>
                    <span className="mt-1 flex gap-1">
                      {u.lessons.map((l) => (
                        <MasterySquare key={l.id} level={levelOf(progress, l.id)} current={l.id === next?.id} size={12} />
                      ))}
                    </span>
                  </span>
                  <Icons.chevron className={`h-5 w-5 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-line">
                      {u.lessons.map((l) => (
                        <LessonRow key={l.id} lesson={l} current={l.id === next?.id} unlocked={isUnlocked(progress, lessons, l)} />
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function SportSwitcher({ current }: { current: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { update } = useProgress()
  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div ref={ref} className="relative mt-1 inline-block">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-1 font-label text-[15px] font-bold uppercase tracking-label text-ink" aria-haspopup="menu" aria-expanded={open}>
        <span className="text-muted">Learning:</span> {current}
        <Icons.chevron className={`h-4 w-4 text-flag transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div role="menu" className="absolute left-0 top-8 z-30 w-60 overflow-hidden rounded-xl border border-line-2 bg-panel-2 shadow-xl">
          {SPORTS.map((s) => (
            <button
              key={s.id}
              role="menuitem"
              disabled={!s.ready}
              onClick={() => {
                update({ sport: s.id })
                setOpen(false)
              }}
              className={`flex w-full items-center justify-between px-4 py-3 text-left ${s.ready ? 'text-ink hover:bg-panel' : 'text-dim'}`}
            >
              <span className="font-label text-[15px] font-bold uppercase tracking-label">{s.name}</span>
              {s.name === current ? <Icons.check className="h-4 w-4 text-flag" /> : !s.ready && <span className="font-label text-[11px] font-bold uppercase tracking-label">Soon</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function UpNext({ lesson }: { lesson: Lesson }) {
  const nav = useNavigate()
  return (
    <section className="mx-5 mt-3 rounded-xl border border-flag/60 bg-panel p-4" aria-label="Up next for you">
      <div className="flex gap-4">
        <div className="min-w-0 flex-1">
          <div className="eyebrow text-flag">Up next for you</div>
          <h2 className="title mt-1 text-[28px]">{lesson.title}</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Pill>{lesson.unit}</Pill>
            <Pill>{lesson.minutes} min</Pill>
          </div>
        </div>
        <div className="w-[104px] shrink-0 self-center">
          <Playbook art={firstArt(lesson)} className="rounded-lg" />
        </div>
      </div>
      <button className="btn-primary mt-4 w-full" onClick={() => nav(`/lesson/${lesson.id}/1`)}>
        <Icons.play className="h-4 w-4" /> Start
      </button>
    </section>
  )
}

function CourseDone() {
  return (
    <section className="mx-5 mt-3 rounded-xl border border-line bg-panel p-4">
      <div className="eyebrow text-good">Course complete</div>
      <h2 className="title mt-1 text-[28px]">Every lesson played</h2>
      <p className="mt-1 text-[15px] text-muted">Review your weakest calls in Practice to reach Mastered.</p>
      <Link to="/practice" className="btn-primary mt-4 w-full">
        Go to practice
      </Link>
    </section>
  )
}

function LessonRow({ lesson, current, unlocked }: { lesson: Lesson; current: boolean; unlocked: boolean }) {
  const { progress } = useProgress()
  const nav = useNavigate()
  const level = levelOf(progress, lesson.id)
  return (
    <li>
      <button
        disabled={!unlocked}
        onClick={() => nav(`/lesson/${lesson.id}/1`)}
        className={`flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left last:border-0 hover:bg-panel-2 disabled:hover:bg-transparent ${current ? 'bg-flag/5' : ''}`}
      >
        <MasterySquare level={level} current={current} />
        <span className="min-w-0 flex-1">
          <span className={`block font-semibold ${unlocked ? 'text-ink' : 'text-dim'}`}>{lesson.title}</span>
          <span className={`font-label text-[12px] font-bold uppercase tracking-label ${current ? 'text-flag' : 'text-muted'}`}>{current ? 'Up next' : unlocked ? LEVEL_LABEL[level] : 'Locked'}</span>
        </span>
        {!unlocked ? <Icons.lock className="h-4 w-4 text-dim" /> : <span className="font-label text-[12px] font-bold uppercase tracking-label text-dim">{lesson.minutes} min</span>}
      </button>
    </li>
  )
}
