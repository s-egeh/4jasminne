/**
 * Corridors and coverage. The routes are the ones named in COMPANY.routes —
 * this file adds the origin/destination split and a note on what typically
 * moves, so /coverage can render them as a list beside the map rather than a
 * strip of labels.
 *
 * [TODO-CLIENT] Confirm the corridor list and the note on each. These are the
 * routes the client named, not the limit of where goods are delivered.
 */

/**
 * Places, as real longitude and latitude.
 *
 * These are the source of truth for the map. scripts/build-coverage-map.mjs
 * projects them through the same Mercator instance it projects the country
 * boundaries with, and bakes the result into ./coverage-map.ts — so a node can
 * never drift away from the coastline it is supposed to sit on. Add a place
 * here, mirror it in the script, re-run `npm run build:map`, and it appears.
 *
 * Coordinates are locality-level, not survey pins: the Tema hub is the town,
 * not a gate in the Free Zone Enclave.
 */
export interface Place {
  label: string;
  lon: number;
  lat: number;
  /** The hub every corridor runs from. Rendered larger, with a ring. */
  hub?: boolean;
  /** Outside Ghana, so it renders differently. */
  crossBorder?: boolean;
  /** Dropped from the map below 640px, where it would collide with Tema. */
  minorOnMobile?: boolean;
  /**
   * False for a place too close to the hub to draw as its own node. Tema Port
   * projects about four pixels from Tema; drawn, its dot and label sit on top of
   * the hub's. The corridor keeps its row in the list, which is where the
   * information lives.
   */
  onMap?: boolean;
}

export const PLACES: Record<string, Place> = {
  tema: { label: 'Tema', lon: -0.0166, lat: 5.6698, hub: true },
  port: { label: 'Tema Port', lon: 0.0167, lat: 5.6333, onMap: false },
  accra: { label: 'Accra', lon: -0.187, lat: 5.6037, minorOnMobile: true },
  kumasi: { label: 'Kumasi', lon: -1.6244, lat: 6.6885 },
  takoradi: { label: 'Takoradi', lon: -1.7554, lat: 4.8845 },
  tamale: { label: 'Tamale', lon: -0.8393, lat: 9.4008 },
};

export interface Corridor {
  from: keyof typeof PLACES;
  to: keyof typeof PLACES;
  /** One line on what typically moves on the corridor. */
  note: string;
}

/** Stable key for a corridor, used to pair the map leg with its list row. */
export const corridorId = (corridor: Corridor) => `${corridor.from}-${corridor.to}`;

export const CORRIDORS: Corridor[] = [
  {
    from: 'port',
    to: 'tema',
    note: 'Transfers between the Port of Tema and the base in the Free Zone Enclave.',
  },
  {
    from: 'tema',
    to: 'accra',
    note: 'Short-haul distribution into Greater Accra, to trade and retail delivery points.',
  },
  {
    from: 'tema',
    to: 'kumasi',
    note: 'Road freight into the middle belt and on to distribution points around Kumasi.',
  },
  {
    from: 'tema',
    to: 'takoradi',
    note: 'West along the coast to Takoradi and the Western Region.',
  },
  {
    from: 'tema',
    to: 'tamale',
    note: 'Long-haul north to Tamale and the northern regions.',
  },
];

/** Every place, in the order they should be labelled. */
export const COVERAGE_NODES: Place[] = Object.values(PLACES);

/* [TODO-CLIENT: review wording] — the copy below. */
export const COVERAGE_COPY = {
  standfirst:
    'Distribution nationwide from the Free Zone Enclave in Tema, with movement into the wider West African sub-region.',

  whereWeRun: [
    'The base in the Free Zone Enclave sits close to Tema Port and to the roads that run north, west and into Accra, which is why most consignments start there. From that base, goods are distributed nationwide.',
    'The corridors below are the routes named most often. They are not a limit — a destination that is not listed is still one we will quote. What changes between routes is not whether we go, but the vehicle, the turnaround and the paperwork the movement needs.',
  ],

  crossBorder: [
    'Movement into the sub-region is quoted case by case, against the documentation the route and the goods require.',
    'Cross-border work carries more paperwork and a less predictable turnaround than a domestic delivery, so it is priced separately and we say at quotation stage what the route will need from you. Where a movement requires a permit or clearance we cannot arrange, we say so at the outset rather than starting the job and stopping at the border.',
  ],

  access: [
    'Two consignments of the same weight travelling the same distance can price differently, and the reason is almost always access.',
    'A delivery into a warehouse with a loading bay and a forklift is a different job from a delivery to a shopfront on a narrow street, where goods are handed down by hand and the vehicle has nowhere to wait. The first releases the vehicle quickly; the second can hold it for much longer. Because a vehicle earns on movement rather than on standing, waiting time is a real cost, and it has to sit somewhere in the price.',
    'This is why the enquiry checklist asks about access at the delivery point. Telling us in advance costs nothing and gets you an accurate quote. Telling us on the day means the wrong vehicle, or the wrong crew, arrives for the job.',
  ],
};
