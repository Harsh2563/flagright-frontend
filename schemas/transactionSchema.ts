import { z } from 'zod';

import {
  PaymentMethodType,
  TransactionStatus,
  TransactionType,
} from '../types/enums/TransactionEnums';

const GeolocationSchema = z.object({
  country: z.string().optional(),
  state: z.string().optional(),
});

const DeviceInfoSchema = z.object({
  ipAddress: z.string().ip().optional(),
  geolocation: GeolocationSchema.optional(),
});

export type TransactionSchemaType = z.infer<typeof TransactionSchema>;

export const TransactionSchema = z.object({
  id: z.string().uuid('Invalid transaction ID format').optional(),
  transactionType: z.nativeEnum(TransactionType, {
    errorMap: () => ({ message: 'Invalid transaction type' }),
  }),
  status: z.nativeEnum(TransactionStatus, {
    errorMap: () => ({ message: 'Invalid transaction status' }),
  }),
  senderId: z.string().uuid('Invalid sender ID format'),
  receiverId: z.string().uuid('Invalid receiver ID format'),
  amount: z.number().positive('Amount must be a positive number'),
  currency: z.string().min(1, 'Currency is required'),
  destinationAmount: z
    .number()
    .positive('Destination amount must be a positive number')
    .optional(),
  destinationCurrency: z.string().optional(),
  timestamp: z
    .string()
    .datetime({ offset: true })
    .optional()
    .default(() => new Date().toISOString()),
  description: z.string().optional(),
  deviceId: z.string().optional(),
  deviceInfo: DeviceInfoSchema.optional(),
  paymentMethod: z.nativeEnum(PaymentMethodType).optional(),
});

export const TransactionFormSchema = z.object({
  id: z.string().uuid('Invalid transaction ID format').optional(),
  transactionType: z.nativeEnum(TransactionType, {
    errorMap: () => ({ message: 'Invalid transaction type' }),
  }),
  status: z.nativeEnum(TransactionStatus, {
    errorMap: () => ({ message: 'Invalid transaction status' }),
  }),
  senderId: z.string().uuid('Invalid sender ID format'),
  receiverId: z.string().uuid('Invalid receiver ID format'),
  amount: z
    .string()
    .refine((value) => !isNaN(parseFloat(value)), {
      message: 'Amount must be a number',
    })
    .transform((value) => parseFloat(value)),
  currency: z.string().min(1, 'Currency is required'),
  destinationAmount: z
    .string()
    .refine((value) => !isNaN(parseFloat(value)), {
      message: 'Destination amount must be a number',
    })
    .optional()
    .transform((value) => (value ? parseFloat(value) : undefined)),
  destinationCurrency: z.string().optional(),
  timestamp: z
    .string()
    .datetime({ offset: true })
    .optional()
    .default(() => new Date().toISOString()),
  description: z.string().optional(),
  deviceId: z.string().optional(),
  deviceInfo: DeviceInfoSchema.optional(),
  paymentMethod: z.nativeEnum(PaymentMethodType).optional(),
});

export type TransactionFormType = z.infer<typeof TransactionFormSchema>;

export const formDataToTransaction = (
  formData: TransactionFormType
): TransactionSchemaType => {
  return {
    id: formData.id,
    transactionType: formData.transactionType,
    status: formData.status,
    senderId: formData.senderId,
    receiverId: formData.receiverId,
    amount: formData.amount,
    currency: formData.currency,
    destinationAmount: formData.destinationAmount,
    destinationCurrency: formData.destinationCurrency,
    timestamp: formData.timestamp || new Date().toISOString(),
    description: formData.description,
    deviceId: formData.deviceId,
    deviceInfo: {
      ipAddress: formData.deviceInfo?.ipAddress,
      geolocation: {
        country: formData.deviceInfo?.geolocation?.country,
        state: formData.deviceInfo?.geolocation?.state,
      },
    },
    paymentMethod: formData.paymentMethod,
  };
};
