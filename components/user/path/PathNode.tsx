'use client';

import React from 'react';
import { IPathNode, IUser } from '@/types/user';
import {
  UserIcon,
  TransactionsIcon,
  CalendarIcon,
  CurrencyIcon,
  IdCardIcon,
  EmailIcon,
  PhoneIcon,
} from '../../ui/icons';

export function PathNode({ node }: { node: IPathNode }) {
  const { type, properties } = node;

  if (type === 'User') {
    const user = properties as IUser;
    return (
      <div className="min-w-[220px] p-4 rounded-md bg-gradient-to-br from-primary-50 to-primary-100 dark:bg-blue-900/70 border-2 border-primary-300 dark:border-blue-800 shadow-md hover:shadow-lg transition-all hover:scale-105">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-full bg-primary-200 dark:bg-blue-800/50 border border-primary-300 dark:border-blue-700">
            <UserIcon
              size={18}
              className="text-primary-700 dark:text-blue-400"
            />
          </div>
          <div>
            <div className="font-semibold text-primary-700 dark:text-blue-200">
              {user.firstName} {user.lastName}
            </div>
            User
          </div>
        </div>

        <div className="space-y-1 mt-3">
          <div className="flex items-center gap-1.5 text-sm text-default-600 dark:text-blue-400">
            <EmailIcon
              size={14}
              className="text-primary-600 dark:text-blue-500"
            />
            <span className="truncate">{user.email}</span>
          </div>

          {user.phone && (
            <div className="flex items-center gap-1.5 text-sm text-default-600 dark:text-blue-400">
              <PhoneIcon
                size={14}
                className="text-primary-600 dark:text-blue-500"
              />
              <span>{user.phone}</span>
            </div>
          )}

          {user.id && (
            <div className="flex items-center gap-1.5 text-xs text-default-500 dark:text-blue-500 mt-1">
              <IdCardIcon
                size={12}
                className="text-primary-500 dark:text-blue-500"
              />
              <span className="truncate">ID: {user.id.substring(0, 8)}...</span>
            </div>
          )}
        </div>
      </div>
    );
  } else if (type === 'Transaction') {
    const transaction = properties as any;
    return (
      <div className="min-w-[220px] p-4 rounded-md bg-gradient-to-br from-secondary-50 to-secondary-100 dark:bg-purple-900/70 border-2 border-secondary-300 dark:border-purple-800 shadow-md hover:shadow-lg transition-all hover:scale-105">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-full bg-secondary-200 dark:bg-purple-800/50 border border-secondary-300 dark:border-purple-700">
            <TransactionsIcon
              size={18}
              className="text-secondary-700 dark:text-purple-400"
            />
          </div>
          <div>
            <div className="font-semibold text-secondary-700 dark:text-purple-200">
              Transaction
            </div>
            Transfer
          </div>
        </div>

        <div className="space-y-1 mt-3">
          <div className="flex items-center gap-1.5 text-sm font-medium text-default-700 dark:text-purple-400">
            <CurrencyIcon
              size={16}
              className="text-secondary-600 dark:text-purple-500"
            />
            <span>
              {transaction.amount} {transaction.currency}
            </span>
          </div>

          {transaction.timestamp && (
            <div className="flex items-center gap-1.5 text-sm text-default-600 dark:text-purple-400">
              <CalendarIcon
                size={14}
                className="text-secondary-600 dark:text-purple-500"
              />
              <span>
                {new Date(transaction.timestamp).toLocaleDateString()}
              </span>
            </div>
          )}

          {transaction.id && (
            <div className="flex items-center gap-1.5 text-xs text-default-500 dark:text-purple-500 mt-1">
              <IdCardIcon
                size={12}
                className="text-secondary-500 dark:text-purple-500"
              />
              <span className="truncate">
                ID: {transaction.id.substring(0, 8)}...
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
