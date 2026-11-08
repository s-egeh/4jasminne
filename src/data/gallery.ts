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
 * renders in their place. No stock or AI-generated imagery is used. The
 * filenames and the portrait/landscape pattern are fixed so the masonry does
 * not move when the photographs land — HANDOVER.md has the shot list.
 */
export const GALLERY: GalleryItem[] = [
  {
    src: '/images/gallery/gallery-morning-dispatch.jpg',
    alt: '4Jasmine Dr trucks lined up in the Free Zone Enclave before morning dispatch',
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
    alt: 'A 4Jasmine Dr rigid truck on a delivery route in Greater Accra',
    caption: 'On route, Greater Accra',
    category: 'fleet',
    ratio: 'portrait',
  },
  {
    src: '/images/gallery/gallery-goods-receiving.jpg',
    alt: 'Goods being received into the 4Jasmine Dr warehouse',
    caption: 'Goods received',
    category: 'warehouse',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-pallet-put-away.jpg',
    alt: 'Pallets being moved inside the warehouse',
    caption: 'Put-away',
    category: 'warehouse',
    ratio: 'portrait',
  },
  {
    src: '/images/gallery/gallery-loading-bay.jpg',
    alt: 'Goods staged at the loading bay ready for dispatch',
    caption: 'Staged for dispatch',
    category: 'warehouse',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-dispatch-planning.jpg',
    alt: 'The operations team planning the day’s dispatches',
    caption: 'Dispatch planning',
    category: 'team',
    ratio: 'portrait',
  },
  {
    src: '/images/gallery/gallery-retail-delivery.jpg',
    alt: 'Cartons being handed over at a retail delivery point',
    caption: 'Retail delivery',
    category: 'distribution',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-multi-drop-loading.jpg',
    alt: 'A delivery vehicle loaded in drop order for a multi-drop run',
    caption: 'Multi-drop run',
    category: 'distribution',
    ratio: 'portrait',
  },
  {
    src: '/images/gallery/gallery-delivery-signed.jpg',
    alt: 'A delivery being signed for at a trade customer',
    caption: 'Signed for',
    category: 'distribution',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-highway-dusk.jpg',
    alt: 'A 4Jasmine Dr truck on a national highway at dusk',
    caption: 'On the road at dusk',
    category: 'fleet',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-import-documents.jpg',
    alt: 'Shipping documents being checked for an import consignment',
    caption: 'Documents checked',
    category: 'port',
    ratio: 'portrait',
  },
  {
    src: '/images/gallery/gallery-port-collection.jpg',
    alt: 'A container being collected at Tema Port',
    caption: 'Collection, Tema Port',
    category: 'port',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-export-cargo.jpg',
    alt: 'Export cargo being prepared for delivery to the port',
    caption: 'Export cargo',
    category: 'port',
    ratio: 'portrait',
  },
  {
    src: '/images/gallery/gallery-driver-briefing.jpg',
    alt: 'Drivers being briefed before departure',
    caption: 'Driver briefing',
    category: 'team',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-stock-check.jpg',
    alt: 'Stock records being checked in the warehouse',
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
    alt: 'A container being unloaded at the warehouse',
    caption: 'Container unloading',
    category: 'port',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-last-mile-tema.jpg',
    alt: 'A 4Jasmine Dr light delivery vehicle in Tema',
    caption: 'Last-mile, Tema',
    category: 'fleet',
    ratio: 'portrait',
  },
  {
    src: '/images/gallery/gallery-head-office.jpg',
    alt: 'The 4Jasmine Dr office in the Free Zone Enclave, Tema',
    caption: 'Head office, Free Zone Enclave',
    category: 'team',
    ratio: 'landscape',
  },
  {
    src: '/images/gallery/gallery-first-light-departure.jpg',
    alt: 'A loaded truck leaving the Free Zone Enclave at first light',
    caption: 'First light departure',
    category: 'fleet',
    ratio: 'portrait',
  },
];

export const GALLERY_PAGE_SIZE = 12;
