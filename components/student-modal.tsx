'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type StudentModalProps = {
  children: ReactNode;
  label: string;
  onClose: () => void;
  className?: string;
  scrollKey?: string;
};

export function StudentModal({ children, label, onClose, className = '', scrollKey }: StudentModalProps) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (dialogRef.current) dialogRef.current.scrollTop = 0;
  }, [scrollKey]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="student-feature-backdrop" onMouseDown={event => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={label} className={`student-feature-dialog ${className}`}>
        {children}
      </section>
    </div>,
    document.body,
  );
}
