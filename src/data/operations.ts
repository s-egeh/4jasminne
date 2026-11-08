import type { LucideIcon } from 'lucide-react';
import {
  Boxes,
  ClipboardCheck,
  Container,
  Package,
  PackageCheck,
  Route,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Warehouse,
} from 'lucide-react';

/*
 * [TODO-CLIENT: review wording] — everything in this file. It describes how
 * a logistics and distribution operator works in general terms; the client
 * must confirm each block matches practice.
 */

/* ------------------------------------------------------------------ *
 * Goods we handle — homepage, after the services grid.
 * [TODO-CLIENT] Confirm the goods handled, and any that are refused.
 * ------------------------------------------------------------------ */

export const CARGO_TYPES: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: 'Palletised goods',
    description: 'Stock on pallets, moved and stored as units from receipt to delivery.',
    icon: Boxes,
  },
  {
    title: 'Cartons and packaged goods',
    description: 'Packaged consumer and trade goods, picked and delivered by the carton.',
    icon: Package,
  },
  {
    title: 'Containerised cargo',
    description: 'Import and export containers moved between Tema Port and inland destinations.',
    icon: Container,
  },
  {
    title: 'Bagged and dry goods',
    description: 'Bagged and dry stock moved in volume and stored until it is called off.',
    icon: Warehouse,
  },
  {
    title: 'Retail and trade stock',
    description: 'Orders delivered to shops, wholesalers and trade counters on scheduled runs.',
    icon: ShoppingCart,
  },
  {
    title: 'Full and part loads',
    description: 'Whole truckloads direct to destination, or part loads sharing a vehicle.',
    icon: Truck,
  },
];

/* ------------------------------------------------------------------ *
 * How a job runs — homepage, dark band after "Why 4Jasmine Dr".
 * Five steps, which is why PROCESS_STEPS (four, used on /services) is kept
 * separate rather than reconciled: they answer different questions.
 * ------------------------------------------------------------------ */

export const JOB_STEPS: { index: string; title: string; description: string }[] = [
  {
    index: '01',
    title: 'Enquiry',
    description:
      'You send the goods, the collection and delivery points and the dates. If you are not sure of the weight or volume, we work from what you have.',
  },
  {
    index: '02',
    title: 'Assessment',
    description:
      'Operations checks vehicle and storage availability, the route and the handling the goods need, then prices the work.',
  },
  {
    index: '03',
    title: 'Confirmation',
    description:
      'You receive a written quote. For repeat volume, we agree a rate schedule instead of quoting every consignment.',
  },
  {
    index: '04',
    title: 'Dispatch',
    description:
      'The vehicle and crew are assigned, the goods are loaded and secured, and the vehicle is checked before departure.',
  },
  {
    index: '05',
    title: 'Delivery and confirmation',
    description:
      'Goods are handed over, the paperwork is signed, and you get confirmation that the delivery is complete.',
  },
];

/* ------------------------------------------------------------------ *
 * Pricing factors — every service detail page, and the /quote panel.
 * Factors, not prices. Rates are not published.
 * ------------------------------------------------------------------ */

export const PRICING_FACTORS: { label: string; value: string }[] = [
  { label: 'Service', value: 'Freight, storage, distribution or forwarding' },
  { label: 'Distance', value: 'Collection to delivery, and any return leg' },
  { label: 'Weight / volume', value: 'Space the goods take on the vehicle or in storage' },
  { label: 'Handling', value: 'How the goods are packed, loaded and received' },
  { label: 'Frequency', value: 'One-off consignment, scheduled runs or ongoing volume' },
];

export const PRICING_CLOSING =
  'We quote in writing. For repeat volume we agree a rate schedule so you are not renegotiating every consignment.';

/* ------------------------------------------------------------------ *
 * What we need from you — service detail pages and /contact.
 * ------------------------------------------------------------------ */

