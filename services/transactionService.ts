import { ITransaction } from '@/types/transaction';
import { IPaginationTransaction } from '@/types/pagination';
import api from '@/utils/api';
import {
  ITransactionSearchParams,
  ITransactionSearchResponse,
} from '@/types/transaction';

export async function getTransactions(): Promise<{
  transactions: ITransaction[];
  pagination: IPaginationTransaction;
}> {
  try {
    const response = await api.get('/transactions', { withCredentials: true });
    const transactions: ITransaction[] =
      response?.data?.data?.transactions || [];
    const pagination: IPaginationTransaction = response?.data?.data
      ?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalTransactions: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    return { transactions, pagination };
  } catch (error) {
    console.error('Error fetching transactions:', error);

    return { transactions: [], pagination: {} as IPaginationTransaction };
  }
}

export async function handleTransaction(
  transaction: any
): Promise<ITransaction> {
  try {
    const response = await api.post('/transactions', transaction, {
      withCredentials: true,
    });
    const newTransaction: ITransaction = response?.data?.data?.transaction;

    return newTransaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

export async function searchTransactions(
  params: ITransactionSearchParams
): Promise<ITransactionSearchResponse> {
  try {
    console.log('Search params received:', params);

    const queryString = new URLSearchParams();

    // Add pagination
    if (params.page) {
      queryString.append('page', params.page.toString());
    }
    if (params.limit) {
      queryString.append('limit', params.limit.toString());
    }

    // Add sorting
    if (params.sortBy) {
      queryString.append('sortBy', params.sortBy);
    }
    if (params.sortOrder) {
      queryString.append('sortOrder', params.sortOrder);
    }

    // Add searchText if present
    if (params.searchText) {
      queryString.append('searchText', params.searchText);
    }

    // Add filters
    if (params.filters) {
      console.log('Filters being processed:', params.filters);
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          console.log(`Adding filter ${key}:`, value);
          queryString.append(`filters.${key}`, value.toString());
        }
      });
    }

    const finalUrl = `/transactions/search?${queryString.toString()}`;

    console.log('Final API URL:', finalUrl);

    const response = await api.get(finalUrl, { withCredentials: true });

    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
}
