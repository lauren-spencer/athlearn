export type Pt = [number, number]
/** [seconds, x, y] on the 360×210 field */
export type Keyframe = [number, number, number]
export type Tone = 'flag' | 'ink' | 'bad' | 'good'

export interface PlayerSpec {
  side: 'O' | 'X'
  x: number
  y: number
  label?: string
  filled?: boolean
  dim?: boolean
  size?: number
}

export interface Scene {
  /**
   * Football: zoom = ~25 yards around the ball, downfield is up; full = whole field, left to right.
   * Other sports draw their whole playing surface left to right (diamond: home plate at the bottom).
   */
  view?: 'zoom' | 'full' | 'court' | 'pitch' | 'diamond' | 'rink'
  los?: number
  lineToGain?: number
  /** true / 'top' = end zone downfield; 'bottom' = the offense's own end zone */
  endzone?: boolean | 'top' | 'bottom'
  players?: PlayerSpec[]
  rings?: { x: number; y: number; r?: number }[]
  arrows?: { from: Pt; to: Pt; via?: Pt; dashed?: boolean; tone?: Tone }[]
  tags?: { x: number; y: number; text: string; tone?: Tone }[]
  zones?: { x: number; y: number; w: number; h: number; label?: string; tone?: Tone }[]
  flag?: Pt
  ball?: Pt
}

export interface Actor {
  side: 'O' | 'X'
  label?: string
  trail?: boolean
  path: Keyframe[]
}

export interface PlayEvent {
  at: number
  tag?: string
  tone?: Tone
  ring?: string[]
  flag?: boolean
}

export interface Play {
  duration: number
  clock?: string
  scene?: string | Scene
  actors: Record<string, Actor>
  ball?: Keyframe[]
  events: PlayEvent[]
}

export interface CardStep {
  type: 'card'
  kicker: string
  num?: number
  title: string
  art: string | Scene
  body: string
  note: string | null
}

export interface PlayStep {
  type: 'play'
  prompt: string
  play: Play
  options: string[]
  answer: number
  explain: string
}

export interface CheckStep {
  type: 'check'
  prompt: string
  options: string[]
  answer: number
  explain: string
}

export type Step = CardStep | PlayStep | CheckStep
export type GradedStep = PlayStep | CheckStep

export interface Lesson {
  id: string
  sport: string
  locale: string
  unit: string
  unitOrder: number
  title: string
  order: number
  minutes: number
  steps: Step[]
}

export type Level = 'attempted' | 'familiar' | 'proficient' | 'mastered'
export type LevelOrNone = Level | 'none'

export interface Progress {
  onboarded: boolean
  name: string
  sport: string
  level: 'new' | 'basics' | 'details'
  goal: 3 | 5 | 10
  streak: number
  lastActive: string | null
  points: number
  levels: Record<string, Level>
  quizResults: Record<string, { correct: number; attempts: number }>
  practiced: number
  perfect: number
}

export interface LessonResult {
  lessonId: string
  mode: 'lesson' | 'practice'
  points: number
  correct: number
  total: number
  seconds: number
  levelBefore: LevelOrNone
  levelAfter: LevelOrNone
  courseBefore: number
  courseAfter: number
  streak: number
}
