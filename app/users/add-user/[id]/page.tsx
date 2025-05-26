'use client';
import UserForm from '@/components/user/form/UserForm';
import { useParams } from 'next/navigation';

export default function UpdateUserPage() {
  const params = useParams();
  const userId = params?.id as string;
  return <UserForm id={userId} />;
}
