'use client';

import { Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { TeamPortrait } from '@/components/ui/TeamPortrait';
import type { TeamMember } from '@/data/team';
import { cn } from '@/lib/utils';

// The modal only exists once someone asks for a bio — it never sits in the
// homepage bundle.
const BioModal = dynamic(() => import('./BioModal'), { ssr: false });

interface TeamGridProps {
  members: TeamMember[];
  /** The homepage preview hides the fifth card at smaller breakpoints. */
  hideLastOnSmall?: boolean;
  className?: string;
}

export function TeamGrid({ members, hideLastOnSmall = false, className }: TeamGridProps) {
  const [openMember, setOpenMember] = useState<TeamMember | null>(null);

  return (
    <>
      <div className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4', className)}>
        {members.map((member, index) => (
          <Reveal
            key={member.slug}
            delay={Math.min(index, 5) * 70}
            className={cn(hideLastOnSmall && index === 4 && 'hidden xl:block')}
          >
            <button
              type="button"
              onClick={() => setOpenMember(member)}
              aria-haspopup="dialog"
              className="group relative flex w-full flex-col border border-line bg-paper text-left transition-[border-color,box-shadow] duration-fast ease-out-expo hover:border-gold hover:shadow-elevate"
            >
              <TeamPortrait
                src={member.photo}
                alt={member.photoAlt}
                initials={member.initials}
                className="aspect-portrait w-full"
              />

              <span className="flex w-full items-end justify-between gap-4 p-5">
                <span>
                  <span className="block font-display text-[18px] font-semibold text-ink-900">
                    {member.name}
                  </span>
                  <span className="u-mono mt-1.5 block text-[12px] text-gold-ink">{member.role}</span>
                </span>

                <span
                  aria-hidden="true"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-line text-ink-900 transition-colors duration-fast group-hover:border-ink-900 group-hover:bg-ink-900 group-hover:text-white"
                >
                  <Plus strokeWidth={1.5} className="h-4 w-4" />
                </span>
              </span>

              <span className="sr-only">Read the full biography of {member.name}</span>
            </button>
          </Reveal>
        ))}
      </div>

      {openMember ? <BioModal member={openMember} onClose={() => setOpenMember(null)} /> : null}
    </>
  );
}
