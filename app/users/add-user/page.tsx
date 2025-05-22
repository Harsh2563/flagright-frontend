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
import { Country, State, City } from 'country-state-city';
import { PaymentMethodType } from '../../../types/enums/UserEnums';
import { UsersIcon } from '../../../components/ui/icons';
import { title } from '../../../components/ui/primitives';
import {
  UserFormType,
  formDataToUser,
  UserFormSchema,
} from '../../../schemas/userSchema';
import { ValidationErrors } from '../../../types/error';
import { handleUser } from '../../../services/userService';

export default function AddUserPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UserFormType>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    paymentMethodType: undefined,
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (formData.country) {
      const countryStates = State.getStatesOfCountry(formData.country);
      setStates(countryStates);
      setFormData((prev) => ({ ...prev, state: '', city: '' }));
      setCities([]);
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state && formData.country) {
      const stateCities = City.getCitiesOfState(
        formData.country,
        formData.state
      );
      setCities(stateCities);
      setFormData((prev) => ({ ...prev, city: '' }));
    }
  }, [formData.state, formData.country]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setValidationErrors({});

    // Validate form data against the schema
    const validationResult = UserFormSchema.safeParse(formData);

    if (!validationResult.success) {
      const errors: ValidationErrors = {};
      validationResult.error.errors.forEach((err) => {
        const path = err.path[0] as keyof ValidationErrors;
        errors[path] = err.message;
      });

      setValidationErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);

      // Form validation passed - proceed with submission
      const user = formDataToUser(formData);
      const newUser = await handleUser(user);

      if (newUser) {
        router.push('/users');
      }
    } catch (error) {
      if (error instanceof Error) {
        setValidationErrors({
          ...validationErrors,
          general: `Error: ${error.message}`,
        });
      } else {
        console.error('Error creating user:', error);
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
    // Simply request the form to submit, which will trigger handleSubmit
    // where validation will be performed
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <Button
        variant="light"
        color="default"
        className="mb-4 flex items-center gap-2"
        onClick={() => router.back()}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Users
      </Button>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-2 bg-primary/10 rounded-full">
          <UsersIcon size={24} className="text-primary" />
        </div>
        <h1 className={title({ size: 'sm' })}>Add New User</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <h2 className="text-xl font-semibold">User Information</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-10"
            validationBehavior="aria"
          >
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                labelPlacement="outside"
                errorMessage={validationErrors.firstName}
                isInvalid={!!validationErrors.firstName}
                type="text"
                name="firstName"
                placeholder="Enter first name"
                isRequired
                value={formData.firstName}
                onValueChange={(val) =>
                  setFormData((p) => ({ ...p, firstName: val }))
                }
              />
              <Input
                label="Last Name"
                labelPlacement="outside"
                errorMessage={validationErrors.lastName}
                isInvalid={!!validationErrors.lastName}
                type="text"
                name="lastName"
                placeholder="Enter last name"
                isRequired
                value={formData.lastName}
                onValueChange={(val) =>
                  setFormData((p) => ({ ...p, lastName: val }))
                }
              />
              <Input
                label="Email"
                labelPlacement="outside"
                name="email"
                placeholder="Enter email address"
                isRequired
                errorMessage={validationErrors.email}
                isInvalid={!!validationErrors.email}
                type="email"
                value={formData.email}
                onValueChange={(val) =>
                  setFormData((p) => ({ ...p, email: val }))
                }
              />
              <Input
                label="Phone Number"
                labelPlacement="outside"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone || ''}
                type="tel"
                onValueChange={(val) =>
                  setFormData((p) => ({ ...p, phone: val }))
                }
              />
            </div>

            {/* Address */}
            <div className="space-y-8">
              <h3 className="text-lg font-semibold">Address Information</h3>
              <Input
                label="Street Address"
                labelPlacement="outside"
                name="street"
                placeholder="Enter street address"
                value={formData.street || ''}
                errorMessage={validationErrors.street}
                isInvalid={!!validationErrors.street}
                onValueChange={(val) =>
                  setFormData((p) => ({ ...p, street: val }))
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Country"
                  labelPlacement="outside"
                  name="country"
                  placeholder="Select a country"
                  selectedKeys={formData.country ? [formData.country] : []}
                  errorMessage={validationErrors.country}
                  isInvalid={!!validationErrors.country}
                  onSelectionChange={(keys) => {
                    const selectedKey =
                      keys instanceof Set
                        ? (Array.from(keys)[0] as string)
                        : undefined;
                    setFormData((prev) => ({
                      ...prev,
                      country: selectedKey || '',
                      state: '', // Reset state when country changes
                      city: '', // Reset city when country changes
                    }));
                  }}
                  className="w-full"
                >
                  {countries.map((country) => (
                    <SelectItem key={country.isoCode} textValue={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="State / Province"
                  labelPlacement="outside"
                  name="state"
                  placeholder="Select a state/province"
                  selectedKeys={formData.state ? [formData.state] : []}
                  errorMessage={validationErrors.state}
                  isInvalid={!!validationErrors.state}
                  onSelectionChange={(keys) => {
                    const selectedKey =
                      keys instanceof Set
                        ? (Array.from(keys)[0] as string)
                        : undefined;
                    setFormData((prev) => ({
                      ...prev,
                      state: selectedKey || '',
                      city: '', // Reset city when state changes
                    }));
                  }}
                  isDisabled={!formData.country || states.length === 0}
                  className="w-full"
                >
                  {states.map((state) => (
                    <SelectItem key={state.isoCode} textValue={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="City"
                  labelPlacement="outside"
                  name="city"
                  placeholder="Select a city"
                  selectedKeys={formData.city ? [formData.city] : []}
                  errorMessage={validationErrors.city}
                  isInvalid={!!validationErrors.city}
                  onSelectionChange={(keys) => {
                    const selectedKey =
                      keys instanceof Set
                        ? (Array.from(keys)[0] as string)
                        : undefined;
                    setFormData((prev) => ({
                      ...prev,
                      city: selectedKey || '',
                    }));
                  }}
                  isDisabled={!formData.state || cities.length === 0}
                  className="w-full"
                >
                  {cities.map((city) => (
                    <SelectItem key={city.name} textValue={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Postal Code"
                  labelPlacement="outside"
                  name="postalCode"
                  placeholder="Enter postal code"
                  value={formData.postalCode || ''}
                  errorMessage={validationErrors.postalCode}
                  isInvalid={!!validationErrors.postalCode}
                  onValueChange={(val) =>
                    setFormData((p) => ({ ...p, postalCode: val }))
                  }
                />
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-8">
              <h3 className="text-lg font-semibold">Payment Method</h3>
              <Select
                label="Payment Type"
                labelPlacement="outside"
                name="paymentMethodType"
                placeholder="Select a payment method"
                selectedKeys={
                  formData.paymentMethodType ? [formData.paymentMethodType] : []
                }
                errorMessage={validationErrors.paymentMethodType}
                isInvalid={!!validationErrors.paymentMethodType}
                onSelectionChange={(keys) => {
                  const selectedKey =
                    keys instanceof Set
                      ? (Array.from(keys)[0] as PaymentMethodType)
                      : undefined;
                  setFormData((prev) => ({
                    ...prev,
                    paymentMethodType: selectedKey,
                  }));
                }}
                className="w-full"
              >
                {Object.values(PaymentMethodType).map((type) => (
                  <SelectItem key={type} textValue={type.replace('_', ' ')}>
                    {type.replace('_', ' ')}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </Form>
        </CardBody>
        <Divider />{' '}
        <CardFooter className="flex flex-col gap-4">
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
              {isSubmitting ? 'Adding...' : 'Add User'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
