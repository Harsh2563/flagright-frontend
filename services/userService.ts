import { UserFormType } from '../schemas/userSchema';
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

export async function handleUser(user: UserFormType): Promise<IUser> {
  try {
    const response = await api.post('/users', user);
    const newUser: IUser = response?.data?.data?.user;
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}
