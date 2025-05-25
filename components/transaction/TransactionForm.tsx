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
  DeviceID,
} from '../../types/enums/TransactionEnums';
import { PaymentMethodType } from '../../types/enums/UserEnums';
import { TransactionIcon } from '../../components/ui/icons';
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
import { currencies, convertCurrency, isValidIpAddress } from '@/helper/helper';
import { Country, State } from 'country-state-city';

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
  }, [formData.deviceInfo?.geolocation?.country]);

  // Update cities when state changes
  useEffect(() => {
    if (
      formData.deviceInfo?.geolocation?.state &&
      formData.deviceInfo?.geolocation?.country
    ) {
      setFormData((prev) => ({
        ...prev,
        deviceInfo: {
          ...getDeviceInfo(prev.deviceInfo),
          geolocation: {
            ...getDeviceInfo(prev.deviceInfo).geolocation,
            state: prev.deviceInfo?.geolocation?.state || '',
          },
        },
      }));
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
                      {getUserById(formData.senderId)?.firstName}{' '}
                      {getUserById(formData.senderId)?.lastName}
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
                      {getUserById(formData.receiverId)?.firstName}{' '}
                      {getUserById(formData.receiverId)?.lastName}
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
                isRequired
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
                errorMessage={validationErrors.currency}
                isRequired
              >
                <>
                  {currencies.map((currency) => (
                    <SelectItem key={currency}>{currency}</SelectItem>
                  ))}
                </>
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
                errorMessage={validationErrors.destinationCurrency}
              >
                <>
                  {currencies.map((currency) => (
                    <SelectItem key={currency}>{currency}</SelectItem>
                  ))}
                </>
              </Select>

              <Input
                id="destinationAmount"
                name="destinationAmount"
                label="Destination Amount"
                labelPlacement="outside"
                placeholder={
                  formData.destinationCurrency
                    ? 'Auto-calculated based on exchange rate'
                    : 'Select destination currency first'
                }
                isInvalid={!!validationErrors.destinationAmount}
                value={formData.destinationAmount?.toString() || ''}
                onValueChange={(val) =>
                  setFormData((p) => ({
                    ...p,
                    destinationAmount: parseFloat(val) || 0,
                  }))
                }
                isDisabled={true}
                isReadOnly={true}
                errorMessage={validationErrors.destinationAmount}
              />

              <div className="col-span-1 md:col-span-2">
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
              <div className="col-span-1 md:col-span-2">
                <Select
                  id="deviceId"
                  name="deviceId"
                  label="Device ID"
                  labelPlacement="outside"
                  placeholder="Select device ID"
                  isInvalid={!!validationErrors.deviceId}
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
                  errorMessage={validationErrors.deviceId}
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
                  id="ipAddress"
                  name="ipAddress"
                  label="IP Address"
                  labelPlacement="outside"
                  placeholder="Enter IP address (IPv4 or IPv6)"
                  isInvalid={!!validationErrors.deviceInfo?.ipAddress}
                  value={formData.deviceInfo?.ipAddress || ''}
                  onValueChange={(val) => {
                    setFormData((prev) => ({
                      ...prev,
                      deviceInfo: {
                        ...getDeviceInfo(prev.deviceInfo),
                        ipAddress: val,
                      },
                    }));
                  }}
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
                  errorMessage={validationErrors.deviceInfo?.ipAddress}
                />
              </div>

              {/* Country Field */}
              <div className="col-span-1 md:col-span-2">
                <Select
                  id="country"
                  name="country"
                  label="Country"
                  labelPlacement="outside"
                  placeholder="Select country"
                  isInvalid={
                    !!validationErrors.deviceInfo?.geolocation?.country
                  }
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
                  errorMessage={
                    validationErrors.deviceInfo?.geolocation?.country
                  }
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
                  id="state"
                  name="state"
                  label="State"
                  labelPlacement="outside"
                  placeholder="Select state"
                  isInvalid={!!validationErrors.deviceInfo?.geolocation?.state}
                  selectedKeys={
                    formData.deviceInfo?.geolocation?.state
                      ? [formData.deviceInfo.geolocation.state]
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
                  errorMessage={validationErrors.deviceInfo?.geolocation?.state}
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
