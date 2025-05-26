'use client';

import React from 'react';
import { Select, SelectItem } from '@heroui/react';

import { UserIcon } from '../../ui/icons';

import { IUser } from '@/types/user';

interface UserSelectorProps {
  label: string;
  userId: string;
  setUserId: (id: string) => void;
  users: IUser[];
  iconColor: string;
  borderColor: string;
  errorMessage?: string;
  getUserById: (id: string) => IUser | undefined;
}

export function UserSelector({
  label,
  userId,
  setUserId,
  users,
  iconColor,
  borderColor,
  errorMessage,
  getUserById,
}: UserSelectorProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-2">
        <UserIcon className={`text-${iconColor}`} size={20} />
        <span className="font-medium dark:text-gray-200">{label}</span>
      </div>
      <Select
        classNames={{
          trigger: `border-2 hover:border-${borderColor} focus-within:border-${borderColor} dark:bg-gray-800 dark:border-gray-700`,
          value: 'dark:text-gray-300',
        }}
        errorMessage={errorMessage}
        id={`${label.toLowerCase().replace(' ', '')}Id`}
        labelPlacement="outside"
        name={`${label.toLowerCase().replace(' ', '')}Id`}
        placeholder={`Select ${label.toLowerCase()}`}
        renderValue={() => {
          return userId ? (
            <div className="flex items-center gap-2">
              {getUserById(userId)?.firstName} {getUserById(userId)?.lastName}
            </div>
          ) : null;
        }}
        selectedKeys={userId ? [userId] : []}
        onSelectionChange={(keys) => {
          const selectedKey =
            keys instanceof Set ? (Array.from(keys)[0] as string) : undefined;

          setUserId(selectedKey || '');
        }}
      >
        {users.map((user) => (
          <SelectItem key={user.id} className="dark:text-gray-300">
            {user.firstName} {user.lastName}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
