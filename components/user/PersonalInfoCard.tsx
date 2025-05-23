'use client';

import { Card, CardHeader, CardBody, Divider } from '@heroui/react';
import { IUser } from '../../types/user';

interface PersonalInfoCardProps {
  user: IUser;
}

export function PersonalInfoCard({ user }: PersonalInfoCardProps) {
  return (
    <Card className="lg:col-span-1 shadow-md hover:shadow-lg transition-shadow border-none dark:bg-default-50/10">
      <CardHeader className="bg-gradient-to-r from-primary-50/50 to-primary-100/50 dark:from-primary-600/20 dark:to-primary-700/10">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-primary/20 dark:bg-primary/30 rounded-full">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary dark:text-primary-400"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2 className="text-xl font-semibold dark:text-white">
            Personal Information
          </h2>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-default-500">Full Name</h3>
            <p className="text-lg font-medium">
              {user.firstName} {user.lastName}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-default-500">
              Email Address
            </h3>
            <p className="flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary/70"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              {user.email}
            </p>
          </div>
          {user.phone && (
            <div>
              <h3 className="text-sm font-medium text-default-500">
                Phone Number
              </h3>
              <p className="flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary/70"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                {user.phone}
              </p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-default-500">
              Account Created
            </h3>
            <p className="flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary/70"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
