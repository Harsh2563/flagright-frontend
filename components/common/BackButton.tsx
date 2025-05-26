'use client';

import { Button } from '@heroui/react';

interface BackButtonProps {
  onBack: () => void;
  content: string;
}

export function BackButton({ onBack, content }: BackButtonProps) {
  return (
    <Button
      className="mb-4 flex items-center gap-2 hover:bg-default-100 transition-all"
      color="default"
      variant="light"
      onClick={onBack}
    >
      <svg
        fill="none"
        height="16"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="16"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      {content}
    </Button>
  );
}
