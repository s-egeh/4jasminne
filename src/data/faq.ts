import type { ServiceSlug } from './services';

export interface FaqItem {
  question: string;
  answer: string;
  /*
   * Set when the answer is a considered draft that the client must confirm
   * before launch. It is NEVER rendered — the drafted answer is what ships, so
   * a visitor never sees a placeholder. The string is the handover note, listed
   * in HANDOVER.md.
   */
  pending?: string;
}

export interface FaqGroup {
  /** Anchor id, also the sticky category-nav target. */
  id: string;
  label: string;
  /** Present when the group is also a service detail page's FAQ block. */
  service?: ServiceSlug;
  items: FaqItem[];
}

/*
 * The full set. /faq renders every group; /services renders the six-item
 * excerpt below and links here; each service detail page renders its own group
 * via getServiceFaqs().
 *
 * [TODO-CLIENT: review wording] — every answer. Where an answer depends on a
 * fact that has not been supplied, it says what is true (that it is agreed case
 * by case) rather than inventing a figure, and carries a `pending` note.
 */
export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: 'general',
    label: 'General',
    items: [
      {
        question: 'Where are you based?',
        answer:
          'In the Free Zone Enclave in Tema, Greater Accra, close to Tema Port. Goods are collected, stored and distributed from there.',
      },
      {
        question: 'Which parts of Ghana do you deliver to?',
        answer:
          'Nationwide. The routes we run most often are Tema to Accra, Kumasi, Takoradi and Tamale, but a destination that is not on that list is still one we will quote.',
        pending: 'Confirm the regular routes and add any that are missing.',
      },
      {
        question: 'What services do you offer?',
        answer:
          'Road freight and haulage, warehousing and storage, scheduled and last-mile distribution, and freight forwarding with support on port and customs documentation.',
      },
      {
        question: 'Do you handle one-off consignments or only contracts?',
        answer:
          'Both. A consignment can be quoted on its own, or volume can be planned under an ongoing arrangement with an agreed rate.',
      },
      {
        question: 'Can one company store and deliver my goods?',
        answer:
          'Yes. Storage, road freight and distribution are run together, so goods can leave the warehouse on our own vehicles without a second company being brought in.',
      },
      {
        question: 'How do I get a quote?',
        answer:
          'Send the goods, the collection and delivery points and the dates through the quote form, or call the operations line directly.',
      },
      {
        question: 'What goods do you handle?',
        answer:
          'Palletised, cartoned, bagged and containerised goods for importers, manufacturers, wholesalers and retailers. Tell us what the goods are and how they are packed, and we will confirm how they will be handled.',
        pending: 'Confirm the goods handled and any that are refused.',
      },
      {
        question: 'Do you handle chilled, frozen or hazardous goods?',
        answer:
          'Not as standard. Ask before you book: we will tell you plainly whether we can take the consignment rather than accept it and work it out later.',
        pending: 'Confirm whether temperature-controlled or hazardous goods are ever handled.',
      },
    ],
  },

  {
    id: 'coverage',
    label: 'Coverage and routes',
    items: [
      {
        question: 'Which routes do you run most often?',
        answer:
          'Tema to Accra, Kumasi, Takoradi and Tamale, and transfers between Tema Port and the Free Zone Enclave. Those are the regular runs; we quote nationwide.',
        pending: 'Confirm the route list and add any regular routes missing from it.',
      },
      {
        question: 'Do you move goods across borders?',
        answer:
          'Movements into the West African sub-region are quoted case by case, against the documentation the route and the goods require. Documentation is prepared before the goods move, not after.',
        pending: 'Confirm which cross-border routes, if any, are actively served.',
      },
      {
        question: 'My destination is not on your list. Can you still quote it?',
        answer:
          'Yes. The listed routes are the regular runs, not the limit of where we go. Send the collection and delivery points and we will price it.',
      },
      {
        question: 'Does access at the delivery point affect the price?',
        answer:
          'It can. Access, receiving hours and how long the vehicle waits all affect how long it is committed to a job, so tell us about a narrow street, a missing loading bay or fixed receiving hours when you enquire rather than on the day.',
      },
    ],
  },

  {
    id: 'safety',
    label: 'Safety and compliance',
    items: [
      {
        question: 'What checks happen before a vehicle leaves?',
        answer:
          'Vehicles are checked before departure — tyres, brakes, lights and how the load is secured. A defect reported at the end of a run takes the vehicle out of service until it is fixed.',
        pending: 'Confirm the pre-departure checks described here match practice.',
      },
      {
        question: 'Can you provide compliance documents for our procurement team?',
        answer:
          'Contact operations with what your audit requires and we will confirm what we can evidence before you commit to anything.',
        pending: 'Confirm which compliance documents may be offered and named on the site.',
      },
      {
        question: 'Who is liable if goods are damaged or lost?',
        answer:
          'Liability is set out in the terms agreed for the consignment or the arrangement. Raise it at quotation stage and operations will confirm the position for your goods in writing.',
        pending: 'Supply the insurance and liability position so this can be stated precisely.',
      },
    ],
  },

  {
    id: 'freight-haulage',
    label: 'Freight and haulage',
    service: 'freight-haulage',
    items: [
      {
        question: 'What is the difference between a full load and a part load?',
        answer:
          'A full load (FTL) has a vehicle to itself and travels direct. A part load (LTL) shares the vehicle with other consignments going the same way, which costs less for smaller volumes.',
      },
      {
        question: 'How much notice do you need?',
        answer:
          'Send the consignment as early as you can and operations will confirm the earliest available window. Clients with an ongoing arrangement have capacity planned in advance.',
        pending: 'Confirm a typical lead time so a figure can be published here.',
      },
      {
        question: 'Can you collect from Tema Port?',
        answer:
          'Yes. Released cargo can be collected from the port and taken on to its destination, or into storage in the Free Zone Enclave.',
      },
      {
        question: 'Can we follow our consignment?',
        answer: 'Operations gives you status updates on request while the consignment is on the road.',
        pending: 'Confirm whether any vehicle tracking is offered to clients.',
      },
    ],
  },

  {
    id: 'warehousing-storage',
    label: 'Warehousing and storage',
    service: 'warehousing-storage',
    items: [
      {
        question: 'Is there a minimum storage period or quantity?',
        answer:
          'Storage is agreed per consignment or under an ongoing arrangement, depending on the space, the time and the handling involved. Tell us what you need to store and for how long, and we will confirm.',
        pending: 'Confirm any minimum storage period or quantity.',
      },
      {
        question: 'How are goods received and released?',
        answer:
          'Goods are received against your paperwork and recorded. They are released on your instruction — to your own collection, or onto our vehicles for delivery.',
      },
      {
        question: 'What is cross-docking?',
        answer:
          'Goods taken off an inbound vehicle, sorted, and loaded straight onto outbound ones without going into storage. It suits consignments that are broken down for delivery as soon as they arrive.',
      },
      {
        question: 'Are stored goods insured?',
        answer:
          'Insurance of stored goods is confirmed when storage is agreed. Raise it at quotation stage and the position will be set out in writing.',
        pending: 'Supply the insurance position for goods in storage.',
      },
    ],
  },

  {
    id: 'distribution',
    label: 'Distribution',
    service: 'distribution',
    items: [
      {
        question: 'Do you deliver to shops and trade customers?',
        answer:
          'Yes. Scheduled runs serve regular delivery points, and last-mile delivery takes individual orders the final stretch to a shop, site or customer.',
      },
      {
        question: 'Can you deliver from stock you hold for us?',
        answer:
          'Yes. Goods held in our warehouse can be picked and dispatched on your instruction, or collected from your own premises and delivered on.',
      },
      {
        question: 'Can you deliver to several points on one run?',
        answer: 'Yes. Multi-drop runs are planned in delivery order around each point’s receiving hours.',
      },
      {
        question: 'Do your drivers collect payment from our customers?',
        answer:
          'Not as standard. Payment collection on delivery is agreed separately, if at all, before the arrangement starts.',
        pending: 'Confirm whether cash-on-delivery collection is offered.',
      },
    ],
  },

  {
    id: 'freight-forwarding',
    label: 'Freight forwarding',
    service: 'freight-forwarding',
    items: [
      {
        question: 'Do you clear goods through customs?',
        answer:
          'We support the documentation and coordinate the movement with the port and your clearing agent. Where a licensed customs broker is required, we tell you at the outset.',
        pending: 'Confirm whether 4Jasmine Dr holds a customs broker licence or works through a partner.',
      },
      {
        question: 'Do you handle both imports and exports?',
        answer: 'Yes, through Tema Port.',
        pending: 'Confirm whether other ports or airports are handled.',
      },
      {
        question: 'What documents will you need from us?',
        answer:
          'The shipping and commercial documents for the consignment. We will tell you exactly what a shipment needs when it is quoted.',
      },
      {
        question: 'Can released goods go straight into storage?',
        answer:
          'Yes. Goods can come from the port into the warehouse in the Free Zone Enclave, or go straight on to their destination.',
      },
    ],
  },

  {
    id: 'accounts',
    label: 'Accounts and payment',
    items: [
      {
        question: 'How do you quote?',
        answer:
          'In writing, priced on the service, the distance, the weight or volume, the handling and the frequency. For repeat volume we agree a rate schedule instead of quoting every consignment.',
      },
      {
        question: 'What are your payment terms?',
        answer:
          'Terms are agreed when the account is opened and confirmed on the quote.',
        pending: 'Confirm the payment terms and accepted payment methods.',
      },
      {
        question: 'How do I open an account?',
        answer:
          'Contact operations with your expected volume and frequency. Terms are agreed before the first consignment.',
      },
      {
        question: 'What documentation do I receive?',
        answer:
          'A written quote, delivery documentation signed at handover, records you can reconcile against invoices, and the invoice itself.',
        pending: 'Confirm the documentation list is complete and accurate.',
      },
    ],
  },
];

/** Six-item excerpt for /services, which links through to /faq for the rest. */
export const FAQS: FaqItem[] = FAQ_GROUPS[0].items.slice(0, 6);

export const getServiceFaqs = (slug: ServiceSlug): FaqItem[] =>
  FAQ_GROUPS.find((group) => group.service === slug)?.items ?? [];

/** Flat list, used for FAQPage schema on /faq. */
export const ALL_FAQS: FaqItem[] = FAQ_GROUPS.flatMap((group) => group.items);
