import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/ui/LegalPage';
import { COMPANY } from '@/data/company';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy policy',
  description:
    'How 4Jasmine Dr collects, uses and stores the information you send through the contact and quote forms on this website, and how to have it deleted.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated={COMPANY.policiesUpdated}>
      <section>
        <p>
          This policy explains what {COMPANY.name} does with the information you send through this
          website. It covers the website only. It does not cover information you give us in person,
          by phone or in a commercial contract.
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <p>
          We collect only what you type into a form. Depending on the form, that is your name, your
          company name, your email address, your phone number, the service you are enquiring about,
          and the details of the goods, the storage or the shipment you are asking us to price.
        </p>
        <p>
          Two hidden fields are submitted with every form: an empty field that automated scripts tend
          to fill in, and a timestamp recording when the form was opened. Both exist to filter out
          spam and neither identifies you.
        </p>
      </section>

      <section>
        <h2>Why we collect it</h2>
        <p>
          To answer your enquiry, to prepare a quotation, and to contact you about the request you
          made. We do not use it for anything else.
        </p>
      </section>

      <section>
        <h2>Who sees it</h2>
        <p>
          Form submissions are emailed to {COMPANY.email} and are read by the people who handle
          enquiries. Delivery of that email is handled by our email service provider. We do not sell
          your information, we do not rent it, and we do not pass it to advertisers or data brokers.
        </p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <p>
          Enquiries are kept for as long as they are commercially useful — typically while a
          quotation is live and for a reasonable period afterwards in case you come back to us.
          {/* [TODO-CLIENT] Confirm a specific retention period with the
              company's accountant and state it here as a number of years. */}
          Records connected to an actual contract are kept for as long as tax and accounting rules
          require.
        </p>
      </section>

      <section>
        <h2>Cookies and analytics</h2>
        <p>
          This site sets no advertising or tracking cookies. If website analytics are switched on, a
          notice appears at the bottom of the screen and no analytics cookie is set until you accept
          it. Your choice is stored in your browser and you can change it by clearing your browser
          storage for this site.
        </p>
      </section>

      <section>
        <h2>Third-party services</h2>
        <ul>
          <li>
            The map on the contact page is loaded from Google Maps only after you click to load it.
            Until then, nothing is requested from Google.
          </li>
          <li>
            WhatsApp links open the WhatsApp service, which has its own privacy terms.
          </li>
        </ul>
      </section>

      <section>
        <h2>Asking us to delete your information</h2>
        <p>
          Email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> with the subject line
          &ldquo;Data deletion request&rdquo; and tell us which enquiry you mean. We will delete it
          and confirm, unless we are legally required to keep a record of a transaction.
        </p>
      </section>

      <section>
        <h2>Changes to this policy</h2>
        <p>
          If this policy changes, the updated version will appear on this page with a new date at the
          top.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          {COMPANY.name}, {COMPANY.addresses[0].lines.join(', ')},{' '}
          {COMPANY.addresses[0].region}, {COMPANY.addresses[0].country}.{' '}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
        </p>
        <p>
          You can also reach us through the <Link href="/contact">contact page</Link>, ask for
          pricing on the <Link href="/quote">quote form</Link>, or read the{' '}
          <Link href="/terms">terms of use</Link> that govern this website.
        </p>
        {/*
          [TODO-CLIENT] This policy has not been reviewed by a lawyer. Have it
          checked against Ghana's Data Protection Act, 2012 (Act 843) before
          launch, and confirm whether the business needs to register with the
          Data Protection Commission.

          That caveat is a note to the client, not a disclosure to the public:
          telling visitors on the page itself that the privacy policy is
          unreviewed undermines the document it appears in. It is tracked in
          HANDOVER.md instead.
        */}
      </section>
    </LegalPage>
  );
}
