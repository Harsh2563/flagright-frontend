'use client';

import { UserHeader } from './UserHeader';
import { PersonalInfoCard } from './PersonalInfoCard';
import { AddressCard } from './AddressCard';
import { PaymentMethodsCard } from './PaymentMethodsCard';
import { GraphGenerator } from './GraphGenerator';
import { BackButton } from './BackButton';
import { IUser } from '../../types/user';

interface UserDetailsProps {
  user: IUser;
  onGenerateGraph: () => void;
  onBack: () => void;
}

export function UserDetails({
  user,
  onGenerateGraph,
  onBack,
}: UserDetailsProps) {
  return (
    <>
      <BackButton onBack={onBack} />
      <UserHeader user={user} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PersonalInfoCard user={user} />
        <AddressCard user={user} />
        <PaymentMethodsCard user={user} />
      </div>

      <GraphGenerator onGenerateGraph={onGenerateGraph} />
    </>
  );
}
