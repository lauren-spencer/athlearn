import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import type { Level, LessonResult, Progress } from '../types'
import { lessonsFor } from '../content'
import { POINTS_PER_CALL, POINTS_PER_LESSON, courseMastery, levelFromLesson, levelFromPractice, levelOf, maxLevel } from '../lib/mastery'
import { supabase } from '../lib/supabase'

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

const dayValue = (k: string | null) => {
  if (!k) return 0
  const [y, m, d] = k.split('-').map(Number)
  return new Date(y, m - 1, d).getTime()
}

/**
 * Combine this device's progress with the account's. A fresh device takes the account as is;
 * otherwise keep the best of both, so signing in never loses a lesson.
 */
export function mergeProgress(local: Progress, remote: Partial<Progress>): Progress {
  const r: Progress = { ...DEFAULT_PROGRESS, ...remote }
  if (!local.onboarded) return r
  if (!r.onboarded) return local

  const levels = { ...r.levels }
  for (const [id, lv] of Object.entries(local.levels)) levels[id] = maxLevel(levels[id] ?? 'none', lv) as Level
  const quizResults = { ...r.quizResults }
  for (const [id, q] of Object.entries(local.quizResults)) if (!quizResults[id] || q.attempts > quizResults[id].attempts) quizResults[id] = q

  const lt = dayValue(local.lastActive)
  const rt = dayValue(r.lastActive)
  const recent = lt === rt ? (local.streak >= r.streak ? local : r) : lt > rt ? local : r

  return {
    ...local,
    levels,
    quizResults,
    streak: recent.streak,
    lastActive: recent.lastActive,
    points: Math.max(local.points, r.points),
    practiced: Math.max(local.practiced, r.practiced),
    perfect: Math.max(local.perfect, r.perfect),
  }
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
  /** False when Supabase isn't configured: no sign-in UI. */
  cloud: boolean
  user: User | null
  /** 'pending' until the first auth check finishes; 'synced' once the account's progress is loaded. */
  sync: 'off' | 'pending' | 'loading' | 'synced' | 'error'
  signIn: (email: string) => Promise<string | null>
  signOut: () => Promise<void>
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

  const [user, setUser] = useState<User | null>(null)
  const [sync, setSync] = useState<Ctx['sync']>(supabase ? 'pending' : 'off')
  const userId = user?.id

  useEffect(() => {
    if (!supabase) return
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session) setSync('off')
    })
    return () => data.subscription.unsubscribe()
  }, [])

  // Pull the account's progress on sign-in and whenever the tab comes back into view.
  useEffect(() => {
    if (!supabase || !userId) return
    const db = supabase
    let cancelled = false
    const pull = async (first: boolean) => {
      if (first) setSync('loading')
      const { data, error } = await db.from('progress').select('data').eq('user_id', userId).maybeSingle()
      if (cancelled) return
      if (error) {
        console.error('progress pull failed', error)
        if (first) setSync('error')
        return
      }
      if (data) {
        setProgress((p) => {
          const merged = mergeProgress(p, data.data as Partial<Progress>)
          return JSON.stringify(merged) === JSON.stringify(p) ? p : merged
        })
      }
      setSync('synced')
    }
    pull(true)
    const onVisible = () => document.visibilityState === 'visible' && pull(false)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [userId])

  // Push changes once the account's copy has been merged in.
  useEffect(() => {
    if (!supabase || !userId || sync !== 'synced') return
    const db = supabase
    const t = setTimeout(async () => {
      const { error } = await db.from('progress').upsert({ user_id: userId, data: progress, updated_at: new Date().toISOString() })
      if (error) console.error('progress push failed', error)
    }, 600)
    return () => clearTimeout(t)
  }, [progress, userId, sync])

  const signIn = useCallback(async (email: string) => {
    if (!supabase) return 'Sign-in is not set up.'
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/auth/callback` } })
    return error ? error.message : null
  }, [])

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut()
  }, [])

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

  const value = useMemo(
    () => ({ progress, update, finishRun, reset, lastResult, cloud: !!supabase, user, sync, signIn, signOut }),
    [progress, update, finishRun, reset, lastResult, user, sync, signIn, signOut],
  )
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress outside ProgressProvider')
  return ctx
}
