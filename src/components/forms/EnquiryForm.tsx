'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { trackEvent } from '@/components/layout/Analytics';
import { Button } from '@/components/ui/Button';
import { Field, Honeypot, Input, Select, Textarea } from '@/components/ui/Field';
import { submitForm } from '@/lib/submit';
import { ENQUIRY_TYPES, enquirySchema, type EnquiryValues } from '@/lib/validation';
import { FormSuccess } from './FormSuccess';

/** Compact homepage enquiry form. The full version lives on /contact. */
export function EnquiryForm() {
  const startedAt = useRef(Date.now());
  const [sent, setSent] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { kind: 'enquiry', startedAt: startedAt.current, company_website: '' },
  });

  const onSubmit = async (values: EnquiryValues) => {
    setFailure(null);
    const result = await submitForm({ ...values, startedAt: startedAt.current });

    if (result.ok) {
      trackEvent('enquiry_submit', { form: 'home' });
      setSent(true);
      reset();
      return;
    }

    setFailure(result.error);
  };

  // Move focus to the first invalid field so a keyboard user is not hunting.
  const onInvalid = () => {
    const first = Object.keys(errors)[0] as keyof EnquiryValues | undefined;
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
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="flex flex-col gap-5">
      <Honeypot register={register('company_website')} />
      <input type="hidden" {...register('kind')} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="enquiry-name" label="Full name" required error={errors.name?.message}>
          <Input
            id="enquiry-name"
            autoComplete="name"
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'enquiry-name-error' : undefined}
            invalid={!!errors.name}
            disabled={isSubmitting}
            {...register('name')}
          />
        </Field>

        <Field id="enquiry-company" label="Company" error={errors.company?.message}>
          <Input
            id="enquiry-company"
            autoComplete="organization"
            disabled={isSubmitting}
            {...register('company')}
          />
        </Field>

        <Field id="enquiry-phone" label="Phone" required error={errors.phone?.message}>
          <Input
            id="enquiry-phone"
            type="tel"
            autoComplete="tel"
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'enquiry-phone-error' : undefined}
            invalid={!!errors.phone}
            disabled={isSubmitting}
            {...register('phone')}
          />
        </Field>

        <Field id="enquiry-service" label="Service" required error={errors.service?.message}>
          <Select
            id="enquiry-service"
            aria-required="true"
            aria-invalid={!!errors.service}
            invalid={!!errors.service}
            defaultValue=""
            disabled={isSubmitting}
            {...register('service')}
          >
            <option value="" disabled>
              Select a service
            </option>
            {ENQUIRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field id="enquiry-message" label="Message" required error={errors.message?.message}>
        <Textarea
          id="enquiry-message"
          rows={4}
          aria-required="true"
          aria-invalid={!!errors.message}
          invalid={!!errors.message}
          disabled={isSubmitting}
          {...register('message')}
        />
      </Field>

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
