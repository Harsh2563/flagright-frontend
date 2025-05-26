'use client';
import { useParams } from 'next/navigation';

import TransactionForm from '@/components/transaction/form/TransactionForm';

export default function UpdateTransactionPage() {
  const params = useParams();
  const transactionId = params?.id as string;

  return <TransactionForm id={transactionId} />;
}
