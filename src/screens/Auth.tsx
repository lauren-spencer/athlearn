import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useProgress } from '../state/progress'
import { SignInForm } from '../components/Account'
import { Icons, Wordmark } from '../components/ui'

/** Sign in from the welcome screen, to restore progress on a new device. */
export function SignIn() {
  const { cloud, user } = useProgress()
  const nav = useNavigate()
  if (!cloud) return <Navigate to="/welcome" replace />
  if (user) return <Navigate to="/auth/callback" replace />
  return (
    <div className="flex h-full flex-col px-5 pb-6 pt-4">
      <button onClick={() => nav(-1)} className="-ml-2 grid h-9 w-9 place-items-center rounded-full hover:bg-panel" aria-label="Back">
        <Icons.back className="h-6 w-6" />
      </button>
      <div className="mt-6">
        <Wordmark />
        <h1 className="title mt-6 text-[48px]">Welcome back</h1>
        <p className="mt-2 text-[16px] text-muted">We'll email you a link. Tap it and your streak and lessons come with you.</p>
      </div>
      <div className="mt-8">
        <SignInForm autoFocus />
      </div>
    </div>
  )
}

/** Where the magic link lands. Waits for the account's progress, then routes on. */
export function AuthCallback() {
  const { progress, sync } = useProgress()
  const nav = useNavigate()
  const [linkError] = useState(() => {
    const params = new URLSearchParams(location.hash.slice(1) || location.search)
    return params.get('error_description')
  })
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    if (sync === 'synced' || sync === 'error') nav(progress.onboarded ? '/learn' : '/welcome?step=1', { replace: true })
  }, [sync, progress.onboarded, nav])

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 8000)
    return () => clearTimeout(t)
  }, [])

  const failed = linkError || (sync === 'off' && timedOut)
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
      <Wordmark />
      {failed ? (
        <>
          <h1 className="title text-[36px]">That link didn't work</h1>
          <p className="text-[15px] text-muted">{linkError ?? 'It may have expired or already been used.'} Ask for a new one.</p>
          <button className="btn-primary w-full" onClick={() => nav('/signin', { replace: true })}>
            Send a new link
          </button>
        </>
      ) : (
        <p className="eyebrow" role="status">
          Signing you in…
        </p>
      )}
    </div>
  )
}
