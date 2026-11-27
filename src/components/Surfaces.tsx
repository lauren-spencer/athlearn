import type { Scene } from '../types'

/*
 * Playing surfaces for the non-football sports, all on the same 360×210 canvas.
 * Court, pitch and rink run left to right with the playing area inside x 10–350.
 * The diamond is seen from behind home plate: home (180,192), first (244,128),
 * second (180,64), third (116,128), pitcher's mound (180,131).
 */

export type View = NonNullable<Scene['view']>

const LINE = '#F2F4F8'

export const SURFACE_BG: Record<View, string> = {
  zoom: '#0E2419',
  full: '#0E2419',
  pitch: '#0E2419',
  diamond: '#0E2419',
  court: '#231A12',
  rink: '#0E1A24',
}

/** Mirror a left-end drawing to the right end. */
const Mirror = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
    <g transform="translate(360 0) scale(-1 1)">{children}</g>
  </>
)

function Court() {
  const end = (
    <g fill="none" stroke={LINE} strokeOpacity="0.4" strokeWidth="1.5">
      <rect x="10" y="76" width="68" height="58" fill={LINE} fillOpacity="0.05" />
      <circle cx="78" cy="105" r="22" />
      <path d="M10,26 L60,26 A85,85 0 0 1 60,184 L10,184" />
      <path d="M29,91 A14,14 0 0 1 29,119" strokeOpacity="0.25" />
      <line x1="24" x2="24" y1="95" y2="115" strokeOpacity="0.8" strokeWidth="2.5" />
      <circle cx="29" cy="105" r="4" stroke="#FF8A3D" strokeOpacity="0.9" strokeWidth="1.8" />
    </g>
  )
  return (
    <g>
      <rect x="10" y="10" width="340" height="190" fill="none" stroke={LINE} strokeOpacity="0.45" strokeWidth="2" />
      <line x1="180" x2="180" y1="10" y2="200" stroke={LINE} strokeOpacity="0.4" strokeWidth="1.5" />
      <circle cx="180" cy="105" r="20" fill="none" stroke={LINE} strokeOpacity="0.4" strokeWidth="1.5" />
      <Mirror>{end}</Mirror>
    </g>
  )
}

function Pitch() {
  const end = (
    <g fill="none" stroke={LINE} strokeOpacity="0.4" strokeWidth="1.5">
      <rect x="10" y="48" width="53" height="114" />
      <rect x="10" y="80" width="18" height="50" />
      <path d="M63,85 A26,26 0 0 1 63,125" />
      <circle cx="46" cy="105" r="1.6" fill={LINE} fillOpacity="0.6" stroke="none" />
      <rect x="3" y="93" width="7" height="24" strokeOpacity="0.7" fill={LINE} fillOpacity="0.08" />
      <path d="M10,16 A6,6 0 0 0 16,10 M10,194 A6,6 0 0 1 16,200" strokeOpacity="0.3" />
    </g>
  )
  const stripes = Array.from({ length: 10 }, (_, i) => 10 + i * 34)
  return (
    <g>
      {stripes.map((x, i) => (i % 2 ? <rect key={x} x={x} y="10" width="34" height="190" fill={LINE} fillOpacity="0.025" /> : null))}
      <rect x="10" y="10" width="340" height="190" fill="none" stroke={LINE} strokeOpacity="0.45" strokeWidth="2" />
      <line x1="180" x2="180" y1="10" y2="200" stroke={LINE} strokeOpacity="0.4" strokeWidth="1.5" />
      <circle cx="180" cy="105" r="26" fill="none" stroke={LINE} strokeOpacity="0.4" strokeWidth="1.5" />
      <circle cx="180" cy="105" r="1.6" fill={LINE} fillOpacity="0.6" />
      <Mirror>{end}</Mirror>
    </g>
  )
}

const DIRT = '#3B2B1D'

function Diamond() {
  const base = (x: number, y: number) => <rect x={x - 4} y={y - 4} width="8" height="8" transform={`rotate(45 ${x} ${y})`} fill={LINE} fillOpacity="0.85" />
  return (
    <g>
      <defs>
        <clipPath id="fair">
          <path d="M180,200 L-10,10 L370,10 Z" />
        </clipPath>
      </defs>
      <path d="M8,26 Q180,-10 352,26" fill="none" stroke="#FFC531" strokeOpacity="0.35" strokeWidth="3" />
      <g clipPath="url(#fair)">
        <circle cx="180" cy="131" r="95" fill={DIRT} />
        <path d="M180,180 L232,128 L180,76 L128,128 Z" fill="#0E2419" />
      </g>
      <circle cx="180" cy="192" r="16" fill={DIRT} />
      <circle cx="180" cy="131" r="7" fill={DIRT} />
      <line x1="179" x2="181" y1="131" y2="131" stroke={LINE} strokeWidth="2" />
      <g stroke={LINE} strokeOpacity="0.55" strokeWidth="1.5">
        <line x1="180" y1="192" x2="-2" y2="10" />
        <line x1="180" y1="192" x2="362" y2="10" />
      </g>
      {base(244, 128)}
      {base(180, 64)}
      {base(116, 128)}
      <path d="M175,189 L185,189 L185,193 L180,197 L175,193 Z" fill={LINE} fillOpacity="0.9" />
    </g>
  )
}

