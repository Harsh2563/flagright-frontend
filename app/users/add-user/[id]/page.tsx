'use client';
import { useParams } from 'next/navigation';

import UserForm from '@/components/user/form/UserForm';

export default function UpdateUserPage() {
  const params = useParams();
  const userId = params?.id as string;

  return <UserForm id={userId} />;
}
