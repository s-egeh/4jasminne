import type { LucideIcon } from 'lucide-react';
import {
  Boxes,
  ClipboardCheck,
  Container,
  Factory,
  FileText,
  Layers,
  MapPinned,
  Package,
  Repeat,
  Route,
  Ship,
  ShoppingCart,
  Store,
  Timer,
  Truck,
  Warehouse,
} from 'lucide-react';

/*
 * [TODO-CLIENT] Service set and slugs proposed for sign-off. The four below
 * replace the previous site's divisions; confirm the list, the names and the
 * wording, and say which capabilities are actually offered today. Remove a
 * capability or a scope line rather than leaving one the business cannot
 * deliver.
 */
export type ServiceSlug =
  | 'freight-haulage'
  | 'warehousing-storage'
  | 'distribution'
  | 'freight-forwarding';

export interface Capability {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface GlanceRow {
  label: string;
  value: string;
}

export interface Service {
  slug: ServiceSlug;
  index: string;
  /** Short label for nav, cards and cross-links. */
  name: string;
  /** Full service name, used as the /about tab heading and the schema serviceType. */
  division: string;
  /** H1 on the detail page. */
  heading: string;
  standfirst: string;
  /** One-line description used on the homepage grid. */
  short: string;
  /**
   * The mega-menu line. `short` runs to three lines in a menu card, which is
   * what left the VIEW links on a ragged baseline; these are held to one line
   * at 1440px and say nothing `short` does not already say.
   */
  menuLine: string;
  /** Two-sentence description used on the services overview rows. */
  summary: string;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
  heroImage: string;
  heroImageAlt: string;
  /** The service in three or four lines — /services rows and the /about tabs. */
  bullets: string[];
  overview: string[];
  glance: GlanceRow[];
  capabilities: Capability[];
  gallery: { src: string; alt: string }[];
}

/*
 * Each service's photograph is named after its slug (service-<slug>.jpg), so
 * the photograph for /services/distribution is service-distribution.jpg.
 * HANDOVER.md lists every slot and what it should show.
 */
export const SERVICES: Service[] = [
  {
    slug: 'freight-haulage',
    index: '01',
    name: 'Freight & Haulage',
    division: 'Road Freight and Haulage',
    heading: 'Road freight and haulage',
    standfirst: 'Full loads and part loads by road, nationwide from the Free Zone Enclave in Tema.',
    short: 'Road freight nationwide, as full truckloads or part loads, collected and delivered to schedule.',
    menuLine: 'Full and part loads by road, nationwide.',
    summary:
      'Road freight across Ghana as full truckloads (FTL) or part loads (LTL). Each movement is planned around the collection and delivery windows the client needs.',
    icon: Truck,
    image: '/images/services/service-freight-haulage.jpg',
    imageAlt: 'A truck and trailer on a highway below mountains',
    heroImage: '/images/services/service-freight-haulage.jpg',
    heroImageAlt: 'A truck and trailer on a highway below mountains',
    bullets: [
      'Full truckload (FTL) movements, nationwide.',
      'Part-load (LTL) movements for smaller consignments.',
      'Collection and delivery planned to agreed windows.',
    ],
    overview: [
      '4Jasmine Dr moves goods by road across Ghana from its base in the Free Zone Enclave, Tema — whole truckloads for clients with the volume to fill a vehicle, and part loads for consignments that do not.',
      'A full load travels direct from collection to delivery. A part load shares the vehicle with other consignments heading the same way, which brings the cost down when the volume does not justify a truck of its own.',
      'Either way, the movement is planned against the collection and delivery windows you give us, and the price is agreed before anything is loaded.',
    ],
    glance: [
      { label: 'Service', value: 'Road freight and haulage' },
      { label: 'Coverage', value: 'Nationwide from Tema' },
      { label: 'Load types', value: 'Full truckload (FTL) and part load (LTL)' },
      { label: 'Engagement', value: 'Per consignment or ongoing arrangement' },
    ],
    capabilities: [
      {
        title: 'Full truckload (FTL)',
        description: 'A vehicle dedicated to one consignment, travelling direct from collection to delivery.',
        icon: Truck,
      },
      {
        title: 'Part load (LTL)',
        description: 'Smaller consignments grouped with others on the same route, so you pay for the space used.',
        icon: Boxes,
      },
      {
        title: 'Route and schedule planning',
        description: 'Collection and delivery planned against the windows you need, confirmed before dispatch.',
        icon: Route,
      },
      {
        title: 'Port collections',
        description: 'Cargo collected from Tema Port and taken on to its destination, or into storage.',
        icon: Container,
      },
    ],
    gallery: [
      { src: '/images/gallery/gallery-morning-dispatch.jpg', alt: 'Trucks ready for dispatch' },
      { src: '/images/gallery/gallery-load-check.jpg', alt: 'A driver checking a load before departure' },
      { src: '/images/gallery/gallery-pallet-loading.jpg', alt: 'Palletised goods being loaded for a nationwide delivery' },
    ],
  },
  {
    slug: 'warehousing-storage',
    index: '02',
    name: 'Warehousing & Storage',
    division: 'Warehousing and Storage',
    heading: 'Warehousing and storage',
    standfirst: 'Short- and long-term storage, inventory handling and cross-docking in Tema.',
    short: 'Short- and long-term storage with inventory handling and cross-docking, close to Tema Port.',
    menuLine: 'Storage, inventory handling and cross-docking.',
    summary:
      'Short- and long-term storage close to Tema Port, with goods received, recorded and released on instruction. Cross-docking moves goods straight from inbound to outbound when they do not need to be stored.',
    icon: Warehouse,
    image: '/images/services/service-warehousing-storage.jpg',
    imageAlt: 'Stacks of wooden pallets in an open yard',
    heroImage: '/images/services/service-warehousing-storage.jpg',
    heroImageAlt: 'Stacks of wooden pallets in an open yard',
    bullets: [
      'Short-term and long-term storage.',
      'Goods received, recorded and released on instruction.',
      'Cross-docking from inbound to outbound.',
    ],
    overview: [
      'Storage sits between the port and the market. 4Jasmine Dr holds goods for clients who need somewhere to put them between arrival and sale — for a few days while a consignment is broken down, or for as long as the stock takes to move.',
      'Goods are received against your paperwork, recorded, and released on your instruction. Where a consignment does not need to be stored at all, cross-docking moves it from the inbound vehicle to the outbound one with no time on the shelf.',
      'Because storage, haulage and distribution are run together, goods can leave the warehouse on our own vehicles without a second company being brought in.',
    ],
    glance: [
      { label: 'Service', value: 'Warehousing and storage' },
      { label: 'Location', value: 'Free Zone Enclave, Tema' },
      { label: 'Storage terms', value: 'Short-term and long-term' },
      { label: 'Engagement', value: 'Per consignment or ongoing arrangement' },
    ],
    capabilities: [
      {
        title: 'Short-term storage',
        description: 'Goods held for days or weeks while a consignment is broken down, sold or scheduled out.',
        icon: Timer,
      },
      {
        title: 'Long-term storage',
        description: 'Stock held on an ongoing arrangement and drawn down as you need it.',
        icon: Warehouse,
      },
      {
        title: 'Inventory handling',
        description: 'Goods received, recorded, picked and released against your instructions.',
        icon: ClipboardCheck,
      },
      {
        title: 'Cross-docking',
        description: 'Inbound goods sorted straight onto outbound vehicles, with no time in storage.',
        icon: Repeat,
      },
    ],
    gallery: [
      { src: '/images/gallery/gallery-goods-receiving.jpg', alt: 'Goods being received into a warehouse' },
      { src: '/images/gallery/gallery-pallet-put-away.jpg', alt: 'Pallets being moved inside a warehouse' },
      { src: '/images/gallery/gallery-loading-bay.jpg', alt: 'A roller shutter door on an industrial building' },
    ],
  },
  {
    slug: 'distribution',
    index: '03',
    name: 'Distribution',
    division: 'Distribution and Last-Mile Delivery',
    heading: 'Distribution and last-mile delivery',
    standfirst: 'Scheduled and last-mile distribution to retail and trade customers.',
    short: 'Scheduled distribution runs and last-mile delivery to retail and trade customers.',
    menuLine: 'Scheduled runs and last-mile delivery.',
    summary:
      'Scheduled distribution runs and last-mile delivery to the retail and trade customers who buy from you. Goods can go out from our warehouse or be collected from yours.',
    icon: Store,
    image: '/images/services/service-distribution.jpg',
    imageAlt: 'A cardboard carton marked for order and item numbers',
    heroImage: '/images/services/service-distribution.jpg',
    heroImageAlt: 'A cardboard carton marked for order and item numbers',
    bullets: [
      'Scheduled distribution runs to regular delivery points.',
      'Last-mile delivery to retail and trade customers.',
      'Dispatch from our warehouse or collection from yours.',
    ],
    overview: [
      'Distribution is the part of the chain your customers see. 4Jasmine Dr delivers to the retailers, wholesalers and trade customers who buy from you — on a scheduled run to regular delivery points, or as last-mile deliveries when an order needs to go out on its own.',
      'Goods can be dispatched from stock held in our warehouse, or collected from yours and delivered on.',
      'A delivery is not finished until it is handed over. Each drop is planned around the delivery point — its access, its receiving hours, and who is there to sign for it.',
    ],
    glance: [
      { label: 'Service', value: 'Distribution and last-mile delivery' },
      { label: 'Coverage', value: 'Greater Accra and nationwide' },
      { label: 'Typical customers', value: 'Retail, wholesale and trade' },
      { label: 'Engagement', value: 'Scheduled runs or per order' },
    ],
    capabilities: [
      {
        title: 'Scheduled distribution',
        description: 'Regular runs to the same delivery points, planned around their receiving days.',
        icon: Repeat,
      },
      {
        title: 'Last-mile delivery',
        description: 'Individual orders taken the final stretch to a shop, site or customer address.',
        icon: MapPinned,
      },
      {
        title: 'Multi-drop runs',
        description: 'Several delivery points served on one route, in a planned order.',
        icon: Route,
      },
      {
        title: 'Retail and trade delivery',
        description: 'Deliveries timed to the hours a shop or trade counter can receive goods.',
        icon: ShoppingCart,
      },
    ],
    gallery: [
      { src: '/images/gallery/gallery-retail-delivery.jpg', alt: 'A motor tricycle loaded with sacks' },
      { src: '/images/gallery/gallery-multi-drop-loading.jpg', alt: 'A person packing a cardboard box at a desk' },
      { src: '/images/gallery/gallery-delivery-signed.jpg', alt: 'A person filling in a form on a clipboard beside a parcel' },
    ],
  },
  {
    slug: 'freight-forwarding',
    index: '04',
    name: 'Freight Forwarding',
    division: 'Freight Forwarding and Documentation Support',
    heading: 'Freight forwarding',
    standfirst: 'Import and export coordination, with support on port and customs documentation.',
    short: 'Import and export coordination, with support on the port and customs paperwork a movement needs.',
    menuLine: 'Import and export coordination and paperwork.',
    summary:
      'Coordination of import and export movements through Tema Port, with support on the port and customs documentation they need. The goods can then move straight into storage or onward delivery.',
    icon: Ship,
    image: '/images/services/service-freight-forwarding.jpg',
    imageAlt: 'Container stacks and cranes at a port, seen from above',
    heroImage: '/images/services/service-freight-forwarding.jpg',
    heroImageAlt: 'Container stacks and cranes at a port, seen from above',
    bullets: [
      'Coordination of import and export movements.',
      'Support with port and customs documentation.',
      'Onward storage or delivery once goods are released.',
    ],
    overview: [
      'An import or export movement involves more parties than a road delivery — the shipping line, the port, customs, and often a clearing agent. 4Jasmine Dr coordinates the movement between them so that you have one point of contact instead of several.',
      'We support the documentation the movement depends on: checking that the paperwork is complete and consistent before the goods arrive, and following it through the port.',
      'Once goods are released, they can come straight into storage in the Free Zone Enclave or go on to their destination on our vehicles, without changing hands again.',
    ],
    glance: [
      { label: 'Service', value: 'Freight forwarding and documentation support' },
      { label: 'Port', value: 'Tema' },
      { label: 'Direction', value: 'Imports and exports' },
      { label: 'Engagement', value: 'Per shipment or ongoing arrangement' },
    ],
    capabilities: [
      {
        title: 'Import coordination',
        description: 'Arrivals followed from vessel to release, with collection booked for when the goods are free.',
        icon: Ship,
      },
      {
        title: 'Export coordination',
        description: 'Outbound cargo collected, documented and delivered to the port against the sailing.',
        icon: Container,
      },
      {
        title: 'Documentation support',
        description: 'Port and customs paperwork checked for completeness and consistency before it is needed.',
        icon: FileText,
      },
      {
        title: 'Onward storage and delivery',
        description: 'Released goods taken into our warehouse or delivered on, with no second handover.',
        icon: Layers,
      },
    ],
    gallery: [
      { src: '/images/gallery/gallery-import-documents.jpg', alt: 'A worker in a high-visibility vest writing on a clipboard' },
      { src: '/images/gallery/gallery-port-collection.jpg', alt: 'A reach stacker beside a train of containers in a port yard' },
      { src: '/images/gallery/gallery-export-cargo.jpg', alt: 'The doors of stacked shipping containers' },
    ],
  },
];

export const getService = (slug: string): Service | undefined =>
  SERVICES.find((service) => service.slug === slug);

export const getSiblingServices = (slug: string): Service[] =>
  SERVICES.filter((service) => service.slug !== slug);

/**
 * Sectors served — shared by the service detail template and /clients.
 * [TODO-CLIENT] Confirm these are the sectors the business works with.
 */
export const SECTORS: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: 'Importers',
    description: 'Goods collected from the port, stored if needed, and distributed to market.',
    icon: Ship,
  },
  {
    title: 'Manufacturers',
    description: 'Inputs brought in and finished goods taken out to distributors and customers.',
    icon: Factory,
  },
  {
    title: 'Wholesale and distribution',
    description: 'Stock held and drawn down, with deliveries out to the trade.',
    icon: Warehouse,
  },
  {
    title: 'Retail',
    description: 'Scheduled deliveries to shops and outlets, timed to their receiving hours.',
    icon: Store,
  },
  {
    title: 'Fast-moving consumer goods',
    description: 'Packaged goods moved in volume on regular distribution runs.',
    icon: Package,
  },
  {
    title: 'Exporters',
    description: 'Outbound cargo collected, documented and delivered to the port.',
    icon: Container,
  },
];

