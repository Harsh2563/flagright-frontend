'use client';
import UserForm from '@/components/user/UserForm';
import { useParams } from 'next/navigation';

export default function AddUserPage() {
  const params = useParams();
  const userId = params?.id as string;
  return <UserForm id={userId} />;
}
