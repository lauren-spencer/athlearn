import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getLesson } from '../content'
import { useProgress } from '../state/progress'
import { LEVEL_LABEL } from '../lib/mastery'
import { MasterySquare, Scoreboard, fmtNum, fmtTime } from '../components/ui'

export default function Final() {
  const { id = '' } = useParams()
  const nav = useNavigate()
  const { lastResult: r } = useProgress()
  const lesson = getLesson(id)
  if (!lesson || !r || r.lessonId !== id) return <Navigate to="/learn" replace />

  const levelUp = r.levelAfter !== r.levelBefore

  return (
    <div className="flex h-full flex-col">
      <div className="scroll-hide flex-1 overflow-y-auto px-5 pt-10">
        <div className="eyebrow text-flag">{r.mode === 'practice' ? 'Practice complete' : 'Lesson complete'}</div>
        <h1 className="title mt-1.5 text-[46px]">{lesson.title}</h1>

        <motion.div className="mt-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <Scoreboard
            header="Final"
            cells={[
              { label: 'Points', value: `+${r.points}` },
              { label: 'Calls right', value: `${r.correct}/${r.total}` },
              { label: 'Time', value: fmtTime(r.seconds) },
            ]}
          />
        </motion.div>

        <section className="mt-6 rounded-xl border border-line bg-panel p-4">
          <div className="eyebrow">Lesson mastery</div>
          <div className="mt-3 flex items-center gap-3 font-label text-[17px] font-bold uppercase tracking-label">
            <span className="flex items-center gap-2 text-muted">
              <MasterySquare level={r.levelBefore} />
              {LEVEL_LABEL[r.levelBefore]}
            </span>
            <span className="text-dim">→</span>
            <span className={`flex items-center gap-2 ${levelUp ? 'text-ink' : 'text-muted'}`}>
              <MasterySquare level={r.levelAfter} />
              {LEVEL_LABEL[r.levelAfter]}
            </span>
          </div>
          {r.levelAfter === 'attempted' && <p className="mt-2 text-[14px] text-muted">Get at least one call right to reach Familiar. You can retake it from the course page.</p>}
          {r.mode === 'lesson' && r.levelAfter === 'proficient' && <p className="mt-2 text-[14px] text-muted">Review it in Practice to reach Mastered.</p>}
        </section>

        <section className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-line bg-panel p-4">
            <div className="eyebrow">Course mastery</div>
            <div className="mt-2 font-display text-[34px] font-black leading-none">
              <span className="text-muted">{r.courseBefore}</span>
              <span className="mx-1.5 text-dim">→</span>
              <span className="text-mastered">{r.courseAfter}%</span>
            </div>
          </div>
          <div className="rounded-xl border border-line bg-panel p-4">
            <div className="eyebrow">Streak</div>
            <div className="mt-2 font-display text-[34px] font-black leading-none text-flag">
              {fmtNum(r.streak)} <span className="font-label text-[14px] font-bold uppercase tracking-label text-muted">{r.streak === 1 ? 'day' : 'days'}</span>
            </div>
          </div>
        </section>
      </div>
      <footer className="px-5 pb-6 pt-3">
        <button className="btn-primary w-full" onClick={() => nav(r.mode === 'practice' ? '/practice' : '/learn', { replace: true })} autoFocus>
          {r.mode === 'practice' ? 'Back to practice' : 'Back to course'}
        </button>
      </footer>
    </div>
  )
}
