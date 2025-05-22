import { IUser } from '../types/user';
import api from '../utils/api';

export async function getUsers(): Promise<IUser[]> {
  try {
    const response = await api.get('/users');
    const users: IUser[] = response?.data?.data?.users;
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}
