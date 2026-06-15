import { defineAction, ActionError } from 'astro:actions';
import { leadSchema } from '../lib/lead-schema';
import { sendLead } from '../lib/send-lead';

const rateLimit = new Map<string, number>();
const RATE_LIMIT_MS = 60_000;

export const server = {
  submitLead: defineAction({
    input: leadSchema,
    handler: async (input, context) => {
      if (input.honeypot) {
        throw new ActionError({ code: 'BAD_REQUEST', message: 'Invalid submission.' });
      }

      const ip =
        context.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
      const lastSubmit = rateLimit.get(ip);
      const now = Date.now();
      if (lastSubmit && now - lastSubmit < RATE_LIMIT_MS) {
        throw new ActionError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Please wait a moment before submitting again.',
        });
      }
      rateLimit.set(ip, now);

      const result = await sendLead(input);
      if (!result.success) {
        throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: result.message });
      }

      return { ok: true, message: result.message };
    },
  }),
};