/** How we work — a genuine four-step sequence, which is why it is numbered. */
export const PROCESS_STEPS: { index: string; title: string; description: string }[] = [
  {
    index: '01',
    title: 'Enquiry',
    description: 'You send the goods, the collection and delivery points, and the dates.',
  },
  {
    index: '02',
    title: 'Assessment and quote',
    description: 'Operations checks capacity, route and handling, then returns written pricing.',
  },
  {
    index: '03',
    title: 'Scheduling and dispatch',
    description: 'The vehicle and crew are assigned, checked and dispatched against the agreed window.',
  },
  {
    index: '04',
    title: 'Delivery and confirmation',
    description: 'Goods are delivered, signed for and confirmed back to your team.',
  },
];

/* ------------------------------------------------------------------ *
 * What's included / what's not — one block per service detail page.
 *
 * The single most useful block for a procurement reader, and it costs nothing
 * to be honest about scope. Excluded items are things a reader might
 * reasonably assume are covered — listing them prevents an argument later.
 *
 * [TODO-CLIENT] Confirm every line in both columns.
 * ------------------------------------------------------------------ */

export interface ServiceScope {
  included: string[];
  excluded: string[];
}

export const SERVICE_SCOPE: Record<ServiceSlug, ServiceScope> = {
  'freight-haulage': {
    included: [
      'Road freight nationwide from Tema',
      'Full truckload and part-load movements',
      'Vehicle matched to the goods and the delivery point',
      'Collection and delivery planned to agreed windows',
      'Load securing and a check before departure',
      'Delivery documentation signed at handover',
    ],
    excluded: [
      'Loading and unloading equipment at your premises, unless agreed',
      'Cargo insurance arranged on your behalf',
      'Goods that need temperature control',
      'Hazardous goods, unless agreed in writing beforehand',
    ],
  },

  'warehousing-storage': {
    included: [
      'Short-term and long-term storage',
      'Goods received and checked against your paperwork',
      'Inventory records kept for the goods held',
      'Picking and release on your instruction',
      'Cross-docking from inbound to outbound vehicles',
      'Onward delivery on our own vehicles, by arrangement',
    ],
    excluded: [
      'Temperature-controlled or cold storage',
      'Insurance of stored goods on your behalf',
      'Repacking, labelling or assembly, unless agreed',
      'Goods that may not legally be stored or traded',
    ],
  },

  distribution: {
    included: [
      'Scheduled runs to regular delivery points',
      'Last-mile delivery of individual orders',
      'Multi-drop routes planned in delivery order',
      'Dispatch from our warehouse or collection from yours',
      'Delivery documentation signed at each drop',
    ],
    excluded: [
      'Collection of payment from your customers',
      'Installation or set-up of goods after delivery',
      'Returns handling, unless agreed',
      'Deliveries outside the agreed delivery windows',
    ],
  },

  'freight-forwarding': {
    included: [
      'Coordination of import and export movements through Tema Port',
      'Checking shipping and customs documents for completeness',
      'Liaison with the port, the shipping line and your clearing agent',
      'Collection of released goods from the port',
      'Onward storage or delivery after release',
    ],
    excluded: [
      'Customs declarations lodged as a licensed customs broker',
      'Payment of duties, taxes and port charges on your behalf',
      'Sea or air freight booked in our own name',
      'Goods requiring a permit or licence that has not been obtained',
    ],
  },
};

