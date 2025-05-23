'use client';

import { IUserRelationshipGraphResponse } from '../../types/relationship';
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Chip,
  Spinner,
} from '@heroui/react';
import { ProfileIcon } from '../ui/icons';

interface UserRelationProps {
  relationships: IUserRelationshipGraphResponse[] | IUserRelationshipGraphResponse | null;
  isLoading?: boolean;
}

export function UserRelation({
  relationships,
  isLoading = false,
}: UserRelationProps) {
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
          <p>No relationship data available for this user.</p>
        </CardBody>
      </Card>
    );
  }

  // Check if relationships is array or single object
  const relationshipsArray = Array.isArray(relationships) ? relationships : [relationships];
  
  if (relationshipsArray.length === 0) {
    return (
      <Card className="mt-6 shadow-md">
        <CardBody>
          <p>No relationship data available for this user.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="mt-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-default-50/10">
        <CardHeader className="bg-gradient-to-r from-primary-50/50 to-secondary-100/50 dark:from-primary-600/20 dark:to-secondary-700/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ProfileIcon />
            <h2 className="text-xl font-semibold dark:text-white">
              User Relationships
            </h2>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          {relationshipsArray.map((relationship, index) => (
            <div key={index} className="mb-6 last:mb-0">
              {renderRelationshipData(relationship)}
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}

function renderRelationshipData(response: IUserRelationshipGraphResponse) {
  // Check if response data is valid and has the expected structure
  if (!response || !response.data) {
    return <p>Invalid relationship data format.</p>;
  }
  
  const { 
    directRelationships = [],
    transactionRelationships = [],
    sentTransactions = [],
    receivedTransactions = []
  } = response.data;

  return (
    <>
      {directRelationships.length > 0 && (
        <div className="mb-4">
          <p className="text-lg font-medium mb-2">Direct Relationships</p>
          <div className="pl-4 border-l-2 border-primary-200 dark:border-primary-800">
            {directRelationships.map((rel, idx) => (
              <div
                key={idx}
                className="mb-2 p-2 bg-default-50 dark:bg-default-800/30 rounded-md"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">
                    {rel.user.firstName} {rel.user.lastName}
                  </p>
                  <Chip size="sm" color="primary" variant="flat">
                    {rel.relationshipType}
                  </Chip>
                </div>
                <p className="text-xs text-default-500">{rel.user.email}</p>
              </div>
            ))}
          </div>
        </div>
      )}      {transactionRelationships.length > 0 && (
        <div className="mb-4">
          <p className="text-lg font-medium mb-2">Transaction Relationships</p>
          <div className="pl-4 border-l-2 border-secondary-200 dark:border-secondary-800">
            {transactionRelationships.map((rel, idx) => (
              <div
                key={idx}
                className="mb-2 p-2 bg-default-50 dark:bg-default-800/30 rounded-md"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">
                    {rel.user.firstName} {rel.user.lastName}
                  </p>
                  <Chip size="sm" color="secondary" variant="flat">
                    {rel.relationshipType}
                  </Chip>
                </div>
                <p className="text-xs text-default-500">
                  {rel.user.email}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}      {sentTransactions.length > 0 && (
        <div className="mb-4">
          <p className="text-lg font-medium mb-2">Sent Transactions</p>
          <div className="pl-4 border-l-2 border-warning-200 dark:border-warning-800">
            {sentTransactions.map((data, idx) => (
              <div
                key={idx}
                className="mb-2 p-2 bg-default-50 dark:bg-default-800/30 rounded-md"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">
                    To: {data.relatedUser.firstName} {data.relatedUser.lastName}
                  </p>
                  <Chip size="sm" color="warning" variant="flat">
                    {data.transaction.amount} {data.transaction.currency}
                  </Chip>
                </div>
                <p className="text-xs text-default-500">
                  Transaction ID: {data.transaction.id.substring(0, 8)}...
                </p>
                <p className="text-xs text-default-500">
                  {new Date(data.transaction.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {response.data.receivedTransactions.length > 0 && (
        <div className="mb-4">
          <p className="text-lg font-medium mb-2">Received Transactions</p>
          <div className="pl-4 border-l-2 border-success-200 dark:border-success-800">
            {response.data.receivedTransactions.map((data, idx) => (
              <div
                key={idx}
                className="mb-2 p-2 bg-default-50 dark:bg-default-800/30 rounded-md"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">
                    From: {data.relatedUser.firstName}{' '}
                    {data.relatedUser.lastName}
                  </p>
                  <Chip size="sm" color="success" variant="flat">
                    {data.transaction.amount} {data.transaction.currency}
                  </Chip>
                </div>
                <p className="text-xs text-default-500">
                  Transaction ID: {data.transaction.id.substring(0, 8)}...
                </p>
                <p className="text-xs text-default-500">
                  {new Date(data.transaction.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {response.data.directRelationships.length === 0 &&
        response.data.transactionRelationships.length === 0 &&
        response.data.sentTransactions.length === 0 &&
        response.data.receivedTransactions.length === 0 && (
          <p>No relationships found for this user.</p>
        )}
    </>
  );
}
