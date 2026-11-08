'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { CORRIDORS, PLACES, corridorId } from '@/data/coverage';
import {
  BURKINA_PATH,
  GHANA_PATH,
  MAP_HEIGHT,
  MAP_POINTS,
  MAP_VIEW_BOX,
  MAP_WIDTH,
} from '@/data/coverage-map';
import { cn } from '@/lib/utils';

/*
 * The corridor map.
 *
 * Geometry is not computed here. scripts/build-coverage-map.mjs projects real
 * Natural Earth boundaries and the city coordinates through one Mercator
 * instance and bakes the result into src/data/coverage-map.ts, so this
 * component renders finished strings: d3-geo stays a devDependency, the client
 * bundle carries no projection code, and there is no layout shift while a map
 * computes itself.
 *
 * The map is an illustration of information that also exists as text. The
 * corridor list beside it is the real content, and a screen reader gets
 * everything from there.
 */

/** A quadratic bezier from a to b, bowed perpendicular to the leg. */
function leg(a: readonly [number, number], b: readonly [number, number]) {
  const [x1, y1] = a;
  const [x2, y2] = b;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);

  /*
   * Real routes are not straight lines, and a gentle bow also stops two legs
   * leaving the same hub from lying on top of one another. 7% of the leg's own
   * length keeps the curvature proportional, so a short leg does not loop.
   */
  /*
   * The bow direction is a single consistent sign, chosen by eye against the
   * rendered map: as drawn, the coastal Tema-Takoradi leg follows the
   * coastline, which is where that road runs anyway. If a northern destination
   * is added whose leg runs close to Tamale's, check the sign again — near-
   * parallel legs bowed the same way can overlap for much of their length.
   */
  const bow = length * 0.07;
  const cx = (x1 + x2) / 2 - (dy / length) * bow;
  const cy = (y1 + y2) / 2 + (dx / length) * bow;

  /*
   * Path length by sampling. getTotalLength() needs a live DOM node, which the
   * server render does not have — and the dash animation has to be correct on
   * the first painted frame or the lines flash in fully drawn.
   */
  let drawn = 0;
  let px = x1;
  let py = y1;
  for (let i = 1; i <= 24; i += 1) {
    const t = i / 24;
    const u = 1 - t;
    const qx = u * u * x1 + 2 * u * t * cx + t * t * x2;
    const qy = u * u * y1 + 2 * u * t * cy + t * t * y2;
    drawn += Math.hypot(qx - px, qy - py);
    px = qx;
    py = qy;
  }

  return { d: `M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}`, length: drawn, distance: length };
}

/** Which side of its node each label sits on, and any vertical nudge. */
/*
 * Tema and Accra project about nineteen units apart, so their labels go on
 * opposite sides of their nodes: Tema to the right, Accra to the left.
 */
const LABELS: Record<string, { anchor: 'start' | 'end'; dy: number }> = {
  tema: { anchor: 'start', dy: 0 },
  accra: { anchor: 'end', dy: -12 },
  kumasi: { anchor: 'end', dy: 0 },
  takoradi: { anchor: 'end', dy: 0 },
  tamale: { anchor: 'start', dy: 0 },
};

/*
 * A leg shorter than this is not drawn. Tema to Accra projects to about
 * nineteen user units and the port transfer to about five — at that size a
 * bowed line is a smudge between two touching dots, not a route. Those
 * corridors keep their rows in the list, which is where the information
 * actually lives.
 */
const MIN_DRAWN_LENGTH = 24;

/** Places drawn as nodes. A place marked `onMap: false` is listed but not drawn. */
const MAP_PLACES = Object.entries(PLACES).filter(([, place]) => place.onMap !== false);

/** The accessible name, built from the data so it cannot drift from the list. */
const MAP_LABEL = `Map of Ghana showing 4Jasmine Dr distribution corridors from ${
  PLACES.tema.label
} to ${CORRIDORS.filter((corridor) => corridor.from === 'tema')
  .map((corridor) => PLACES[corridor.to].label)
  .join(', ')
  .replace(/, ([^,]*)$/, ' and $1')}.`;

interface CoverageMapProps {
  className?: string;
  /** Corridor id currently hovered in the list beside the map. */
  activeCorridor?: string | null;
}

