import { useState } from 'react';
import { actions } from 'astro:actions';
import { leadSchema } from '../../lib/lead-schema';
import { siteConfig } from '../../lib/site-config';
import { Check, CheckCircle2, ChevronLeft, ChevronRight, Phone } from 'lucide-react';

/**
 * Compact 3-step quote capture used in the homepage hero.
 * Submits through the shared `submitLead` Astro action (email via Resend).
 * Backend destination is configured in src/lib/send-lead.ts.
 */

const PROJECTS = [
  { id: 'roofing', label: 'Roofing' },
  { id: 'siding', label: 'Siding' },
  { id: 'windows', label: 'Windows' },
  { id: 'doors', label: 'Doors' },
  { id: 'other', label: 'Other' },
];

const STEP_LABELS = ['Project', 'Location', 'Details'];

export default function HeroQuoteForm() {
  const [step, setStep] = useState(0);
  const [projects, setProjects] = useState<string[]>([]);
  const [zip, setZip] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function toggleProject(id: string) {
    setError(null);
    setProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function next() {
    setError(null);
    if (step === 0 && projects.length === 0) {
      setError('Please choose at least one project to continue.');
      return;
    }
    if (step === 1 && zip.trim().length < 5) {
      setError('Enter a 5-digit ZIP code.');
      return;
    }
    setStep((s) => Math.min(s + 1, 2));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = {
      services: projects,
      projectDetails: details,
      zip: zip.trim(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      preferredContactTime: '',
      honeypot,
    };

    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please check your details and try again.');
      return;
    }

    setSubmitting(true);
    const { error: actionError } = await actions.submitLead(parsed.data);
    setSubmitting(false);

    if (actionError) {
      setError(actionError.message ?? 'Something went wrong. Please call us directly.');
      return;
    }

    setSubmitted(true);
    const w = window as Window & { gtag?: (...args: unknown[]) => void };
    w.gtag?.('event', 'generate_lead', { event_category: 'hero_quote_form' });
  }

  if (submitted) {
    return (
      <div className="card p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-700" aria-hidden="true" />
        <h2 className="text-display mt-4 text-2xl font-bold text-brand-900">Request received</h2>
        <p className="mt-3 text-stone-400">
          Thanks! We'll reach out within one business day to schedule your free estimate.
        </p>
        <a href={`tel:${siteConfig.phone.primaryTel}`} className="btn btn-primary mt-6 inline-flex">
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call {siteConfig.phone.primary}
        </a>
      </div>
    );
  }

  const inputClass =
    'mt-1.5 w-full rounded-[var(--radius-default)] border border-brand-900/10 bg-canvas px-4 py-3 text-ink outline-none transition-colors focus:border-brand-700';

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-6 sm:p-7"
      aria-label="Request a free quote"
    >
      <div className="flex items-baseline justify-between">
        <h2 className="text-display text-xl font-bold text-brand-900">Get your free quote</h2>
        <span className="text-xs font-semibold text-stone-400">Step {step + 1} of 3</span>
      </div>

      {/* Progress */}
      <div className="mt-4 flex gap-1.5" aria-hidden="true">
        {STEP_LABELS.map((label, i) => (
          <div
            key={label}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? 'bg-accent' : 'bg-brand-50'
            }`}
          />
        ))}
      </div>

      {/* Honeypot */}
      <input
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="mt-6">
        {step === 0 && (
          <fieldset>
            <legend className="text-sm font-semibold text-brand-900">
              What project can we help with?
            </legend>
            <p className="mt-1 text-xs text-stone-400">Select all that apply.</p>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {PROJECTS.map((p) => {
                const active = projects.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleProject(p.id)}
                    aria-pressed={active}
                    className={`relative min-h-11 rounded-[var(--radius-default)] border-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                      active
                        ? 'border-brand-700 bg-brand-700 text-paper'
                        : 'border-brand-900/10 bg-canvas text-brand-900 hover:border-brand-700'
                    } ${p.id === 'other' ? 'col-span-2' : ''}`}
                  >
                    {active && (
                      <Check className="absolute right-2 top-2 h-4 w-4" aria-hidden="true" />
                    )}
                    {p.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <div>
            <label htmlFor="hero-zip" className="text-sm font-semibold text-brand-900">
              Where is your project located?
            </label>
            <input
              id="hero-zip"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="ZIP code"
              className={inputClass}
            />
            <p className="mt-2 text-xs text-stone-400">
              We serve Washington, DC, Northern Virginia, and the Maryland suburbs.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-brand-900">Where should we send your estimate?</p>
            <div>
              <label htmlFor="hero-name" className="sr-only">Full name</label>
              <input
                id="hero-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                autoComplete="name"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="hero-phone" className="sr-only">Phone</label>
              <input
                id="hero-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                autoComplete="tel"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="hero-email" className="sr-only">Email</label>
              <input
                id="hero-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="hero-details" className="sr-only">Project details</label>
              <textarea
                id="hero-details"
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Project details (optional)"
                className={inputClass}
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-[var(--radius-default)] bg-red-50 p-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 flex items-center gap-3">
        {step > 0 && (
          <button type="button" onClick={back} className="btn btn-ghost inline-flex px-4">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Back
          </button>
        )}
        {step < 2 ? (
          <button type="button" onClick={next} className="btn btn-primary inline-flex flex-1">
            Continue <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
            {submitting ? 'Sending…' : 'Get my free quote'}
          </button>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-stone-400">
        No pressure. No obligation. Just a clear estimate for your project.
      </p>
    </form>
  );
}
