import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SPORTS, lessonsFor, unitsFor } from '../content'
import { liveStreak, useProgress } from '../state/progress'
import { Icons, Modal, Scoreboard, ScreenHeader, fmtNum } from '../components/ui'

const LEVEL_NAME = { new: 'Brand new', basics: 'Knows the basics', details: 'Wants the details' }

export default function Profile() {
  const { progress, update, reset } = useProgress()
  const nav = useNavigate()
  const [confirmReset, setConfirmReset] = useState(false)
  const lessons = lessonsFor(progress.sport)
  const done = lessons.filter((l) => progress.levels[l.id]).length
  const totals = Object.values(progress.quizResults).reduce((s, r) => ({ c: s.c + r.correct, a: s.a + r.attempts * 2 }), { c: 0, a: 0 })
  const acc = totals.a ? Math.round((totals.c / totals.a) * 100) : 0
  const unitDone = (i: number) => {
    const u = unitsFor(progress.sport)[i]
    return !!u && u.lessons.every((l) => progress.levels[l.id])
  }

  const achievements = [
    { title: 'First call', sub: 'Get a call right', got: totals.c > 0 },
    { title: 'Perfect lesson', sub: 'Every call right', got: progress.perfect > 0 },
    { title: 'On a roll', sub: '3-day streak', got: progress.streak >= 3 },
    { title: 'Basics down', sub: 'Finish Unit 1', got: unitDone(0) },
    { title: 'Penalty box', sub: 'Finish Unit 2', got: unitDone(1) },
    { title: 'Film study', sub: 'Do a practice review', got: progress.practiced > 0 },
  ]

  return (
    <div className="pb-8">
      <ScreenHeader eyebrow={`Learning ${SPORTS.find((s) => s.id === progress.sport)?.name}`} title="Profile" />

      <div className="flex items-center gap-4 px-5">
        <Jersey number={done} />
        <div className="min-w-0 flex-1">
          <label htmlFor="name" className="eyebrow block">
            Name
          </label>
          <input
            id="name"
            value={progress.name}
            onChange={(e) => update({ name: e.target.value.slice(0, 20) })}
            placeholder="Add your name"
            className="mt-0.5 w-full bg-transparent font-display text-[30px] font-black uppercase leading-none text-ink placeholder:text-dim focus:outline-none"
          />
          <div className="mt-1 text-[14px] text-muted">
            {LEVEL_NAME[progress.level]} · {progress.goal} min a day
          </div>
        </div>
      </div>

      <div className="mt-5 px-5">
        <Scoreboard
          cells={[
            { label: 'Streak', value: liveStreak(progress) },
            { label: 'Points', value: fmtNum(progress.points) },
            { label: 'Lessons', value: `${done}/${lessons.length}` },
            { label: 'Accuracy', value: `${acc}%` },
          ]}
        />
      </div>

      <section className="mt-6 px-5">
        <div className="eyebrow mb-2">Achievements</div>
        <div className="grid grid-cols-3 gap-2">
          {achievements.map((a) => (
            <div key={a.title} className={`rounded-xl border p-3 text-center ${a.got ? 'border-flag/60 bg-panel' : 'border-line bg-panel/50'}`}>
              <div className={`mx-auto grid h-9 w-9 place-items-center rounded-full ${a.got ? 'bg-flag text-app' : 'border border-dashed border-line-2 text-dim'}`}>{a.got ? <Icons.check className="h-5 w-5" /> : <Icons.lock className="h-4 w-4" />}</div>
              <div className={`mt-2 font-label text-[13px] font-bold uppercase leading-tight tracking-[0.06em] ${a.got ? 'text-ink' : 'text-muted'}`}>{a.title}</div>
              <div className="mt-0.5 text-[11px] leading-tight text-dim">{a.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-2 px-5">
        <button className="btn-secondary w-full" onClick={() => nav('/welcome')}>
          Replay intro
        </button>
        <button className="btn-secondary w-full border-bad/50 text-bad hover:border-bad" onClick={() => setConfirmReset(true)}>
          Reset progress
        </button>
      </section>

      <Modal
        open={confirmReset}
        title="Reset progress?"
        body="This clears your streak, points and every lesson's mastery on this device."
        onClose={() => setConfirmReset(false)}
        actions={
          <>
            <button className="btn-primary" onClick={() => setConfirmReset(false)} autoFocus>
              Keep my progress
            </button>
            <button
              className="btn-secondary border-bad/50 text-bad"
              onClick={() => {
                reset()
                nav('/welcome', { replace: true })
              }}
            >
              Reset everything
            </button>
          </>
        }
      />
    </div>
  )
}

function Jersey({ number }: { number: number }) {
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0" aria-hidden>
      <path d="M26 8 L14 14 L4 30 L16 36 L20 30 L20 74 L60 74 L60 30 L64 36 L76 30 L66 14 L54 8 C50 14 30 14 26 8 Z" fill="#1B2330" stroke="#323D4F" strokeWidth="2" strokeLinejoin="round" />
      <path d="M4 30 L16 36 M76 30 L64 36" stroke="#FFC531" strokeWidth="3" />
      <text x="40" y="60" textAnchor="middle" fontFamily="Big Shoulders Display" fontWeight="900" fontSize="30" fill="#FFC531">
        {String(number).padStart(2, '0')}
      </text>
    </svg>
  )
}
