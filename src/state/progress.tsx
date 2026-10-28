import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { LessonResult, Progress } from '../types'
import { lessonsFor } from '../content'
import { POINTS_PER_CALL, POINTS_PER_LESSON, courseMastery, levelFromLesson, levelFromPractice, levelOf, maxLevel } from '../lib/mastery'

const KEY = 'athlearn.progress'

export const DEFAULT_PROGRESS: Progress = {
  onboarded: false,
  name: '',
  sport: 'football',
  level: 'basics',
  goal: 5,
  streak: 0,
  lastActive: null,
  points: 0,
  levels: {},
  quizResults: {},
  practiced: 0,
  perfect: 0,
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) }
  } catch {
    /* storage blocked or corrupt: start fresh */
  }
  return DEFAULT_PROGRESS
}

const dayKey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
const yesterdayKey = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return dayKey(d)
}

/** The stored streak only counts if the user played today or yesterday. */
export function liveStreak(p: Progress) {
  return p.lastActive === dayKey() || p.lastActive === yesterdayKey() ? p.streak : 0
}

interface Ctx {
  progress: Progress
  update: (patch: Partial<Progress>) => void
  finishRun: (args: { lessonId: string; mode: 'lesson' | 'practice'; correct: number; total: number; seconds: number }) => LessonResult
  reset: () => void
  lastResult: LessonResult | null
}

const ProgressContext = createContext<Ctx | null>(null)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<Progress>(load)
  const [lastResult, setLastResult] = useState<LessonResult | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress))
    } catch {
      /* ignore */
    }
  }, [progress])

  const update = useCallback((patch: Partial<Progress>) => setProgress((p) => ({ ...p, ...patch })), [])

  const finishRun: Ctx['finishRun'] = useCallback(
    ({ lessonId, mode, correct, total, seconds }) => {
      const p = progress
      const lessons = lessonsFor(p.sport)
      const before = levelOf(p, lessonId)
      const after = mode === 'lesson' ? maxLevel(before, levelFromLesson(correct, total)) : levelFromPractice(before, correct, total)
      const levels = after === 'none' ? p.levels : { ...p.levels, [lessonId]: after }

      const today = dayKey()
      const streak = p.lastActive === today ? Math.max(p.streak, 1) : p.lastActive === yesterdayKey() ? p.streak + 1 : 1
      const points = (mode === 'lesson' ? POINTS_PER_LESSON : 0) + POINTS_PER_CALL * correct
      const prev = p.quizResults[lessonId] ?? { correct: 0, attempts: 0 }

      const next: Progress = {
        ...p,
        levels,
        streak,
        lastActive: today,
        points: p.points + points,
        quizResults: { ...p.quizResults, [lessonId]: { correct: prev.correct + correct, attempts: prev.attempts + 1 } },
        practiced: p.practiced + (mode === 'practice' ? 1 : 0),
        perfect: p.perfect + (correct === total ? 1 : 0),
      }
      const result: LessonResult = {
        lessonId,
        mode,
        points,
        correct,
        total,
        seconds,
        levelBefore: before,
        levelAfter: after,
        courseBefore: courseMastery(p.levels, lessons),
        courseAfter: courseMastery(levels, lessons),
        streak,
      }
      setProgress(next)
      setLastResult(result)
      return result
    },
    [progress],
  )

  const reset = useCallback(() => {
    setProgress(DEFAULT_PROGRESS)
    setLastResult(null)
  }, [])

  const value = useMemo(() => ({ progress, update, finishRun, reset, lastResult }), [progress, update, finishRun, reset, lastResult])
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress outside ProgressProvider')
  return ctx
}