export const ENQUIRY_CHECKLIST: { title: string; description: string }[] = [
  {
    title: 'Collection and delivery points',
    description: 'Where the goods start and where they have to end up, as precisely as you can give it.',
  },
  {
    title: 'Description of the goods',
    description: 'What they are, and whether they are palletised, cartoned, bagged or containerised.',
  },
  {
    title: 'Approximate weight or volume',
    description: 'An estimate is enough. If you are not sure, tell us what you do know and we will work from that.',
  },
  {
    title: 'Dates and timing',
    description: 'When the goods are ready, when they have to arrive, and whether either date can move.',
  },
  {
    title: 'Access and receiving hours',
    description: 'Loading bays, narrow streets, height limits, or fixed hours when the delivery point can receive.',
  },
  {
    title: 'Storage or documentation',
    description: 'Whether the goods need to be stored, and any port, customs or delivery paperwork involved.',
  },
];

/* ------------------------------------------------------------------ *
 * Operating standards — /about, dark band.
 * ------------------------------------------------------------------ */

export const OPERATING_STANDARDS: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: 'Plan before promising',
    description:
      'A date is committed against the vehicles, storage space and people actually available, so that once it is agreed it can be kept.',
    icon: Route,
  },
  {
    title: 'One point of contact',
    description:
      'Every consignment has someone in operations responsible for it. Clients are not handed between departments.',
    icon: ClipboardCheck,
  },
  {
    title: 'Paperwork that matches the goods',
    description:
      'Goods are recorded on receipt and signed for at handover, so deliveries and stock can be reconciled against invoices.',
    icon: PackageCheck,
  },
  {
    title: 'Safety is supervised',
    description:
      'Vehicle checks, load securing and safe handling in the warehouse are part of the job, not a policy on a shelf.',
    icon: ShieldCheck,
  },
];

/* ------------------------------------------------------------------ *
 * Maintenance programme — /fleet, dark band.
 * ------------------------------------------------------------------ */

export const MAINTENANCE_BLOCKS: { title: string; description: string }[] = [
  {
    title: 'Scheduled servicing',
    description: 'Servicing runs to interval and is recorded per vehicle, not deferred to a quieter week.',
  },
  {
    title: 'Pre-departure checks',
    description: 'Vehicles are checked before they leave — tyres, brakes, lights and load securing.',
  },
  {
    title: 'Defect reporting',
    description:
      'Drivers report defects at the end of a run; a reported defect takes the vehicle out of service until it is cleared.',
  },
  {
    title: 'Clean, dry load space',
    description: 'Load space is kept clean and dry, so goods arrive in the condition they were loaded in.',
  },
];

/* ------------------------------------------------------------------ *
 * Drivers and crews — /fleet, light band.
 * ------------------------------------------------------------------ */

export const DRIVERS_COPY =
  'The people driving the vehicles and handing over the goods are the part of 4Jasmine Dr your customers actually meet. How they drive, how they handle the goods and how they deal with the person signing for a delivery is held to the same standard as everything else.';

export const DRIVER_POINTS: { title: string; description: string }[] = [
  {
    title: 'Recruitment on experience',
    description: 'Time behind the wheel and a clean record count when drivers are taken on.',
  },
  {
    title: 'Care with the goods',
    description: 'Goods are loaded, secured and handed over as if they were the driver’s own.',
  },
  {
    title: 'Conduct on the road',
    description: 'A vehicle carries the company name at every junction. Conduct is supervised, not assumed.',
  },
  {
    title: 'Accountability for the load',
    description: 'The driver who takes a load is answerable for it, from securing to signature.',
  },
];

/* ------------------------------------------------------------------ *
 * Load securing and handling — /fleet.
 * ------------------------------------------------------------------ */

export const LOAD_SECURING: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: 'Palletised loads',
    description:
      'Pallets are loaded to the vehicle’s floor plan and strapped against movement, then sheeted where the goods or the weather require it.',
    icon: Boxes,
  },
  {
    title: 'Cartons and mixed loads',
    description:
      'Heavier cartons go underneath, drops are loaded in delivery order, and the load is secured so it does not shift as the vehicle empties.',
    icon: Package,
  },
  {
    title: 'Containers',
    description:
      'Containers are secured to the trailer at their locking points, and the route is checked for height and weight limits before departure.',
    icon: Container,
  },
];
