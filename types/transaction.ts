import { TransactionStatus, TransactionType } from './enums/TransactionEnums';
import { PaymentMethodType } from './enums/UserEnums';

export interface ITransaction {
  id: string;
  transactionType: TransactionType;
  status: TransactionStatus;
  senderId: string;
  receiverId: string;
  amount: number;
  currency: string;
  destinationAmount?: number;
  destinationCurrency?: string;
  timestamp: string;
  description?: string;
  deviceId?: string;
  deviceInfo?: {
    ipAddress?: string;
    geolocation?: {
      country?: string;
      state?: string;
    };
  };
  paymentMethod?: PaymentMethodType;
}

export interface ITransactionSearchFilters {
  transactionType?: TransactionType;
  status?: TransactionStatus;
  senderId?: string;
  receiverId?: string;
  currency?: string;
  paymentMethod?: PaymentMethodType;
  amountMin?: number;
  amountMax?: number;
  description?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export interface ITransactionSearchParams {
  page?: number;
  limit?: number;
  searchText?: string;
  sortBy?: 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  filters?: ITransactionSearchFilters;
}

export interface ITransactionSearchResponse {
  status: string;
  message: string;
  data: {
    transactions: any[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalTransactions: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface ITransactionFilterState {
  filters: ITransactionSearchFilters;
  searchText?: string;
  sortBy: ITransactionSearchParams['sortBy'];
  sortOrder: ITransactionSearchParams['sortOrder'];
  page: number;
  limit: number;
}
