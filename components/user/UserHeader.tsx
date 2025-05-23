'use client';

import { title, subtitle } from '../../components/ui/primitives';
import { UsersIcon } from '../../components/ui/icons';
import { IUser } from '../../types/user';

interface UserHeaderProps {
  user: IUser;
}

export function UserHeader({ user }: UserHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-8 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 p-6 rounded-xl shadow-sm border border-primary-200/20 dark:border-primary-700/30">
      <div className="p-4 bg-primary/20 dark:bg-primary/30 rounded-full shadow-inner dark:shadow-primary/10">
        <UsersIcon size={32} className="text-primary dark:text-primary-400" />
      </div>
      <div>
        <h1 className={title({ size: 'sm' })}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-300 dark:to-secondary-300">
            {user.firstName} {user.lastName}
          </span>
        </h1>
        <p
          className={subtitle({
            class: 'w-full md:w-full mt-1 dark:text-default-300',
          })}
        >
          Detailed profile and account information
        </p>
      </div>
    </div>
  );
}
