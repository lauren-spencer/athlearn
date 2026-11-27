export interface RuleEntry {
  /** Defaults to football. */
  sport?: string
  term: string
  category: 'Basics' | 'Scoring' | 'Penalties' | 'Violations' | 'Fouls' | 'Timing' | 'Positions' | 'Teams'
  badge?: string
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
  { term: 'Touchdown', category: 'Scoring', badge: '6 pts', plain: 'Get the ball into the end zone.', detail: 'Run it in or catch it there. The ball only has to break the plane of the goal line.', lesson: 'scoring' },
  { term: 'Extra point', category: 'Scoring', badge: '1 or 2 pts', plain: 'The bonus try after a touchdown.', detail: 'Kick it through the uprights for 1, or run or pass it into the end zone for 2.', lesson: 'scoring' },
  { term: 'Field goal', category: 'Scoring', badge: '3 pts', plain: 'Kick the ball through the uprights.', detail: 'Can be tried on any down; most teams do it on 4th down when a touchdown looks unlikely.', lesson: 'scoring' },
  { term: 'Safety', category: 'Scoring', badge: '2 pts', plain: 'The defense tackles the offense in its own end zone.', detail: 'Worth 2 points to the defense, and the team that gave up the safety has to kick the ball away.', lesson: 'scoring' },
  { term: 'False start', category: 'Penalties', badge: '5 yds', plain: 'An offensive player moves before the snap.', detail: 'The play is stopped before it begins. Back 5 yards, replay the down.', lesson: 'false-start' },
  { term: 'Offside', category: 'Penalties', badge: '5 yds', plain: 'A defender is past the ball when it is snapped.', detail: 'If the offense snaps anyway, the play may go on and the offense can take the better result.', lesson: 'false-start' },
  { term: 'Holding', category: 'Penalties', badge: '10 yds', plain: 'Grabbing a player to stop him.', detail: 'Offensive holding is 10 yards. Defensive holding is 5 yards plus an automatic first down.', lesson: 'holding' },
  { term: 'Pass interference', category: 'Penalties', badge: 'Spot foul', plain: 'Illegal contact with a player trying to catch a pass.', detail: 'On the defense, the ball moves to where the foul happened, plus a first down.' },
  { term: 'Roughing the passer', category: 'Penalties', badge: '15 yds', plain: 'A late, high, low or body-slam hit on the quarterback.', detail: '15 yards and an automatic first down for the offense.', lesson: 'roughing' },
  { term: 'Delay of game', category: 'Timing', badge: '5 yds', plain: 'The offense was too slow to snap the ball.', detail: 'A play clock counts down between plays; let it hit zero and it costs 5 yards.' },
  { term: 'Two-minute warning', category: 'Timing', plain: 'An automatic timeout with two minutes left in each half.', detail: 'Used in pro football; the clock stops, and teams often change pace after it.' },
  { term: 'Timeout', category: 'Timing', plain: 'A team asks to stop the clock.', detail: 'Each team gets three per half.' },
  { term: 'Quarterback', category: 'Positions', badge: 'QB', plain: 'Takes the snap and runs the offense.', detail: 'Calls the play in the huddle, then throws, hands off or runs.', lesson: 'offense' },
  { term: 'Running back', category: 'Positions', badge: 'RB', plain: 'Lines up behind the QB and carries the ball.', detail: 'Also catches short passes and blocks blitzing defenders.', lesson: 'offense' },
  { term: 'Wide receiver', category: 'Positions', badge: 'WR', plain: 'Splits out wide and runs routes to catch passes.', detail: 'The fastest players on offense, usually two or three on the field.', lesson: 'offense' },
  { term: 'Tight end', category: 'Positions', badge: 'TE', plain: 'Lines up next to a tackle; blocks and catches.', detail: 'Half lineman, half receiver. Eligible to catch because he plays on the end of the line.', lesson: 'offense' },
  { term: 'Offensive line', category: 'Positions', badge: 'OL', plain: 'Center, two guards, two tackles. They block.', detail: "Linemen can't catch forward passes. The left tackle protects a right-handed QB's blind side.", lesson: 'offense' },
  { term: 'Defensive line', category: 'Positions', badge: 'DL', plain: 'Tackles and ends who rush the passer and stop the run.', detail: 'Tackling the QB behind the line of scrimmage is a sack.', lesson: 'defense' },
  { term: 'Linebacker', category: 'Positions', badge: 'LB', plain: 'Second-level defenders who tackle, cover and blitz.', detail: 'The middle linebacker usually calls the defensive play.', lesson: 'defense' },
  { term: 'Cornerback', category: 'Positions', badge: 'CB', plain: 'Covers the wide receivers.', detail: 'Lines up across from a receiver and tries to break up or intercept passes.', lesson: 'defense' },
  { term: 'Safety', category: 'Positions', badge: 'S', plain: 'The deepest defender; the last line of defense.', detail: 'Not to be confused with the 2-point safety score.', lesson: 'defense' },
  { term: 'Kicker', category: 'Positions', badge: 'K', plain: 'Kicks off and kicks field goals and extra points.', detail: 'A holder places the ball for field goals; that is often the punter.', lesson: 'special-teams' },
  { term: 'Punter', category: 'Positions', badge: 'P', plain: 'Kicks the ball away on 4th down.', detail: 'Pins the other team deep so they have farther to go.', lesson: 'special-teams' },
  { term: 'Long snapper', category: 'Positions', badge: 'LS', plain: 'Snaps the ball back on punts and kicks.', detail: 'Fires it about 15 yards on punts, about 7 on field goals.', lesson: 'special-teams' },
  { term: 'Fair catch', category: 'Positions', plain: 'A returner waves an arm overhead to catch a kick untouched.', detail: "He can't be hit, and he can't run after catching it. The ball is spotted where he caught it.", lesson: 'special-teams' },
  { term: 'Arizona', category: 'Teams', plain: 'Icons: Larry Fitzgerald.', detail: 'Fitzgerald spent all 17 seasons there and ranks second all-time in receiving yards.' },
  { term: 'Atlanta', category: 'Teams', plain: 'Icons: Michael Vick, Matt Ryan, Julio Jones.', detail: 'Vick redefined the running quarterback; Ryan was MVP in 2016.' },
  { term: 'Baltimore', category: 'Teams', plain: 'Icons: Ray Lewis, Ed Reed, Lamar Jackson.', detail: 'Known for ferocious defenses. Jackson is a two-time MVP and one of the best running QBs ever.' },
  { term: 'Buffalo', category: 'Teams', plain: 'Icons: Jim Kelly, Bruce Smith, Josh Allen.', detail: 'Reached four straight title games in the early \'90s. Smith has the most sacks in history.' },
  { term: 'Carolina', category: 'Teams', plain: 'Icons: Cam Newton, Luke Kuechly, Steve Smith.', detail: 'Newton won MVP in 2015 and led them to the title game.' },
  { term: 'Chicago', category: 'Teams', plain: 'Icons: Walter Payton, Dick Butkus, the 1985 defense.', detail: 'One of the oldest franchises. The \'85 team even recorded a rap single before winning the title.' },
  { term: 'Cincinnati', category: 'Teams', plain: "Icons: Anthony Muñoz, Joe Burrow, Ja'Marr Chase.", detail: 'Burrow and Chase were college teammates at LSU before reuniting in the pros.' },
  { term: 'Cleveland', category: 'Teams', plain: 'Icons: Jim Brown, Myles Garrett.', detail: 'Brown led the league in rushing 8 times in 9 seasons, then retired at his peak to act in movies.' },
  { term: 'Dallas', category: 'Teams', plain: 'Icons: Roger Staubach, Troy Aikman, Emmitt Smith.', detail: 'Nicknamed "America\'s Team." Smith is the all-time leading rusher.' },
  { term: 'Denver', category: 'Teams', plain: 'Icons: John Elway, Terrell Davis.', detail: 'Elway won back-to-back titles at the end of his career; Peyton Manning won his last game there.' },
  { term: 'Detroit', category: 'Teams', plain: 'Icons: Barry Sanders, Calvin Johnson.', detail: 'Sanders retired suddenly in his prime, closing in on the rushing record. Johnson was nicknamed Megatron.' },
  { term: 'Green Bay', category: 'Teams', plain: 'Icons: Vince Lombardi, Bart Starr, Brett Favre, Aaron Rodgers.', detail: 'Owned by its fans. The championship trophy is named for Lombardi, and players do the Lambeau Leap.', lesson: 'teams' },
  { term: 'Houston', category: 'Teams', plain: 'Icons: J.J. Watt, Andre Johnson.', detail: 'Watt won Defensive Player of the Year three times.' },
  { term: 'Indianapolis', category: 'Teams', plain: 'Icons: Peyton Manning, Johnny Unitas.', detail: 'Unitas starred when the team was in Baltimore. Manning won a record five MVPs, four of them here.' },
  { term: 'Jacksonville', category: 'Teams', plain: 'Icons: Tony Boselli, Fred Taylor, Trevor Lawrence.', detail: 'Joined the league in 1995 and reached the conference title game in only its second season.' },
  { term: 'Kansas City', category: 'Teams', plain: 'Icons: Len Dawson, Derrick Thomas, Patrick Mahomes, Travis Kelce.', detail: 'Mahomes and Kelce won three titles in five seasons. Its stadium is famously loud.', lesson: 'teams' },
  { term: 'Las Vegas', category: 'Teams', plain: 'Icons: Marcus Allen, Tim Brown, Bo Jackson.', detail: 'Moved from Oakland in 2020. Owner Al Davis\'s motto: "Just win, baby."' },
  { term: 'Los Angeles', category: 'Teams', badge: 'horns', plain: 'Icons: Deacon Jones, Eric Dickerson, Kurt Warner, Aaron Donald.', detail: 'Deacon Jones coined the word "sack." Dickerson still holds the single-season rushing record.' },
  { term: 'Los Angeles', category: 'Teams', badge: 'bolts', plain: 'Icons: Dan Fouts, Junior Seau, LaDainian Tomlinson.', detail: 'Spent decades in San Diego. Tomlinson set the record with 31 touchdowns in a season.' },
  { term: 'Miami', category: 'Teams', plain: 'Icons: Don Shula, Dan Marino.', detail: 'The 1972 team went 17–0, the only perfect season. Shula won more games than any coach.', lesson: 'famous-plays' },
  { term: 'Minnesota', category: 'Teams', plain: 'Icons: the Purple People Eaters, Randy Moss, Adrian Peterson, Justin Jefferson.', detail: 'Moss caught a rookie-record 17 touchdowns in 1998. The \'70s defensive line had the best nickname in the sport.' },
  { term: 'New England', category: 'Teams', plain: 'Icons: Tom Brady, Bill Belichick.', detail: 'Six titles, all with Brady and Belichick, tied for the most of any team.', lesson: 'teams' },
  { term: 'New Orleans', category: 'Teams', plain: 'Icons: Drew Brees.', detail: 'Won its first title in the 2009 season, four years after Hurricane Katrina. Fans chant "Who dat?"' },
  { term: 'New York', category: 'Teams', badge: 'blue', plain: 'Icons: Lawrence Taylor, Michael Strahan, Eli Manning.', detail: 'Eli Manning beat Brady\'s New England twice in title games, including the Helmet Catch.', lesson: 'famous-plays' },
  { term: 'New York', category: 'Teams', badge: 'green', plain: 'Icons: Joe Namath.', detail: '"Broadway Joe" guaranteed an upset in the 1969 title game and delivered.' },
  { term: 'Philadelphia', category: 'Teams', plain: 'Icons: Reggie White, Brian Dawkins, Jalen Hurts.', detail: 'Famous for passionate fans and the "tush push" quarterback sneak.' },
  { term: 'Pittsburgh', category: 'Teams', plain: 'Icons: Terry Bradshaw, Franco Harris, "Mean" Joe Greene, T.J. Watt.', detail: 'Six titles, tied for the most. The \'70s "Steel Curtain" defense won four.', lesson: 'teams' },
  { term: 'San Francisco', category: 'Teams', plain: 'Icons: Joe Montana, Jerry Rice, Steve Young, Ronnie Lott.', detail: 'Five titles in 14 seasons. Brock Purdy went from last pick in the draft to starter.', lesson: 'teams' },
  { term: 'Seattle', category: 'Teams', plain: 'Icons: Steve Largent, the Legion of Boom, Marshawn Lynch.', detail: 'Fans are "the 12th man," loud enough to register on earthquake sensors during a Lynch run.' },
  { term: 'Tampa Bay', category: 'Teams', plain: 'Icons: Derrick Brooks, Warren Sapp, Tom Brady.', detail: 'Brady won his seventh title here in 2021, the first team to win the big game in its home stadium.' },
  { term: 'Tennessee', category: 'Teams', plain: 'Icons: Earl Campbell, Steve McNair, Derrick Henry.', detail: 'Started as the Houston team. Henry ran for over 2,000 yards in 2020.' },
  { term: 'Washington', category: 'Teams', plain: 'Icons: Joe Gibbs, John Riggins, Sean Taylor.', detail: 'Coach Gibbs won three titles with three different starting quarterbacks.' },

  { sport: 'basketball', term: 'Shot clock', category: 'Timing', badge: '24 sec', plain: 'Time the offense has to shoot.', detail: 'The shot has to hit the rim before it runs out. An offensive rebound resets it to 14.', lesson: 'bb-basics' },
  { sport: 'basketball', term: 'Quarters', category: 'Timing', badge: '4 × 12 min', plain: 'How a pro game is split up.', detail: 'College games use two 20-minute halves. Tied at the end means 5-minute overtimes.' },
  { sport: 'basketball', term: 'Field goal', category: 'Scoring', badge: '2 pts', plain: 'Any basket made from inside the arc.', detail: 'Layups, dunks and jumpers all count the same as long as a foot is inside or on the line.', lesson: 'bb-basics' },
  { sport: 'basketball', term: 'Three-pointer', category: 'Scoring', badge: '3 pts', plain: 'A basket from behind the three-point line.', detail: 'Both feet must be behind the line when the shooter leaves the floor. The corners are the shortest spot.', lesson: 'bb-basics' },
  { sport: 'basketball', term: 'Free throw', category: 'Scoring', badge: '1 pt', plain: 'An unguarded shot from the line after a foul.', detail: 'Shot from 15 feet. Players line the lane but can\'t move until the ball leaves the shooter\'s hand.', lesson: 'bb-basics' },
  { sport: 'basketball', term: 'Traveling', category: 'Violations', plain: 'Too many steps without dribbling.', detail: 'After you stop dribbling you get two steps. The other team gets the ball.', lesson: 'bb-violations' },
  { sport: 'basketball', term: 'Double dribble', category: 'Violations', plain: 'Dribbling again after stopping, or with both hands.', detail: 'Once you pick up your dribble you have to pass or shoot.', lesson: 'bb-violations' },
  { sport: 'basketball', term: 'Three seconds', category: 'Violations', plain: 'Staying in the lane too long.', detail: 'Offensive players can\'t stay in the painted area for more than 3 seconds at a time.', lesson: 'bb-violations' },
  { sport: 'basketball', term: 'Backcourt', category: 'Violations', badge: '8 sec', plain: 'Taking the ball back over half court.', detail: 'The offense has 8 seconds to cross half court, then can\'t go back.', lesson: 'bb-violations' },
  { sport: 'basketball', term: 'Goaltending', category: 'Violations', plain: 'Blocking a shot on its way down.', detail: 'Touching a shot that is falling toward the hoop, or on the rim, gives the shooter the points.', lesson: 'bb-violations' },
  { sport: 'basketball', term: 'Personal foul', category: 'Fouls', plain: 'Illegal contact with an opponent.', detail: 'Pushing, holding, tripping or hitting an arm. Six in a pro game and you foul out.', lesson: 'bb-fouls' },
  { sport: 'basketball', term: 'Shooting foul', category: 'Fouls', badge: '2–3 FT', plain: 'A foul on a player who is shooting.', detail: 'Miss and you get 2 or 3 free throws to match the shot. Make it and you get one more: an and-one.', lesson: 'bb-fouls' },
  { sport: 'basketball', term: 'Charge', category: 'Fouls', plain: 'An offensive player runs into a set defender.', detail: 'The defender must be set in the path before contact. Otherwise it\'s a blocking foul.', lesson: 'bb-fouls' },
  { sport: 'basketball', term: 'Bonus', category: 'Fouls', plain: 'Free throws for every foul after the team limit.', detail: 'In the pros, a team\'s fifth foul of a quarter puts the other team in the bonus.', lesson: 'bb-fouls' },
  { sport: 'basketball', term: 'Technical foul', category: 'Fouls', badge: '1 FT', plain: 'A foul for conduct, not contact.', detail: 'Arguing, taunting or delay of game. The other team gets a free throw. Two in a game and you\'re ejected.' },
]

export const CATEGORIES = ['All', 'Basics', 'Scoring', 'Timing', 'Penalties', 'Violations', 'Fouls', 'Positions', 'Teams'] as const

export const rulesFor = (sport: string) => RULEBOOK.filter((r) => (r.sport ?? 'football') === sport)
