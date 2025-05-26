import { SVGProps } from 'react';
import { PaymentMethodType } from './enums/UserEnums';
import { ITransaction } from './transaction';

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

export interface IShortestPathUser {
  startUserId: string;
  targetUserId: string;
}

export interface IPathNode {
  type: 'User' | 'Transaction';
  properties: IUser | ITransaction;
}

export interface IPathRelationship {
  type: 'SENT' | 'RECEIVED_BY';
  startNodeId: string;
  endNodeId: string;
}

export interface IShortestPath {
  nodes: IPathNode[];
  relationships: IPathRelationship[];
}

export interface IShortestPathResponseUser {
  status: 'success' | 'error'; 
  data: {
    path: IShortestPath;
    length: number;
  };
}