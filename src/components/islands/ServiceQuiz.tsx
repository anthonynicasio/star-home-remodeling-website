import { useState } from 'react';

export interface QuizService {
  id: string;
  label: string;
}

interface ServiceQuizProps {
  services: QuizService[];
}

export default function ServiceQuiz({ services }: ServiceQuizProps) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  function handleContinue() {
    const params = new URLSearchParams();
    if (selected.length > 0) {
      params.set('services', selected.join(','));
    }
    window.location.href = `/get-estimate${params.toString() ? `?${params}` : ''}`;
  }

  return (
    <div className="rounded-[var(--radius-default)] bg-paper p-6 shadow-[var(--shadow-card)] sm:p-8">
      <h2 className="text-display text-xl font-bold text-brand-900 sm:text-2xl">
        What can we help you with?
      </h2>
      <p className="mt-2 text-sm text-stone-400">
        Select all that apply    we will prefill your estimate request.
      </p>

      <div className="mt-6 flex flex-wrap gap-3" role="group" aria-label="Services needed">
        {services.map((service) => {
          const isSelected = selected.includes(service.id);
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => toggle(service.id)}
              aria-pressed={isSelected}
              className={`min-h-11 rounded-[var(--radius-default)] border-2 px-5 py-2.5 text-sm font-semibold transition-colors ${
                isSelected
                  ? 'border-brand-700 bg-brand-700 text-paper'
                  : 'border-brand-300/60 bg-brand-50 text-brand-900 hover:border-brand-700'
              }`}
            >
              {service.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        className="btn btn-primary mt-8 w-full sm:w-auto"
      >
        Continue to free estimate
      </button>
    </div>
  );
}