/* ------------------------------------------------------------------ *
 * Per-service extra sections, rendered by ServiceExtras.
 *
 * [TODO-CLIENT: review wording] — everything below.
 * ------------------------------------------------------------------ */

export interface ComparisonOption {
  title: string;
  suits: string;
  priced: string;
  gets: string;
}

/** /services/freight-haulage — full load against part load. */
export const HAULAGE_COMPARISON: ComparisonOption[] = [
  {
    title: 'Full truckload (FTL)',
    suits: 'Consignments big enough to fill a vehicle, or goods that should not share space.',
    priced: 'Per vehicle, on distance, route and the time the vehicle is held.',
    gets: 'A vehicle dedicated to your goods, travelling direct with no intermediate stops.',
  },
  {
    title: 'Part load (LTL)',
    suits: 'Smaller consignments that do not justify a vehicle of their own.',
    priced: 'On the space and weight your goods take up, and the route.',
    gets: 'A lower cost for smaller volumes, in exchange for sharing the vehicle and its schedule.',
  },
];

export const HAULAGE_PLANNING_COPY =
  'Every movement starts with the same questions: what the goods are, how they are packed, where they are going and when they have to be there. The answers decide the vehicle, the route and the schedule — which is why the quote comes after them, not before.';

/** /services/warehousing-storage — short-term against long-term storage. */
export const STORAGE_COMPARISON: ComparisonOption[] = [
  {
    title: 'Short-term storage',
    suits: 'Goods between arrival and onward delivery, or stock waiting to be broken down.',
    priced: 'On the space used and the time held.',
    gets: 'Somewhere to put a consignment while the next step is arranged.',
  },
  {
    title: 'Long-term storage',
    suits: 'Stock that is drawn down over weeks or months.',
    priced: 'On an agreed arrangement, set against the space and the handling expected.',
    gets: 'Space held for your goods, with releases made on your instruction.',
  },
];

