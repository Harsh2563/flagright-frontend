import { IUserRelationshipGraphResponse } from '@/types/relationship';
import api from '@/utils/api';

export async function getUserRelationships(
  userId: string
): Promise<IUserRelationshipGraphResponse> {
  try {
    const response = await api.get(`/relationships/user/${userId}`);
    const relationship: IUserRelationshipGraphResponse = response?.data;
    return relationship;
  } catch (error) {
    console.error('Error fetching user relationships:', error);
    throw error;
  }
}