function Rink() {
  const end = (
    <g>
      <line x1="29" x2="29" y1="22" y2="188" stroke="#FF5A5F" strokeOpacity="0.55" strokeWidth="1.5" />
      <path d="M29,96 A10,10 0 0 1 29,114 Z" fill="#4C9BFF" fillOpacity="0.25" stroke="#FF5A5F" strokeOpacity="0.55" />
      <rect x="22" y="98" width="7" height="14" fill="none" stroke="#FF5A5F" strokeOpacity="0.8" strokeWidth="1.5" />
      <line x1="137" x2="137" y1="15" y2="195" stroke="#4C9BFF" strokeOpacity="0.7" strokeWidth="4" />
      {[59, 151].map((y) => (
        <g key={y}>
          <circle cx="66" cy={y} r="24" fill="none" stroke="#FF5A5F" strokeOpacity="0.45" strokeWidth="1.5" />
          <circle cx="66" cy={y} r="2.5" fill="#FF5A5F" fillOpacity="0.7" />
        </g>
      ))}
    </g>
  )
  return (
    <g>
      <rect x="10" y="15" width="340" height="180" rx="45" fill={LINE} fillOpacity="0.04" stroke={LINE} strokeOpacity="0.5" strokeWidth="2" />
      <line x1="180" x2="180" y1="15" y2="195" stroke="#FF5A5F" strokeOpacity="0.6" strokeWidth="4" />
      <circle cx="180" cy="105" r="24" fill="none" stroke="#4C9BFF" strokeOpacity="0.6" strokeWidth="1.5" />
      <circle cx="180" cy="105" r="2.5" fill="#4C9BFF" />
      <Mirror>{end}</Mirror>
    </g>
  )
}

export function Surface({ view }: { view: View }) {
  if (view === 'court') return <Court />
  if (view === 'pitch') return <Pitch />
  if (view === 'diamond') return <Diamond />
  if (view === 'rink') return <Rink />
  return null
}

export function BallMark({ view, x, y }: { view: View; x: number; y: number }) {
  if (view === 'court')
    return (
      <g transform={`translate(${x} ${y})`}>
        <circle r="4.8" fill="#F08A3C" stroke="#231A12" strokeWidth="1" />
        <path d="M-4.8,0 H4.8 M0,-4.8 V4.8" stroke="#231A12" strokeWidth="0.8" />
      </g>
    )
  if (view === 'pitch')
    return (
      <g transform={`translate(${x} ${y})`}>
        <circle r="4.5" fill="#F2F4F8" stroke="#0E2419" strokeWidth="1" />
        <circle r="1.6" fill="#0E2419" />
      </g>
    )
  if (view === 'diamond')
    return (
      <g transform={`translate(${x} ${y})`}>
        <circle r="3.4" fill="#F2F4F8" stroke="#0E2419" strokeWidth="0.8" />
        <path d="M-1.6,-2.6 Q0,0 -1.6,2.6 M1.6,-2.6 Q0,0 1.6,2.6" fill="none" stroke="#FF5A5F" strokeWidth="0.7" />
      </g>
    )
  if (view === 'rink') return <ellipse cx={x} cy={y} rx="4.2" ry="3" fill="#05070A" stroke="#F2F4F8" strokeWidth="1" />
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse rx="5.5" ry="3.6" fill="#C98B52" stroke="#0E2419" strokeWidth="1" />
      <line x1="-2" x2="2" y1="0" y2="0" stroke="#F2F4F8" strokeWidth="0.9" />
    </g>
  )
}

/** The official's call: a penalty flag in football, a card in soccer, a whistle everywhere else. */
export function CallMark({ view, x, y, opacity = 1 }: { view: View; x: number; y: number; opacity?: number }) {
  if (view === 'zoom' || view === 'full')
    return (
      <g opacity={opacity} transform={`translate(${x} ${y})`}>
        <path d="M-7,-9 C-2,-12 2,-6 8,-9 L6,5 C1,8 -3,2 -9,5 Z" fill="#FFC531" stroke="#0D1117" strokeWidth="1" />
      </g>
    )
  if (view === 'pitch')
    return <rect opacity={opacity} x={x - 5} y={y - 7.5} width="10" height="15" rx="1.5" fill="#FFC531" stroke="#0D1117" strokeWidth="1" transform={`rotate(12 ${x} ${y})`} />
  return (
    <g opacity={opacity} transform={`translate(${x} ${y})`}>
      <path d="M-8,-3 H5 A5,5 0 1 1 -1,5 H-8 Z" fill="#FFC531" stroke="#0D1117" strokeWidth="1" />
      <circle cx="3" cy="2" r="1.6" fill="#0D1117" />
    </g>
  )
}
