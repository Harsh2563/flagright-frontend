import { IPaginationUser } from '@/types/pagination';
import { UserFormType } from '../schemas/userSchema';
import {
  IShortestPathResponseUser,
  IShortestPathUser,
  IUser,
} from '../types/user';
import api from '../utils/api';
import { UserSearchParams, UserSearchResponse } from '../types/userFilter';

export async function getUsers(): Promise<{
  users: IUser[];
  pagination: IPaginationUser;
}> {
  try {
    const response = await api.get('/users');
    const users: IUser[] = response?.data?.data?.users || [];
    const pagination = response?.data?.data?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalUsers: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
    return { users, pagination };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { users: [], pagination: {} as IPaginationUser };
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

export async function searchUsers(
  params: UserSearchParams
): Promise<UserSearchResponse> {
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

    const finalUrl = `/users/search?${queryString.toString()}`;
    console.log('Final API URL:', finalUrl);

    const response = await api.get(finalUrl);
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
}

export async function findShortestPath(
  users: IShortestPathUser
): Promise<IShortestPathResponseUser> {
  try {
    const response = await api.post('/users/shortest-path', users);
    return response.data;
  } catch (error) {
    console.error('Error finding shortest path:', error);
    throw error;
  }
}

export default {
  searchUsers,
};