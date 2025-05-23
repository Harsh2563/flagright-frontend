'use client';

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from 'react';
import { ITransaction } from '../types/transaction';
import { getTransactions } from '../services/transactionService';

interface TransactionContextType {
  transactions: ITransaction[];
  loading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  getTransactionById: (id: string) => ITransaction | undefined;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  const fetchTransactions = useCallback(async () => {
    if (initialized && transactions.length > 0) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getTransactions();
      setTransactions(data);
      setInitialized(true);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [transactions.length, initialized]);

  const refreshTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Error refreshing transactions:', err);
      setError('Failed to refresh transactions. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize transactions on mount
  React.useEffect(() => {
    if (!initialized) {
      fetchTransactions();
    }
  }, [initialized, fetchTransactions]);

  // Helper function to get a transaction by ID
  const getTransactionById = useCallback(
    (id: string) => {
      return transactions.find(transaction => transaction.id === id);
    },
    [transactions]
  );

  const value = {
    transactions,
    loading,
    error,
    fetchTransactions,
    refreshTransactions,
    getTransactionById,
  };

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
