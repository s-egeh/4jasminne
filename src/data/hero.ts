export interface HeroSlide {
  id: string;
  image: string;
  imageAlt: string;
  eyebrow: string;
  heading: string;
  standfirst: string;
  /** Short title for the vertical slide list on wide screens. */
  title: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}

/* [TODO-CLIENT: review wording] — headings and standfirsts. */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'logistics',
    image: '/images/hero/hero-highway-truck.jpg',
    imageAlt: 'A tanker truck on a mountain highway',
    eyebrow: 'Logistics & Distribution',
    heading: 'Goods moved, stored and delivered — on schedule.',
    standfirst:
      'Road freight, warehousing and distribution from the Free Zone Enclave in Tema, nationwide and across West Africa.',
    title: 'Logistics and distribution',
    primary: { label: 'Request a quote', href: '/quote' },
    secondary: { label: 'Our services', href: '/services' },
  },
  {
    id: 'warehousing',
    image: '/images/hero/hero-warehouse-storage.jpg',
    imageAlt: 'Wooden pallets stacked close together',
    eyebrow: 'Warehousing & Storage',
    heading: 'Storage close to the port.',
    standfirst:
      'Short- and long-term storage, inventory handling and cross-docking in the Free Zone Enclave, close to Tema Port.',
    title: 'Warehousing and storage',
    primary: { label: 'Warehousing', href: '/services/warehousing-storage' },
    secondary: { label: 'Request a quote', href: '/quote' },
  },
  {
    id: 'distribution',
    image: '/images/hero/hero-vehicle-loading.jpg',
    imageAlt: 'A forklift loading a pallet onto a truck trailer',
    eyebrow: 'Distribution',
    heading: 'Scheduled runs and last-mile delivery.',
    standfirst:
      'Distribution to retail and trade customers, dispatched from our warehouse or collected from yours.',
    title: 'Distribution',
    primary: { label: 'Distribution', href: '/services/distribution' },
    secondary: { label: 'View our fleet', href: '/fleet' },
  },
  {
    id: 'forwarding',
    image: '/images/hero/hero-port-containers.jpg',
    imageAlt: 'An aerial view of a container terminal',
    eyebrow: 'Freight Forwarding',
    heading: 'From the port to where it is needed.',
    standfirst:
      'Import and export coordination through Tema Port, with support on the documentation each shipment needs.',
    title: 'Freight forwarding',
    primary: { label: 'Freight forwarding', href: '/services/freight-forwarding' },
    secondary: { label: 'Contact us', href: '/contact' },
  },
];
