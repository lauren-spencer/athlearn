import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { getLesson, isGraded, lessonsFor } from '../content'
import { useProgress } from '../state/progress'
import { isUnlocked } from '../lib/mastery'
import { PlayDiagram, Playbook, usePlayback } from '../components/Playbook'
import { Icons, Modal, RichText, Segments } from '../components/ui'
import type { CardStep, GradedStep, PlayStep } from '../types'

type Answer = { choice: number; correct: boolean }

export default function LessonScreen() {
  const { id = '', step = '1' } = useParams()
  const [search] = useSearchParams()
  const mode = search.get('mode') === 'practice' ? 'practice' : 'lesson'
  const nav = useNavigate()
  const { progress, finishRun } = useProgress()
  const [answers, setAnswers] = useState<Record<number, Answer>>({})
  const [dir, setDir] = useState(1)
  const [confirmExit, setConfirmExit] = useState(false)
  const startedAt = useRef(Date.now())

  const lesson = getLesson(id)
  const steps = lesson ? (mode === 'practice' ? lesson.steps.filter(isGraded) : lesson.steps) : []
  const idx = Math.min(Math.max(Number(step) - 1 || 0, 0), Math.max(steps.length - 1, 0))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConfirmExit((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!lesson || (mode === 'lesson' && !isUnlocked(progress, lessonsFor(lesson.sport), lesson))) return <Navigate to="/learn" replace />

  const current = steps[idx]
  const qs = mode === 'practice' ? '?mode=practice' : ''
  const go = (i: number) => {
    setDir(i > idx ? 1 : -1)
    nav(`/lesson/${id}/${i + 1}${qs}`, { replace: true })
  }
  const back = () => idx > 0 && go(idx - 1)

  const next = () => {
    if (idx < steps.length - 1) return go(idx + 1)
    const graded = steps.flatMap((s, i) => (isGraded(s) ? [answers[i]] : []))
    finishRun({
      lessonId: id,
      mode,
      correct: graded.filter((a) => a?.correct).length,
      total: graded.length,
      seconds: (Date.now() - startedAt.current) / 1000,
    })
    nav(`/lesson/${id}/final`, { replace: true })
  }

  const segs = steps.map((s, i) => {
    if (isGraded(s) && answers[i]) return answers[i].correct ? 'good' : 'bad'
    if (i < idx) return 'done'
    return i === idx ? 'current' : 'todo'
  }) as ('todo' | 'current' | 'done' | 'good' | 'bad')[]

  return (
    <div className="flex h-full flex-col">
      <header className="px-4 pb-3 pt-4">
        <div className="mb-3 flex items-center gap-2">
          <button onClick={back} disabled={idx === 0} className="-ml-1 grid h-9 w-9 place-items-center rounded-full text-ink hover:bg-panel disabled:text-line-2 disabled:hover:bg-transparent" aria-label="Previous card">
            <Icons.back className="h-6 w-6" />
          </button>
          <div className="eyebrow flex-1 truncate">
            {mode === 'practice' ? `Practice · ${lesson.title}` : `${lesson.unit} · Lesson ${lesson.order}`}
          </div>
          <button onClick={() => setConfirmExit(true)} className="-mr-1 grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-panel hover:text-ink" aria-label="Exit lesson">
            <Icons.close className="h-6 w-6" />
          </button>
        </div>
        <Segments states={segs} />
      </header>

      <div className="relative min-h-0 flex-1">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={`${mode}-${idx}`}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d * 36, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d * -36, opacity: 0, pointerEvents: "none" as const }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col"
            style={{ touchAction: 'pan-y' }}
            onPanEnd={(_, info) => {
              if (info.offset.x > 80 && Math.abs(info.offset.y) < 60) back()
            }}
          >
            {current.type === 'card' ? (
              <CardView step={current} cta={steps[idx + 1] && isGraded(steps[idx + 1]) ? 'Make the call' : idx === steps.length - 1 ? 'Finish' : 'Continue'} onNext={next} />
            ) : (
              <GradedView
                key={idx}
                step={current}
                answer={answers[idx]}
                onAnswer={(a) => setAnswers((prev) => ({ ...prev, [idx]: a }))}
                onNext={next}
                last={idx === steps.length - 1}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <Modal
        open={confirmExit}
        title="Leave the lesson?"
        body="You'll lose your progress in this lesson."
        onClose={() => setConfirmExit(false)}
        actions={
          <>
            <button className="btn-primary" onClick={() => setConfirmExit(false)} autoFocus>
              Keep going
            </button>
            <button className="btn-secondary" onClick={() => nav(mode === 'practice' ? '/practice' : '/learn')}>
              End lesson
            </button>
          </>
        }
      />
    </div>
  )
}

/* ---------- Card ---------- */

function CardView({ step, cta, onNext }: { step: CardStep; cta: string; onNext: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLButtonElement && e.key === 'Enter') return
      if (e.key === 'Enter' || e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onNext])

  return (
    <>
      <div className="scroll-hide flex-1 overflow-y-auto px-5 pb-4">
        <div className="eyebrow text-flag">
          {step.kicker}
          {step.num ? ` #${step.num}` : ''}
        </div>
        <h1 className="title mt-1.5 text-[40px]">{step.title}</h1>
        <Playbook art={step.art} className="mt-4" title={step.title} />
        <p className="mt-5 text-[17px] leading-relaxed text-ink/90">
          <RichText text={step.body} />
        </p>
        {step.note && <p className="mt-4 rounded-lg border-l-[3px] border-flag bg-panel px-3.5 py-2.5 text-[14px] text-muted">{step.note}</p>}
      </div>
      <footer className="border-t border-line px-5 pb-6 pt-3">
        <button className="btn-primary w-full" onClick={onNext}>
          {cta}
        </button>
      </footer>
    </>
  )
}

/* ---------- Play call + quick check ---------- */

function GradedView({ step, answer, onAnswer, onNext, last }: { step: GradedStep; answer?: Answer; onAnswer: (a: Answer) => void; onNext: () => void; last: boolean }) {
  const [selected, setSelected] = useState<number | null>(answer?.choice ?? null)
  const isPlay = step.type === 'play'
  const pb = usePlayback(isPlay ? (step as PlayStep).play.duration : 0)
  const unlocked = !isPlay || pb.watched || !!answer
  const revealed = !!answer

  const lock = () => {
    if (selected === null || revealed) return
    onAnswer({ choice: selected, correct: selected === step.answer })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key)
      if (n >= 1 && n <= step.options.length && unlocked && !revealed) setSelected(n - 1)
      if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) revealed ? onNext() : lock()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <>
      <div className="scroll-hide flex-1 overflow-y-auto px-5 pb-4">
        <div className="eyebrow text-flag">{isPlay ? 'Make the call' : 'Quick check'}</div>
        <h1 className={`title mt-1.5 ${isPlay ? 'text-[34px]' : 'text-[38px]'}`}>{step.prompt}</h1>

        {isPlay && (
          <div className="mt-4">
            <PlayDiagram play={(step as PlayStep).play} t={pb.t} />
            <button onClick={pb.play} disabled={pb.playing} className="btn-secondary mt-2 h-10 w-full text-[14px]">
              {pb.playing ? (
                'Playing…'
              ) : pb.watched || revealed ? (
                <>
                  <Icons.replay className="h-4 w-4" /> Replay
                </>
              ) : (
                <>
                  <Icons.play className="h-4 w-4" /> Watch the play
                </>
              )}
            </button>
          </div>
        )}

        <div className="mt-5 grid gap-2" role="radiogroup" aria-label="Answers">
          {step.options.map((opt, i) => {
            let style = 'border-line bg-panel hover:border-line-2'
            if (revealed) {
              if (i === step.answer) style = 'border-good bg-good/10'
              else if (i === answer.choice) style = 'border-bad bg-bad/10'
              else style = 'border-line bg-panel opacity-50'
            } else if (selected === i) style = 'border-flag bg-panel-2'
            return (
              <button
                key={i}
                role="radio"
                aria-checked={selected === i}
                disabled={!unlocked || revealed}
                onClick={() => setSelected(i)}
                className={`flex items-center gap-3 rounded-xl border-2 px-3.5 py-3 text-left text-[16px] transition-colors disabled:cursor-default ${style} ${!unlocked ? 'opacity-40' : ''}`}
              >
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border font-label text-[14px] font-bold ${selected === i && !revealed ? 'border-flag text-flag' : 'border-line-2 text-muted'}`}>{i + 1}</span>
                <span className="font-medium">{opt}</span>
              </button>
            )
          })}
        </div>
        {!unlocked && <p className="mt-3 text-center text-[14px] text-muted">Watch the play to unlock your call.</p>}
      </div>

      <footer className="border-t border-line px-5 pb-6 pt-3">
        <button className="btn-primary w-full" disabled={selected === null || !unlocked} onClick={lock}>
          Lock it in
        </button>
      </footer>

      <ReviewBanner open={revealed} correct={!!answer?.correct} answerText={step.options[step.answer]} explain={step.explain} onNext={onNext} last={last} />
    </>
  )
}

function ReviewBanner({ open, correct, answerText, explain, onNext, last }: { open: boolean; correct: boolean; answerText: string; explain: string; onNext: () => void; last: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.section
          role="status"
          className={`absolute inset-x-0 bottom-0 z-20 border-t-[3px] bg-panel px-5 pb-6 pt-4 shadow-[0_-16px_40px_rgba(0,0,0,0.5)] ${correct ? 'border-good' : 'border-bad'}`}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div className={`flex items-center gap-2 ${correct ? 'text-good' : 'text-bad'}`}>
            {correct ? <Icons.check className="h-6 w-6" /> : <Icons.close className="h-6 w-6" />}
            <h2 className="title text-[30px]">{correct ? 'Call confirmed' : 'Call overturned'}</h2>
          </div>
          {!correct && (
            <p className="mt-2 text-[15px]">
              <span className="eyebrow mr-1.5">Right call</span>
              <span className="font-semibold">{answerText}</span>
            </p>
          )}
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{explain}</p>
          <button className="btn-primary mt-4 w-full" onClick={onNext} autoFocus>
            {last ? 'See the final' : 'Continue'}
          </button>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
