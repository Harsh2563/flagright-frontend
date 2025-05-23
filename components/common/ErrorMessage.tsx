'use client';

import { ErrorMessageProps } from "@/types/common";

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="text-danger text-center py-10">
      {message || 'An error occurred'}
    </div>
  );
}
