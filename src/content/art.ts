import type { PlayerSpec, Scene } from '../types'

/*
 * Named diagrams referenced by `art` in lesson JSON. Coordinates are on the
 * 360×210 field. In the zoom view downfield is up and the line of scrimmage
 * usually sits at y=128; each 5 yards is 35px.
 */

const LOS = 128
const o = (x: number, y: number, label?: string): PlayerSpec => ({ side: 'O', x, y, label })
const x = (px: number, py: number, label?: string): PlayerSpec => ({ side: 'X', x: px, y: py, label })

export const OL = (y = 138) => [132, 156, 180, 204, 228].map((px) => o(px, y))
export const QB = (y = 158) => o(180, y, 'QB')
export const DL = (y = 118) => [150, 170, 190, 210].map((px) => x(px, y))
const WRS = [o(40, 136, 'WR'), o(320, 136, 'WR')]
const BACK7 = [x(140, 88), x(180, 84), x(220, 88), x(40, 106), x(320, 106), x(130, 40), x(240, 40)]
const formation = (): PlayerSpec[] => [...OL(), QB(), ...WRS, ...DL(), x(104, 120), x(256, 120), ...BACK7]

// Labeled 11-player sides for the positions lessons. Seven offensive players are on the line.
const OL_LABELED = () => ['T', 'G', 'C', 'G', 'T'].map((l, i) => o(132 + i * 24, 138, l))
const OFFENSE = (): PlayerSpec[] => [...OL_LABELED(), QB(), o(180, 186, 'RB'), o(40, 138, 'WR'), o(252, 138, 'TE'), o(290, 148, 'WR'), o(322, 148, 'WR')]
const DEFENSE = (): PlayerSpec[] => [
  ...['DE', 'DT', 'DT', 'DE'].map((l, i) => x(150 + i * 20, 118, l)),
  x(140, 88, 'LB'), x(180, 84, 'MLB'), x(220, 88, 'LB'),
  x(40, 112, 'CB'), x(322, 122, 'CB'),
  x(120, 34, 'S'), x(240, 34, 'S'),
]
const dimAll = (ps: PlayerSpec[]) => ps.map((p) => ({ ...p, dim: true }))

