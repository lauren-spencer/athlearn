export interface RuleEntry {
  term: string
  category: 'Basics' | 'Scoring' | 'Penalties' | 'Timing'
  yards?: string
  /** One plain-language line, shown first */
  plain: string
  detail: string
  lesson?: string
}

export const RULEBOOK: RuleEntry[] = [
  { term: 'Down', category: 'Basics', plain: 'One try to move the ball. The offense gets four.', detail: 'Gain 10 yards within four downs to earn a new set. Fail and the other team takes over.', lesson: 'downs' },
  { term: 'Line of scrimmage', category: 'Basics', plain: 'The imaginary line where the ball sits before a play.', detail: 'Neither team may cross it before the snap. It moves to wherever the last play ended.', lesson: 'downs' },
  { term: 'Line to gain', category: 'Basics', plain: 'The spot the offense must reach for a first down.', detail: 'Shown on TV as a yellow line, 10 yards from where the set of downs started.', lesson: 'downs' },
  { term: 'Hash marks', category: 'Basics', plain: 'Two rows of short lines where the ball is placed.', detail: 'If a play ends outside the hashes, the ball is moved back to the nearest one for the next snap.', lesson: 'field' },
  { term: 'Out of bounds', category: 'Basics', plain: 'Off the field. The sideline itself counts as out.', detail: 'A runner who steps out ends the play and stops the clock. A receiver needs both feet in for a catch.', lesson: 'field' },
  { term: 'Snap', category: 'Basics', plain: 'The center hands or tosses the ball back to start the play.', detail: 'Before the snap, offensive players must be set; only one may be in motion.', lesson: 'false-start' },
  { term: 'Touchdown', category: 'Scoring', yards: '6 pts', plain: 'Get the ball into the end zone.', detail: 'Run it in or catch it there. The ball only has to break the plane of the goal line.', lesson: 'scoring' },
  { term: 'Extra point', category: 'Scoring', yards: '1 or 2 pts', plain: 'The bonus try after a touchdown.', detail: 'Kick it through the uprights for 1, or run or pass it into the end zone for 2.', lesson: 'scoring' },
  { term: 'Field goal', category: 'Scoring', yards: '3 pts', plain: 'Kick the ball through the uprights.', detail: 'Can be tried on any down; most teams do it on 4th down when a touchdown looks unlikely.', lesson: 'scoring' },
  { term: 'Safety', category: 'Scoring', yards: '2 pts', plain: 'The defense tackles the offense in its own end zone.', detail: 'Worth 2 points to the defense, and the team that gave up the safety has to kick the ball away.', lesson: 'scoring' },
  { term: 'False start', category: 'Penalties', yards: '5 yds', plain: 'An offensive player moves before the snap.', detail: 'The play is stopped before it begins. Back 5 yards, replay the down.', lesson: 'false-start' },
  { term: 'Offside', category: 'Penalties', yards: '5 yds', plain: 'A defender is past the ball when it is snapped.', detail: 'If the offense snaps anyway, the play may go on and the offense can take the better result.', lesson: 'false-start' },
  { term: 'Holding', category: 'Penalties', yards: '10 yds', plain: 'Grabbing a player to stop him.', detail: 'Offensive holding is 10 yards. Defensive holding is 5 yards plus an automatic first down.', lesson: 'holding' },
  { term: 'Pass interference', category: 'Penalties', yards: 'Spot foul', plain: 'Illegal contact with a player trying to catch a pass.', detail: 'On the defense, the ball moves to where the foul happened, plus a first down.' },
  { term: 'Roughing the passer', category: 'Penalties', yards: '15 yds', plain: 'A late, high, low or body-slam hit on the quarterback.', detail: '15 yards and an automatic first down for the offense.', lesson: 'roughing' },
  { term: 'Delay of game', category: 'Timing', yards: '5 yds', plain: 'The offense was too slow to snap the ball.', detail: 'A play clock counts down between plays; let it hit zero and it costs 5 yards.' },
  { term: 'Two-minute warning', category: 'Timing', plain: 'An automatic timeout with two minutes left in each half.', detail: 'Used in pro football; the clock stops, and teams often change pace after it.' },
  { term: 'Timeout', category: 'Timing', plain: 'A team asks to stop the clock.', detail: 'Each team gets three per half.' },
]

export const CATEGORIES = ['All', 'Basics', 'Scoring', 'Penalties', 'Timing'] as const
