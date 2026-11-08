/**
 * /safety-compliance content.
 *
 * This page exists because procurement teams ask for it. Nothing on it claims a
 * certification, an accreditation, a licence or an audit — a false compliance
 * claim is the one kind of copy that costs a client rather than winning one.
 *
 * [TODO-CLIENT: review wording] — every block. Each describes a practice a
 * logistics and distribution operator should be able to stand behind; the
 * client must confirm that each one matches how the business actually works,
 * and delete any that does not. The `pending` notes are never rendered.
 */

export interface SafetyBlock {
  title: string;
  description: string;
  /** Handover note when the client must confirm before launch. Never rendered. */
  pending?: string;
}

export const SAFETY_STANDFIRST =
  'What we hold ourselves to in the warehouse and on the road, and what we can evidence for your audit.';

/** In the warehouse and on the road — section 01. */
export const OPERATIONAL_SAFETY: SafetyBlock[] = [
  {
    title: 'Goods receipt',
    description:
      'Goods are checked against the paperwork when they arrive. A shortage or damage is recorded and reported at receipt, not discovered later.',
    pending: 'Confirm the goods-receipt check.',
  },
  {
    title: 'Storage and stacking',
    description:
      'Goods are stored and stacked according to their packaging and weight, with walkways and loading areas kept clear.',
    pending: 'Confirm the storage practice described.',
  },
  {
    title: 'Handling equipment',
    description:
      'Handling equipment in the warehouse is operated only by staff trained to use it.',
    pending: 'Confirm what handling equipment is used and how operators are trained.',
  },
  {
    title: 'Pre-departure checks',
    description:
      'Vehicles are checked before they leave — tyres, brakes, lights and how the load is secured. A vehicle that fails a check does not go out on the promise of being looked at later.',
    pending: 'Confirm the pre-departure checks.',
  },
  {
    title: 'Load securing',
    description:
      'Loads are secured to suit the goods and the vehicle — strapped, wrapped or sheeted according to what is being carried — and checked before departure.',
  },
  {
    title: 'Defect reporting',
    description:
      'Drivers report vehicle defects at the end of a run, and a reported defect takes the vehicle out of service until it is cleared.',
    pending: 'Confirm the defect-reporting practice.',
  },
];

/** Vehicle compliance — section 02, dark band. */
export const VEHICLE_COMPLIANCE: SafetyBlock[] = [
  {
    title: 'Roadworthiness',
    description:
      'Roadworthiness is maintained per vehicle and renewed on schedule. A vehicle whose certification has lapsed does not carry goods.',
    pending: 'Confirm what may be stated about roadworthiness certification.',
  },
  {
    title: 'Insurance',
    description:
      'Vehicle insurance is maintained per vehicle. The cover that applies to a specific consignment is confirmed at quotation stage.',
    pending: 'Confirm the insurance position and what cover may be named publicly.',
  },
  {
    title: 'Licensing',
    description:
      'Licensing is maintained for the vehicles and for the drivers who operate them, and records are kept for both.',
    pending: 'Confirm what may be stated about vehicle and driver licensing.',
  },
  {
    title: 'Maintenance records',
    description:
      'Servicing runs to interval and is recorded per vehicle, so a vehicle’s maintenance history is a record rather than a recollection.',
    pending: 'Confirm maintenance is recorded per vehicle.',
  },
];

/** Section 03 — import and export documentation. */
export const TRADE_COMPLIANCE =
  'Import and export documentation is checked before goods move, not after. We tell you at the outset what a shipment needs from you, and where a movement needs a licence, a permit or a licensed customs broker, we say so before starting rather than proceeding without it.';

/** Section 03 — tax and accounting. */
export const FINANCIAL_COMPLIANCE =
  'The business keeps its tax and accounting records in line with Ghanaian requirements, and quotes, invoices and delivery records are kept so that one can be checked against another.';

/** Section 04 — what a client receives. */
export const DOCUMENTATION_PROVIDED: { label: string; value: string }[] = [
  { label: 'Written quote', value: 'Priced on the agreed factors, issued before the work starts' },
  { label: 'Goods received record', value: 'For goods taken into storage, noting their condition on arrival' },
  { label: 'Delivery documentation', value: 'Completed and signed at handover' },
  { label: 'Delivery and stock records', value: 'Kept so deliveries and stock can be reconciled against invoices' },
  { label: 'Invoice', value: 'Against the quote, or against the agreed rate schedule' },
];

export const DOCUMENTATION_PENDING =
  'Confirm the documentation list is complete, and whether any further documents can be offered to procurement teams.';

export const PROCUREMENT_COPY =
  'If your procurement process needs documentation before you can raise a purchase order, contact operations with the list. We will tell you what we can evidence and what we cannot, before you commit to anything.';
