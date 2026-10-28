# athlearn

Micro-lessons on sports rules, one rule at a time: read 6 cards, make the call on an animated play, build mastery. Football first.

React + Vite + TypeScript + Tailwind, Framer Motion for transitions, progress in `localStorage` (`athlearn.progress`).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Adding a lesson

Drop a JSON file in `src/content/lessons/`. It's picked up automatically and sorted by `order`; `unit` + `unitOrder` group it into an accordion. Each lesson is 6 `card` steps, then a `play` and a `check`.

- `==phrase==` in a card body gets the yellow underline.
- `art` is either a named diagram from `src/content/art.ts` or an inline scene object (players, arrows, rings, tags, zones, `los`, `lineToGain`, `endzone`).
- `play` paths are `[seconds, x, y]` keyframes on a 360×210 field (downfield is up, line of scrimmage around y=128). `scene` draws dimmed backdrop players. Events: `tag`, `ring` (actor ids), `flag`.

## Rules of the system

- Mastery from one lesson: all calls right = Proficient, half = Familiar, none = Attempted. Each perfect Practice review moves a lesson up one level; Mastered only comes from Practice.
- Points: 40 per lesson + 30 per correct call.
- Up next is the first lesson with no level yet. Lessons after it are locked.

Dev only: add `?noanim` to the first URL to skip Framer animations (handy in throttled or background browsers).
