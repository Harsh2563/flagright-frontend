import { ITransaction } from "@/types/transaction";
import api from "@/utils/api";

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
