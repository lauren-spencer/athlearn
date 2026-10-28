import type { Lesson, Level, LevelOrNone, Progress } from '../types'

export const LEVEL_ORDER: LevelOrNone[] = ['none', 'attempted', 'familiar', 'proficient', 'mastered']

export const LEVEL_LABEL: Record<LevelOrNone, string> = {
  none: 'Not started',
  attempted: 'Attempted',
  familiar: 'Familiar',
  proficient: 'Proficient',
  mastered: 'Mastered',
}

const WEIGHT: Record<LevelOrNone, number> = { none: 0, attempted: 0, familiar: 50, proficient: 80, mastered: 100 }

export const levelOf = (p: Progress, id: string): LevelOrNone => p.levels[id] ?? 'none'

export const maxLevel = (a: LevelOrNone, b: LevelOrNone) => (LEVEL_ORDER.indexOf(a) >= LEVEL_ORDER.indexOf(b) ? a : b)

export function courseMastery(levels: Progress['levels'], lessons: Lesson[]) {
  if (!lessons.length) return 0
  const sum = lessons.reduce((s, l) => s + WEIGHT[levels[l.id] ?? 'none'], 0)
  return Math.round(sum / lessons.length)
}

/** First lesson with no level yet; undefined when the course is done. */
export const upNext = (p: Progress, lessons: Lesson[]) => lessons.find((l) => !p.levels[l.id])

export function isUnlocked(p: Progress, lessons: Lesson[], lesson: Lesson) {
  const next = upNext(p, lessons)
  return !next || lesson.order <= next.order
}

/** One lesson run: 2/2 → Proficient, 1/2 → Familiar, 0 → Attempted. */
export function levelFromLesson(correct: number, total: number): Level {
  if (total > 0 && correct === total) return 'proficient'
  if (correct > 0 && correct * 2 >= total) return 'familiar'
  return 'attempted'
}

/** Practice can raise a lesson one level per perfect review; Mastered only comes from here. */
export function levelFromPractice(current: LevelOrNone, correct: number, total: number): LevelOrNone {
  if (correct < total) return current === 'none' ? 'attempted' : current
  const i = LEVEL_ORDER.indexOf(current)
  return LEVEL_ORDER[Math.min(LEVEL_ORDER.length - 1, Math.max(i + 1, 2))]
}

export const POINTS_PER_LESSON = 40
export const POINTS_PER_CALL = 30

export function accuracy(p: Progress, id: string) {
  const r = p.quizResults[id]
  if (!r || !r.attempts) return null
  return Math.round((r.correct / (r.attempts * 2)) * 100)
}
