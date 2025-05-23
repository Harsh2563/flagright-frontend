'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUsers } from '../../../contexts/UserContext';
import { IUser } from '../../../types/user';
import { UserDetails } from '../../../components/user/UserDetails';
import { UserNotFound } from '../../../components/user/UserNotFound';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;
  const { getUserById, loading: contextLoading } = useUsers();

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const foundUser = getUserById(userId);
      if (foundUser) {
        setUser(foundUser);
        setLoading(false);
      } else if (!contextLoading) {
        setError('User not found');
        setLoading(false);
      }
    } else if (!contextLoading) {
      setError('Invalid user ID');
      setLoading(false);
    }
  }, [userId, getUserById, contextLoading]);

  const handleGenerateGraph = () => {};
  return (
    <section className="container mx-auto px-4 py-8">
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : user ? (
        <UserDetails
          user={user}
          onGenerateGraph={handleGenerateGraph}
          onBack={() => router.back()}
        />
      ) : (
        <UserNotFound />
      )}
    </section>
  );
}
