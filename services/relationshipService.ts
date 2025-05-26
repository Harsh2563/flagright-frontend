import {
  IUserRelationshipGraphResponse,
  ITransactionRelationshipGraphResponse,
} from '@/types/relationship';
import api from '@/utils/api';

export async function getUserRelationships(
  userId: string
): Promise<IUserRelationshipGraphResponse> {
  try {
    const response = await api.get(`/relationships/user/${userId}`, {
      withCredentials: true,
    });
    const relationship: IUserRelationshipGraphResponse = response?.data;

    return relationship;
  } catch (error) {
    console.error('Error fetching user relationships:', error);
    throw error;
  }
}

export async function getTransactionRelationships(
  transactionId: string
): Promise<ITransactionRelationshipGraphResponse> {
  try {
    const response = await api.get(
      `/relationships/transaction/${transactionId}`,
      { withCredentials: true }
    );
    const relationship: ITransactionRelationshipGraphResponse = response?.data;

    return relationship;
  } catch (error) {
    console.error('Error fetching transaction relationships:', error);
    throw error;
  }
}
