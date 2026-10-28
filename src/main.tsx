import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig, MotionGlobalConfig } from 'framer-motion'
import App from './App'
import './index.css'

// Dev only: ?noanim skips Framer animations for automated checks in throttled browsers.
if (import.meta.env.DEV && new URLSearchParams(location.search).has('noanim')) MotionGlobalConfig.skipAnimations = true

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
)
