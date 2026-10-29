import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** Null when the env vars aren't set: the app then runs local-only, progress in localStorage. */
export const supabase = url && key ? createClient(url, key) : null
