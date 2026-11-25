'use client';
import { usePublicDialog } from './public-dialogs';

export function ProgrammeExplore({ code, label = 'Explore →' }: { code: string; label?: string }) {
  const { open } = usePublicDialog();
  return (
    <button type="button" className="text-link" onClick={() => open({ type: 'programme', code })}>
      {label}
    </button>
  );
}
