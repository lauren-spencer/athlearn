import type { GradedStep, Lesson, Step } from '../types'

// Every JSON file in ./lessons is a lesson; add one and it shows up in the course.
const modules = import.meta.glob<Lesson>('./lessons/*.json', { eager: true, import: 'default' })

export const LESSONS: Lesson[] = Object.values(modules).sort((a, b) => a.order - b.order)

export function lessonsFor(sport: string, locale = 'en') {
  return LESSONS.filter((l) => l.sport === sport && l.locale === locale)
}

export function getLesson(id: string) {
  return LESSONS.find((l) => l.id === id)
}

export interface Unit {
  name: string
  order: number
  lessons: Lesson[]
}

export function unitsFor(sport: string): Unit[] {
  const map = new Map<string, Unit>()
  for (const l of lessonsFor(sport)) {
    if (!map.has(l.unit)) map.set(l.unit, { name: l.unit, order: l.unitOrder, lessons: [] })
    map.get(l.unit)!.lessons.push(l)
  }
  return [...map.values()].sort((a, b) => a.order - b.order)
}

export const isGraded = (s: Step): s is GradedStep => s.type === 'play' || s.type === 'check'

export const firstArt = (l: Lesson) => {
  const card = l.steps.find((s) => s.type === 'card')
  return card && card.type === 'card' ? card.art : 'hero'
}

export interface Sport {
  id: string
  name: string
  course: string
  ready: boolean
}

export const SPORTS: Sport[] = [
  { id: 'football', name: 'Football', course: 'Pro football', ready: true },
  { id: 'basketball', name: 'Basketball', course: 'Basketball rules', ready: false },
  { id: 'soccer', name: 'Soccer', course: 'Soccer rules', ready: false },
  { id: 'baseball', name: 'Baseball', course: 'Baseball rules', ready: false },
]
