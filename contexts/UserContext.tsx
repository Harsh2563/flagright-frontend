'use client';

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from 'react';
import { IUser } from '../types/user';
import { getUsers, handleUser } from '../services/userService';
import { UserSchemaType } from '../schemas/userSchema';

interface UserContextType {
  users: IUser[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (userData: UserSchemaType) => Promise<IUser | null>;
  refreshUsers: () => Promise<void>;
  getUserById: (id: string) => IUser | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  const fetchUsers = useCallback(async () => {
    if (initialized && users.length > 0) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
      setInitialized(true);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [users.length, initialized]);

  const addUser = useCallback(
    async (userData: UserSchemaType): Promise<IUser | null> => {
      try {
        setLoading(true);
        setError(null);
        const newUser = await handleUser(userData);

        if (newUser) {
          // Update the users array with the new user
          setUsers((prevUsers) => [...prevUsers, newUser]);
        }
        refreshUsers();
        return newUser;
      } catch (err) {
        console.error('Error adding user:', err);
        setError('Failed to add user. Please try again later.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const refreshUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error refreshing users:', err);
      setError('Failed to refresh users. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize users on mount
  React.useEffect(() => {
    if (!initialized) {
      fetchUsers();
    }
  }, [initialized, fetchUsers]);
  // Helper function to get a user by ID
  const getUserById = useCallback(
    (id: string) => {
      return users.find((user) => user.id === id);
    },
    [users]
  );

  const value = {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    refreshUsers,
    getUserById,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
}
