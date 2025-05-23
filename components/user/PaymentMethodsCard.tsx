'use client';

import { Card, CardHeader, CardBody, Divider, Chip } from '@heroui/react';
import { IUser } from '../../types/user';
import { PaymentMethodType } from '../../types/enums/UserEnums';
import { getPaymentMethodName } from '@/helper/helper';

interface PaymentMethodsCardProps {
  user: IUser;
}

export function PaymentMethodsCard({ user }: PaymentMethodsCardProps) {
  return (
    <Card className="lg:col-span-1 shadow-md hover:shadow-lg transition-shadow border-none dark:bg-default-50/10">
      <CardHeader className="bg-gradient-to-r from-success-50/50 to-success-100/50 dark:from-success-600/20 dark:to-success-700/10">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-success/20 dark:bg-success/30 rounded-full">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-success dark:text-success-400"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          <h2 className="text-xl font-semibold dark:text-white">
            Payment Methods
          </h2>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        {user.paymentMethods && user.paymentMethods.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.paymentMethods.map((method) => (
              <Chip
                key={method.id}
                color={
                  method.type === PaymentMethodType.CARD
                    ? 'primary'
                    : method.type === PaymentMethodType.BANK_ACCOUNT
                      ? 'success'
                      : method.type === PaymentMethodType.WALLET
                        ? 'warning'
                        : 'secondary'
                }
                variant="flat"
                className="px-3 py-1.5 text-sm font-medium shadow-sm"
              >
                {getPaymentMethodName(method.type)}
              </Chip>
            ))}
          </div>
        ) : (
          <div className="text-default-500 dark:text-default-400 italic flex items-center gap-2 py-4 justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="dark:stroke-default-400"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            No payment methods added
          </div>
        )}
      </CardBody>
    </Card>
  );
}
