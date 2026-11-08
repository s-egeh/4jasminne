'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { trackEvent } from '@/components/layout/Analytics';
import { Button } from '@/components/ui/Button';
import { Checkbox, Field, Honeypot, Input, Select, Textarea } from '@/components/ui/Field';
import { submitForm } from '@/lib/submit';
import { contactSchema, ENQUIRY_TYPES, type ContactValues } from '@/lib/validation';
import { FormSuccess } from './FormSuccess';

export function ContactForm() {
  const startedAt = useRef(Date.now());
  const [sent, setSent] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { kind: 'contact', startedAt: startedAt.current, company_website: '' },
  });

  const onSubmit = async (values: ContactValues) => {
    setFailure(null);
    const result = await submitForm({ ...values, startedAt: startedAt.current });

    if (result.ok) {
      trackEvent('contact_submit', { form: 'contact' });
      setSent(true);
      reset();
      return;
    }

    setFailure(result.error);
  };

  const onInvalid = () => {
    const first = Object.keys(errors)[0] as keyof ContactValues | undefined;
    if (first) setFocus(first as never);
  };

  if (sent) {
    return (
      <FormSuccess
        heading="Message sent"
        body="We have received your enquiry and the operations team will be in touch."
      >
        <Button variant="secondary-dark" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </FormSuccess>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="flex flex-col gap-6">
      <Honeypot register={register('company_website')} />
      <input type="hidden" {...register('kind')} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field id="contact-name" label="Full name" required error={errors.name?.message}>
          <Input
            id="contact-name"
            autoComplete="name"
            aria-required="true"
            aria-invalid={!!errors.name}
            invalid={!!errors.name}
            disabled={isSubmitting}
            {...register('name')}
          />
        </Field>

        <Field id="contact-company" label="Company" error={errors.company?.message}>
          <Input
            id="contact-company"
            autoComplete="organization"
            disabled={isSubmitting}
            {...register('company')}
          />
        </Field>

        <Field id="contact-email" label="Email" required error={errors.email?.message}>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            aria-required="true"
            aria-invalid={!!errors.email}
            invalid={!!errors.email}
            disabled={isSubmitting}
            {...register('email')}
          />
        </Field>

        <Field id="contact-phone" label="Phone" required error={errors.phone?.message}>
          <Input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            aria-required="true"
            aria-invalid={!!errors.phone}
            invalid={!!errors.phone}
            disabled={isSubmitting}
            {...register('phone')}
          />
        </Field>
      </div>

      <Field id="contact-type" label="Enquiry type" required error={errors.enquiryType?.message}>
        <Select
          id="contact-type"
          defaultValue=""
          aria-required="true"
          aria-invalid={!!errors.enquiryType}
          invalid={!!errors.enquiryType}
          disabled={isSubmitting}
          {...register('enquiryType')}
        >
          <option value="" disabled>
            Select an enquiry type
          </option>
          {ENQUIRY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </Field>

      <Field id="contact-message" label="Message" required error={errors.message?.message}>
        <Textarea
          id="contact-message"
          rows={6}
          aria-required="true"
          aria-invalid={!!errors.message}
          invalid={!!errors.message}
          disabled={isSubmitting}
          {...register('message')}
        />
      </Field>

      <Checkbox
        id="contact-consent"
        label="I agree to be contacted about this enquiry."
        error={errors.consent?.message}
        disabled={isSubmitting}
        {...register('consent')}
      />

      {failure ? (
        <p role="alert" className="flex items-start gap-2 border border-danger p-4 t-small text-danger">
          <AlertCircle aria-hidden="true" strokeWidth={1.5} className="mt-0.5 h-4 w-4 shrink-0" />
          {failure}
        </p>
      ) : null}

      <Button type="submit" size="lg" loading={isSubmitting} withArrow className="self-start">
        Send message
      </Button>
    </form>
  );
}
