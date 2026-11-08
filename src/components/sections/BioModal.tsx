'use client';

import { X } from 'lucide-react';
import { useRef } from 'react';
import { TeamPortrait } from '@/components/ui/TeamPortrait';
import type { TeamMember } from '@/data/team';
import { useFocusTrap, useScrollLock } from '@/lib/use-focus-trap';

interface BioModalProps {
  member: TeamMember | null;
  onClose: () => void;
}

/**
 * Bio modal. Ink overlay at 80% with blur; the panel slides up 24px and fades in
 * over 320ms. Escape and outside clicks close it, focus is trapped inside, and
 * focus returns to the card that opened it.
 */
export default function BioModal({ member, onClose }: BioModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const open = member !== null;

  useFocusTrap(panelRef, open, onClose);
  useScrollLock(open);

  if (!member) return null;

  return (
    <div className="fixed inset-0 z-overlay flex items-center justify-center p-4 sm:p-8">
      <div
        role="presentation"
        onClick={onClose}
        className="absolute inset-0 bg-ink-900/80 backdrop-blur-[6px]"
        style={{ animation: 'site-fade-in 320ms cubic-bezier(0.16,1,0.3,1) forwards' }}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bio-modal-name"
        tabIndex={-1}
        className="relative grid max-h-full w-full max-w-4xl grid-cols-1 overflow-y-auto bg-paper md:grid-cols-12"
        style={{ animation: 'site-panel-in 320ms cubic-bezier(0.16,1,0.3,1) forwards' }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close biography"
          className="absolute right-0 top-0 z-10 inline-flex h-12 w-12 items-center justify-center bg-ink-900 text-white transition-colors duration-fast hover:bg-gold hover:text-ink-900"
        >
          <X aria-hidden="true" strokeWidth={1.5} className="h-5 w-5" />
        </button>

        <div className="md:col-span-5">
          <TeamPortrait
            src={member.photo}
            alt={member.photoAlt}
            initials={member.initials}
            greyscale={false}
            sizes="(min-width: 768px) 420px, 100vw"
            className="aspect-portrait w-full md:h-full"
          />
        </div>

        <div className="flex flex-col gap-5 p-8 md:col-span-7 md:p-10">
          <div>
            <h2 id="bio-modal-name" className="t-h3 font-bold text-ink-900">
              {member.name}
            </h2>
            <p className="u-mono mt-2 text-[12px] text-gold-ink">{member.role}</p>
          </div>

          {member.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="max-w-measure text-slate-600">
              {paragraph}
            </p>
          ))}

          <div className="mt-2 border-t border-line pt-5">
            <h3 className="u-eyebrow text-slate-600">Credentials</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {member.credentials.map((credential) => (
                <li key={credential} className="u-mono text-[11px] normal-case tracking-[0.06em] text-ink-900">
                  {credential}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes site-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes site-panel-in {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
