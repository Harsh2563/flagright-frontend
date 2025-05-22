import { SVGProps } from "react";
import { PaymentMethodType } from "./enums/UserEnums";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  paymentMethods?: Array<{
    id: string;
    type: PaymentMethodType;
  }>;
  createdAt: string;
  updatedAt?: string;
}
