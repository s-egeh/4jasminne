import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/ui/LegalPage';
import { COMPANY } from '@/data/company';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Terms of use',
  description:
    'The terms governing use of the 4Jasmine Dr website. These are website terms only, separate from the commercial terms of any freight or storage agreement.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" updated={COMPANY.policiesUpdated}>
      <section>
        <p>
          <strong>These are website terms, not terms of carriage or storage.</strong> They govern your use of this
          website. They do not set out the commercial terms of any freight, storage, distribution or
          {/* [TODO-CLIENT] If the company has standard commercial terms and
              conditions of carriage, link them from this paragraph. */}
          forwarding agreement with {COMPANY.name}. Those are agreed separately and in writing.
        </p>
      </section>

      <section>
        <h2>Using this site</h2>
        <p>
          You may read, print and share the pages of this site for your own business purposes. You may
          not copy the site&rsquo;s design, code or photography for use elsewhere, and you may not use
          the {COMPANY.name} name or logo to represent yourself as connected with the company.
        </p>
      </section>

      <section>
        <h2>Accuracy of information</h2>
        <p>
          The service descriptions, coverage and capabilities on this site describe what the business
          does in general terms. They are not an offer, and they are not a guarantee of availability
          on any particular date. Pricing, capacity and delivery dates are confirmed in a written
          quotation.
        </p>
      </section>

      <section>
        <h2>Enquiries submitted through this site</h2>
        <p>
          Submitting the contact or quote form does not create a contract. It starts a conversation.
          A binding arrangement exists only once terms have been agreed in writing by both parties.
        </p>
      </section>

      <section>
        <h2>Availability</h2>
        <p>
          We try to keep this site available and accurate, but we do not guarantee uninterrupted
          access. Pages may be changed or withdrawn without notice.
        </p>
      </section>

      <section>
        <h2>Links to other sites</h2>
        <p>
          Where this site links to a third-party service — a map provider, or a messaging service —
          that service is governed by its own terms, and we are not responsible for its content.
        </p>
      </section>

      <section>
        <h2>Governing law</h2>
        {/* [TODO-CLIENT] Confirm the governing-law clause with legal counsel
            before launch. */}
        <p>These terms are governed by the laws of the Republic of Ghana.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
        </p>
        <p>
          See also the <Link href="/privacy">privacy policy</Link>, the{' '}
          <Link href="/services">services we provide</Link>, and the{' '}
          <Link href="/contact">contact page</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
