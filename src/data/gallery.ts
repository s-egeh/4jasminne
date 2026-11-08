/**
 * Whether /gallery is published.
 *
 * `false` until the client supplies real photographs. The route still builds and
 * still renders — it is simply not linked from the navigation, the footer or any
 * page, and it carries `noindex` while it is off.
 *
 * The gallery is the one page whose entire value is that the photographs are
 * genuinely the company's. A grid of placeholders, or of vehicles and
 * warehouses that belong to somebody else, is worse than no gallery.
 *
 * To publish: set this to `true` and remove `/gallery` from the `exclude` array
 * in next-sitemap.config.js. Those are the only two changes.
 */
export const GALLERY_PUBLISHED = false;

export type GalleryFilter = 'fleet' | 'warehouse' | 'distribution' | 'port' | 'team';

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  category: GalleryFilter;
  /** Masonry mixes 4:5 and 16:10 crops. */
  ratio: 'portrait' | 'landscape';
  /** Set when the client supplies footage instead of a still. */
  video?: string;
}

export const GALLERY_FILTERS: { value: GalleryFilter | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'fleet', label: 'Fleet' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'distribution', label: 'Distribution' },
  { value: 'port', label: 'Port' },
  { value: 'team', label: 'Team' },
];

/**
 * [TODO-CLIENT] Photography. Every entry points at a real path under
 * /public/images/gallery; until the files are supplied the branded placeholder
 * renders in their place. Some slots hold temporary public-domain stock
 * images until then (docs/image-credits.md lists them); none is AI-generated. The
 * filenames and the portrait/landscape pattern are fixed so the masonry does
 * not move when the photographs land — HANDOVER.md has the shot list.
 */
export const GALLERY: GalleryItem[] = [
  {
    src: '/images/gallery/gallery-morning-dispatch.jpg',
    alt: 'Trucks lined up before morning dispatch',
    caption: 'Morning dispatch, Tema',
    category: 'fleet',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-load-check.jpg',
    alt: 'A driver checking how a load is secured before departure',
    caption: 'Pre-departure check',
    category: 'fleet',
    ratio: 'portrait',
  },
  {
    src: '/images/gallery/gallery-pallet-loading.jpg',
    alt: 'Palletised goods being loaded onto a truck for a nationwide delivery',
    caption: 'Loading for a nationwide run',
    category: 'distribution',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-rigid-truck-accra.jpg',
    alt: 'A rigid truck on a delivery route',
    caption: 'On route, Greater Accra',
    category: 'fleet',
    ratio: 'portrait',
  },
  {
    src: '/images/gallery/gallery-goods-receiving.jpg',
    alt: 'Goods being received into a warehouse',
    caption: 'Goods received',
    category: 'warehouse',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-pallet-put-away.jpg',
    alt: 'Pallets being moved inside a warehouse',
    caption: 'Put-away',
    category: 'warehouse',
    ratio: 'portrait',
  },
  {
    src: '/images/gallery/gallery-loading-bay.jpg',
    alt: 'A roller shutter door on an industrial building',
    caption: 'Loading door',
    category: 'warehouse',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-dispatch-planning.jpg',
    alt: 'A team planning the day’s dispatches',
    caption: 'Dispatch planning',
    category: 'team',
    ratio: 'portrait',
  },
  {
    src: '/images/gallery/gallery-retail-delivery.jpg',
    alt: 'A motor tricycle loaded with sacks',
    caption: 'Retail delivery',
    category: 'distribution',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-multi-drop-loading.jpg',
    alt: 'A person packing a cardboard box at a desk',
    caption: 'Packing',
    category: 'distribution',
    ratio: 'portrait',
  },
  {
    src: '/images/gallery/gallery-delivery-signed.jpg',
    alt: 'A person filling in a form on a clipboard beside a parcel',
    caption: 'Signed for',
    category: 'distribution',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-highway-dusk.jpg',
    alt: 'A truck on a national highway at dusk',
    caption: 'On the road at dusk',
    category: 'fleet',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-import-documents.jpg',
    alt: 'A worker in a high-visibility vest writing on a clipboard',
    caption: 'Documents checked',
    category: 'port',
    ratio: 'portrait',
  },
  {
    src: '/images/gallery/gallery-port-collection.jpg',
    alt: 'A reach stacker beside a train of containers in a port yard',
    caption: 'Container handling',
    category: 'port',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-export-cargo.jpg',
    alt: 'The doors of stacked shipping containers',
    caption: 'Export cargo',
    category: 'port',
    ratio: 'portrait',
  },
  {
    src: '/images/gallery/gallery-driver-briefing.jpg',
    alt: 'A hard hat, work gloves, safety glasses and ear plugs on a table',
    caption: 'Safety equipment',
    category: 'team',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-stock-check.jpg',
    alt: 'Stock records being checked in a warehouse',
    caption: 'Stock check',
    category: 'warehouse',
    ratio: 'portrait',
  },
  {
    src: '/images/gallery/gallery-distributor-unloading.jpg',
    alt: 'A delivery being unloaded at a distributor’s warehouse',
    caption: 'Unloading at a distributor',
    category: 'distribution',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-cross-docking.jpg',
    alt: 'Goods moved straight from an inbound to an outbound vehicle at the cross-dock',
    caption: 'Cross-docking',
    category: 'warehouse',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-pallet-wrapping.jpg',
    alt: 'Goods being wrapped and secured on a pallet',
    caption: 'Wrapped and secured',
    category: 'warehouse',
    ratio: 'portrait',
  },
  {
    src: '/images/gallery/gallery-container-unloading.jpg',
    alt: 'A container being unloaded at a warehouse',
    caption: 'Container unloading',
    category: 'port',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-last-mile-tema.jpg',
    alt: 'A light delivery vehicle',
    caption: 'Last-mile, Tema',
    category: 'fleet',
    ratio: 'portrait',
  },
  {
    src: '/images/gallery/gallery-head-office.jpg',
    alt: 'An office building',
    caption: 'Head office, Free Zone Enclave',
    category: 'team',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-first-light-departure.jpg',
    alt: 'A loaded truck leaving at first light',
    caption: 'First light departure',
    category: 'fleet',
    ratio: 'portrait',
  },
];

export const GALLERY_PAGE_SIZE = 12;
