'use client';

import { title, subtitle } from '../../components/ui/primitives';
import { TransactionIcon } from '../../components/ui/icons';
import { TransactionCard } from '../../components/transaction/TransactionCard';
import { useTransactions } from '../../contexts/TransactionContext';
import { useRouter } from 'next/navigation';

export default function TransactionsPage() {
  const { transactions, loading, error } = useTransactions();
  const router = useRouter();
  
  return (
    <section className="container mx-auto px-4 py-8">      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <TransactionIcon size={24} className="text-primary" />
          </div>
          <div>
            <h1 className={title({ size: 'sm' })}>Transactions</h1>
            <p className={subtitle({ class: 'w-full md:w-full mt-1' })}>
              View and monitor financial transactions across accounts
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push('/transactions/add-transaction')}
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
          Add Transaction
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-danger text-center py-10">{error}</div>
      ) : transactions?.length === 0 ? (
        <div className="text-center py-10 text-default-500">
          No transactions found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transactions?.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </section>
  );
}