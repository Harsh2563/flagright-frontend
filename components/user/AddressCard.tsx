'use client';

import { Card, CardHeader, CardBody, Divider } from '@heroui/react';

import { IUser } from '../../types/user';

interface AddressCardProps {
  user: IUser;
}

export function AddressCard({ user }: AddressCardProps) {
  return (
    <Card className="lg:col-span-1 shadow-md hover:shadow-lg transition-shadow border-none dark:bg-default-50/10">
      <CardHeader className="bg-gradient-to-r from-secondary-50/50 to-secondary-100/50 dark:from-secondary-600/20 dark:to-secondary-700/10">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-secondary/20 dark:bg-secondary/30 rounded-full">
            <svg
              className="text-secondary dark:text-secondary-400"
              fill="none"
              height="16"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="16"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold dark:text-white">
            Address Information
          </h2>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        {user.address && Object.values(user.address).some((val) => val) ? (
          <div className="space-y-4">
            {user.address.street && (
              <div>
                <h3 className="text-sm font-medium text-default-500">Street</h3>
                <p>{user.address.street}</p>
              </div>
            )}
            {user.address.city && (
              <div>
                <h3 className="text-sm font-medium text-default-500">City</h3>
                <p>{user.address.city}</p>
              </div>
            )}
            {user.address.state && (
              <div>
                <h3 className="text-sm font-medium text-default-500">
                  State/Province
                </h3>
                <p>{user.address.state}</p>
              </div>
            )}
            {user.address.postalCode && (
              <div>
                <h3 className="text-sm font-medium text-default-500">
                  Postal Code
                </h3>
                <p>{user.address.postalCode}</p>
              </div>
            )}
            {user.address.country && (
              <div>
                <h3 className="text-sm font-medium text-default-500">
                  Country
                </h3>
                <p>{user.address.country}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-default-500 dark:text-default-400 italic flex items-center gap-2 py-4 justify-center">
            <svg
              className="dark:stroke-default-400"
              fill="none"
              height="16"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="16"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            No address information provided
          </div>
        )}
      </CardBody>
    </Card>
  );
}
