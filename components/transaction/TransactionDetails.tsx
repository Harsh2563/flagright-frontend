import React from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Divider } from '@heroui/divider';

import { ITransaction } from '../../types/transaction';
import {
  TransactionStatus,
  TransactionType,
} from '../../types/enums/TransactionEnums';
import {
  InfoIcon,
  DollarSignIcon,
  CalendarIcon,
  CreditCardIcon,
  UserIcon,
  ArrowRightIcon,
  MapPinIcon,
  DeviceIcon,
  FileTextIcon,
} from '../ui/icons';

interface TransactionDetailsProps {
  transaction: ITransaction & {
    senderName?: string;
    receiverName?: string;
  };
}

// Helper function to get appropriate status color
export const getStatusColor = (status: TransactionStatus) => {
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
export const getTransactionTypeLabel = (type: TransactionType) => {
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

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transaction,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-md hover:shadow-lg transition-shadow border-none dark:bg-default-50/10">
          <CardHeader className="bg-gradient-to-r from-primary-50/50 to-primary-100/50 dark:from-primary-600/20 dark:to-primary-700/10">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-primary/20 dark:bg-primary/30 rounded-full">
                <InfoIcon
                  className="text-primary dark:text-primary-400"
                  size={16}
                />
              </div>
              <h2 className="text-xl font-semibold dark:text-white">
                Basic Information
              </h2>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-default-500 flex items-center gap-2">
                  <InfoIcon className="text-primary/70" size={14} />
                  Type
                </h3>
                <p className="text-lg font-medium">
                  {getTransactionTypeLabel(transaction.transactionType)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-default-500 flex items-center gap-2">
                  <CalendarIcon className="text-primary/70" size={14} />
                  Date & Time
                </h3>
                <p className="text-lg font-medium">
                  {new Date(transaction.timestamp).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-default-500 flex items-center gap-2">
                  <CreditCardIcon className="text-primary/70" size={14} />
                  Payment Method
                </h3>
                <p className="text-lg font-medium">
                  {transaction.paymentMethod
                    ? transaction.paymentMethod
                        .replace('_', ' ')
                        .charAt(0)
                        .toUpperCase() +
                      transaction.paymentMethod.replace('_', ' ').slice(1)
                    : 'Not specified'}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Amount Information Card */}
        <Card className="lg:col-span-1 shadow-md hover:shadow-lg transition-shadow border-none dark:bg-default-50/10">
          <CardHeader className="bg-gradient-to-r from-secondary-50/50 to-secondary-100/50 dark:from-secondary-600/20 dark:to-secondary-700/10">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-secondary/20 dark:bg-secondary/30 rounded-full">
                <DollarSignIcon
                  className="text-secondary dark:text-secondary-400"
                  size={16}
                />
              </div>
              <h2 className="text-xl font-semibold dark:text-white">
                Amount Information
              </h2>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-default-500 flex items-center gap-2">
                  <DollarSignIcon className="text-secondary/70" size={14} />
                  Transaction Amount
                </h3>
                <p className="text-2xl font-bold text-secondary dark:text-secondary-400">
                  {formatCurrency(transaction.amount, transaction.currency)}
                </p>
              </div>
              {transaction.destinationAmount &&
                transaction.destinationCurrency && (
                  <div>
                    <h3 className="text-sm font-medium text-default-500 flex items-center gap-2">
                      <ArrowRightIcon className="text-secondary/70" size={14} />
                      Destination Amount
                    </h3>
                    <p className="text-xl font-semibold text-secondary dark:text-secondary-400">
                      {formatCurrency(
                        transaction.destinationAmount,
                        transaction.destinationCurrency
                      )}
                    </p>
                  </div>
                )}
            </div>
          </CardBody>
        </Card>

        {/* Status Information Card */}
        <Card className="lg:col-span-1 shadow-md hover:shadow-lg transition-shadow border-none dark:bg-default-50/10">
          <CardHeader className="bg-gradient-to-r from-success-50/50 to-warning-50/50 dark:from-success-600/20 dark:to-warning-600/20">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-success/20 dark:bg-success/30 rounded-full">
                <InfoIcon
                  className="text-success dark:text-success-400"
                  size={16}
                />
              </div>
              <h2 className="text-xl font-semibold dark:text-white">
                Status Information
              </h2>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-default-500">
                  Current Status
                </h3>
                <Chip
                  className="capitalize font-medium shadow-sm mt-2"
                  color={getStatusColor(transaction.status)}
                  size="lg"
                  variant="solid"
                >
                  {transaction.status.charAt(0).toUpperCase() +
                    transaction.status.slice(1)}
                </Chip>
              </div>
              <div>
                <h3 className="text-sm font-medium text-default-500">
                  Transaction ID
                </h3>
                <p className="font-mono text-sm bg-default-100 p-2 rounded mt-1">
                  {transaction.id}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Participants Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sender Information Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow border-none dark:bg-default-50/10">
          <CardHeader className="bg-gradient-to-r from-primary-50/50 to-primary-100/50 dark:from-primary-600/20 dark:to-primary-700/10">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-primary/20 dark:bg-primary/30 rounded-full">
                <UserIcon
                  className="text-primary dark:text-primary-400"
                  size={16}
                />
              </div>
              <h2 className="text-xl font-semibold dark:text-white">
                Sender Information
              </h2>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-default-500 flex items-center gap-2">
                  <UserIcon className="text-primary/70" size={14} />
                  Sender Name
                </h3>
                <p className="text-lg font-medium">
                  {transaction.senderName || 'Unknown'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-default-500">
                  Sender ID
                </h3>
                <p className="font-mono text-sm bg-default-100  p-2 rounded">
                  {transaction.senderId}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Receiver Information Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow border-none dark:bg-default-50/10">
          <CardHeader className="bg-gradient-to-r from-secondary-50/50 to-secondary-100/50 dark:from-secondary-600/20 dark:to-secondary-700/10">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-secondary/20 dark:bg-secondary/30 rounded-full">
                <UserIcon
                  className="text-secondary dark:text-secondary-400"
                  size={16}
                />
              </div>
              <h2 className="text-xl font-semibold dark:text-white">
                Receiver Information
              </h2>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-default-500 flex items-center gap-2">
                  <UserIcon className="text-secondary/70" size={14} />
                  Receiver Name
                </h3>
                <p className="text-lg font-medium">
                  {transaction.receiverName || 'Unknown'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-default-500">
                  Receiver ID
                </h3>
                <p className="font-mono text-sm bg-default-100 p-2 rounded">
                  {transaction.receiverId}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Additional Information */}
      {transaction.description && (
        <Card className="shadow-md hover:shadow-lg transition-shadow border-none dark:bg-default-50/10">
          <CardHeader className="bg-gradient-to-r from-primary-50/50 to-primary-100/50 dark:from-primary-600/20 dark:to-primary-700/10">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-primary/20 dark:bg-primary/30 rounded-full">
                <FileTextIcon
                  className="text-primary dark:text-primary-400"
                  size={16}
                />
              </div>
              <h2 className="text-xl font-semibold dark:text-white">
                Description
              </h2>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="bg-gradient-to-r from-default-50 to-default-100 dark:from-default-100 dark:to-default-200 p-4 rounded-lg">
              <p className="text-default-700 dark:text-default-800 italic">
                &quot;{transaction.description}&quot;
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Device Information */}
      {transaction.deviceInfo && (
        <Card className="shadow-md hover:shadow-lg transition-shadow border-none dark:bg-default-50/10">
          <CardHeader className="bg-gradient-to-r from-warning-50/50 to-warning-100/50 dark:from-warning-600/20 dark:to-warning-700/10">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-warning/20 dark:bg-warning/30 rounded-full">
                <DeviceIcon
                  className="text-warning dark:text-warning-400"
                  size={16}
                />
              </div>
              <h2 className="text-xl font-semibold dark:text-white">
                Device Information
              </h2>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {transaction.deviceInfo.ipAddress && (
                <div>
                  <h3 className="text-sm font-medium text-default-500 flex items-center gap-2">
                    <DeviceIcon className="text-warning/70" size={14} />
                    IP Address
                  </h3>
                  <p className="font-mono text-sm p-2 rounded mt-1">
                    {transaction.deviceInfo.ipAddress}
                  </p>
                </div>
              )}
              {transaction.deviceInfo.geolocation && (
                <div className="space-y-3">
                  {transaction.deviceInfo.geolocation.country && (
                    <div>
                      <h3 className="text-sm font-medium text-default-500 flex items-center gap-2">
                        <MapPinIcon className="text-warning/70" size={14} />
                        Country
                      </h3>
                      <p className="text-lg font-medium">
                        {transaction.deviceInfo.geolocation.country}
                      </p>
                    </div>
                  )}
                  {transaction.deviceInfo.geolocation.state && (
                    <div>
                      <h3 className="text-sm font-medium text-default-500 flex items-center gap-2">
                        <MapPinIcon className="text-warning/70" size={14} />
                        State
                      </h3>
                      <p className="text-lg font-medium">
                        {transaction.deviceInfo.geolocation.state}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
