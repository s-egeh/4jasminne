'use client';

import { Children, isValidElement, type ElementType, type ReactNode } from 'react';
import { Reveal } from './Reveal';

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  childAs?: ElementType;
  /** 70ms per child. */
  step?: number;
  /** Never stagger more than 6 children — beyond that the last one feels broken. */
  max?: number;
  baseDelay?: number;
}

export function StaggerGroup({
  children,
  className,
  as: Tag = 'div',
  childAs = 'div',
  step = 70,
  max = 6,
  baseDelay = 0,
}: StaggerGroupProps) {
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <Tag className={className}>
      {items.map((child, index) => (
        <Reveal key={child.key ?? index} as={childAs} delay={baseDelay + Math.min(index, max - 1) * step}>
          {child}
        </Reveal>
      ))}
    </Tag>
  );
}
