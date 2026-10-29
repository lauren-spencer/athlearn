import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ProgressProvider, useProgress } from './state/progress'
import { Icons, Wordmark } from './components/ui'
import Welcome from './screens/Welcome'
import Learn from './screens/Learn'
import LessonScreen from './screens/Lesson'
import Final from './screens/Final'
import Rulebook from './screens/Rulebook'
import Practice from './screens/Practice'
import Profile from './screens/Profile'
import { AuthCallback, SignIn } from './screens/Auth'

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full items-center justify-center sm:py-6">
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-app sm:h-[844px] sm:w-[390px] sm:rounded-[44px] sm:border sm:border-line sm:shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        {children}
      </div>
    </div>
  )
}

function Splash() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(!reduce)
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 900)
    return () => clearTimeout(t)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-3 bg-app" initial={{ opacity: 1 }} exit={{ opacity: 0, pointerEvents: 'none' }} transition={{ duration: 0.35 }}>
          <div className="scale-150">
            <Wordmark />
          </div>
          <div className="eyebrow">Learn the game</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const TABS = [
  { to: '/learn', label: 'Learn', Icon: Icons.learn },
  { to: '/rulebook', label: 'Rulebook', Icon: Icons.rulebook },
  { to: '/practice', label: 'Practice', Icon: Icons.practice },
  { to: '/profile', label: 'Profile', Icon: Icons.profile },
]

function TabLayout() {
  const { pathname } = useLocation()
  return (
    <>
      <main key={pathname} className="scroll-hide flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <nav className="grid grid-cols-4 border-t border-line bg-app pb-[env(safe-area-inset-bottom)]" aria-label="Main">
        {TABS.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `relative flex flex-col items-center gap-1 pb-3 pt-3 font-label text-[11px] font-bold uppercase tracking-label ${isActive ? 'text-flag' : 'text-dim hover:text-muted'}`}>
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute inset-x-5 top-0 h-[3px] rounded-b bg-flag" />}
                <Icon className="h-6 w-6" />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  )
}

function RequireSetup({ children }: { children: React.ReactNode }) {
  const { progress } = useProgress()
  return progress.onboarded ? <>{children}</> : <Navigate to="/welcome" replace />
}

function AppRoutes() {
  const { progress } = useProgress()
  return (
    <Routes>
      <Route path="/" element={<Navigate to={progress.onboarded ? '/learn' : '/welcome'} replace />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        element={
          <RequireSetup>
            <TabLayout />
          </RequireSetup>
        }
      >
        <Route path="/learn" element={<Learn />} />
        <Route path="/rulebook" element={<Rulebook />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/lesson/:id/final" element={<RequireSetup><Final /></RequireSetup>} />
      <Route path="/lesson/:id/:step" element={<RequireSetup><LessonScreen /></RequireSetup>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <PhoneFrame>
          <Splash />
          <AppRoutes />
        </PhoneFrame>
      </BrowserRouter>
    </ProgressProvider>
  )
}
