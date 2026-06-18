import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { actions } from 'astro:actions';
import { leadSchema, isDmvZip, type LeadFormData } from '../../lib/lead-schema';
import { siteConfig } from '../../lib/site-config';
import { ChevronLeft, ChevronRight, CheckCircle2, Phone } from 'lucide-react';

interface LeadFormProps {
  initialServices?: string[];
}

const STEPS = ['Services', 'Project', 'Location', 'Contact', 'Preferences'] as const;

export default function LeadForm({ initialServices = [] }: LeadFormProps) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      services: initialServices,
      projectDetails: '',
      zip: '',
      name: '',
      phone: '',
      email: '',
      preferredContactTime: '',
      honeypot: '',
    },
  });

  const zip = watch('zip');
  const outsideDmv = zip && zip.length >= 5 && !isDmvZip(zip);

  const stepFields: (keyof LeadFormData)[][] = useMemo(
    () => [
      ['services'],
      ['projectDetails'],
      ['zip'],
      ['name', 'phone', 'email'],
      ['preferredContactTime'],
    ],
    [],
  );

  async function nextStep() {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(data: LeadFormData) {
    setSubmitError(null);
    const { error } = await actions.submitLead(data);
    if (error) {
      setSubmitError(error.message ?? 'Something went wrong. Please call us directly.');
      return;
    }
    setSubmitted(true);
    if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'generate_lead', {
        event_category: 'form',
      });
    }
  }

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-default)] bg-brand-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-700" aria-hidden="true" />
        <h2 className="text-display mt-4 text-2xl font-bold text-brand-900">Thanks — we got it!</h2>
        <p className="mt-3 text-stone-400">
          We will call you within one business day to schedule your free estimate.
        </p>
        <a
          href={`tel:${siteConfig.phone.primaryTel}`}
          className="btn btn-primary mt-6 inline-flex"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call {siteConfig.phone.primary} now
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-[var(--radius-default)] bg-paper p-6 shadow-[var(--shadow-card)] sm:p-8" noValidate>
      <div className="mb-8">
        <div className="flex justify-between text-xs font-medium text-stone-400" aria-hidden="true">
          {STEPS.map((label, i) => (
            <span key={label} className={i <= step ? 'text-brand-700' : ''}>
              {i + 1}. {label}
            </span>
          ))}
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-50">
          <div
            className="h-full bg-brand-700 transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={STEPS.length}
            aria-label="Form progress"
          />
        </div>
      </div>

      <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {step === 0 && (
        <fieldset>
          <legend className="text-display text-xl font-bold text-brand-900">What services do you need?</legend>
          <div className="mt-4 flex flex-wrap gap-3">
            {['roofing', 'siding', 'windows', 'doors', 'gutters', 'remodeling'].map((svc) => (
              <label key={svc} className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-default)] border border-brand-300/50 px-4 py-2 has-[:checked]:border-brand-700 has-[:checked]:bg-brand-50">
                <input type="checkbox" value={svc} {...register('services')} className="h-4 w-4 accent-brand-700" />
                <span className="text-sm font-medium capitalize">{svc}</span>
              </label>
            ))}
          </div>
          {errors.services && <p className="mt-2 text-sm text-red-700" role="alert">{errors.services.message}</p>}
        </fieldset>
      )}

      {step === 1 && (
        <div>
          <label htmlFor="projectDetails" className="text-display block text-xl font-bold text-brand-900">
            Tell us about your project
          </label>
          <p className="mt-1 text-sm text-stone-400">Optional — the more detail, the better we can prepare.</p>
          <textarea
            id="projectDetails"
            rows={5}
            {...register('projectDetails')}
            className="mt-4 w-full rounded-[var(--radius-default)] border border-brand-300/50 px-4 py-3 text-ink"
            placeholder="e.g. Roof is about 20 years old, noticing missing shingles after last storm..."
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <label htmlFor="zip" className="text-display block text-xl font-bold text-brand-900">
            Where is the project?
          </label>
          <input
            id="zip"
            type="text"
            inputMode="numeric"
            {...register('zip')}
            className="mt-4 w-full max-w-xs rounded-[var(--radius-default)] border border-brand-300/50 px-4 py-3 text-ink"
            placeholder="ZIP code"
            aria-invalid={!!errors.zip}
            aria-describedby={outsideDmv ? 'zip-warning' : undefined}
          />
          {errors.zip && <p className="mt-2 text-sm text-red-700" role="alert">{errors.zip.message}</p>}
          {outsideDmv && (
            <p id="zip-warning" className="mt-3 rounded-[var(--radius-default)] bg-brand-50 p-3 text-sm text-brand-900">
              This ZIP may be outside our usual service area — but go ahead and submit. We'll let you know if we can help.
            </p>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-display text-xl font-bold text-brand-900">How can we reach you?</h2>
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Full name</label>
            <input id="name" {...register('name')} className="mt-1 w-full rounded-[var(--radius-default)] border border-brand-300/50 px-4 py-3" />
            {errors.name && <p className="mt-1 text-sm text-red-700" role="alert">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
            <input id="phone" type="tel" {...register('phone')} className="mt-1 w-full rounded-[var(--radius-default)] border border-brand-300/50 px-4 py-3" />
            {errors.phone && <p className="mt-1 text-sm text-red-700" role="alert">{errors.phone.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input id="email" type="email" {...register('email')} className="mt-1 w-full rounded-[var(--radius-default)] border border-brand-300/50 px-4 py-3" />
            {errors.email && <p className="mt-1 text-sm text-red-700" role="alert">{errors.email.message}</p>}
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <label htmlFor="preferredContactTime" className="text-display block text-xl font-bold text-brand-900">
            Best time to call? <span className="font-normal text-stone-400">(optional)</span>
          </label>
          <select
            id="preferredContactTime"
            {...register('preferredContactTime')}
            className="mt-4 w-full max-w-sm rounded-[var(--radius-default)] border border-brand-300/50 px-4 py-3"
          >
            <option value="">No preference</option>
            <option value="morning">Morning (8 AM – 12 PM)</option>
            <option value="afternoon">Afternoon (12 PM – 5 PM)</option>
            <option value="evening">Evening (5 PM – 7 PM)</option>
          </select>
        </div>
      )}

      {submitError && (
        <p className="mt-4 rounded-[var(--radius-default)] bg-red-50 p-3 text-sm text-red-800" role="alert">
          {submitError}
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <button type="button" onClick={prevStep} className="btn btn-ghost inline-flex">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Back
          </button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={nextStep} className="btn btn-primary inline-flex">
            Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? 'Sending...' : 'Submit my request'}
          </button>
        )}
      </div>
    </form>
  );
}
