'use client';

import { useState, useEffect } from 'react';
import { title, subtitle } from '../../components/ui/primitives';
import { UsersIcon } from '../../components/ui/icons';
import { UserCard } from '../../components/userCard';
import { getUsers } from '../../services/userService';
import { IUser } from '../../types/user';

export default function UsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);
  return (
    <section className="container mx-auto px-4 py-8">
      {' '}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <UsersIcon size={24} className="text-primary" />
          </div>
          <div>
            <h1 className={title({ size: 'sm' })}>Users</h1>
            <p className={subtitle({ class: 'w-full md:w-full mt-1' })}>
              View and manage user accounts and their relationships
            </p>
          </div>
        </div>
        <button
          onClick={() => (window.location.href = '/users/add-user')}
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-1"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add User
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-danger text-center py-10">{error}</div>
      ) : users?.length === 0 ? (
        <div className="text-center py-10 text-default-500">
          No users found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users?.map((user) => <UserCard key={user.id} user={user} />)}
        </div>
      )}
    </section>
  );
}
