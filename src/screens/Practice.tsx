import { Link, useNavigate } from 'react-router-dom'
import { lessonsFor } from '../content'
import { useProgress } from '../state/progress'
import { LEVEL_LABEL, accuracy, levelOf } from '../lib/mastery'
import { MasterySquare, ScreenHeader } from '../components/ui'

export default function Practice() {
  const { progress } = useProgress()
  const nav = useNavigate()
  const skills = lessonsFor(progress.sport)
    .filter((l) => progress.levels[l.id])
    .map((l) => ({ lesson: l, acc: accuracy(progress, l.id) ?? 0, level: levelOf(progress, l.id) }))
  const weakest = [...skills].filter((s) => s.level !== 'mastered').sort((a, b) => a.acc - b.acc)[0]
  const review = (id: string) => nav(`/lesson/${id}/1?mode=practice`)

  return (
    <div className="pb-8">
      <ScreenHeader eyebrow="Skills" title="Practice" />
      {!skills.length ? (
        <div className="mx-5 rounded-xl border border-dashed border-line-2 p-6 text-center">
          <p className="text-muted">Finish a lesson and its calls show up here for review.</p>
          <Link to="/learn" className="btn-primary mx-auto mt-4 w-fit">
            Go to lessons
          </Link>
        </div>
      ) : (
        <>
          {weakest && (
            <section className="mx-5 rounded-xl border border-bad/50 bg-panel p-4">
              <div className="eyebrow text-bad">Weakest skill</div>
              <h2 className="title mt-1 text-[28px]">{weakest.lesson.title}</h2>
              <p className="mt-1 text-[15px] text-muted">
                {weakest.acc}% of calls right. A clean review moves it up a level{weakest.level === 'proficient' ? ', to Mastered' : ''}.
              </p>
              <button className="btn-primary mt-4 w-full" onClick={() => review(weakest.lesson.id)}>
                Review now
              </button>
            </section>
          )}
          <ul className="mt-4 grid gap-2 px-5">
            {skills.map(({ lesson, acc, level }) => (
              <li key={lesson.id} className="flex items-center gap-3 rounded-xl border border-line bg-panel p-3.5">
                <MasterySquare level={level} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-semibold">{lesson.title}</span>
                    <span className="font-display text-[18px] font-black">{acc}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line" role="meter" aria-valuenow={acc} aria-valuemin={0} aria-valuemax={100} aria-label={`${lesson.title} accuracy`}>
                    <div className="h-full rounded-full bg-mastered" style={{ width: `${acc}%` }} />
                  </div>
                  <div className="mt-1 font-label text-[11px] font-bold uppercase tracking-label text-muted">{LEVEL_LABEL[level]}</div>
                </div>
                <button className="btn-secondary h-9 px-3 text-[13px]" onClick={() => review(lesson.id)}>
                  Review
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
