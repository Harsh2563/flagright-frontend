'use client';
import TransactionForm from "@/components/transaction/form/TransactionForm";
import { useParams } from "next/navigation";

export default function UpdateTransactionPage() {
  const params = useParams();
  const transactionId = params?.id as string;
  return <TransactionForm id={transactionId} />;
}