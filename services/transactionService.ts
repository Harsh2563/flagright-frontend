import { ITransaction } from '@/types/transaction';
import api from '@/utils/api';

export async function getTransactions(): Promise<ITransaction[]> {
  try {
    const response = await api.get('/transactions');
    const transactions: ITransaction[] = response?.data?.data?.transactions;
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function handleTransaction(
  transaction: any
): Promise<ITransaction> {
  try {
    const response = await api.post('/transactions', transaction);
    const newTransaction: ITransaction = response?.data?.data?.transaction;
    return newTransaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}
