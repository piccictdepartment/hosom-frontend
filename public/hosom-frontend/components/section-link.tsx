'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type SectionLinkProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  target: string;
  children: ReactNode;
};

export function SectionLink({ target, children, onClick, ...props }: SectionLinkProps) {
  return (
    <button
      {...props}
      type="button"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }}
    >
      {children}
    </button>
  );
}
