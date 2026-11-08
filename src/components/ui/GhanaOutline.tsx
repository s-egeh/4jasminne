import { GHANA_PATH, MAP_POINTS, MAP_VIEW_BOX } from '@/data/coverage-map';
import { cn } from '@/lib/utils';

/**
 * The national outline as a faint decorative backdrop, with a gold marker on
 * Tema.
 *
 * Shares its geometry with the coverage map rather than carrying a second copy.
 * It used to hold its own hand-traced polygon — a straight-diagonal coastline
 * and a zigzag Volta boundary — which was wrong in the same way the map was,
 * just at 6% opacity where it was harder to notice.
 */
export function GhanaOutline({ className }: { className?: string }) {
  const [temaX, temaY] = MAP_POINTS.tema;

  return (
    <svg
      viewBox={MAP_VIEW_BOX}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn('block', className)}
    >
      <path d={GHANA_PATH} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx={temaX} cy={temaY} r="7" fill="var(--gold)" />
    </svg>
  );
}
