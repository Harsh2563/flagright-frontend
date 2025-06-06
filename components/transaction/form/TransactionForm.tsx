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
import { z } from 'zod';
import { Country, State } from 'country-state-city';

import {
  TransactionType,
  TransactionStatus,
  DeviceID,
} from '../../../types/enums/TransactionEnums';
import { PaymentMethodType } from '../../../types/enums/UserEnums';
import { TransactionIcon } from '../../../components/ui/icons';
import { title } from '../../../components/ui/primitives';
import {
  formDataToTransaction,
  TransactionSchema,
} from '../../../schemas/transactionSchema';
import { TransactionValidationError as ValidationErrors } from '../../../types/error';
import { useTransactions } from '../../../contexts/TransactionContext';
import { useUsers } from '../../../contexts/UserContext';
import { BackButton } from '../../common/BackButton';

import { currencies, convertCurrency, isValidIpAddress } from '@/helper/helper';
import { useToastMessage } from '@/utils/toast';

type TransactionFormType = z.infer<typeof TransactionSchema>;

export default function TransactionForm({ id = undefined }: { id?: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTransaction, getTransactionById } = useTransactions();
  const { users, loading: usersLoading, getUserById } = useUsers();

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
    deviceInfo: {
      ipAddress: '',
      geolocation: {
        country: '',
        state: '',
      },
    },
  });
  const toast = useToastMessage();

  // Load existing transaction data if id is provided
  useEffect(() => {
    if (id) {
      const transaction = getTransactionById(id);

      if (transaction) {
        const transactionData = {
          ...transaction,
          senderId: transaction.senderId || '',
          receiverId: transaction.receiverId || '',
        };

        setFormData(transactionData);

        // Initialize states based on country if country exists in device info
        if (transaction.deviceInfo?.geolocation?.country) {
          const countryStates = State.getStatesOfCountry(
            transaction.deviceInfo.geolocation.country
          );

          setStates(countryStates);
        }
      }
    }
  }, [id, getTransactionById]);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  // Geolocation state management for device info
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);

  // Helper function to ensure deviceInfo has proper structure
  const getDeviceInfo = (deviceInfo: any) => ({
    ipAddress: deviceInfo?.ipAddress || '',
    geolocation: {
      country: deviceInfo?.geolocation?.country || '',
      state: deviceInfo?.geolocation?.state || '',
    },
  });

  // Initialize countries list
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);
  // Update states when country changes
  useEffect(() => {
    if (formData.deviceInfo?.geolocation?.country) {
      const countryStates = State.getStatesOfCountry(
        formData.deviceInfo.geolocation.country
      );

      setStates(countryStates);

      // Only reset state if this is a new transaction or if country selection is being changed after initial load
      if (!id || !formData.id) {
        setFormData((prev) => ({
          ...prev,
          deviceInfo: {
            ...getDeviceInfo(prev.deviceInfo),
            geolocation: {
              ...getDeviceInfo(prev.deviceInfo).geolocation,
              country: prev.deviceInfo?.geolocation?.country || '',
              state: '',
            },
          },
        }));
      }
    }
  }, [formData.deviceInfo?.geolocation?.country, id, formData.id]);
  // Update cities when state changes
  useEffect(() => {
    if (
      formData.deviceInfo?.geolocation?.state &&
      formData.deviceInfo?.geolocation?.country
    ) {
      // We don't need to reset any values here, just ensure the state value is maintained
      // but we're keeping the hook for future additions like city selection
    }
  }, [
    formData.deviceInfo?.geolocation?.state,
    formData.deviceInfo?.geolocation?.country,
  ]);

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
      toast.error('Please fix the validation errors before submitting');

      return;
    }

    try {
      setIsSubmitting(true); // Form validation passed, proceed with submission
      const transaction = formDataToTransaction(formData);
      const newTransaction = await addTransaction(formData);

      if (newTransaction) {
        toast.success(
          id
            ? 'Transaction updated successfully!'
            : 'Transaction created successfully!'
        );
        router.push('/transactions');
      } else {
        toast.error(
          id
            ? 'Failed to update transaction. Please try again.'
            : 'Failed to create transaction. Please try again.'
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        setValidationErrors({
          ...validationErrors,
          general: `Error: ${error.message}`,
        });
        toast.error(`Error: ${error.message}`);
      } else {
        console.error('Error creating transaction:', error);
        setValidationErrors({
          ...validationErrors,
          general: 'An unknown error occurred. Please try again.',
        });
        toast.error('An unknown error occurred. Please try again.');
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
          <TransactionIcon className="text-primary" size={24} />
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
            className="space-y-10"
            validationBehavior="aria"
            onSubmit={handleSubmit}
          >
            {/* Transaction Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                errorMessage={validationErrors.transactionType}
                id="transactionType"
                isInvalid={!!validationErrors.transactionType}
                label="Transaction Type"
                labelPlacement="outside"
                name="transactionType"
                placeholder="Select transaction type"
                selectedKeys={
                  formData.transactionType ? [formData.transactionType] : []
                }
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
              >
                {Object.values(TransactionType).map((type) => (
                  <SelectItem key={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </Select>
              <Select
                errorMessage={validationErrors.status}
                id="status"
                isInvalid={!!validationErrors.status}
                label="Transaction Status"
                labelPlacement="outside"
                name="status"
                placeholder="Select transaction status"
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
              >
                {Object.values(TransactionStatus).map((status) => (
                  <SelectItem key={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </Select>
              <Select
                isRequired
                errorMessage={validationErrors.senderId}
                id="senderId"
                isInvalid={!!validationErrors.senderId}
                label="Sender"
                labelPlacement="outside"
                name="senderId"
                placeholder="Select sender"
                renderValue={() => {
                  return formData.senderId ? (
                    <div className="flex items-center gap-2">
                      {getUserById(formData.senderId)?.firstName}{' '}
                      {getUserById(formData.senderId)?.lastName}
                    </div>
                  ) : null;
                }}
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
              >
                {users.map((user) => (
                  <SelectItem key={user.id}>
                    {user.firstName} {user.lastName}
                  </SelectItem>
                ))}
              </Select>
              <Select
                isRequired
                errorMessage={validationErrors.receiverId}
                id="receiverId"
                isInvalid={!!validationErrors.receiverId}
                label="Receiver"
                labelPlacement="outside"
                name="receiverId"
                placeholder="Select receiver"
                renderValue={() => {
                  return formData.receiverId ? (
                    <div className="flex items-center gap-2">
                      {getUserById(formData.receiverId)?.firstName}{' '}
                      {getUserById(formData.receiverId)?.lastName}
                    </div>
                  ) : null;
                }}
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
              >
                {users.map((user) => (
                  <SelectItem key={user.id}>
                    {user.firstName} {user.lastName}
                  </SelectItem>
                ))}
              </Select>
              <Input
                isRequired
                errorMessage={validationErrors.amount}
                id="amount"
                isInvalid={!!validationErrors.amount}
                label="Amount"
                labelPlacement="outside"
                name="amount"
                placeholder="Enter amount"
                value={formData.amount.toString() || ''}
                onValueChange={(val) => {
                  const newAmount = parseFloat(val) || 0;

                  setFormData((prev) => {
                    const updatedData = { ...prev, amount: newAmount };

                    // If destination currency is set, recalculate destination amount
                    if (
                      prev.destinationCurrency &&
                      prev.currency &&
                      newAmount > 0
                    ) {
                      updatedData.destinationAmount = convertCurrency(
                        newAmount,
                        prev.currency,
                        prev.destinationCurrency
                      );
                    }

                    return updatedData;
                  });
                }}
              />
              <Select
                isRequired
                errorMessage={validationErrors.currency}
                id="currency"
                isInvalid={!!validationErrors.currency}
                label="Currency"
                labelPlacement="outside"
                name="currency"
                placeholder="Select currency"
                selectedKeys={formData.currency ? [formData.currency] : []}
                onSelectionChange={(keys) => {
                  const selectedCurrency =
                    keys instanceof Set
                      ? (Array.from(keys)[0] as string)
                      : undefined;

                  setFormData((prev) => {
                    const updatedData = {
                      ...prev,
                      currency: selectedCurrency || '',
                    };

                    // If destination currency is already set, recalculate destination amount
                    if (
                      selectedCurrency &&
                      prev.destinationCurrency &&
                      prev.amount > 0
                    ) {
                      updatedData.destinationAmount = convertCurrency(
                        prev.amount,
                        selectedCurrency,
                        prev.destinationCurrency
                      );
                    }

                    return updatedData;
                  });
                }}
              >
                <>
                  {currencies.map((currency) => (
                    <SelectItem key={currency}>{currency}</SelectItem>
                  ))}
                </>
              </Select>
              <Select
                errorMessage={validationErrors.destinationCurrency}
                id="destinationCurrency"
                isInvalid={!!validationErrors.destinationCurrency}
                label="Destination Currency"
                labelPlacement="outside"
                name="destinationCurrency"
                placeholder="Select destination currency"
                selectedKeys={
                  formData.destinationCurrency
                    ? [formData.destinationCurrency]
                    : []
                }
                onSelectionChange={(keys) => {
                  const selectedCurrency =
                    keys instanceof Set
                      ? (Array.from(keys)[0] as string)
                      : undefined;

                  // Update the form data with the new currency and calculate destination amount
                  setFormData((prev) => {
                    const updatedData = {
                      ...prev,
                      destinationCurrency: selectedCurrency || '',
                    };

                    // If both currencies are selected and amount is provided, calculate destination amount
                    if (selectedCurrency && prev.currency && prev.amount > 0) {
                      updatedData.destinationAmount = convertCurrency(
                        prev.amount,
                        prev.currency,
                        selectedCurrency
                      );
                    } else if (!selectedCurrency) {
                      // If no destination currency is selected, clear the destination amount
                      updatedData.destinationAmount = undefined;
                    }

                    return updatedData;
                  });
                }}
              >
                <>
                  {currencies.map((currency) => (
                    <SelectItem key={currency}>{currency}</SelectItem>
                  ))}
                </>
              </Select>
              <Input
                errorMessage={validationErrors.destinationAmount}
                id="destinationAmount"
                isDisabled={true}
                isInvalid={!!validationErrors.destinationAmount}
                isReadOnly={true}
                label="Destination Amount"
                labelPlacement="outside"
                name="destinationAmount"
                placeholder={
                  formData.destinationCurrency
                    ? 'Auto-calculated based on exchange rate'
                    : 'Select destination currency first'
                }
                value={formData.destinationAmount?.toString() || ''}
                onValueChange={(val) =>
                  setFormData((p) => ({
                    ...p,
                    destinationAmount: parseFloat(val) || 0,
                  }))
                }
              />
              <div className="col-span-1 md:col-span-2">
                <Select
                  errorMessage={validationErrors.paymentMethod}
                  id="paymentMethod"
                  isInvalid={!!validationErrors.paymentMethod}
                  label="Payment Method"
                  labelPlacement="outside"
                  name="paymentMethod"
                  placeholder="Select payment method"
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
                  errorMessage={validationErrors.description}
                  id="description"
                  isInvalid={!!validationErrors.description}
                  label="Description"
                  labelPlacement="outside"
                  name="description"
                  placeholder="Enter transaction description"
                  value={formData.description || ''}
                  onValueChange={(val) =>
                    setFormData((p) => ({ ...p, description: val }))
                  }
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <Select
                  errorMessage={validationErrors.deviceId}
                  id="deviceId"
                  isInvalid={!!validationErrors.deviceId}
                  label="Device ID"
                  labelPlacement="outside"
                  name="deviceId"
                  placeholder="Select device ID"
                  selectedKeys={formData.deviceId ? [formData.deviceId] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey =
                      keys instanceof Set
                        ? (Array.from(keys)[0] as DeviceID)
                        : undefined;

                    setFormData((prev) => ({
                      ...prev,
                      deviceId: selectedKey || DeviceID.ANDROID,
                    }));
                  }}
                >
                  {Object.values(DeviceID).map((method) => (
                    <SelectItem key={method}>
                      {method.replace('_', ' ').charAt(0).toUpperCase() +
                        method.replace('_', ' ').slice(1)}
                    </SelectItem>
                  ))}
                </Select>
              </div>{' '}
              {/* IP Address Field */}
              <div className="col-span-1 md:col-span-2">
                <Input
                  errorMessage={validationErrors.deviceInfo?.ipAddress}
                  id="ipAddress"
                  isInvalid={!!validationErrors.deviceInfo?.ipAddress}
                  label="IP Address"
                  labelPlacement="outside"
                  name="ipAddress"
                  placeholder="Enter IP address (IPv4 or IPv6)"
                  value={formData.deviceInfo?.ipAddress || ''}
                  onBlur={(e) => {
                    const ipAddress = e.target.value;

                    if (ipAddress && !isValidIpAddress(ipAddress)) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        deviceInfo: {
                          ...((prev.deviceInfo as any) || {}),
                          ipAddress: 'Please enter a valid IP address',
                        },
                      }));
                    } else {
                      setValidationErrors((prev) => ({
                        ...prev,
                        deviceInfo: {
                          ...((prev.deviceInfo as any) || {}),
                          ipAddress: undefined,
                        },
                      }));
                    }
                  }}
                  onValueChange={(val) => {
                    setFormData((prev) => ({
                      ...prev,
                      deviceInfo: {
                        ...getDeviceInfo(prev.deviceInfo),
                        ipAddress: val,
                      },
                    }));
                  }}
                />
              </div>
              {/* Country Field */}
              <div className="col-span-1 md:col-span-2">
                <Select
                  errorMessage={
                    validationErrors.deviceInfo?.geolocation?.country
                  }
                  id="country"
                  isInvalid={
                    !!validationErrors.deviceInfo?.geolocation?.country
                  }
                  label="Country"
                  labelPlacement="outside"
                  name="country"
                  placeholder="Select country"
                  selectedKeys={
                    formData.deviceInfo?.geolocation?.country
                      ? [formData.deviceInfo.geolocation.country]
                      : []
                  }
                  onSelectionChange={(keys) => {
                    const selectedCountry =
                      keys instanceof Set
                        ? (Array.from(keys)[0] as string)
                        : undefined;

                    setFormData((prev) => ({
                      ...prev,
                      deviceInfo: {
                        ...getDeviceInfo(prev.deviceInfo),
                        geolocation: {
                          ...getDeviceInfo(prev.deviceInfo).geolocation,
                          country: selectedCountry || '',
                          state: '',
                        },
                      },
                    }));

                    // Update states and cities based on selected country
                    if (selectedCountry) {
                      const countryStates =
                        State.getStatesOfCountry(selectedCountry);

                      setStates(countryStates);
                    } else {
                      setStates([]);
                    }
                  }}
                >
                  {countries.map((country) => (
                    <SelectItem key={country.isoCode}>
                      {country.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="col-span-1 md:col-span-2">
                <Select
                  errorMessage={validationErrors.deviceInfo?.geolocation?.state}
                  id="state"
                  isInvalid={!!validationErrors.deviceInfo?.geolocation?.state}
                  label="State"
                  labelPlacement="outside"
                  name="state"
                  placeholder="Select state"
                  selectedKeys={
                    formData.deviceInfo?.geolocation?.state
                      ? [formData.deviceInfo.geolocation?.state]
                      : []
                  }
                  onSelectionChange={(keys) => {
                    const selectedState =
                      keys instanceof Set
                        ? (Array.from(keys)[0] as string)
                        : undefined;

                    setFormData((prev) => ({
                      ...prev,
                      deviceInfo: {
                        ...getDeviceInfo(prev.deviceInfo),
                        geolocation: {
                          ...getDeviceInfo(prev.deviceInfo).geolocation,
                          state: selectedState || '',
                        },
                      },
                    }));
                  }}
                >
                  {states.map((state) => (
                    <SelectItem key={state.name}>{state.name}</SelectItem>
                  ))}
                </Select>
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
              color="default"
              variant="flat"
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