export const CROSS_DOCKING_COPY =
  'Not every consignment needs to be stored. Cross-docking takes goods off the inbound vehicle, sorts them, and loads them straight onto the outbound ones — so a container can be broken down into deliveries the same day, without the goods ever going onto a shelf.';

/** /services/distribution — the two ways distribution is bought. */
export const DISTRIBUTION_MODES: { title: string; points: string[] }[] = [
  {
    title: 'Scheduled distribution',
    points: [
      'Regular runs to the same delivery points',
      'Delivery days agreed with you in advance',
      'Suits steady, predictable volume',
    ],
  },
  {
    title: 'Last-mile delivery',
    points: [
      'Individual orders taken the final stretch',
      'Booked as orders come in',
      'Suits irregular or urgent volume',
    ],
  },
];

export const DISTRIBUTION_COPY =
  'Each drop is planned around the delivery point: when it can receive goods, how a vehicle gets to it, and who will sign for the delivery. Getting those right is the difference between a delivery made and a delivery attempted.';

/** /services/freight-forwarding */
export const FORWARDING_COMPLIANCE_COPY =
  'Import and export documentation is checked before goods move, not after. We tell you at the outset what a shipment needs from you, and where a movement needs a licence, a permit or a licensed customs broker, we say so before starting — rather than finding out at the port.';

export const FORWARDING_SIDES: { title: string; points: string[] }[] = [
  {
    title: 'What we coordinate',
    points: [
      'The movement between the shipping line, the port and the road',
      'A check of the documents before they are needed',
      'Collection from the port and onward storage or delivery',
    ],
  },
  {
    title: 'What we need from you',
    points: [
      'The shipping and commercial documents for the consignment',
      'Your clearing agent’s details, or a request that we introduce one',
      'Instructions for the goods once they are released',
    ],
  },
];

/**
 * Closing line for each tab panel in the /about "What we do" section. The tabs
 * used to show three bullets and stop, which read as unfinished — a list with
 * no conclusion.
 */
export const DIVISION_CLOSING: Record<ServiceSlug, string> = {
  'freight-haulage':
    'This is the service most clients meet first, and the one the others depend on to move what is stored, distributed or imported.',
  'warehousing-storage':
    'Because storage and transport are run together, goods leave the warehouse on our own vehicles instead of being handed to another company.',
  distribution:
    'Distribution draws on the warehouse and the fleet at once, so stock and delivery are planned in the same conversation.',
  'freight-forwarding':
    'Forwarding sits beside our own storage and road capacity, so goods released at the port do not change hands again before they arrive.',
};
