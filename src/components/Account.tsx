import { useState } from 'react'
import { useProgress } from '../state/progress'

/** Email magic-link form. No passwords: Supabase emails a one-tap sign-in link. */
export function SignInForm({ autoFocus }: { autoFocus?: boolean }) {
  const { signIn } = useProgress()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState<string | null>(null)

  if (state === 'sent') {
    return (
      <div role="status" className="rounded-xl border border-flag/60 bg-panel p-4">
        <div className="font-label text-[17px] font-bold uppercase tracking-[0.06em]">Check your email</div>
        <p className="mt-1 text-[14px] text-muted">
          We sent a sign-in link to <span className="text-ink">{email}</span>. Open it on this device to finish.
        </p>
        <button className="mt-3 text-[14px] text-flag underline-offset-2 hover:underline" onClick={() => setState('idle')}>
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <form
      className="grid gap-2"
      onSubmit={async (e) => {
        e.preventDefault()
        setState('sending')
        setError(null)
        const err = await signIn(email.trim())
        if (err) {
          setError(err)
          setState('idle')
        } else setState('sent')
      }}
    >
      <label htmlFor="email" className="eyebrow">
        Email
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        autoFocus={autoFocus}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="h-12 rounded-btn border border-line-2 bg-panel px-4 text-[16px] text-ink placeholder:text-dim focus:border-flag focus:outline-none"
      />
      {error && <p className="text-[14px] text-bad">{error}</p>}
      <button className="btn-primary w-full" disabled={state === 'sending' || !email.trim()}>
        {state === 'sending' ? 'Sending…' : 'Email me a sign-in link'}
      </button>
    </form>
  )
}

/** Profile section: save progress to an account, or show who's signed in. */
export function AccountCard() {
  const { cloud, user, sync, signOut } = useProgress()
  if (!cloud) return null

  if (user) {
    return (
      <section className="mt-6 px-5">
        <div className="eyebrow mb-2">Account</div>
        <div className="rounded-xl border border-line bg-panel p-4">
          <div className="truncate text-[16px] text-ink">{user.email}</div>
          <div className={`mt-0.5 text-[14px] ${sync === 'error' ? 'text-bad' : 'text-muted'}`}>
            {sync === 'synced' ? 'Progress saved to your account' : sync === 'error' ? "Couldn't reach your account. Progress is saved on this device." : 'Syncing…'}
          </div>
          <button className="btn-secondary mt-3 w-full" onClick={signOut}>
            Sign out
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-6 px-5">
      <div className="eyebrow mb-2">Save your progress</div>
      <p className="mb-3 text-[14px] text-muted">Sign in to keep your streak and lessons on every device.</p>
      <SignInForm />
    </section>
  )
}
