import { z } from 'zod';
import { PaymentMethodType } from '../types/enums/UserEnums';

const PaymentMethodSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(PaymentMethodType),
});

const AddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

export const UserSchema = z.object({
  id: z.string().uuid('Invalid user ID format').optional(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  address: AddressSchema.optional(),
  paymentMethods: z.array(PaymentMethodSchema).optional(),
});

export type UserSchemaType = z.infer<typeof UserSchema>;

export const UserFormSchema = z.object({
  id: z.string().uuid('Invalid user ID format').optional(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  paymentMethodTypes: z
    .array(z.nativeEnum(PaymentMethodType))
    .default([])
    .optional(),
});

export type UserFormType = z.infer<typeof UserFormSchema>;

export const formDataToUser = (formData: UserFormType): UserSchemaType => {
  return {
    id: formData.id,
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    address: {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country,
    },
    paymentMethods: formData?.paymentMethodTypes?.map((type) => ({
      id: crypto.randomUUID(),
      type: type,
    })),
  };
};