export const ART: Record<string, Scene> = {
  /* ---- play backdrops (drawn dimmed behind the moving actors) ---- */
  oline: { los: LOS, players: [...OL().slice(0, 4), ...DL().slice(0, 3)] },
  olineFull: { los: LOS, players: [...OL(), ...DL()] },

  /* ---- welcome ---- */
  hero: {
    los: LOS,
    players: [...OL(), QB(), ...WRS, ...DL(), x(104, 120), x(256, 120), x(140, 88), x(220, 88), x(40, 100)],
    arrows: [
      { from: [320, 128], to: [292, 46], via: [330, 70] },
      { from: [104, 112], to: [160, 160], tone: 'bad', dashed: true },
    ],
    rings: [{ x: 180, y: 158, r: 16 }],
    tags: [
      { x: 292, y: 30, text: 'Read the play' },
      { x: 100, y: 176, text: 'Make the call', tone: 'ink' },
    ],
  },

  /* ---- the field ---- */
  field: {
    view: 'full',
    tags: [
      { x: 30, y: 12, text: 'End zone' },
      { x: 180, y: 12, text: '50-yard line' },
      { x: 330, y: 12, text: 'End zone' },
    ],
    arrows: [{ from: [36, 198], to: [324, 198], tone: 'ink' }],
  },
  fieldmap: {
    view: 'full',
    zones: [
      { x: 0, y: 25, w: 30, h: 160, tone: 'flag' },
      { x: 330, y: 25, w: 30, h: 160, tone: 'flag' },
    ],
    tags: [
      { x: 180, y: 12, text: '100 yards goal line to goal line' },
      { x: 180, y: 198, text: '53⅓ yards wide', tone: 'ink' },
    ],
  },
  sideline: {
    zones: [{ x: 326, y: 0, w: 34, h: 210, tone: 'bad', label: 'Out' }],
    players: [o(312, 64, 'WR'), x(296, 82)],
    arrows: [{ from: [290, 170], to: [310, 76], via: [320, 120] }],
    ball: [318, 58],
    tags: [{ x: 230, y: 40, text: 'Both feet in', tone: 'good' }],
  },
  hashes: {
    view: 'full',
    arrows: [{ from: [210, 180], to: [210, 122], tone: 'flag' }],
    ball: [210, 114],
    rings: [{ x: 210, y: 114, r: 12 }],
    tags: [
      { x: 210, y: 200, text: 'Tackled near the sideline' },
      { x: 120, y: 105, text: 'Next snap: on the hash', tone: 'ink' },
    ],
  },
  plane: {
    endzone: 'top',
    players: [o(180, 46, 'RB'), x(160, 30), x(204, 34)],
    ball: [182, 34],
    rings: [{ x: 182, y: 35, r: 14 }],
    tags: [
      { x: 280, y: 35, text: 'Goal line' },
      { x: 180, y: 80, text: 'Ball breaks the plane', tone: 'good' },
    ],
  },
  clockstop: {
    view: 'full',
    players: [o(212, 40, 'RB'), x(190, 60)],
    arrows: [{ from: [170, 120], to: [224, 14] }],
    tags: [
      { x: 110, y: 200, text: 'Out of bounds = clock stops', tone: 'ink' },
      { x: 290, y: 12, text: 'Out', tone: 'bad' },
    ],
  },

  /* ---- downs ---- */
  chains: {
    los: 140,
    lineToGain: 70,
    players: [...OL(150), o(180, 168, 'QB')],
    arrows: [{ from: [300, 138], to: [300, 74], tone: 'ink' }],
    tags: [
      { x: 70, y: 156, text: 'Line of scrimmage', tone: 'ink' },
      { x: 60, y: 56, text: 'Line to gain' },
      { x: 300, y: 106, text: '10 yds', tone: 'ink' },
    ],
  },
  fourtries: {
    los: 140,
    lineToGain: 70,
    arrows: [
      { from: [180, 140], to: [180, 120], tone: 'ink' },
      { from: [180, 120], to: [180, 106], tone: 'ink' },
      { from: [180, 106], to: [180, 90], tone: 'ink' },
      { from: [180, 90], to: [180, 74] },
    ],
    tags: [
      { x: 240, y: 130, text: '1st', tone: 'ink' },
      { x: 240, y: 113, text: '2nd', tone: 'ink' },
      { x: 240, y: 98, text: '3rd', tone: 'ink' },
      { x: 240, y: 82, text: '4th' },
      { x: 80, y: 56, text: 'Reach it: new set of 4' },
    ],
  },
  gain4: {
    los: 140,
    lineToGain: 70,
    players: [o(180, 112, 'RB'), x(170, 102), x(194, 104)],
    arrows: [{ from: [180, 158], to: [180, 120], tone: 'ink' }],
    tags: [
      { x: 270, y: 126, text: '+4 yds', tone: 'ink' },
      { x: 270, y: 90, text: 'Now 2nd & 6' },
    ],
  },
  movechains: {
    los: 140,
    lineToGain: 70,
    players: [o(196, 58, 'RB'), x(180, 46)],
    arrows: [{ from: [180, 158], to: [194, 66], via: [150, 110] }],
    rings: [{ x: 196, y: 58, r: 14 }],
    tags: [
      { x: 290, y: 70, text: 'First down', tone: 'good' },
      { x: 290, y: 150, text: 'Chains move', tone: 'ink' },
    ],
  },
  fourth: {
    los: 140,
    lineToGain: 112,
    players: [...OL(150), o(180, 196, 'P')],
    arrows: [
      { from: [180, 186], to: [140, 14], dashed: true },
      { from: [210, 186], to: [260, 30], dashed: true, tone: 'ink' },
      { from: [180, 160], to: [200, 104], tone: 'good' },
    ],
    tags: [
      { x: 90, y: 40, text: 'Punt' },
      { x: 300, y: 40, text: 'Kick', tone: 'ink' },
      { x: 270, y: 100, text: 'Go for it', tone: 'good' },
    ],
  },
  turnover: {
    los: 140,
    lineToGain: 70,
    players: [o(180, 88, 'RB'), x(176, 76), x(196, 80)],
    rings: [{ x: 182, y: 82, r: 18 }],
    tags: [
      { x: 80, y: 56, text: '2 yards short' },
      { x: 280, y: 120, text: 'Ball goes over', tone: 'bad' },
    ],
  },

  /* ---- scoring ---- */
  scoreboard: {
    endzone: 'top',
    players: [o(180, 22, 'RB')],
    ball: [186, 18],
    tags: [
      { x: 70, y: 80, text: 'Touchdown · 6' },
      { x: 70, y: 106, text: 'Extra point · 1 or 2', tone: 'ink' },
      { x: 270, y: 80, text: 'Field goal · 3', tone: 'ink' },
      { x: 270, y: 106, text: 'Safety · 2', tone: 'ink' },
    ],
  },
  td: {
    endzone: 'top',
    players: [o(240, 22, 'WR'), x(222, 34)],
    arrows: [{ from: [300, 140], to: [244, 30], via: [300, 60] }],
    ball: [246, 16],
    rings: [{ x: 240, y: 22, r: 15 }],
    tags: [{ x: 120, y: 60, text: 'Caught in the end zone · 6', tone: 'good' }],
  },
  pat: {
    endzone: 'top',
    los: 140,
    players: [...OL(150), o(180, 178, 'K')],
    arrows: [{ from: [180, 172], to: [180, 8], dashed: true }],
    tags: [
      { x: 80, y: 80, text: 'Kick it · 1' },
      { x: 280, y: 80, text: 'Run or pass it · 2', tone: 'ink' },
    ],
  },
  fg: {
    endzone: 'top',
    los: 105,
    players: [...OL(115), o(180, 145, 'K')],
    arrows: [{ from: [180, 140], to: [180, 6], dashed: true }],
    zones: [{ x: 160, y: 2, w: 40, h: 14, tone: 'good' }],
    tags: [
      { x: 90, y: 58, text: 'Through the uprights' },
      { x: 290, y: 58, text: '3 pts', tone: 'good' },
    ],
  },
  safety: {
    endzone: 'bottom',
    players: [o(180, 192, 'QB'), x(168, 182), x(198, 186)],
    rings: [{ x: 180, y: 190, r: 16 }],
    tags: [
      { x: 180, y: 140, text: 'Tackled in his own end zone', tone: 'ink' },
      { x: 300, y: 165, text: 'Defense +2', tone: 'good' },
    ],
  },

  /* ---- false start ---- */
  set: {
    los: LOS,
    players: formation(),
    tags: [{ x: 290, y: 190, text: 'Set for one second' }],
  },
  flinch: {
    los: LOS,
    players: [...OL().slice(0, 4), o(234, 142), QB(), ...DL(), x(256, 120)],
    arrows: [{ from: [228, 140], to: [236, 146], tone: 'bad' }],
    rings: [{ x: 234, y: 142, r: 14 }],
    flag: [262, 158],
    tags: [
      { x: 290, y: 180, text: 'Moved before the snap', tone: 'bad' },
      { x: 90, y: 180, text: 'Ball never moved', tone: 'ink' },
    ],
  },
  motion: {
    los: LOS,
    players: [...OL(), QB(), o(320, 140, 'WR'), ...DL()],
    arrows: [{ from: [314, 150], to: [256, 150], tone: 'good' }],
    tags: [
      { x: 286, y: 170, text: 'Parallel = legal', tone: 'good' },
      { x: 90, y: 180, text: 'Only one player', tone: 'ink' },
    ],
  },
  snapcount: {
    los: LOS,
    players: [...OL(), QB(), ...DL()],
    ball: [180, 131],
    tags: [
      { x: 180, y: 190, text: '"Set… hut!"', tone: 'ink' },
      { x: 280, y: 96, text: 'Hard count', tone: 'flag' },
    ],
    arrows: [{ from: [228, 96], to: [214, 132], tone: 'flag', via: [216, 104] }],
  },
  offside: {
    los: LOS,
    zones: [{ x: 0, y: 121, w: 360, h: 14, tone: 'ink' }],
    players: [...OL(), QB(), x(150, 118), x(170, 118), x(194, 134), x(210, 118)],
    rings: [{ x: 194, y: 134, r: 13 }],
    tags: [
      { x: 70, y: 106, text: 'Neutral zone', tone: 'ink' },
      { x: 290, y: 106, text: 'Defense: offside', tone: 'bad' },
    ],
  },
  back5: {
    los: 93,
    lineToGain: 23,
    arrows: [{ from: [180, 93], to: [180, 124], tone: 'bad' }],
    tags: [
      { x: 270, y: 108, text: '−5 yards', tone: 'bad' },
      { x: 80, y: 140, text: 'Replay the down', tone: 'ink' },
    ],
    ball: [180, 128],
    players: [],
    flag: [210, 140],
  },

  /* ---- holding ---- */
  pocket: {
    los: LOS,
    players: [...OL(), QB(), ...DL(), x(104, 120), x(256, 120)],
    arrows: [
      { from: [104, 126], to: [128, 156], tone: 'bad', dashed: true },
      { from: [256, 126], to: [232, 156], tone: 'bad', dashed: true },
    ],
    zones: [{ x: 130, y: 144, w: 100, h: 30, tone: 'flag' }],
    tags: [{ x: 180, y: 190, text: 'The pocket' }],
  },
  frame: {
    players: [{ side: 'O', x: 140, y: 120, size: 22 }, { side: 'X', x: 220, y: 100, size: 22 }],
    zones: [{ x: 196, y: 82, w: 48, h: 40, tone: 'good' }],
    arrows: [
      { from: [160, 112], to: [192, 104], tone: 'good' },
      { from: [158, 128], to: [196, 116], tone: 'good' },
    ],
    tags: [
      { x: 220, y: 146, text: 'Hands inside the frame', tone: 'good' },
      { x: 220, y: 168, text: 'Grab outside = hold', tone: 'bad' },
    ],
  },
  grab: {
    los: LOS,
    players: [...OL().slice(0, 4), o(236, 146), QB(), ...DL().slice(0, 3), x(262, 140)],
    arrows: [
      { from: [252, 120], to: [262, 136], tone: 'bad', dashed: true },
      { from: [240, 144], to: [254, 140], tone: 'flag' },
    ],
    rings: [{ x: 250, y: 143, r: 18 }],
    tags: [{ x: 290, y: 180, text: 'Jersey grab', tone: 'bad' }],
  },
  takedown: {
    los: LOS,
    players: [...OL().slice(0, 4), o(222, 148), QB(), ...DL().slice(0, 3), { side: 'X', x: 244, y: 156, size: 8 }],
    arrows: [{ from: [256, 122], to: [246, 150], tone: 'bad', dashed: true }],
    rings: [{ x: 234, y: 152, r: 18 }],
    tags: [
      { x: 290, y: 190, text: 'Pulled to the ground', tone: 'bad' },
      { x: 80, y: 190, text: 'Rusher was beating him', tone: 'ink' },
    ],
  },
  defhold: {
    los: LOS,
    players: [...OL(), QB(), o(312, 92, 'WR'), x(300, 100), ...DL()],
    arrows: [{ from: [320, 134], to: [314, 100], tone: 'ink' }],
    rings: [{ x: 306, y: 96, r: 16 }],
    tags: [
      { x: 280, y: 60, text: 'Defensive holding' },
      { x: 280, y: 180, text: '5 yds + 1st down', tone: 'ink' },
    ],
  },
  back10: {
    los: 58,
    lineToGain: 0,
    ball: [180, 128],
    arrows: [{ from: [180, 58], to: [180, 124], tone: 'bad' }],
    flag: [210, 140],
    tags: [
      { x: 270, y: 92, text: '−10 yards', tone: 'bad' },
      { x: 80, y: 160, text: 'Replay the down', tone: 'ink' },
    ],
  },

  /* ---- roughing the passer ---- */
  protect: {
    los: LOS,
    players: [...OL(), QB(), ...DL(), x(104, 120), x(256, 120)],
    arrows: [
      { from: [186, 152], to: [300, 50], dashed: true },
      { from: [104, 126], to: [164, 160], tone: 'bad', dashed: true },
    ],
    rings: [{ x: 180, y: 158, r: 16 }],
    tags: [
      { x: 300, y: 34, text: 'Eyes downfield' },
      { x: 90, y: 182, text: 'Defenseless', tone: 'bad' },
    ],
  },
  define: {
    los: LOS,
    players: [...OL(), o(180, 170, 'QB'), x(150, 174)],
    arrows: [{ from: [184, 164], to: [292, 52], dashed: true }],
    ball: [292, 52],
    zones: [{ x: 120, y: 160, w: 44, h: 26, tone: 'flag' }],
    tags: [
      { x: 292, y: 36, text: "Ball's out" },
      { x: 90, y: 198, text: 'About one step to stop', tone: 'ink' },
    ],
  },
  late: {
    los: LOS,
    players: [...OL(), o(180, 176, 'QB'), x(168, 180)],
    arrows: [
      { from: [104, 120], to: [160, 178], via: [130, 170], tone: 'bad' },
      { from: [184, 170], to: [292, 52], dashed: true },
    ],
    ball: [292, 52],
    rings: [{ x: 174, y: 178, r: 18 }],
    tags: [
      { x: 292, y: 36, text: "Ball's out" },
      { x: 80, y: 196, text: 'Two steps late', tone: 'bad' },
    ],
  },
  zones: {
    players: [{ side: 'O', x: 180, y: 105, size: 26, label: 'QB', filled: true }],
    zones: [
      { x: 140, y: 22, w: 80, h: 40, tone: 'bad', label: 'Head & neck' },
      { x: 140, y: 150, w: 80, h: 40, tone: 'bad', label: 'Knees & below' },
    ],
    tags: [
      { x: 290, y: 105, text: 'Strike zone', tone: 'good' },
      { x: 70, y: 105, text: 'Chest to thighs', tone: 'ink' },
    ],
    arrows: [{ from: [254, 105], to: [212, 105], tone: 'good' }],
  },
  slam: {
    los: LOS,
    players: [...OL(), { side: 'O', x: 196, y: 176, label: 'QB', filled: true }, x(206, 168)],
    arrows: [{ from: [240, 120], to: [214, 180], via: [250, 170], tone: 'bad' }],
    rings: [{ x: 200, y: 174, r: 20 }],
    tags: [
      { x: 290, y: 200, text: 'Full body weight', tone: 'bad' },
      { x: 90, y: 180, text: 'Wrap, roll off', tone: 'ink' },
    ],
  },
  flag: {
    los: 128,
    lineToGain: 23,
    ball: [180, 128],
    arrows: [{ from: [180, 126], to: [180, 30], tone: 'good' }],
    flag: [216, 140],
    tags: [
      { x: 270, y: 80, text: '+15 yards', tone: 'good' },
      { x: 90, y: 14, text: 'Automatic first down' },
    ],
  },

  /* ---- positions: offense ---- */
  offense11: {
    los: LOS,
    players: OFFENSE(),
    tags: [
      { x: 180, y: 30, text: '11 on offense' },
      { x: 70, y: 196, text: '7 on the line', tone: 'ink' },
    ],
  },
  qbjob: {
    los: LOS,
    players: [...dimAll(OFFENSE()).filter((p) => p.label !== 'QB'), QB()],
    arrows: [
      { from: [180, 150], to: [298, 64], via: [240, 70] },
      { from: [174, 164], to: [176, 182], tone: 'ink', dashed: true },
    ],
    rings: [{ x: 180, y: 158, r: 16 }],
    tags: [
      { x: 290, y: 46, text: 'Throw it' },
      { x: 90, y: 182, text: 'Or hand it off', tone: 'ink' },
    ],
  },
  olinejob: {
    los: LOS,
    players: [...OL_LABELED(), QB(), ...DL()],
    zones: [{ x: 118, y: 128, w: 124, h: 22, tone: 'ink' }],
    tags: [
      { x: 180, y: 186, text: "Can't catch a pass", tone: 'bad' },
      { x: 60, y: 140, text: 'Left tackle', tone: 'ink' },
    ],
    arrows: [{ from: [92, 140], to: [124, 140], tone: 'ink' }],
  },
  rbjob: {
    los: LOS,
    players: [...dimAll(OFFENSE()).filter((p) => p.label !== 'RB'), o(180, 186, 'RB')],
    arrows: [{ from: [180, 178], to: [196, 60], via: [196, 140] }],
    rings: [{ x: 180, y: 186, r: 14 }],
    tags: [
      { x: 270, y: 70, text: 'Through the gap' },
      { x: 90, y: 196, text: 'Runs, catches, blocks', tone: 'ink' },
    ],
  },
  receivers: {
    los: LOS,
    players: [...dimAll(OL_LABELED()), QB(), o(40, 138, 'WR'), o(252, 138, 'TE'), o(322, 148, 'WR')],
    arrows: [
      { from: [40, 130], to: [86, 40], via: [40, 60] },
      { from: [252, 130], to: [210, 74], via: [252, 84] },
      { from: [322, 140], to: [300, 30] },
    ],
    tags: [
      { x: 70, y: 196, text: 'Wide receivers: split out', tone: 'ink' },
      { x: 270, y: 196, text: 'Tight end: blocks + catches' },
    ],
  },
  seven: {
    los: LOS,
    players: OFFENSE(),
    zones: [{ x: 26, y: 128, w: 240, h: 22, tone: 'flag' }],
    rings: [
      { x: 40, y: 138, r: 13 },
      { x: 252, y: 138, r: 13 },
    ],
    tags: [
      { x: 146, y: 112, text: '7 on the line' },
      { x: 260, y: 196, text: 'Ends + backs can catch', tone: 'good' },
    ],
  },

  /* ---- positions: defense ---- */
  defense11: {
    los: LOS,
    players: [...dimAll(OFFENSE()), ...DEFENSE()],
    tags: [
      { x: 300, y: 70, text: 'Linebackers', tone: 'ink' },
      { x: 300, y: 16, text: 'Secondary', tone: 'ink' },
      { x: 92, y: 96, text: 'Line' },
    ],
  },
  dline: {
    los: LOS,
    players: [...dimAll(OFFENSE()), ...DEFENSE().slice(0, 4)],
    arrows: [
      { from: [150, 116], to: [168, 154], tone: 'bad', dashed: true },
      { from: [210, 116], to: [192, 154], tone: 'bad', dashed: true },
    ],
    tags: [
      { x: 290, y: 100, text: 'Rush the passer', tone: 'bad' },
      { x: 70, y: 90, text: 'Plug the run' },
    ],
  },
  linebackers: {
    los: LOS,
    players: [...dimAll(OFFENSE()), ...dimAll(DEFENSE().slice(0, 4)), x(140, 88, 'LB'), x(180, 84, 'MLB'), x(220, 88, 'LB')],
    rings: [{ x: 180, y: 84, r: 14 }],
    arrows: [
      { from: [140, 82], to: [80, 60], tone: 'ink', dashed: true },
      { from: [220, 82], to: [200, 120], tone: 'bad', dashed: true },
    ],
    tags: [
      { x: 180, y: 56, text: 'Calls the defense' },
      { x: 290, y: 110, text: 'Tackle, cover, blitz', tone: 'ink' },
    ],
  },
  corners: {
    los: LOS,
    players: [o(40, 138, 'WR'), o(322, 148, 'WR'), x(40, 112, 'CB'), x(322, 122, 'CB')],
    arrows: [
      { from: [40, 130], to: [70, 40], via: [40, 60] },
      { from: [40, 104], to: [62, 36], via: [36, 60], tone: 'bad', dashed: true },
      { from: [322, 140], to: [300, 50] },
      { from: [322, 114], to: [306, 46], tone: 'bad', dashed: true },
    ],
    tags: [{ x: 180, y: 70, text: 'Shadow the receivers' }],
  },
  safeties: {
    los: LOS,
    players: [...dimAll(OFFENSE()), ...dimAll(DEFENSE().slice(0, 9)), x(120, 34, 'S'), x(240, 34, 'S')],
    zones: [{ x: 20, y: 4, w: 320, h: 56, tone: 'flag' }],
    tags: [{ x: 180, y: 14, text: 'Last line of defense' }],
  },
  blitz: {
    los: LOS,
    players: [...dimAll(OFFENSE()).filter((p) => p.label !== 'QB'), QB(), ...dimAll(DEFENSE().filter((p) => p.label !== 'MLB')), x(180, 84, 'MLB')],
    arrows: [{ from: [180, 92], to: [186, 150], via: [192, 120], tone: 'bad' }],
    tags: [
      { x: 290, y: 100, text: 'Extra rusher', tone: 'bad' },
      { x: 80, y: 60, text: 'Fewer in coverage', tone: 'ink' },
    ],
  },

  /* ---- positions: special teams ---- */
  specialteams: {
    view: 'full',
    arrows: [
      { from: [135, 60], to: [320, 60], via: [230, 20] },
      { from: [150, 140], to: [290, 140], via: [220, 105], tone: 'ink' },
    ],
    tags: [
      { x: 230, y: 44, text: 'Kickoff' },
      { x: 220, y: 156, text: 'Punt', tone: 'ink' },
      { x: 180, y: 198, text: 'Every kick = special teams' },
    ],
  },
  kicker: {
    endzone: 'top',
    los: 96,
    players: [...[148, 164, 180, 196, 212].map((px) => o(px, 104)), o(180, 152, 'H'), { side: 'O', x: 166, y: 168, label: 'K', filled: true }],
    arrows: [{ from: [172, 160], to: [180, 6], tone: 'flag' }],
    tags: [
      { x: 290, y: 60, text: 'Field goal: 3', tone: 'good' },
      { x: 280, y: 160, text: 'Holder + kicker', tone: 'ink' },
    ],
  },
  punter: {
    view: 'full',
    players: [o(60, 105, 'P'), o(276, 105, 'PR')],
    arrows: [{ from: [64, 100], to: [272, 100], via: [170, 30] }],
    tags: [
      { x: 170, y: 198, text: '4th down: kick it away', tone: 'ink' },
      { x: 170, y: 14, text: 'Flip the field' },
    ],
  },
  snapper: {
    los: 70,
    players: [...[148, 164, 196, 212].map((px) => o(px, 78)), o(180, 80, 'LS'), { side: 'O', x: 180, y: 182, label: 'P', filled: true }],
    arrows: [{ from: [180, 88], to: [180, 170], tone: 'flag', dashed: true }],
    tags: [
      { x: 270, y: 130, text: '15 yards back' },
      { x: 90, y: 130, text: 'Long snapper', tone: 'ink' },
    ],
  },
  faircatch: {
    players: [o(180, 70, 'PR'), x(150, 150), x(212, 160), x(180, 176)],
    arrows: [
      { from: [150, 142], to: [168, 96], tone: 'bad', dashed: true },
      { from: [212, 152], to: [194, 98], tone: 'bad', dashed: true },
    ],
    ball: [182, 52],
    rings: [{ x: 180, y: 66, r: 18 }],
    tags: [
      { x: 284, y: 40, text: 'Wave = fair catch' },
      { x: 284, y: 190, text: "Can't hit him", tone: 'bad' },
    ],
  },
  returner: {
    view: 'full',
    players: [o(318, 105, 'KR'), x(220, 60), x(230, 100), x(220, 150)],
    arrows: [{ from: [314, 105], to: [150, 140], via: [260, 170], tone: 'good' }],
    tags: [
      { x: 150, y: 14, text: 'Catch it, run it back' },
      { x: 120, y: 198, text: 'Fastest player on the field', tone: 'ink' },
    ],
  },

  /* ---- legends ---- */
  legendsIntro: {
    los: LOS,
    players: [...dimAll(OFFENSE()), ...dimAll(DEFENSE())],
    tags: [
      { x: 180, y: 106, text: 'Every position has its icons' },
    ],
  },
  goat: {
    los: LOS,
    players: [...dimAll(OL()), { side: 'O', x: 180, y: 160, label: 'QB', filled: true, size: 12 }],
    rings: [{ x: 180, y: 160, r: 22 }],
    tags: [
      { x: 180, y: 60, text: '7 championships' },
      { x: 180, y: 200, text: '23 seasons', tone: 'ink' },
    ],
  },
  rice: {
    endzone: 'top',
    los: LOS,
    players: [...dimAll(OL()), QB(), o(300, 50, 'WR')],
    arrows: [{ from: [300, 130], to: [300, 58], via: [320, 90] }],
    ball: [304, 44],
    tags: [
      { x: 110, y: 66, text: '22,895 yards' },
      { x: 110, y: 90, text: '197 TD catches', tone: 'ink' },
    ],
  },
  ltrush: {
    los: LOS,
    players: [...OL_LABELED(), QB(), x(98, 120, 'LB')],
    arrows: [{ from: [98, 128], to: [168, 170], via: [100, 176], tone: 'bad' }],
    rings: [{ x: 132, y: 138, r: 13 }],
    tags: [
      { x: 260, y: 186, text: "QB's blind side", tone: 'bad' },
      { x: 110, y: 96, text: 'Left tackle got paid' },
    ],
  },
  sweetness: {
    los: LOS,
    players: [...dimAll(OL()), QB(), o(210, 74, 'RB'), x(190, 70), x(236, 82)],
    arrows: [{ from: [180, 186], to: [208, 84], via: [216, 150] }],
    tags: [
      { x: 90, y: 50, text: '"Sweetness"' },
      { x: 270, y: 186, text: 'Award carries his name', tone: 'ink' },
    ],
  },
  nicknames: {
    players: [o(70, 70, 'CB'), o(290, 70, 'RB'), o(70, 160, 'WR'), o(290, 160, 'RB')],
    tags: [
      { x: 70, y: 44, text: 'Prime Time' },
      { x: 290, y: 44, text: 'Beast Mode' },
      { x: 70, y: 134, text: 'Megatron' },
      { x: 290, y: 134, text: 'Sweetness' },
    ],
  },

  /* ---- famous plays ---- */
  immaculate: {
    los: 160,
    players: [o(180, 186, 'QB'), o(196, 70, 'RB'), x(184, 46), o(170, 50)],
    arrows: [
      { from: [180, 178], to: [176, 52], tone: 'ink', dashed: true },
      { from: [176, 52], to: [196, 82], tone: 'flag' },
    ],
    rings: [{ x: 176, y: 50, r: 16 }],
    tags: [
      { x: 290, y: 90, text: 'Off the shoetops' },
      { x: 80, y: 24, text: 'Deflection', tone: 'bad' },
      { x: 90, y: 196, text: 'Dec 23, 1972', tone: 'ink' },
    ],
  },
  thecatch: {
    endzone: 'top',
    los: 150,
    players: [{ side: 'O', x: 316, y: 132, label: 'QB', filled: true }, o(230, 18, 'WR'), x(246, 30), x(298, 112), x(330, 140)],
    arrows: [{ from: [312, 126], to: [232, 24], via: [270, 50] }],
    ball: [232, 12],
    tags: [
      { x: 110, y: 70, text: 'Leaping grab' },
      { x: 100, y: 196, text: 'Jan 10, 1982', tone: 'ink' },
    ],
  },
  hailmary: {
    view: 'full',
    players: [{ side: 'O', x: 150, y: 105, label: 'QB', filled: true }, o(316, 96, 'WR'), x(322, 80), x(330, 112), x(310, 124)],
    arrows: [{ from: [156, 100], to: [312, 92], via: [240, 20] }],
    tags: [
      { x: 230, y: 14, text: 'Throw it up and pray' },
      { x: 120, y: 198, text: '1975 playoffs', tone: 'ink' },
    ],
  },
  helmet: {
    los: 140,
    players: [{ side: 'O', x: 176, y: 176, label: 'QB', filled: true }, x(160, 166), x(196, 170), o(200, 54, 'WR'), x(212, 46)],
    arrows: [
      { from: [176, 168], to: [200, 60], via: [176, 110] },
    ],
    rings: [
      { x: 176, y: 172, r: 22 },
      { x: 204, y: 50, r: 16 },
    ],
    tags: [
      { x: 90, y: 30, text: 'Pinned to his helmet' },
      { x: 290, y: 190, text: 'Escape', tone: 'ink' },
    ],
  },
  guarantee: {
    tags: [
      { x: 180, y: 70, text: '"I guarantee it"' },
      { x: 180, y: 110, text: 'Big underdogs', tone: 'ink' },
      { x: 180, y: 150, text: 'They won', tone: 'good' },
    ],
  },
  perfect: {
    tags: [
      { x: 180, y: 80, text: '17–0' },
      { x: 180, y: 120, text: 'Still the only perfect season', tone: 'ink' },
    ],
  },

  playsIntro: {
    tags: [
      { x: 110, y: 50, text: 'The Catch' },
      { x: 250, y: 80, text: 'The Hail Mary', tone: 'ink' },
      { x: 120, y: 120, text: 'The Helmet Catch', tone: 'ink' },
      { x: 230, y: 160, text: 'The Immaculate Reception' },
    ],
  },
  biggame: {
    view: 'full',
    tags: [
      { x: 180, y: 60, text: 'Most-watched broadcast' },
      { x: 110, y: 110, text: 'Halftime show', tone: 'ink' },
      { x: 250, y: 140, text: 'The commercials', tone: 'ink' },
    ],
  },

  /* ---- teams ---- */
  cities: {
    view: 'full',
    tags: [
      { x: 90, y: 60, text: 'Pittsburgh' },
      { x: 270, y: 60, text: 'Green Bay' },
      { x: 120, y: 105, text: 'San Francisco', tone: 'ink' },
      { x: 260, y: 140, text: 'Kansas City' },
      { x: 90, y: 150, text: 'New England', tone: 'ink' },
    ],
  },
  sixrings: {
    tags: [
      { x: 100, y: 70, text: 'Pittsburgh' },
      { x: 260, y: 70, text: 'New England' },
      { x: 100, y: 110, text: '6 titles', tone: 'ink' },
      { x: 260, y: 110, text: '6 titles', tone: 'ink' },
      { x: 180, y: 170, text: 'The most of any team', tone: 'good' },
    ],
  },
  lambeau: {
    endzone: 'top',
    players: [o(180, 22, 'RB'), x(140, 70), x(230, 80)],
    arrows: [
      { from: [180, 150], to: [180, 32], via: [196, 80] },
      { from: [188, 16], to: [214, 2], tone: 'flag', dashed: true },
    ],
    tags: [
      { x: 290, y: 50, text: 'Leap into the stands' },
      { x: 90, y: 190, text: 'Fan-owned team', tone: 'ink' },
    ],
  },
  westcoast: {
    los: LOS,
    players: [...dimAll(OL()), QB(), o(254, 78, 'WR'), x(266, 70)],
    arrows: [{ from: [254, 130], to: [254, 86], tone: 'ink' }, { from: [180, 150], to: [250, 84], tone: 'flag', dashed: true }],
    tags: [
      { x: 90, y: 60, text: 'Short, fast throws' },
      { x: 270, y: 190, text: '5 titles in 14 seasons', tone: 'ink' },
    ],
  },
  kc: {
    los: LOS,
    players: [...dimAll(OL()), QB(), o(196, 76, 'TE'), x(214, 70)],
    arrows: [{ from: [252, 130], to: [200, 84], via: [252, 96] }, { from: [178, 150], to: [194, 84], tone: 'flag', dashed: true }],
    rings: [{ x: 180, y: 158, r: 16 }, { x: 196, y: 76, r: 14 }],
    tags: [
      { x: 90, y: 50, text: 'QB to tight end' },
      { x: 280, y: 190, text: '3 titles in 5 seasons', tone: 'ink' },
    ],
  },
}

export function resolveArt(art: string | Scene): Scene {
  if (typeof art !== 'string') return art
  return ART[art] ?? {}
}
