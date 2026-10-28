import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { SPORTS } from '../content'
import { useProgress } from '../state/progress'
import { Playbook } from '../components/Playbook'
import { Icons, Segments, Wordmark } from '../components/ui'
import type { Progress } from '../types'

const LEVELS: { id: Progress['level']; title: string; sub: string }[] = [
  { id: 'new', title: 'Brand new', sub: "I'm not sure what a down is" },
  { id: 'basics', title: 'I know the basics', sub: 'I follow along, but flags confuse me' },
  { id: 'details', title: 'I want the details', sub: 'Teach me the fine print' },
]

const GOALS: { id: Progress['goal']; title: string; sub: string }[] = [
  { id: 3, title: '3 min a day', sub: 'One quick rule' },
  { id: 5, title: '5 min a day', sub: 'A lesson a day' },
  { id: 10, title: '10 min a day', sub: 'Two lessons and a review' },
]

export default function Welcome() {
  const { progress, update } = useProgress()
  const [params] = useSearchParams()
  const nav = useNavigate()
  const [step, setStep] = useState(Number(params.get('step')) || 0)
  const [sport, setSport] = useState(progress.sport)
  const [level, setLevel] = useState(progress.level)
  const [goal, setGoal] = useState(progress.goal)

  const finish = () => {
    update({ sport, level, goal, onboarded: true })
    nav('/learn', { replace: true })
  }

  if (step === 0) {
    return (
      <motion.div className="flex h-full flex-col px-5 pb-6 pt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.5 }}>
        <Wordmark />
        <div className="flex flex-1 flex-col justify-center">
          <Playbook art="hero" />
          <h1 className="title mt-8 text-[58px]">
            Learn the game.
            <br />
            <span className="text-flag">Not just the score.</span>
          </h1>
          <p className="mt-4 text-[17px] text-muted">Short lessons, one rule at a time. Then you make the call on a real play.</p>
        </div>
        <button className="btn-primary w-full" onClick={() => setStep(1)} autoFocus>
          Get started
        </button>
      </motion.div>
    )
  }

  const canNext = step !== 1 || SPORTS.find((s) => s.id === sport)?.ready
  return (
    <div className="flex h-full flex-col">
      <header className="px-4 pt-4">
        <div className="mb-3 flex items-center gap-2">
          <button onClick={() => setStep(step - 1)} className="-ml-1 grid h-9 w-9 place-items-center rounded-full hover:bg-panel" aria-label="Back">
            <Icons.back className="h-6 w-6" />
          </button>
          <div className="eyebrow flex-1">Setup · {step} of 3</div>
        </div>
        <Segments states={[1, 2, 3].map((i) => (i < step ? 'done' : i === step ? 'current' : 'todo'))} />
      </header>

      <AnimatePresence mode="wait">
        <motion.div key={step} className="scroll-hide flex-1 overflow-y-auto px-5 pt-6" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.18 }}>
          {step === 1 && (
            <>
              <h1 className="title text-[42px]">Pick a sport</h1>
              <p className="mt-2 text-muted">More sports are on the way.</p>
              <div className="mt-6 grid gap-2">
                {SPORTS.map((s) => (
                  <Choice key={s.id} selected={sport === s.id} disabled={!s.ready} onClick={() => setSport(s.id)} title={s.name} sub={s.ready ? s.course : undefined} badge={s.ready ? undefined : 'Soon'} />
                ))}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h1 className="title text-[42px]">Where are you starting?</h1>
              <div className="mt-6 grid gap-2">
                {LEVELS.map((l) => (
                  <Choice key={l.id} selected={level === l.id} onClick={() => setLevel(l.id)} title={l.title} sub={l.sub} />
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h1 className="title text-[42px]">Set a daily goal</h1>
              <p className="mt-2 text-muted">Lessons take 2 to 5 minutes. You can change this later.</p>
              <div className="mt-6 grid gap-2">
                {GOALS.map((g) => (
                  <Choice key={g.id} selected={goal === g.id} onClick={() => setGoal(g.id)} title={g.title} sub={g.sub} />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <footer className="px-5 pb-6 pt-3">
        <button className="btn-primary w-full" disabled={!canNext} onClick={() => (step < 3 ? setStep(step + 1) : finish())}>
          {step < 3 ? 'Continue' : 'Start learning'}
        </button>
      </footer>
    </div>
  )
}

function Choice({ selected, disabled, onClick, title, sub, badge }: { selected: boolean; disabled?: boolean; onClick: () => void; title: string; sub?: string; badge?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-colors ${selected ? 'border-flag bg-panel-2' : 'border-line bg-panel hover:border-line-2'} disabled:opacity-50 disabled:hover:border-line`}
    >
      <span className="flex-1">
        <span className="block font-label text-[19px] font-bold uppercase tracking-[0.06em]">{title}</span>
        {sub && <span className="text-[14px] text-muted">{sub}</span>}
      </span>
      {badge && <span className="rounded-full border border-line-2 px-2 py-0.5 font-label text-[11px] font-bold uppercase tracking-label text-muted">{badge}</span>}
      {selected && <Icons.check className="h-5 w-5 text-flag" />}
    </button>
  )
}
