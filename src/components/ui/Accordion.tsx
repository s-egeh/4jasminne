'use client';

import { Plus } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  onDark?: boolean;
  className?: string;
  /** Index open on first render; null closes everything. */
  defaultOpen?: number | null;
  /**
   * Heading level for each question. Defaults to h3; /faq nests accordions
   * under h3 category labels, so it passes h4 to keep the outline in order.
   */
  headingLevel?: 'h3' | 'h4';
}

export function Accordion({
  items,
  onDark = false,
  className,
  defaultOpen = 0,
  headingLevel: Heading = 'h3',
}: AccordionProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = items.length - 1;
    let next: number | null = null;

    if (event.key === 'ArrowDown') next = index === last ? 0 : index + 1;
    if (event.key === 'ArrowUp') next = index === 0 ? last : index - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = last;

    if (next !== null) {
      event.preventDefault();
      buttonsRef.current[next]?.focus();
    }
  };

  return (
    <div className={cn('border-t', onDark ? 'border-line-dark' : 'border-line', className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const headingId = `${baseId}-h-${index}`;
        const panelId = `${baseId}-p-${index}`;

        return (
          <div key={item.question} className={cn('border-b', onDark ? 'border-line-dark' : 'border-line')}>
            <Heading>
              <button
                ref={(node) => {
                  buttonsRef.current[index] = node;
                }}
                type="button"
                id={headingId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className={cn(
                  'group flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-fast',
                  onDark ? 'text-white hover:text-gold' : 'text-ink-900 hover:text-gold-ink',
                )}
              >
                <span className="font-display t-h4 font-semibold">{item.question}</span>
                <Plus
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className={cn(
                    'mt-1 h-5 w-5 shrink-0 text-gold transition-transform duration-base ease-out-expo',
                    isOpen && 'rotate-45',
                  )}
                />
              </button>
            </Heading>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headingId}
              hidden={!isOpen}
              className="pb-7 pr-10"
            >
              <p className={cn('max-w-measure', onDark ? 'text-slate-400' : 'text-slate-600')}>
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
