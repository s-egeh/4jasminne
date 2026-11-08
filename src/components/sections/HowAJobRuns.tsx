import { StepList } from '@/components/sections/ContentBlocks';
import { SectionHeader, SectionIndex } from '@/components/ui/SectionHeader';
import { JOB_STEPS } from '@/data/operations';

/**
 * How a job runs — the sequence from enquiry to proof of delivery. Dark band,
 * placed straight after Why 4Jasmine Dr: the previous section argues that one
 * structure means fewer handoffs, and this one shows the handoffs.
 */
export function HowAJobRuns() {
  return (
    <section aria-labelledby="job-steps-heading" className="grain section-y relative bg-ink-900">
      <div className="container-site relative z-10">
        <SectionIndex onDark>07</SectionIndex>

        <SectionHeader
          headingId="job-steps-heading"
          eyebrow="Process"
          heading="From enquiry to proof of delivery."
          intro="Five steps, the same for a one-off consignment as for ongoing volume. The difference is that clients on an agreed rate skip step three."
          onDark
          width="wide"
        />

        <StepList steps={JOB_STEPS} onDark className="mt-16" />
      </div>
    </section>
  );
}
