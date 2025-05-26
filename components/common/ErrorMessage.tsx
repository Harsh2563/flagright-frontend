'use client';

import { IErrorMessageProps } from '@/types/common';

export function ErrorMessage({ message }: IErrorMessageProps) {
  return (
    <div className="text-danger text-center py-10">
      {message || 'An error occurred'}
    </div>
  );
}