export function CoverageMap({ className, activeCorridor = null }: CoverageMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setDrawn(true);
      return;
    }
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setDrawn(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  const legs = CORRIDORS.map((corridor) => ({
    id: corridorId(corridor),
    crossBorder: Boolean(PLACES[corridor.to].crossBorder),
    from: PLACES[corridor.from].label,
    to: PLACES[corridor.to].label,
    ...leg(MAP_POINTS[corridor.from], MAP_POINTS[corridor.to]),
  })).filter((item) => item.distance >= MIN_DRAWN_LENGTH);

  return (
    <div ref={ref} className={cn('coverage-map relative', className)}>
      <svg
        viewBox={MAP_VIEW_BOX}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={MAP_LABEL}
        className="block h-full w-full"
      >
        {/* Burkina Faso — faint context along the northern border. */}
        <path
          d={BURKINA_PATH}
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="1"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          d={GHANA_PATH}
          fill="var(--ink-800)"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.25"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {legs.map((item, index) => {
          const dimmed = activeCorridor !== null && activeCorridor !== item.id;
          const active = activeCorridor === item.id;
          return (
            <path
              key={item.id}
              d={item.d}
              fill="none"
              stroke={item.crossBorder ? 'var(--gold-d)' : 'var(--gold)'}
              strokeWidth={active ? 2 : 1.5}
              strokeLinecap="round"
              /*
               * The cross-border leg is dashed, which reads as "beyond the
               * border" without needing a legend. That is styling, not motion,
               * so it survives the reduced-motion path — but it cannot share the
               * dasharray the draw-on animation uses, hence the two branches.
               */
              strokeDasharray={
                item.crossBorder && drawn ? '5 4' : `${item.length} ${item.length}`
              }
              strokeDashoffset={drawn ? 0 : item.length}
              opacity={dimmed ? 0.4 : 1}
              vectorEffect="non-scaling-stroke"
              style={{
                transition: reduced
                  ? 'opacity 180ms linear, stroke-width 180ms linear'
                  : `stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 120}ms, opacity 180ms linear, stroke-width 180ms linear`,
              }}
            >
              <title>{`${item.from} to ${item.to}`}</title>
            </path>
          );
        })}

        {MAP_PLACES.map(([id, place], index) => {
          const point = MAP_POINTS[id];
          if (!point) return null;
          const [x, y] = point;
          return (
            <g
              key={id}
              className={place.minorOnMobile ? 'map-node map-node--minor' : 'map-node'}
              style={{
                opacity: drawn ? 1 : 0,
                transform: drawn ? 'scale(1)' : 'scale(0.6)',
                transformOrigin: `${x}px ${y}px`,
                transition: reduced
                  ? undefined
                  : `opacity 420ms ease-out ${300 + index * 90}ms, transform 420ms cubic-bezier(0.16,1,0.3,1) ${300 + index * 90}ms`,
              }}
            >
              <title>{place.label}</title>
              {place.hub ? (
                <>
                  <circle cx={x} cy={y} r="14" fill="var(--gold)" opacity="0.3" />
                  <circle cx={x} cy={y} r="7" fill="var(--gold)" />
                </>
              ) : place.crossBorder ? (
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill="none"
                  stroke="var(--gold-d)"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              ) : (
                <circle cx={x} cy={y} r="5" fill="var(--gold)" />
              )}
            </g>
          );
        })}
      </svg>

      {/*
        Labels are HTML, not SVG <text>.

        The SVG scales to its container — from about 0.93 of user space on a
        desktop column down to 0.52 on a 360px phone. Text inside it scales with
        everything else, so a 12px label renders at roughly 6px on a phone, which
        is unreadable. Positioning the labels absolutely by percentage keeps them
        at a true 12px at every viewport while the geometry underneath stays
        fluid. The layered text-shadow does the job SVG's `paint-order: stroke
        fill` would, keeping a label legible where a corridor passes behind it.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {MAP_PLACES.map(([id, place]) => {
          const point = MAP_POINTS[id];
          if (!point) return null;
          const config = LABELS[id] ?? { anchor: 'start' as const, dy: 0 };
          const [x, y] = point;
          return (
            <span
              key={id}
              className={cn('map-label', place.minorOnMobile && 'map-label--minor')}
              style={{
                left: `${(x / MAP_WIDTH) * 100}%`,
                top: `${((y + config.dy) / MAP_HEIGHT) * 100}%`,
                transform:
                  config.anchor === 'start'
                    ? 'translate(12px, -50%)'
                    : 'translate(calc(-100% - 12px), -50%)',
                opacity: drawn ? 1 : 0,
              }}
            >
              {place.label.toUpperCase()}
            </span>
          );
        })}
      </div>
    </div>
  );
}
