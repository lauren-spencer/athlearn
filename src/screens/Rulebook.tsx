import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, rulesFor } from '../content/rulebook'
import { getLesson, lessonsFor } from '../content'
import { useProgress } from '../state/progress'
import { isUnlocked } from '../lib/mastery'
import { Icons, ScreenHeader } from '../components/ui'

export default function Rulebook() {
  const { progress } = useProgress()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('All')

  const rules = useMemo(() => rulesFor(progress.sport), [progress.sport])
  const cats = CATEGORIES.filter((c) => c === 'All' || rules.some((r) => r.category === c))

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return rules.filter((r) => (cat === 'All' || r.category === cat) && (!needle || `${r.term} ${r.plain} ${r.detail}`.toLowerCase().includes(needle)))
  }, [q, cat, rules])

  return (
    <div className="pb-8">
      <ScreenHeader eyebrow="Plain-language glossary" title="Rulebook" />
      <div className="px-5">
        <label htmlFor="rule-search" className="eyebrow mb-1.5 block">
          Search the rules
        </label>
        <div className="relative">
          <Icons.search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            id="rule-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={progress.sport === 'basketball' ? 'Traveling, charge, bonus…' : 'Holding, safety, offside…'}
            className="h-12 w-full rounded-xl border border-line-2 bg-panel pl-11 pr-4 text-[16px] text-ink placeholder:text-dim focus:border-flag focus:outline-none"
          />
        </div>
        <div className="scroll-hide -mx-5 mt-3 flex gap-2 overflow-x-auto px-5">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 font-label text-[13px] font-bold uppercase tracking-label ${cat === c ? 'border-flag bg-flag text-app' : 'border-line-2 text-muted hover:text-ink'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-4 grid gap-2 px-5">
        {results.map((r) => {
          const lesson = r.lesson ? getLesson(r.lesson) : undefined
          const canOpen = lesson && isUnlocked(progress, lessonsFor(lesson.sport), lesson)
          return (
            <li key={`${r.term}-${r.badge ?? ""}`} className="rounded-xl border border-line bg-panel p-4">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-label text-[19px] font-bold uppercase tracking-[0.06em]">
                  {r.term}
                  {r.badge && <span className="text-flag"> · {r.badge}</span>}
                </h2>
                <span className="eyebrow text-[10px] text-dim">{r.category}</span>
              </div>
              <p className="mt-1 text-[16px] font-medium">{r.plain}</p>
              <p className="mt-1 text-[14px] text-muted">{r.detail}</p>
              {canOpen && (
                <Link to={`/lesson/${lesson.id}/1`} className="mt-2 inline-block font-label text-[13px] font-bold uppercase tracking-label text-flag hover:underline">
                  Learn it → {lesson.title}
                </Link>
              )}
            </li>
          )
        })}
        {!results.length && <li className="py-10 text-center text-muted">No rules match “{q}”.</li>}
      </ul>
    </div>
  )
}
