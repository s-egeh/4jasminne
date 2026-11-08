'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { trackEvent } from '@/components/layout/Analytics';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Checkbox, Field, Honeypot, Input, Select, Textarea } from '@/components/ui/Field';
import { SERVICES } from '@/data/services';
import { submitForm } from '@/lib/submit';
import {
  CONTACT_METHODS,
  QUOTE_FREQUENCIES,
  quoteSchema,
  type QuoteValues,
} from '@/lib/validation';
import { cn } from '@/lib/utils';
import { FormSuccess } from './FormSuccess';

const STEPS = [
  { label: 'What do you need?', fields: ['service', 'cargo', 'quantity', 'requirements'] },
  { label: 'Where and when?', fields: ['pickup', 'delivery', 'startDate', 'frequency'] },
  { label: 'Your details', fields: ['name', 'company', 'email', 'phone', 'contactMethod', 'consent'] },
] as const;

export function QuoteForm() {
  const startedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<QuoteValues>({
    resolver: zodResolver(quoteSchema),
    mode: 'onTouched',
    defaultValues: { kind: 'quote', startedAt: startedAt.current, company_website: '' },
  });

  /*
   * Repositioning after a step change.
   *
   * `instant`, not `smooth`: this is a reposition, not a journey. The step
   * swaps its content in the same frame, so an animated scroll would travel
   * across a form that has already changed underneath it. Note that `auto` will
   * not do — it defers to `scroll-behavior: smooth` on <html>, and only
   * `instant` overrides a stylesheet.
   *
   * Without this the reader stayed wherever they were when they pressed
   * Continue, which on a phone is usually the bottom of the previous step.
   */
  const showStepFromTop = () => {
    formRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  };

  const next = async () => {
    const valid = await trigger(STEPS[step].fields as unknown as (keyof QuoteValues)[]);
    if (!valid) {
      const firstInvalid = STEPS[step].fields.find((field) => field in errors);
      // `preventScroll` then an explicit scroll: the browser's own scroll-on-
      // focus puts the field wherever it likes, including under the sticky
      // action bar at the bottom of a phone viewport.
      if (firstInvalid) setFocus(firstInvalid as never, { shouldSelect: false });
      return;
    }
    setStep((value) => Math.min(value + 1, STEPS.length - 1));
    showStepFromTop();
  };

  const back = () => {
    setStep((value) => Math.max(value - 1, 0));
    showStepFromTop();
  };

  const onSubmit = async (values: QuoteValues) => {
    setFailure(null);
    const result = await submitForm({ ...values, startedAt: startedAt.current });

    if (result.ok) {
      trackEvent('quote_submit', { service: values.service, frequency: values.frequency });
      setSent(true);
      reset();
      return;
    }

    setFailure(result.error);
  };

  // Enter advances the step rather than submitting a half-filled request.
  const onKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key !== 'Enter') return;
    const target = event.target as HTMLElement;
    if (target.tagName === 'TEXTAREA') return;
    if (step < STEPS.length - 1) {
      event.preventDefault();
      void next();
    }
  };

  if (sent) {
    return (
      <FormSuccess
        heading="Request received"
        body="Operations will confirm availability and pricing, and you will receive a written quote."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" variant="secondary-dark">
            Back to home
          </ButtonLink>
          <ButtonLink href="/services" variant="secondary-dark">
            View our services
          </ButtonLink>
        </div>
      </FormSuccess>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={onKeyDown}
      noValidate
      className="scroll-mt-[calc(var(--header-h)+24px)] flex flex-col gap-8"
    >
      <Honeypot register={register('company_website')} />
      <input type="hidden" {...register('kind')} />

      {/* Progress */}
      <div>
        <ol className="flex flex-wrap gap-x-6 gap-y-2">
          {STEPS.map((entry, index) => (
            <li
              key={entry.label}
              aria-current={index === step ? 'step' : undefined}
              className={cn(
                'u-mono text-[10px]',
                index === step ? 'text-ink-900' : index < step ? 'text-gold-ink' : 'text-slate-400',
              )}
            >
              {String(index + 1).padStart(2, '0')} {entry.label}
            </li>
          ))}
        </ol>

        <div className="mt-4 h-0.5 w-full bg-line">
          <span
            className="block h-full origin-left bg-gold transition-transform duration-[320ms] ease-out-expo"
            style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }}
          />
        </div>
      </div>

      {/* Step 1 */}
      <fieldset hidden={step !== 0} className="flex flex-col gap-6 border-0 p-0">
        <legend className="sr-only">What do you need?</legend>

        <div>
          <span className="u-mono text-[11px] text-slate-600">
            Service <span className="text-gold-ink">*</span>
          </span>
          <div
            role="radiogroup"
            aria-label="Service"
            className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <label
                  key={service.slug}
                  className="group flex cursor-pointer items-start gap-4 border border-line bg-paper p-5 transition-colors duration-fast hover:border-ink-900 has-[:checked]:border-gold-ink has-[:checked]:bg-paper"
                >
                  <input
                    type="radio"
                    value={service.name}
                    className="peer sr-only"
                    disabled={isSubmitting}
                    {...register('service')}
                  />
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="mt-0.5 h-6 w-6 shrink-0 text-slate-400 transition-colors duration-fast peer-checked:text-gold-ink"
                  />
                  <span>
                    <span className="block font-display text-[15px] font-semibold text-ink-900">
                      {service.name}
                    </span>
                    <span className="mt-1 block t-small text-slate-600">{service.short}</span>
                  </span>
                </label>
              );
            })}
          </div>
          {errors.service ? (
            <p role="alert" className="mt-3 flex items-center gap-2 t-small text-danger">
              <AlertCircle aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 shrink-0" />
              {errors.service.message}
            </p>
          ) : null}
        </div>

        <Field id="quote-cargo" label="Description of the goods" required error={errors.cargo?.message}>
          <Input
            id="quote-cargo"
            aria-required="true"
            invalid={!!errors.cargo}
            disabled={isSubmitting}
            {...register('cargo')}
          />
        </Field>

        <Field
          id="quote-quantity"
          label="Estimated weight or volume"
          hint="Optional — an approximate figure is fine."
          error={errors.quantity?.message}
        >
          <Input id="quote-quantity" disabled={isSubmitting} {...register('quantity')} />
        </Field>

        <Field id="quote-requirements" label="Special requirements" error={errors.requirements?.message}>
          <Textarea id="quote-requirements" rows={4} disabled={isSubmitting} {...register('requirements')} />
        </Field>
      </fieldset>

      {/* Step 2 */}
      <fieldset hidden={step !== 1} className="flex flex-col gap-6 border-0 p-0">
        <legend className="sr-only">Where and when?</legend>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field id="quote-pickup" label="Collection point" required error={errors.pickup?.message}>
            <Input
              id="quote-pickup"
              aria-required="true"
              invalid={!!errors.pickup}
              disabled={isSubmitting}
              {...register('pickup')}
            />
          </Field>

          <Field id="quote-delivery" label="Delivery point" required error={errors.delivery?.message}>
            <Input
              id="quote-delivery"
              aria-required="true"
              invalid={!!errors.delivery}
              disabled={isSubmitting}
              {...register('delivery')}
            />
          </Field>

          <Field id="quote-date" label="Preferred start date" error={errors.startDate?.message}>
            <Input id="quote-date" type="date" disabled={isSubmitting} {...register('startDate')} />
          </Field>

          <Field id="quote-frequency" label="Frequency" required error={errors.frequency?.message}>
            <Select
              id="quote-frequency"
              defaultValue=""
              aria-required="true"
              invalid={!!errors.frequency}
              disabled={isSubmitting}
              {...register('frequency')}
            >
              <option value="" disabled>
                Select frequency
              </option>
              {QUOTE_FREQUENCIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </fieldset>

      {/* Step 3 */}
      <fieldset hidden={step !== 2} className="flex flex-col gap-6 border-0 p-0">
        <legend className="sr-only">Your details</legend>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field id="quote-name" label="Full name" required error={errors.name?.message}>
            <Input
              id="quote-name"
              autoComplete="name"
              aria-required="true"
              invalid={!!errors.name}
              disabled={isSubmitting}
              {...register('name')}
            />
          </Field>

          <Field id="quote-company" label="Company" required error={errors.company?.message}>
            <Input
              id="quote-company"
              autoComplete="organization"
              aria-required="true"
              invalid={!!errors.company}
              disabled={isSubmitting}
              {...register('company')}
            />
          </Field>

          <Field id="quote-email" label="Email" required error={errors.email?.message}>
            <Input
              id="quote-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-required="true"
              invalid={!!errors.email}
              disabled={isSubmitting}
              {...register('email')}
            />
          </Field>

          <Field id="quote-phone" label="Phone" required error={errors.phone?.message}>
            <Input
              id="quote-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-required="true"
              invalid={!!errors.phone}
              disabled={isSubmitting}
              {...register('phone')}
            />
          </Field>
        </div>

        <div>
          <span className="u-mono text-[11px] text-slate-600">
            Preferred contact method <span className="text-gold-ink">*</span>
          </span>
          <div role="radiogroup" aria-label="Preferred contact method" className="mt-3 flex flex-wrap gap-3">
            {CONTACT_METHODS.map((method) => (
              <label
                key={method}
                className="cursor-pointer border border-line bg-paper px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-slate-600 transition-colors duration-fast hover:border-ink-900 has-[:checked]:border-gold-ink has-[:checked]:text-ink-900"
              >
                <input
                  type="radio"
                  value={method}
                  className="sr-only"
                  disabled={isSubmitting}
                  {...register('contactMethod')}
                />
                {method}
              </label>
            ))}
          </div>
          {errors.contactMethod ? (
            <p role="alert" className="mt-3 flex items-center gap-2 t-small text-danger">
              <AlertCircle aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 shrink-0" />
              {errors.contactMethod.message}
            </p>
          ) : null}
        </div>

        <Checkbox
          id="quote-consent"
          label="I agree to be contacted about this request."
          error={errors.consent?.message}
          disabled={isSubmitting}
          {...register('consent')}
        />

        <p className="t-small text-slate-600">
          We use these details only to respond to this request. See our{' '}
          <Link href="/privacy" className="underline decoration-gold underline-offset-4 hover:text-gold-ink">
            privacy policy
          </Link>
          .
        </p>
      </fieldset>

      {failure ? (
        <p role="alert" className="flex items-start gap-2 border border-danger p-4 t-small text-danger">
          <AlertCircle aria-hidden="true" strokeWidth={1.5} className="mt-0.5 h-4 w-4 shrink-0" />
          {failure}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {step > 0 ? (
          <Button variant="secondary-light" size="lg" onClick={back} disabled={isSubmitting}>
            Back
          </Button>
        ) : null}

        {step < STEPS.length - 1 ? (
          <Button size="lg" onClick={next} withArrow>
            Continue
          </Button>
        ) : (
          <Button type="submit" size="lg" loading={isSubmitting} withArrow>
            Submit request
          </Button>
        )}
      </div>

      {/* NOTE: steps cross-fade via `hidden` rather than unmounting, so values
          entered on an earlier step survive navigation without extra state. The
          12px slide is applied to the visible fieldset only. */}
      <style jsx>{`
        fieldset:not([hidden]) {
          animation: ${reduced ? 'none' : 'quote-step-in 320ms cubic-bezier(0.16, 1, 0.3, 1)'};
        }
        @keyframes quote-step-in {
          from {
            opacity: 0;
            transform: translateX(12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </form>
  );
}
