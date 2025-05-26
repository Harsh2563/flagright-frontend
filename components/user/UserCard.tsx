import React from 'react';
import { Card, CardBody, CardFooter } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Link } from '@heroui/link';

import { IUser } from '../../types/user';

interface UserCardProps {
  user: IUser;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <Card className="w-full">
      <CardBody className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-default-500 text-sm">{user.email}</p>
              {user.phone && (
                <p className="text-default-500 text-sm">{user.phone}</p>
              )}
            </div>
            <Chip color="primary" size="sm" variant="flat">
              {user.paymentMethods?.length || 0} payment method(s)
            </Chip>
          </div>

          {user.address && (
            <div className="mt-2">
              <p className="text-sm text-default-500">
                {[
                  user.address.street,
                  user.address.city,
                  user.address.state,
                  user.address.postalCode,
                  user.address.country,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          )}

          <div className="mt-2">
            <p className="text-xs text-default-400">
              Created: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex justify-end gap-2">
        <Button
          as={Link}
          color="primary"
          href={`/users/${user.id}`}
          size="sm"
          variant="flat"
        >
          View Details
        </Button>
        <Button
          as={Link}
          color="secondary"
          href={`users/add-user/${user.id}`}
          size="sm"
          variant="flat"
        >
          Update
        </Button>
      </CardFooter>
    </Card>
  );
};
