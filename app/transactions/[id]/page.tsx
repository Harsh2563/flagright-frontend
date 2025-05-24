'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTransactions } from '../../../contexts/TransactionContext';
import { useUsers } from '../../../contexts/UserContext';
import { ITransaction } from '../../../types/transaction';
import { TransactionDetails } from '../../../components/transaction/TransactionDetails';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { BackButton } from '../../../components/user/BackButton';

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

  useEffect(() => {
    if (transactionId) {
      const foundTransaction = getTransactionById(transactionId);
      if (foundTransaction) {
        setTransaction(foundTransaction);
        setLoading(false);
      } else if (!transactionsLoading) {
        setError('Transaction not found');
        setLoading(false);
      }
    } else if (!transactionsLoading) {
      setError('Invalid transaction ID');
      setLoading(false);
    }
  }, [transactionId, getTransactionById, transactionsLoading]);

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
          <TransactionDetails
            transaction={{
              ...transaction,
              senderName: names?.senderName,
              receiverName: names?.receiverName,
            }}
          />
        </>
      ) : (
        <ErrorMessage message="Transaction not found" />
      )}
    </section>
  );
}
