import { z } from 'zod';

/** Minimum milliseconds between form render and submit. Anything faster is a bot. */
export const MIN_FILL_MS = 2000;

const phone = z
  .string()
  .min(7, 'Enter a phone number we can reach you on.')
  .max(24, 'That phone number looks too long.');

const antiSpam = {
  /** Honeypot — must stay empty. */
  company_website: z.string().max(0, 'Submission rejected.').optional().or(z.literal('')),
  startedAt: z.number(),
};

export const enquirySchema = z.object({
  ...antiSpam,
  kind: z.literal('enquiry'),
  name: z.string().min(2, 'Enter your full name.').max(120),
  company: z.string().max(160).optional().or(z.literal('')),
  phone,
  service: z.string().min(1, 'Choose the service you need.'),
  message: z.string().min(10, 'Tell us briefly what you need.').max(4000),
});

export const contactSchema = z.object({
  ...antiSpam,
  kind: z.literal('contact'),
  name: z.string().min(2, 'Enter your full name.').max(120),
  company: z.string().max(160).optional().or(z.literal('')),
  email: z.string().email('Enter a valid email address.'),
  phone,
  enquiryType: z.string().min(1, 'Choose an enquiry type.'),
  message: z.string().min(10, 'Tell us briefly what you need.').max(4000),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Please confirm we may contact you about this enquiry.' }),
  }),
});

export const quoteSchema = z.object({
  ...antiSpam,
  kind: z.literal('quote'),
  // Step 1
  service: z.string().min(1, 'Choose the service you need.'),
  cargo: z.string().min(2, 'Tell us what the goods are.').max(200),
  quantity: z.string().max(200).optional().or(z.literal('')),
  requirements: z.string().max(2000).optional().or(z.literal('')),
  // Step 2
  pickup: z.string().min(2, 'Enter the collection point.').max(200),
  delivery: z.string().min(2, 'Enter the delivery point.').max(200),
  startDate: z.string().max(40).optional().or(z.literal('')),
  frequency: z.string().min(1, 'Choose how often this runs.'),
  // Step 3
  name: z.string().min(2, 'Enter your full name.').max(120),
  company: z.string().min(2, 'Enter your company name.').max(160),
  email: z.string().email('Enter a valid email address.'),
  phone,
  contactMethod: z.string().min(1, 'Choose how you would like us to reply.'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Please confirm we may contact you about this request.' }),
  }),
});

export const submissionSchema = z.discriminatedUnion('kind', [
  enquirySchema,
  contactSchema,
  quoteSchema,
]);

export type EnquiryValues = z.infer<typeof enquirySchema>;
export type ContactValues = z.infer<typeof contactSchema>;
export type QuoteValues = z.infer<typeof quoteSchema>;
export type SubmissionValues = z.infer<typeof submissionSchema>;

export const ENQUIRY_TYPES = [
  'Freight and haulage',
  'Warehousing and storage',
  'Distribution',
  'Freight forwarding',
  'General enquiry',
];

export const QUOTE_FREQUENCIES = ['One-off consignment', 'Weekly', 'Monthly', 'Ongoing arrangement'];

export const CONTACT_METHODS = ['Phone', 'WhatsApp', 'Email'];
