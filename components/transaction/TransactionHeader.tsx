'use client';

import { Chip } from '@heroui/chip';

import { title, subtitle } from '../ui/primitives';
import { TransactionIcon } from '../ui/icons';
import { ITransaction } from '../../types/transaction';

import { getStatusColor, getTransactionTypeLabel } from './TransactionDetails';

interface TransactionHeaderProps {
  transaction: ITransaction & {
    senderName?: string;
    receiverName?: string;
  };
}

export function TransactionHeader({ transaction }: TransactionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 p-6 rounded-xl shadow-sm border border-primary-200/20 dark:border-primary-700/30">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-primary/20 dark:bg-primary/30 rounded-full shadow-inner dark:shadow-primary/10">
          <TransactionIcon
            className="text-primary dark:text-primary-400"
            size={32}
          />
        </div>
        <div>
          <h1 className={title({ size: 'sm' })}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-300 dark:to-secondary-300">
              {getTransactionTypeLabel(transaction.transactionType)}
            </span>
          </h1>
          <p
            className={subtitle({
              class: 'w-full md:w-full mt-1 dark:text-default-300',
            })}
          >
            Transaction ID:{' '}
            <span className="font-mono text-xs">{transaction.id}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Chip
          className="capitalize font-medium shadow-sm"
          color={getStatusColor(transaction.status)}
          size="md"
          variant="solid"
        >
          {transaction.status.charAt(0).toUpperCase() +
            transaction.status.slice(1)}
        </Chip>
        <p className="text-sm text-default-500">
          {new Date(transaction.timestamp).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
