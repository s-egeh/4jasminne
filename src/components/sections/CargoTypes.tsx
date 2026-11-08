import { CellGrid } from '@/components/sections/ContentBlocks';
import { SectionHeader, SectionIndex } from '@/components/ui/SectionHeader';
import { CARGO_TYPES } from '@/data/operations';

/**
 * Goods we handle — a --paper band, deliberately placed between two bone
 * sections so the middle of the homepage stops reading as one long field of
 * the same colour.
 */
export function CargoTypes() {
  return (
    <section aria-labelledby="cargo-heading" className="section-y relative bg-paper">
      <div className="container-site relative">
        <SectionIndex>05</SectionIndex>

        <SectionHeader
          headingId="cargo-heading"
          eyebrow="Goods we handle"
          heading="What we move and store."
          intro="Different goods need different vehicles, different handling and different storage. These are the consignments we are set up for."
          width="wide"
        />

        <CellGrid cells={CARGO_TYPES} columns={3} className="mt-14" />
      </div>
    </section>
  );
}
