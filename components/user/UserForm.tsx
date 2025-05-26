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
import { PaymentMethodType } from '../../types/enums/UserEnums';
import { UsersIcon } from '../../components/ui/icons';
import { title } from '../../components/ui/primitives';
import {
  UserFormType,
  formDataToUser,
  UserFormSchema,
} from '../../schemas/userSchema';
import { UserValidationErrors as ValidationErrors } from '../../types/error';
import { useUsers } from '../../contexts/UserContext';
import { BackButton } from './BackButton';
import { useToastMessage } from '@/utils/toast';

export default function UserForm({ id = undefined }: { id?: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addUser, getUserById } = useUsers();
  const toast = useToastMessage();

  const [formData, setFormData] = useState<UserFormType>({
    id: id,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    paymentMethodTypes: [],
  });
  // Load user data if ID is provided
  useEffect(() => {
    if (id) {
      const user = getUserById(id);
      if (user) {
        // Convert IUser to UserFormType
        const userData = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || '',
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          postalCode: user.address?.postalCode || '',
          country: user.address?.country || '',
          paymentMethodTypes: user.paymentMethods?.map((pm) => pm.type) || [],
        };

        setFormData(userData);

        // Initialize states based on country
        if (userData.country) {
          const countryStates = State.getStatesOfCountry(userData.country);
          setStates(countryStates);
        }

        // Initialize cities based on state and country
        if (userData.state && userData.country) {
          const stateCities = City.getCitiesOfState(
            userData.country,
            userData.state
          );
          setCities(stateCities);
        }
      }
    }
  }, [id, getUserById]);

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

      // Only reset state and city if this is a new selection, not during initialization
      if (!id) {
        setFormData((prev) => ({ ...prev, state: '', city: '' }));
        setCities([]);
      }
    }
  }, [formData.country, id]);

  useEffect(() => {
    if (formData.state && formData.country) {
      const stateCities = City.getCitiesOfState(
        formData.country,
        formData.state
      );
      setCities(stateCities);

      // Only reset city if this is a new selection, not during initialization
      if (!id) {
        setFormData((prev) => ({ ...prev, city: '' }));
      }
    }
  }, [formData.state, formData.country, id]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setValidationErrors({});

    // Validate form data against the schema
    const validationResult = UserFormSchema.safeParse(formData);
    if (!validationResult.success) {
      console.log('Validation errors:', validationResult.error.errors);

      const errors: ValidationErrors = {};
      validationResult.error.errors.forEach((err) => {
        const path = err.path[0] as keyof ValidationErrors;
        errors[path] = err.message;
      });

      setValidationErrors(errors);
      toast.error('Please fix the validation errors before submitting');
      return;
    }
    try {
      setIsSubmitting(true);

      // Form validation passed - proceed with submission
      const user = formDataToUser(formData);
      const newUser = await addUser(user);

      if (newUser) {
        toast.success(
          id ? 'User updated successfully!' : 'User created successfully!'
        );
        router.push('/users');
      } else {
        toast.error(
          id ? 'Failed to update user. Please try again.' : 'Failed to create user. Please try again.'  
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
        console.error('Error creating user:', error);
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
    // Simply request the form to submit, which will trigger handleSubmit
    // where validation will be performed
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <BackButton content="Back to Users" onBack={() => router.back()} />

      <div className="flex items-center gap-4 mb-6">
        <div className="p-2 bg-primary/10 rounded-full">
          <UsersIcon size={24} className="text-primary" />
        </div>
        <h1 className={title({ size: 'sm' })}>
          {id ? 'Update User' : 'Add New User'}
        </h1>
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
            </div>{' '}
            {/* Payment */}
            <div className="space-y-8">
              <h3 className="text-lg font-semibold">
                Payment Methods{' '}
                <span className="text-sm font-normal text-gray-500">
                  (Select multiple)
                </span>
              </h3>
              <Select
                label="Payment Types"
                labelPlacement="outside"
                name="paymentMethodTypes"
                placeholder="Select payment methods"
                selectionMode="multiple"
                selectedKeys={new Set(formData.paymentMethodTypes)}
                errorMessage={validationErrors.paymentMethodTypes}
                isInvalid={!!validationErrors.paymentMethodTypes}
                onSelectionChange={(keys) => {
                  const selectedKeys =
                    keys instanceof Set
                      ? (Array.from(keys) as PaymentMethodType[])
                      : [];
                  setFormData((prev) => ({
                    ...prev,
                    paymentMethodTypes: selectedKeys,
                  }));
                }}
                className="w-full"
              >
                {Object.values(PaymentMethodType).map((type) => (
                  <SelectItem key={type} textValue={type.replace('_', ' ')}>
                    {type
                      .replace('_', ' ')
                      .split(' ')
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(' ')}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </Form>
        </CardBody>
        <Divider />
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
              {isSubmitting
                ? id
                  ? 'Updating...'
                  : 'Adding...'
                : id
                  ? 'Update User'
                  : 'Add User'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
