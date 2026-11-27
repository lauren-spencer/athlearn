import { createPortal } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import { lessonsFor } from '../content'
import { PlayDiagram, Playbook } from '../components/Playbook'

/** Dev only: every card and play for one sport on a page, for checking diagrams. /dev/art?sport=soccer&t=0.5 */
export default function ArtSheet() {
  const [params] = useSearchParams()
  const sport = params.get('sport') ?? 'football'
  const frac = Number(params.get('t') ?? 1)
  return createPortal(
    <div className="absolute left-0 top-0 z-[80] grid grid-cols-2 gap-3 bg-app p-3" style={{ width: 760 }}>
      {lessonsFor(sport).flatMap((l) =>
        l.steps.map((s, i) =>
          s.type === 'check' ? null : (
            <figure key={`${l.id}-${i}`} className="art-tile">
              <figcaption className="mb-1 truncate font-label text-[11px] uppercase tracking-label text-muted">
                {l.id} · {i + 1} · {s.type === 'card' ? s.title : s.prompt}
              </figcaption>
              {s.type === 'card' ? <Playbook art={s.art} /> : <PlayDiagram play={s.play} t={s.play.duration * frac} />}
            </figure>
          ),
        ),
      )}
    </div>,
    document.body,
  )
}
