'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useUsers } from '../../../contexts/UserContext';
import { IUser } from '../../../types/user';
import { UserDetails } from '../../../components/user/UserDetails';
import { UserNotFound } from '../../../components/user/UserNotFound';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { getUserRelationships } from '../../../services/relationshipService';
import { IUserRelationshipGraphResponse } from '../../../types/relationship';

import { useToastMessage } from '@/utils/toast';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;
  const { getUserById, loading: contextLoading } = useUsers();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingGraph, setIsGeneratingGraph] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>(
    'Generating user relationship graph'
  );
  const [relationships, setRelationships] =
    useState<IUserRelationshipGraphResponse | null>(null);
  const [relationshipsLoading, setRelationshipsLoading] =
    useState<boolean>(false);
  const toast = useToastMessage();

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
  // Fetch user relationships when the page loads
  useEffect(() => {
    async function fetchRelationships() {
      if (!userId) return;

      try {
        setRelationshipsLoading(true);
        const result = await getUserRelationships(userId);

        setRelationships(result);
        console.log('User relationships fetched:', result);
      } catch (err) {
        toast.error('Failed to fetch user relationships');
        console.error('Failed to fetch user relationships:', err);
      } finally {
        setRelationshipsLoading(false);
      }
    }

    fetchRelationships();
  }, [userId]);

  // Update loading text with dots periodically
  useEffect(() => {
    if (!isGeneratingGraph) return;

    let dotCount = 0;
    const interval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      const dots = '.'.repeat(dotCount);

      setLoadingText(`Generating user relationship graph${dots}`);
    }, 500);

    return () => clearInterval(interval);
  }, [isGeneratingGraph]);

  const handleGenerateGraph = () => {
    setIsGeneratingGraph(true);
  };

  return (
    <section className="container mx-auto px-4 py-8">
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : user ? (
        <UserDetails
          isGeneratingGraph={isGeneratingGraph}
          loadingText={loadingText}
          relationships={relationships}
          relationshipsLoading={relationshipsLoading}
          user={user}
          onBack={() => router.back()}
          onGenerateGraph={handleGenerateGraph}
        />
      ) : (
        <UserNotFound />
      )}
    </section>
  );
}
