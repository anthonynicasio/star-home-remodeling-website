import { z } from 'zod';

export const leadSchema = z.object({
  services: z
    .array(z.string())
    .min(1, 'Select at least one service we can help with.'),
  projectDetails: z.string().optional(),
  zip: z
    .string()
    .min(5, 'Enter your ZIP code so we know where the project is.')
    .max(10, 'Enter a valid ZIP code.'),
  name: z.string().min(2, 'Enter your name so we know who to call.'),
  phone: z
    .string()
    .min(10, 'Enter a phone number we can reach you at.')
    .regex(/^[\d\s()+-]+$/, 'Enter a valid phone number.'),
  email: z.string().email('Enter an email address for your estimate details.'),
  preferredContactTime: z.string().optional(),
  honeypot: z.string().max(0).optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

export function isDmvZip(zip: string): boolean {
  const prefix = zip.trim().slice(0, 2);
  const dmvPrefixes = ['20', '21', '22'];
  return dmvPrefixes.includes(prefix);
}
