import { TransactionType } from './enums/TransactionEnums';
import { ITransaction } from './transaction';
import { IUser } from './user';

export interface IUserRelationshipData {
  relationshipType: string;
  user: IUser;
}

export interface IUserTransactionData {
  transaction: ITransaction;
  relatedUser: IUser;
}

export interface IUserRelationshipGraphResponse {
  status: string;
  data: {
    directRelationships: IUserRelationshipData[];
    transactionRelationships: IUserRelationshipData[];
    sentTransactions: IUserTransactionData[];
    receivedTransactions: IUserTransactionData[];
  };
}

export interface IUserRelationshipGraphProps {
  relationships:
    | IUserRelationshipGraphResponse[]
    | IUserRelationshipGraphResponse
    | null;
  isLoading?: boolean;
  centerUserId?: string;
}

export interface ITransactionResponseUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ITransactionResponseTransaction {
  id: string;
  amount: number;
  currency: string;
  timestamp: string;
  transactionType: TransactionType;
  status: string;
  deviceId: string | null;
}

export interface ITransactionRelationshipData {
  relationshipType: 'SHARED_DEVICE' | 'SHARED_IP';
  transaction: ITransactionResponseTransaction;
}

export interface ITransactionRelationshipGraphResponse {
  status: string;
  data: {
    sender: ITransactionResponseUser;
    receiver: ITransactionResponseUser;
    sharedDeviceTransactions: ITransactionRelationshipData[];
    sharedIPTransactions: ITransactionRelationshipData[];
  };
}

export interface ITransactionRelationshipGraphProps {
  relationships: ITransactionRelationshipGraphResponse | null;
  isLoading?: boolean;
  centerTransactionId?: string;
}
