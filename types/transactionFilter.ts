import { TransactionStatus, TransactionType } from "./enums/TransactionEnums";
import { PaymentMethodType } from "./enums/UserEnums";

export interface TransactionSearchFilters {
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

export interface TransactionSearchParams {
  page?: number;
  limit?: number;
  searchText?: string;
  sortBy?: 'amount' | 'createdAt' ;
  sortOrder?: 'asc' | 'desc';
  filters?: TransactionSearchFilters;
}

export interface TransactionSearchResponse {
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

export interface TransactionFilterState {
  filters: TransactionSearchFilters;
  searchText?: string;
  sortBy: TransactionSearchParams['sortBy'];
  sortOrder: TransactionSearchParams['sortOrder'];
  page: number;
  limit: number;
}