'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Form,
  Input,
  Button,
  Select,
  SelectItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from '@heroui/react';
import {
  TransactionType,
  TransactionStatus,
} from '../../types/enums/TransactionEnums';
import { PaymentMethodType } from '../../types/enums/UserEnums';
import {  TransactionIcon } from '../../components/ui/icons';
import { title } from '../../components/ui/primitives';
import {
  formDataToTransaction,
  TransactionSchema,
} from '../../schemas/transactionSchema';
import { TransactionValidationError as ValidationErrors } from '../../types/error';
import { useTransactions } from '../../contexts/TransactionContext';
import { useUsers } from '../../contexts/UserContext';
import { ITransaction } from '../../types/transaction';
import { z } from 'zod';
import { BackButton } from '../user';
import { currencies } from '@/helper/helper';

type TransactionFormType = z.infer<typeof TransactionSchema>;

export default function TransactionForm({ id = undefined }: { id?: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTransaction, getTransactionById } = useTransactions();
  const { users, loading: usersLoading } = useUsers();

  const [formData, setFormData] = useState<TransactionFormType>({
    id: id,
    transactionType: TransactionType.TRANSFER,
    status: TransactionStatus.PENDING,
    senderId: '',
    receiverId: '',
    amount: 0,
    currency: '',
    timestamp: new Date().toISOString(),
    description: '',
    paymentMethod: PaymentMethodType.BANK_ACCOUNT,
  });

  const getUsernameFromId = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : '';
  };

  // Load existing transaction data if id is provided
  useEffect(() => {
    if (id) {
      const transaction = getTransactionById(id);
      if (transaction) {
        setFormData({
          ...transaction,
          senderId: transaction.senderId || '',
          receiverId: transaction.receiverId || '',
        });
      }
    }
  }, [id, getTransactionById]);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setValidationErrors({});

    // Validate form data against the schema
    const validateResult = TransactionSchema.safeParse(formData);

    if (!validateResult.success) {
      const errors: ValidationErrors = {};
      validateResult.error.errors.forEach((err) => {
        const path = err.path[0] as keyof ValidationErrors;
        errors[path] = err.message;
      });

      setValidationErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);

      // Form validation passed, proceed with submission
      const transaction = formDataToTransaction(formData);
      const newTransaction = await addTransaction(formData);

      if (newTransaction) {
        router.push('/transactions');
      }
    } catch (error) {
      if (error instanceof Error) {
        setValidationErrors({
          ...validationErrors,
          general: `Error: ${error.message}`,
        });
      } else {
        console.error('Error creating transaction:', error);
        setValidationErrors({
          ...validationErrors,
          general: 'An unknown error occurred. Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExternalSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <BackButton content="Back to Transactions" onBack={() => router.back()} />

      <div className="flex items-center gap-4 mb-6">
        <div className="p-2 bg-primary/10 rounded-full">
          <TransactionIcon size={24} className="text-primary" />
        </div>
        <h1 className={title({ size: 'sm' })}>
          {id ? 'Edit Transaction' : 'Add New Transaction'}
        </h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <h2 className="text-xl font-semibold">Transaction Information</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-10"
            validationBehavior="aria"
          >
            {/* Transaction Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Transaction Type"
                labelPlacement="outside"
                id="transactionType"
                name="transactionType"
                placeholder="Select transaction type"
                selectedKeys={
                  formData.transactionType ? [formData.transactionType] : []
                }
                isInvalid={!!validationErrors.transactionType}
                onSelectionChange={(keys) => {
                  const selectedKey =
                    keys instanceof Set
                      ? (Array.from(keys)[0] as TransactionType)
                      : undefined;
                  setFormData((prev) => ({
                    ...prev,
                    transactionType: selectedKey || TransactionType.TRANSFER,
                  }));
                }}
                errorMessage={validationErrors.transactionType}
                isRequired
              >
                {Object.values(TransactionType).map((type) => (
                  <SelectItem key={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Transaction Status"
                labelPlacement="outside"
                id="status"
                name="status"
                placeholder="Select transaction status"
                isInvalid={!!validationErrors.status}
                selectedKeys={formData.status ? [formData.status] : []}
                onSelectionChange={(keys) => {
                  const selectedKey =
                    keys instanceof Set
                      ? (Array.from(keys)[0] as TransactionStatus)
                      : undefined;
                  setFormData((prev) => ({
                    ...prev,
                    status: selectedKey || TransactionStatus.PENDING,
                  }));
                }}
                errorMessage={validationErrors.status}
                isRequired
              >
                {Object.values(TransactionStatus).map((status) => (
                  <SelectItem key={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Sender"
                labelPlacement="outside"
                id="senderId"
                name="senderId"
                renderValue={() => {
                  return formData.senderId ? (
                    <div className="flex items-center gap-2">
                      {getUsernameFromId(formData.senderId)}
                    </div>
                  ) : null;
                }}
                placeholder="Select sender"
                isInvalid={!!validationErrors.senderId}
                selectedKeys={formData.senderId ? [formData.senderId] : []}
                onSelectionChange={(keys) => {
                  const selectedKey =
                    keys instanceof Set
                      ? (Array.from(keys)[0] as string)
                      : undefined;
                  setFormData((prev) => ({
                    ...prev,
                    senderId: selectedKey || '',
                  }));
                }}
                errorMessage={validationErrors.senderId}
                isRequired
              >
                {users.map((user) => (
                  <SelectItem key={user.id}>
                    {user.firstName} {user.lastName}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Receiver"
                labelPlacement="outside"
                id="receiverId"
                name="receiverId"
                renderValue={() => {
                  return formData.receiverId ? (
                    <div className="flex items-center gap-2">
                      {getUsernameFromId(formData.receiverId)}
                    </div>
                  ) : null;
                }}
                placeholder="Select receiver"
                isInvalid={!!validationErrors.receiverId}
                selectedKeys={formData.receiverId ? [formData.receiverId] : []}
                onSelectionChange={(keys) => {
                  const selectedKey =
                    keys instanceof Set
                      ? (Array.from(keys)[0] as string)
                      : undefined;
                  setFormData((prev) => ({
                    ...prev,
                    receiverId: selectedKey || '',
                  }));
                }}
                errorMessage={validationErrors.receiverId}
                isRequired
              >
                {users.map((user) => (
                  <SelectItem key={user.id}>
                    {user.firstName} {user.lastName}
                  </SelectItem>
                ))}
              </Select>

              <Input
                id="amount"
                name="amount"
                placeholder="Enter amount"
                label="Amount"
                labelPlacement="outside"
                value={formData.amount.toString() || ''}
                errorMessage={validationErrors.amount}
                isInvalid={!!validationErrors.amount}
                onValueChange={(val) =>
                  setFormData((p) => ({ ...p, amount: parseFloat(val) || 0 }))
                }
              />

              <Select
                id="currency"
                name="currency"
                label="Currency"
                labelPlacement="outside"
                placeholder="Select currency"
                isInvalid={!!validationErrors.currency}
                selectedKeys={formData.currency ? [formData.currency] : []}
                onSelectionChange={(keys) => {
                  const selectedKey =
                    keys instanceof Set
                      ? (Array.from(keys)[0] as string)
                      : undefined;
                  setFormData((prev) => ({
                    ...prev,
                    currency: selectedKey || '',
                  }));
                }}
                errorMessage={validationErrors.currency}
                isRequired
              >
                {currencies.map((currency) => (
                  <SelectItem key={currency}>{currency}</SelectItem>
                ))}
              </Select>

              <Select
                id="destinationCurrency"
                name="destinationCurrency"
                label="Destination Currency"
                labelPlacement="outside"
                placeholder="Select destination currency"
                isInvalid={!!validationErrors.destinationCurrency}
                selectedKeys={
                  formData.destinationCurrency
                    ? [formData.destinationCurrency]
                    : []
                }
                onSelectionChange={(keys) => {
                  const selectedKey =
                    keys instanceof Set
                      ? (Array.from(keys)[0] as string)
                      : undefined;
                  setFormData((prev) => ({
                    ...prev,
                    destinationCurrency: selectedKey || '',
                  }));
                }}
                errorMessage={validationErrors.destinationCurrency}
              >
                {currencies.map((currency) => (
                  <SelectItem key={currency}>{currency}</SelectItem>
                ))}
              </Select>

              <Input
                id="destinationAmount"
                name="destinationAmount"
                label="Destination Amount"
                labelPlacement="outside"
                placeholder="Enter destination amount"
                isInvalid={!!validationErrors.destinationAmount}
                value={formData.destinationAmount?.toString() || ''}
                onValueChange={(val) =>
                  setFormData((p) => ({
                    ...p,
                    destinationAmount: parseFloat(val) || 0,
                  }))
                }
                errorMessage={validationErrors.destinationAmount}
              />

              <div className='col-span-1 md:col-span-2'>
                <Select
                  id="paymentMethod"
                  name="paymentMethod"
                  label="Payment Method"
                  labelPlacement="outside"
                  placeholder="Select payment method"
                  isInvalid={!!validationErrors.paymentMethod}
                  selectedKeys={
                    formData.paymentMethod ? [formData.paymentMethod] : []
                  }
                  onSelectionChange={(keys) => {
                    const selectedKey =
                      keys instanceof Set
                        ? (Array.from(keys)[0] as PaymentMethodType)
                        : undefined;
                    setFormData((prev) => ({
                      ...prev,
                      paymentMethod:
                        selectedKey || PaymentMethodType.BANK_ACCOUNT,
                    }));
                  }}
                  errorMessage={validationErrors.paymentMethod}
                >
                  {Object.values(PaymentMethodType).map((method) => (
                    <SelectItem key={method}>
                      {method.replace('_', ' ').charAt(0).toUpperCase() +
                        method.replace('_', ' ').slice(1)}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <Input
                  id="description"
                  name="description"
                  label="Description"
                  labelPlacement="outside"
                  placeholder="Enter transaction description"
                  isInvalid={!!validationErrors.description}
                  value={formData.description || ''}
                  onValueChange={(val) =>
                    setFormData((p) => ({ ...p, description: val }))
                  }
                  errorMessage={validationErrors.description}
                />
              </div>
            </div>

            {validationErrors.description && (
              <div className="text-red-500 text-sm">
                {validationErrors.description}
              </div>
            )}
          </Form>
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-end gap-2 w-full">
          {validationErrors.general && (
            <div className="w-full bg-danger-50 text-danger p-3 rounded-md text-center">
              {validationErrors.general}
            </div>
          )}
          <div className="flex justify-end gap-2 w-full">
            <Button
              variant="flat"
              color="default"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              isLoading={isSubmitting}
              onClick={handleExternalSubmit}
            >
              {isSubmitting
                ? id
                  ? 'Updating...'
                  : 'Adding...'
                : id
                  ? 'Update Transaction'
                  : 'Add Transaction'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
