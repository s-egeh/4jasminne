export type FleetCategory = 'long-haul' | 'rigid' | 'last-mile' | 'container' | 'handling';

export interface FleetSpec {
  label: string;
  value: string;
}

export interface FleetUnit {
  slug: string;
  name: string;
  category: FleetCategory;
  image: string;
  imageAlt: string;
  /** One line under the title. */
  summary: string;
  /**
   * Specs are qualitative by design.
   *
   * [TODO-CLIENT] Supply publishable capacities and unit counts. Until then no
   * capacity figure is invented and no placeholder string is rendered — add a
   * `{ label: 'Capacity', value: '…' }` row here when the client confirms.
   */
  specs: FleetSpec[];
  /** Lightbox set for this unit type. */
  gallery: { src: string; alt: string }[];
}

/*
 * [TODO-CLIENT] Confirm which of these vehicle and equipment types the business
 * operates, and delete any it does not. These are the types the four services
 * call for, described in general terms — not an inventory. Where vehicles are
 * hired in or subcontracted rather than owned, say so and the copy on /fleet
 * will be adjusted to match.
 *
 * Image paths are photography slots kept from the original build so that no
 * layout moves; HANDOVER.md says what each slot should now show.
 */

export const FLEET_FILTERS: { value: FleetCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'long-haul', label: 'Long-haul' },
  { value: 'rigid', label: 'Rigid trucks' },
  { value: 'last-mile', label: 'Last-mile' },
  { value: 'container', label: 'Container' },
  { value: 'handling', label: 'Warehouse handling' },
];

export const FLEET: FleetUnit[] = [
  {
    slug: 'articulated-truck',
    name: 'Articulated trucks',
    category: 'long-haul',
    image: '/images/fleet/fleet-trailer.jpg',
    imageAlt: 'A 4Jasmine Dr articulated truck loaded for a long-haul delivery',
    summary: 'Full loads over long distances, from Tema to the regions.',
    specs: [
      { label: 'Type', value: 'Tractor unit and semi-trailer' },
      { label: 'Typical load', value: 'Full truckloads of palletised or bagged goods' },
      { label: 'Typical route', value: 'Tema to Kumasi, Takoradi and Tamale' },
      { label: 'Availability', value: 'Per consignment, or planned under an arrangement' },
    ],
    gallery: [
      { src: '/images/fleet/fleet-trailer.jpg', alt: 'Articulated truck on a national route' },
      { src: '/images/gallery/gallery-01.jpg', alt: 'Trucks ready for dispatch in Tema' },
    ],
  },
  {
    slug: 'rigid-truck',
    name: 'Rigid box and curtain-side trucks',
    category: 'rigid',
    image: '/images/fleet/fleet-tanker.jpg',
    imageAlt: 'A 4Jasmine Dr rigid box truck being loaded at the warehouse',
    summary: 'Enclosed vehicles for part loads and distribution runs.',
    specs: [
      { label: 'Type', value: 'Rigid truck, box or curtain-side body' },
      { label: 'Typical load', value: 'Part loads, cartons and mixed consignments' },
      { label: 'Typical route', value: 'Tema and Greater Accra, and regional runs' },
      { label: 'Availability', value: 'Per consignment, or on a scheduled run' },
    ],
    gallery: [
      { src: '/images/fleet/fleet-tanker.jpg', alt: 'Rigid box truck at the loading bay' },
      { src: '/images/gallery/gallery-03.jpg', alt: 'Goods being loaded for delivery' },
    ],
  },
  {
    slug: 'delivery-vehicle',
    name: 'Light delivery vehicles',
    category: 'last-mile',
    image: '/images/fleet/fleet-tipper.jpg',
    imageAlt: 'A 4Jasmine Dr light delivery vehicle at a retail drop',
    summary: 'Last-mile and multi-drop delivery to shops and trade customers.',
    specs: [
      { label: 'Type', value: 'Van and light commercial vehicle' },
      { label: 'Typical load', value: 'Orders for individual delivery points' },
      { label: 'Typical route', value: 'Multi-drop runs in and around Accra and Tema' },
      { label: 'Availability', value: 'Scheduled runs or per order' },
    ],
    gallery: [
      { src: '/images/fleet/fleet-tipper.jpg', alt: 'Light delivery vehicle on a distribution run' },
      { src: '/images/gallery/gallery-10.jpg', alt: 'Delivery vehicle loaded for a multi-drop run' },
    ],
  },
  {
    slug: 'container-trailer',
    name: 'Container trailers',
    category: 'container',
    image: '/images/fleet/fleet-flatbed.jpg',
    imageAlt: 'A container on a 4Jasmine Dr trailer leaving Tema Port',
    summary: 'Containers between Tema Port, the Free Zone Enclave and inland.',
    specs: [
      { label: 'Type', value: 'Flatbed or skeletal container trailer' },
      { label: 'Typical load', value: 'Import and export containers' },
      { label: 'Typical route', value: 'Tema Port to the Free Zone Enclave and inland' },
      { label: 'Availability', value: 'Per container, booked against release' },
    ],
    gallery: [
      { src: '/images/fleet/fleet-flatbed.jpg', alt: 'Container on a trailer at the port' },
      { src: '/images/gallery/gallery-14.jpg', alt: 'Container being collected at Tema Port' },
    ],
  },
  {
    slug: 'handling-equipment',
    name: 'Warehouse handling equipment',
    category: 'handling',
    image: '/images/fleet/fleet-excavator.jpg',
    imageAlt: 'Forklift moving palletised goods inside the 4Jasmine Dr warehouse',
    summary: 'Equipment for receiving, storing and loading goods in the warehouse.',
    specs: [
      { label: 'Type', value: 'Forklifts and pallet trucks' },
      { label: 'Typical use', value: 'Receiving, put-away, picking and loading' },
      { label: 'Location', value: 'Warehouse in the Free Zone Enclave, Tema' },
    ],
    gallery: [
      { src: '/images/fleet/fleet-excavator.jpg', alt: 'Forklift in the warehouse' },
      { src: '/images/gallery/gallery-06.jpg', alt: 'Pallets being moved inside the warehouse' },
    ],
  },
];

/** /fleet, dark band. [TODO-CLIENT: review wording] */
export const MAINTENANCE_PILLARS: { title: string; lines: string[]; icon: string }[] = [
  {
    title: 'Preventive maintenance',
    lines: [
      'Servicing is scheduled to interval rather than triggered by a breakdown.',
      'The aim is a vehicle that turns up when it was booked, which is what a client is buying.',
    ],
    icon: 'Wrench',
  },
  {
    title: 'Safety compliance',
    lines: [
      'Roadworthiness, insurance and licensing are kept current per vehicle.',
      'A vehicle outside its compliance window does not carry goods.',
    ],
    icon: 'ShieldCheck',
  },
  {
    title: 'Dispatch supervision',
    lines: [
      'Every movement is assigned, checked and supervised against the agreed window.',
      'Route and load are confirmed before departure, not after.',
    ],
    icon: 'ClipboardCheck',
  },
  {
    title: 'Driver standards',
    lines: [
      'Drivers are taken on for experience and a clean record.',
      'How they drive and how they hand over goods is supervised, not assumed.',
    ],
    icon: 'GraduationCap',
  },
];
