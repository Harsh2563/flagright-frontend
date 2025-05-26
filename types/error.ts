import { z } from 'zod';

import { UserFormSchema } from '../schemas/userSchema';

import { TransactionFormSchema } from '@/schemas/transactionSchema';

export type UserValidationErrors = {
  [K in keyof z.infer<typeof UserFormSchema>]?: string;
} & {
  general?: string;
};

export type TransactionValidationError = {
  [K in keyof z.infer<typeof TransactionFormSchema>]?: string;
} & {
  general?: string;
  deviceInfo?: {
    ipAddress?: string;
    geolocation?: {
      country?: string;
      state?: string;
    };
  };
};
