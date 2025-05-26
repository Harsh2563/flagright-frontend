'use client';

import { ITransactionRelationshipGraphResponse } from '../../../types/relationship';
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Chip,
  Spinner,
} from '@heroui/react';
import {
  CreditCardIcon,
  DeviceIcon,
  MapPinIcon,
  ArrowRightIcon,
} from '../../ui/icons';

interface TransactionRelationProps {
  relationships: ITransactionRelationshipGraphResponse | null;
  isLoading?: boolean;
}

export function TransactionRelation({
  relationships,
  isLoading = false,
}: TransactionRelationProps) {
  if (isLoading) {
    return (
      <div className="mt-6 flex justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!relationships) {
    return (
      <Card className="mt-6 shadow-md">
        <CardBody>
          <p>No relationship data available for this transaction.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="mt-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-default-50/10">
        <CardHeader className="bg-gradient-to-r from-primary-50/50 to-secondary-100/50 dark:from-primary-600/20 dark:to-secondary-700/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CreditCardIcon />
            <h2 className="text-xl font-semibold dark:text-white">
              Transaction Relationships
            </h2>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>{renderTransactionRelationshipData(relationships)}</CardBody>
      </Card>
    </div>
  );
}

function renderTransactionRelationshipData(
  response: ITransactionRelationshipGraphResponse
) {
  // Check if response data is valid and has the expected structure
  if (!response || !response.data) {
    return <p>Invalid relationship data format.</p>;
  }

  const {
    sender,
    receiver,
    sharedDeviceTransactions = [],
    sharedIPTransactions = [],
  } = response.data;

  console.log('Transaction relationships data:', sharedIPTransactions);

  return (
    <>
      {/* Transaction Flow Section */}
      {(sender || receiver) && (
        <div className="mb-6">
          <p className="text-lg font-medium mb-3 flex items-center gap-2">
            <ArrowRightIcon className="w-5 h-5" />
            Transaction Flow
          </p>
          <div className="pl-4 border-l-2 border-success-200 dark:border-success-800">
            {sender && (
              <div className="mb-3 p-3 bg-default-50 dark:bg-default-800/30 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-success-600 dark:text-success-400">
                    Sender
                  </p>
                </div>
                <p className="text-sm text-default-600">User ID: {sender.id}</p>
                <p className="text-xs text-default-500">
                  Name: {sender.firstName} {sender.lastName}
                </p>
                <p className="text-xs text-default-500">
                  Email: {sender.email}
                </p>
              </div>
            )}

            {receiver && (
              <div className="mb-3 p-3 bg-default-50 dark:bg-default-800/30 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-primary-600 dark:text-primary-400">
                    Receiver
                  </p>
                </div>
                <p className="text-sm text-default-600">
                  User ID: {receiver.id}
                </p>
                <p className="text-xs text-default-500">
                  Name: {receiver.firstName} {receiver.lastName}
                </p>
                <p className="text-xs text-default-500">
                  Email: {receiver.email}
                </p>
              </div>
            )}
          </div>
        </div>
      )}{' '}
      {/* Shared Device Transactions */}
      {sharedDeviceTransactions?.length > 0 && (
        <div className="mb-6">
          <p className="text-lg font-medium mb-3 flex items-center gap-2">
            <DeviceIcon className="w-5 h-5" />
            Shared Device Transactions ({sharedDeviceTransactions.length})
          </p>
          <div className="pl-4 border-l-2 border-danger-200 dark:border-danger-800">
            {sharedDeviceTransactions?.map((relationshipData, relIndex) => (
              <div key={relIndex} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Chip size="sm" color="danger" variant="flat">
                    {relationshipData?.relationshipType}
                  </Chip>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-danger-50 dark:bg-danger-900/20 rounded-md border border-danger-100 dark:border-danger-800">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">
                        Transaction ID:{' '}
                        {relationshipData.transaction.id?.substring(0, 12)}...
                      </p>
                      <Chip size="sm" color="danger" variant="flat">
                        {relationshipData.transaction.amount}{' '}
                        {relationshipData.transaction.currency}
                      </Chip>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-default-600">
                      <p>Status: {relationshipData.transaction.status}</p>
                      <p>
                        Type: {relationshipData.transaction.transactionType.toUpperCase()}
                      </p>
                      <p>
                        Date:{' '}
                        {new Date(
                          relationshipData.transaction.timestamp
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        Device:{' '}
                        {relationshipData.transaction.deviceId
                          ? relationshipData.transaction.deviceId.substring(
                              0,
                              8
                            ) + '...'
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}{' '}
      {/* Shared IP Transactions */}
      {sharedIPTransactions?.length > 0 && (
        <div className="mb-6">
          <p className="text-lg font-medium mb-3 flex items-center gap-2">
            <MapPinIcon className="w-5 h-5" />
            Shared IP Transactions ({sharedIPTransactions.length})
          </p>
          <div className="pl-4 border-l-2 border-secondary-200 dark:border-secondary-800">
            {sharedIPTransactions?.map((relationshipData, relIndex) => (
              <div key={relIndex} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Chip size="sm" color="secondary" variant="flat">
                    {relationshipData?.relationshipType}
                  </Chip>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-secondary-50 dark:bg-secondary-900/20 rounded-md border border-secondary-100 dark:border-secondary-800">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">
                        Transaction ID:{' '}
                        {relationshipData.transaction.id?.substring(0, 12)}...
                      </p>
                      <Chip size="sm" color="secondary" variant="flat">
                        {relationshipData.transaction.amount}{' '}
                        {relationshipData.transaction.currency}
                      </Chip>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-default-600">
                      <p>Status: {relationshipData.transaction.status}</p>
                      <p>
                        Type: {relationshipData.transaction.transactionType.toUpperCase()}
                      </p>
                      <p>
                        Date:{' '}
                        {new Date(
                          relationshipData.transaction.timestamp
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        Device:{' '}
                        {relationshipData.transaction.deviceId
                          ? relationshipData.transaction.deviceId.substring(
                              0,
                              8
                            ) + '...'
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* No relationships found */}
      {!sender &&
        !receiver &&
        sharedDeviceTransactions?.length === 0 &&
        sharedIPTransactions?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-default-500">
              No relationships found for this transaction.
            </p>
          </div>
        )}
    </>
  );
}
