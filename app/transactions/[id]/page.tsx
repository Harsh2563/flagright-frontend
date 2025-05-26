'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTransactions } from '../../../contexts/TransactionContext';
import { useUsers } from '../../../contexts/UserContext';
import { ITransaction } from '../../../types/transaction';
import { ITransactionRelationshipGraphResponse } from '../../../types/relationship';
import {
  TransactionDetails,
  TransactionHeader,
  TransactionRelation,
  TransactionRelationshipGraph,
} from '../../../components/transaction';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { BackButton } from '../../../components/common/BackButton';
import { getTransactionRelationships } from '../../../services/relationshipService';
import { useToastMessage } from '@/utils/toast';

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params?.id as string;
  const { getTransactionById, loading: transactionsLoading } =
    useTransactions();
  const { getUserById, loading: usersLoading } = useUsers();
  const [transaction, setTransaction] = useState<ITransaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [relationships, setRelationships] =
    useState<ITransactionRelationshipGraphResponse | null>(null);
  const [relationshipsLoading, setRelationshipsLoading] =
    useState<boolean>(false);
  const [relationshipsError, setRelationshipsError] = useState<string | null>(
    null
  );
  const toast = useToastMessage();
  useEffect(() => {
    if (transactionId) {
      const foundTransaction = getTransactionById(transactionId);
      if (foundTransaction) {
        setTransaction(foundTransaction);
        setLoading(false);
        // Fetch relationships after transaction is found
        fetchTransactionRelationships(transactionId);
      } else if (!transactionsLoading) {
        setError('Transaction not found');
        toast.error('Transaction not found');
        setLoading(false);
      }
    } else if (!transactionsLoading) {
      setError('Invalid transaction ID');
      toast.error('Invalid transaction ID');
      setLoading(false);
    }
  }, [transactionId, getTransactionById, transactionsLoading]);

  // Function to fetch transaction relationships
  const fetchTransactionRelationships = async (id: string) => {
    try {
      setRelationshipsLoading(true);
      setRelationshipsError(null);
      const relationshipData = await getTransactionRelationships(id);

      setRelationships(relationshipData);
    } catch (err) {
      console.error('Error fetching transaction relationships:', err);
      toast.error('Failed to load relationship data');
      setRelationshipsError('Failed to load relationship data');
    } finally {
      setRelationshipsLoading(false);
    }
  };

  // Get sender and receiver names for display
  const getSenderAndReceiverNames = () => {
    if (!transaction) return null;

    const sender = getUserById(transaction.senderId);
    const receiver = getUserById(transaction.receiverId);

    return {
      senderName: sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown',
      receiverName: receiver
        ? `${receiver.firstName} ${receiver.lastName}`
        : 'Unknown',
    };
  };
  const names = getSenderAndReceiverNames();

  const handleBack = () => {
    router.push('/transactions');
  };
  return (
    <section className="container mx-auto px-4 py-8">
      {loading || usersLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : transaction ? (
        <>
          <BackButton onBack={handleBack} content="Back to Transactions" />
          <TransactionHeader
            transaction={{
              ...transaction,
              senderName: names?.senderName,
              receiverName: names?.receiverName,
            }}
          />
          <TransactionDetails
            transaction={{
              ...transaction,
              senderName: names?.senderName,
              receiverName: names?.receiverName,
            }}
          />

          {/* Relationship Components */}
          <TransactionRelationshipGraph
            relationships={relationships}
            isLoading={relationshipsLoading}
            centerTransactionId={transactionId}
          />
          <TransactionRelation
            relationships={relationships}
            isLoading={relationshipsLoading}
          />
          {relationshipsError && (
            <div className="mt-6">
              <ErrorMessage message={relationshipsError} />
            </div>
          )}
        </>
      ) : (
        <ErrorMessage message="Transaction not found" />
      )}
    </section>
  );
}
