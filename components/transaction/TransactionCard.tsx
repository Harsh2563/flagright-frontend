import React from 'react';
import { Card, CardBody, CardFooter } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Link } from '@heroui/link';
import { ITransaction } from '../../types/transaction';
import {
  TransactionStatus,
  TransactionType,
} from '../../types/enums/TransactionEnums';
import { useUsers } from '../../contexts/UserContext';

interface TransactionCardProps {
  transaction: ITransaction;
}

// Helper function to get appropriate status color
const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.COMPLETED:
      return 'success';
    case TransactionStatus.PENDING:
      return 'warning';
    case TransactionStatus.FAILED:
      return 'danger';
    case TransactionStatus.REVERSED:
      return 'secondary';
    default:
      return 'default';
  }
};

// Helper function to format currency
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

// Helper function to get transaction type label
const getTransactionTypeLabel = (type: TransactionType) => {
  switch (type) {
    case TransactionType.DEPOSIT:
      return 'Deposit';
    case TransactionType.WITHDRAWAL:
      return 'Withdrawal';
    case TransactionType.TRANSFER:
      return 'Transfer';
    case TransactionType.PAYMENT:
      return 'Payment';
    case TransactionType.EXCHANGE:
      return 'Exchange';
    default:
      return 'Unknown';
  }
};

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
}) => {
  const { getUserById } = useUsers();

  // Get user names for display
  const sender = getUserById(transaction.senderId);
  const receiver = getUserById(transaction.receiverId);

  const senderName = sender
    ? `${sender.firstName} ${sender.lastName}`
    : 'Unknown';
  const receiverName = receiver
    ? `${receiver.firstName} ${receiver.lastName}`
    : 'Unknown';
  return (
    <Card className="w-full">
      <CardBody className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">
                {getTransactionTypeLabel(transaction.transactionType)}
              </h3>
              <p className="text-default-500 text-sm">
                {formatCurrency(transaction.amount, transaction.currency)}
                {transaction.destinationAmount &&
                  transaction.destinationCurrency &&
                  ` → ${formatCurrency(transaction.destinationAmount, transaction.destinationCurrency)}`}
              </p>
              {transaction.description && (
                <p className="text-default-500 text-sm italic">
                  "{transaction.description}"
                </p>
              )}
            </div>
            <Chip
              color={getStatusColor(transaction.status)}
              variant="flat"
              size="sm"
            >
              {transaction.status}
            </Chip>
          </div>
          
          <div className="mt-2">
            <p className="text-sm text-default-500">
              <span className="font-medium">From:</span> {senderName}
              <span className="text-xs text-default-400 ml-1">
                ({transaction.senderId})
              </span>
            </p>
            <p className="text-sm text-default-500">
              <span className="font-medium">To:</span> {receiverName}
              <span className="text-xs text-default-400 ml-1">
                ({transaction.receiverId})
              </span>
            </p>
            {transaction.paymentMethod && (
              <p className="text-sm text-default-500">
                <span className="font-medium">Payment Method:</span>{' '}
                {transaction.paymentMethod.replace('_', ' ')}
              </p>
            )}
          </div>

          {transaction.deviceInfo && (
            <div className="mt-2">
              <p className="text-xs text-default-400">
                {transaction.deviceInfo.ipAddress &&
                  `IP: ${transaction.deviceInfo.ipAddress}`}
                {transaction.deviceInfo.geolocation &&
                  transaction.deviceInfo.geolocation.country &&
                  ` | Location: ${transaction.deviceInfo.geolocation.city || ''} ${transaction.deviceInfo.geolocation.country}`}
              </p>
            </div>
          )}

          <div className="mt-2">
            <p className="text-xs text-default-400">
              Date: {new Date(transaction.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex justify-end gap-2">
        <Button
          as={Link}
          href={`/transactions/${transaction.id}`}
          color="primary"
          variant="flat"
          size="sm"
        >
          View Details
        </Button>
        <Button
          as={Link}
          href={`transactions/add-transaction/${transaction.id}`}
          color="secondary"
          variant="flat"
          size="sm"
        >
          Update
        </Button>
      </CardFooter>
    </Card>
  );
};
