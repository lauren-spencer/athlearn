import type { PlayerSpec, Scene } from '../types'

/*
 * Basketball diagrams on the full court (view: 'court'). The offense attacks the
 * right hoop at (331,105). Three-point arc: radius 85 around the hoop, corner lines at y=26 and y=184.
 * Lane: x 282–350, y 76–134. Free-throw line at x=282.
 */

const o = (x: number, y: number, label?: string): PlayerSpec => ({ side: 'O', x, y, label })
const x = (px: number, py: number, label?: string): PlayerSpec => ({ side: 'X', x: px, y: py, label })
const V = 'court' as const

const OFFENSE = () => [o(236, 105, 'PG'), o(262, 40, 'SG'), o(262, 170, 'SF'), o(300, 64, 'PF'), o(300, 146, 'C')]
const DEFENSE = () => [x(256, 105), x(280, 50), x(280, 160), x(316, 76), x(316, 134)]
const dim = (ps: PlayerSpec[]) => ps.map((p) => ({ ...p, dim: true }))

export const BASKETBALL: Record<string, Scene> = {
  'bb.five': {
    view: V,
    players: [...OFFENSE(), ...DEFENSE()],
    tags: [{ x: 290, y: 199, text: 'Five on five' }],
    arrows: [{ from: [150, 105], to: [210, 105], tone: 'ink' }],
  },
  'bb.two': {
    view: V,
    players: [o(292, 150, 'SF'), x(304, 140)],
    ball: [294, 142],
    arrows: [{ from: [292, 140], to: [327, 108], via: [300, 104] }],
    tags: [{ x: 250, y: 190, text: 'Inside the arc: 2' }],
  },
  'bb.three': {
    view: V,
    players: [o(226, 105, 'SG'), o(338, 192, 'SF'), x(250, 100)],
    arrows: [
      { from: [230, 98], to: [326, 102], via: [270, 60] },
      { from: [336, 186], to: [331, 112], dashed: true },
    ],
    tags: [
      { x: 200, y: 60, text: 'Behind the arc: 3' },
      { x: 290, y: 196, text: 'Corner three' },
    ],
  },
  'bb.ft': {
    view: V,
    players: [o(272, 105, 'FT'), ...[300, 322].flatMap((px, i) => [i ? o(px, 70) : x(px, 70), i ? x(px, 140) : o(px, 140)]), ...dim([o(220, 60), x(220, 150)])],
    ball: [280, 105],
    arrows: [{ from: [282, 100], to: [327, 104], via: [306, 84] }],
    tags: [{ x: 220, y: 105, text: '1 point each' }],
  },
  'bb.shotclock': {
    view: V,
    players: [o(200, 120, 'PG'), ...dim(DEFENSE().slice(1)), x(222, 116)],
    ball: [210, 128],
    arrows: [{ from: [206, 118], to: [262, 90], via: [240, 130], tone: 'ink', dashed: true }],
    tags: [
      { x: 90, y: 30, text: 'Shot clock 24', tone: 'bad' },
      { x: 250, y: 199, text: 'Shoot before it hits 0' },
    ],
  },
  'bb.inbound': {
    view: V,
    players: [x(355, 60, 'IN'), x(300, 120), ...dim([o(312, 70), o(290, 140)])],
    ball: [354, 70],
    arrows: [
      { from: [352, 66], to: [304, 112], tone: 'bad' },
      { from: [290, 120], to: [110, 120], tone: 'bad', dashed: true },
    ],
    tags: [{ x: 120, y: 30, text: 'Score, then they inbound' }],
  },

  'bb.violation': {
    view: V,
    players: [...dim(OFFENSE()), ...dim(DEFENSE())],
    flag: [180, 105],
    tags: [{ x: 180, y: 150, text: 'Violation: change of possession' }],
  },
  'bb.travel': {
    view: V,
    players: [o(214, 112, 'PG'), x(310, 100)],
    ball: [218, 102],
    arrows: [
      { from: [222, 108], to: [240, 96], tone: 'ink' },
      { from: [246, 98], to: [264, 112], tone: 'ink' },
      { from: [270, 110], to: [290, 96], tone: 'bad' },
    ],
    tags: [
      { x: 240, y: 140, text: 'Step 1 · step 2' },
      { x: 290, y: 72, text: 'Step 3: travel', tone: 'bad' },
    ],
  },
  'bb.double': {
    view: V,
    players: [o(250, 110, 'PG'), x(280, 104)],
    ball: [262, 112],
    tags: [
      { x: 160, y: 50, text: '1. Dribble' },
      { x: 160, y: 75, text: '2. Pick it up' },
      { x: 160, y: 100, text: '3. Dribble again', tone: 'bad' },
    ],
  },
  'bb.lane': {
    view: V,
    zones: [{ x: 282, y: 76, w: 68, h: 58, label: '3 seconds max', tone: 'bad' }],
    players: [o(314, 112, 'C'), x(326, 104), ...dim([o(236, 105), o(262, 40), x(256, 100)])],
  },
  'bb.backcourt': {
    view: V,
    players: [o(196, 105, 'PG'), x(214, 100)],
    ball: [200, 114],
    arrows: [{ from: [190, 112], to: [146, 122], tone: 'bad', dashed: true }],
    tags: [
      { x: 180, y: 20, text: 'Half court' },
      { x: 120, y: 160, text: "Can't go back", tone: 'bad' },
      { x: 280, y: 190, text: '8 seconds to cross' },
    ],
  },
  'bb.goaltend': {
    view: V,
    players: [x(318, 92), o(250, 70, 'SG')],
    ball: [326, 96],
    arrows: [{ from: [254, 64], to: [324, 92], via: [290, 30], dashed: true }],
    rings: [{ x: 324, y: 96, r: 14 }],
    tags: [{ x: 240, y: 150, text: 'Blocked on the way down', tone: 'bad' }],
  },

  'bb.foul': {
    view: V,
    players: [o(270, 120, 'SF'), x(284, 112)],
    ball: [272, 110],
    rings: [{ x: 277, y: 116, r: 18 }],
    flag: [300, 130],
    tags: [{ x: 220, y: 170, text: 'Illegal contact' }],
  },
  'bb.shootingfoul': {
    view: V,
    players: [o(234, 70, 'SG'), x(248, 76)],
    arrows: [{ from: [238, 64], to: [324, 100], via: [280, 30], dashed: true }],
    rings: [{ x: 241, y: 73, r: 18 }],
    tags: [
      { x: 180, y: 150, text: 'Fouled on a three: 3 free throws' },
      { x: 180, y: 174, text: 'Fouled on a two: 2 free throws', tone: 'ink' },
    ],
  },
  'bb.andone': {
    view: V,
    players: [o(312, 120, 'C'), x(322, 112)],
    ball: [331, 105],
    rings: [{ x: 317, y: 116, r: 18 }],
    tags: [
      { x: 240, y: 60, text: 'Basket counts', tone: 'good' },
      { x: 240, y: 84, text: '+ 1 free throw' },
    ],
  },
  'bb.charge': {
    view: V,
    players: [x(300, 104, 'D'), o(262, 118, 'PG')],
    ball: [266, 128],
    arrows: [{ from: [268, 114], to: [292, 106], tone: 'ink' }],
    tags: [
      { x: 300, y: 70, text: 'Set: charge on offense' },
      { x: 220, y: 160, text: 'Moving: block on defense', tone: 'ink' },
    ],
  },
  'bb.bonus': {
    view: V,
    players: [...dim(OFFENSE()), ...dim(DEFENSE())],
    zones: [{ x: 120, y: 80, w: 120, h: 50, label: 'Team fouls: 5' }],
    tags: [{ x: 180, y: 112, text: 'Every foul: free throws', tone: 'ink' }],
  },
  'bb.foulout': {
    view: V,
    players: [o(200, 150, 'PF'), ...dim([o(260, 60), x(280, 70)])],
    arrows: [{ from: [200, 160], to: [200, 204], tone: 'bad', dashed: true }],
    tags: [{ x: 120, y: 120, text: 'Foul No. 6: out', tone: 'bad' }],
  },
}
