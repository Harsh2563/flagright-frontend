'use client';

import { IUser } from '../../types/user';
import { IUserRelationshipGraphResponse } from '../../types/relationship';

import { UserHeader } from './UserHeader';
import { PersonalInfoCard } from './PersonalInfoCard';
import { AddressCard } from './AddressCard';
import { PaymentMethodsCard } from './PaymentMethodsCard';
import { BackButton } from './../common/BackButton';
import { UserRelation } from './relation/UserRelation';
import { UserRelationshipGraph } from './relation/UserRelationshipGraph';

interface UserDetailsProps {
  user: IUser;
  onGenerateGraph: () => void;
  onBack: () => void;
  isGeneratingGraph?: boolean;
  loadingText?: string;
  relationships?: IUserRelationshipGraphResponse | null;
  relationshipsLoading?: boolean;
}

export function UserDetails({
  user,
  onBack,
  relationships = null,
  relationshipsLoading = false,
}: UserDetailsProps) {
  return (
    <>
      <BackButton content="Back to Users" onBack={onBack} />
      <UserHeader user={user} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PersonalInfoCard user={user} />
        <AddressCard user={user} />
        <PaymentMethodsCard user={user} />
      </div>{' '}
      <UserRelationshipGraph
        centerUserId={user?.id}
        isLoading={relationshipsLoading}
        relationships={relationships}
      />
      <UserRelation
        isLoading={relationshipsLoading}
        relationships={relationships}
      />
    </>
  );
}
