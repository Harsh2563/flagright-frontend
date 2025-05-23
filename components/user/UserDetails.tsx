'use client';

import { UserHeader } from './UserHeader';
import { PersonalInfoCard } from './PersonalInfoCard';
import { AddressCard } from './AddressCard';
import { PaymentMethodsCard } from './PaymentMethodsCard';
import { GraphGenerator } from './GraphGenerator';
import { BackButton } from './BackButton';
import { UserRelation } from './UserRelation';
import { IUser } from '../../types/user';
import { IUserRelationshipGraphResponse } from '../../types/relationship';

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
  onGenerateGraph,
  onBack,
  isGeneratingGraph = false,
  loadingText = 'Generating user relationship graph',
  relationships = null,
  relationshipsLoading = false,
}: UserDetailsProps) {
  return (
    <>
      <BackButton onBack={onBack} />
      <UserHeader user={user} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PersonalInfoCard user={user} />
        <AddressCard user={user} />
        <PaymentMethodsCard user={user} />
      </div>{' '}
      <GraphGenerator
        onGenerateGraph={onGenerateGraph}
        isGeneratingGraph={isGeneratingGraph}
        loadingText={loadingText}
      />
      <UserRelation
        relationships={relationships}
        isLoading={relationshipsLoading}
      />
    </>
  );
}
