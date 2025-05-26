'use client';

import { Button } from '@heroui/react';
import { IUser } from '../../types/user';

interface BackButtonProps {
  onBack: () => void;
  content: string;
}

export function BackButton({ onBack, content }: BackButtonProps) {
  return (
    <Button
      variant="light"
      color="default"
      className="mb-4 flex items-center gap-2 hover:bg-default-100 transition-all"
      onClick={onBack}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      {content}
    </Button>
  );
}
