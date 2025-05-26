'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Input,
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Select,
  SelectItem,
  Checkbox,
} from '@heroui/react';
import { Country, State, City } from 'country-state-city';
import { SearchIcon, FilterIcon, RefreshIcon } from '../ui/icons';
import { IUserFilterState, IUserSearchFilters } from '../../types/user';

interface UserSearchFilterProps {
  filterState: IUserFilterState;
  onFilterChange: (newState: IUserFilterState) => void;
  onSearch: () => void;
  onReset: () => void;
  isLoading?: boolean;
  totalPages?: number;
  currentPage?: number;
  totalUsers?: number;
}

export const UserSearchFilter: React.FC<UserSearchFilterProps> = ({
  filterState,
  onFilterChange,
  onSearch,
  onReset,
  isLoading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSearchText, setLocalSearchText] = useState('');

  // State for dynamic country-state-city data
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [availableStates, setAvailableStates] = useState<any[]>([]);
  const [availableCities, setAvailableCities] = useState<any[]>([]);


  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry);
      setAvailableStates(states);
      setAvailableCities([]); // Clear cities when country changes
      setSelectedState(''); // Clear selected state
    } else {
      setAvailableStates([]);
      setAvailableCities([]);
      setSelectedState('');
    }
  }, [selectedCountry]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cities = City.getCitiesOfState(selectedCountry, selectedState);
      setAvailableCities(cities);
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry, selectedState]);

  
  useEffect(() => {
    if (
      filterState.filters.country &&
      filterState.filters.country !== selectedCountry
    ) {
      setSelectedCountry(filterState.filters.country);
    }
    if (
      filterState.filters.state &&
      filterState.filters.state !== selectedState
    ) {
      setSelectedState(filterState.filters.state);
    }
  }, [
    filterState.filters.country,
    filterState.filters.state,
    selectedCountry,
    selectedState,
  ]);
  const handleFilterChange = (key: keyof IUserSearchFilters, value: any) => {
    const newFilters = { ...filterState.filters, [key]: value };

    // Update local state for country-state-city dependencies
    if (key === 'country') {
      setSelectedCountry(value || '');
      // Clear dependent filters
      newFilters.state = undefined;
      newFilters.city = undefined;
    } else if (key === 'state') {
      setSelectedState(value || '');
      // Clear city filter
      newFilters.city = undefined;
    }

    onFilterChange({
      ...filterState,
      filters: newFilters,
    });
  };

  const handleSortChange = (
    sortBy: IUserFilterState['sortBy'],
    sortOrder: IUserFilterState['sortOrder']
  ) => {
    onFilterChange({
      ...filterState,
      sortBy,
      sortOrder,
      page: 1,
    });
  };

  const hasActiveFilters = () => {
    return Object.values(filterState.filters).some(
      (value) =>
        value !== undefined &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
    );
  };
  const clearAllFilters = () => {
    setLocalSearchText('');
    setSelectedCountry('');
    setSelectedState('');
    setAvailableStates([]);
    setAvailableCities([]);
    setSelectedSearchFields(new Set()); 
    onFilterChange({
      ...filterState,
      filters: {},
      page: 1,
    });
    onReset();
  };

  const sortOptions = [
    { label: 'First Name', value: 'firstName' },
    { label: 'Last Name', value: 'lastName' },
    { label: 'Email', value: 'email' },
    { label: 'Created Date', value: 'createdAt' },
    { label: 'Updated Date', value: 'updatedAt' },
  ]; 
  const [selectedSearchFields, setSelectedSearchFields] = useState<Set<string>>(
    new Set()
  );

  // Handle checkbox changes for field selection
  const handleCheckboxChange = (
    field: 'firstName' | 'lastName' | 'email' | 'phone' | 'postalCode',
    checked: boolean
  ) => {
    const newSelectedFields = new Set(selectedSearchFields);
    if (checked) {
      newSelectedFields.add(field);
    } else {
      newSelectedFields.delete(field);
    }
    setSelectedSearchFields(newSelectedFields);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardBody className="space-y-4">
          {' '}
          {/* Main Search Bar */}
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Search users by name, email, phone, or address..."
              value={localSearchText}
              onValueChange={setLocalSearchText}
              startContent={
                <SearchIcon className="text-default-400" size={18} />
              }
              variant="bordered"
              className="flex-1"
              isDisabled={isLoading}
            />{' '}
            {/* Search Button */}
            <Button
              color="primary"
              onPress={() => {
                const newFilters = { ...filterState.filters };

                // Clear all search fields first
                newFilters.firstName = undefined;
                newFilters.lastName = undefined;
                newFilters.email = undefined;
                newFilters.phone = undefined;
                newFilters.postalCode = undefined;

                // Apply search text to selected fields
                if (localSearchText && selectedSearchFields.size > 0) {
                  selectedSearchFields.forEach((field) => {
                    if (field === 'firstName')
                      newFilters.firstName = localSearchText;
                    else if (field === 'lastName')
                      newFilters.lastName = localSearchText;
                    else if (field === 'email')
                      newFilters.email = localSearchText;
                    else if (field === 'phone')
                      newFilters.phone = localSearchText;
                    else if (field === 'postalCode')
                      newFilters.postalCode = localSearchText;
                  });
                }

                onFilterChange({
                  ...filterState,
                  filters: newFilters,
                  page: 1,
                });
                onSearch();
              }}
              className="shrink-0"
              isDisabled={isLoading}
              startContent={<SearchIcon size={16} />}
            >
              Search
            </Button>
            <Button
              variant="bordered"
              isIconOnly
              onPress={() => setIsExpanded(!isExpanded)}
              className="shrink-0"
              isDisabled={isLoading}
            >
              <FilterIcon size={18} />
            </Button>
            {hasActiveFilters() && (
              <Button
                variant="bordered"
                isIconOnly
                onPress={clearAllFilters}
                className="shrink-0"
                isDisabled={isLoading}
              >
                <RefreshIcon size={18} />
              </Button>
            )}
            {/* Sort Dropdown */}
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="shrink-0"
                  isDisabled={isLoading}
                >
                  Sort:{' '}
                  {
                    sortOptions.find((opt) => opt.value === filterState.sortBy)
                      ?.label
                  }
                  ({filterState.sortOrder?.toUpperCase()})
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {sortOptions.map((option) => (
                  <DropdownItem
                    key={option.value}
                    onClick={() => handleSortChange(option.value as any, 'asc')}
                  >
                    {option.label} (ASC)
                  </DropdownItem>
                ))}
                {sortOptions.map((option) => (
                  <DropdownItem
                    key={`${option.value}-desc`}
                    onClick={() =>
                      handleSortChange(option.value as any, 'desc')
                    }
                  >
                    {option.label} (DESC)
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>{' '}
          {/* Active Filters Display */}
          {(hasActiveFilters() || selectedSearchFields.size > 0) && (
            <div className="flex flex-wrap gap-2">
              {selectedSearchFields.size > 0 && (
                <Chip
                  size="sm"
                  variant="flat"
                  color="primary"
                  onClose={() => setSelectedSearchFields(new Set())}
                >
                  Search in: {Array.from(selectedSearchFields).join(', ')}
                </Chip>
              )}

              {Object.entries(filterState.filters).map(([key, value]) => {
                if (
                  [
                    'firstName',
                    'lastName',
                    'email',
                    'phone',
                    'postalCode',
                  ].includes(key)
                ) {
                  return null;
                }

                if (
                  !value ||
                  value === '' ||
                  (Array.isArray(value) && value.length === 0)
                )
                  return null;
                let displayValue = value;
                if (typeof value === 'string' && value.length > 20) {
                  displayValue = value.substring(0, 20) + '...';
                }

                return (
                  <Chip
                    key={key}
                    size="sm"
                    variant="flat"
                    onClose={() =>
                      handleFilterChange(
                        key as keyof IUserSearchFilters,
                        undefined
                      )
                    }
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}:{' '}
                    {displayValue.toString()}
                  </Chip>
                );
              })}
            </div>
          )}
          {/* Expanded Filters */}
          {isExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 border-t">
              {/* Personal Information Filters - Using Checkboxes */}
              <div className="space-y-3 col-span-full">
                <p className="text-sm font-medium text-default-700">
                  Search Fields
                </p>{' '}
                <div className="flex flex-wrap gap-4">
                  <Checkbox
                    isSelected={selectedSearchFields.has('firstName')}
                    onValueChange={(checked) =>
                      handleCheckboxChange('firstName', checked)
                    }
                    isDisabled={isLoading}
                  >
                    First Name
                  </Checkbox>
                  <Checkbox
                    isSelected={selectedSearchFields.has('lastName')}
                    onValueChange={(checked) =>
                      handleCheckboxChange('lastName', checked)
                    }
                    isDisabled={isLoading}
                  >
                    Last Name
                  </Checkbox>
                  <Checkbox
                    isSelected={selectedSearchFields.has('email')}
                    onValueChange={(checked) =>
                      handleCheckboxChange('email', checked)
                    }
                    isDisabled={isLoading}
                  >
                    Email
                  </Checkbox>
                  <Checkbox
                    isSelected={selectedSearchFields.has('phone')}
                    onValueChange={(checked) =>
                      handleCheckboxChange('phone', checked)
                    }
                    isDisabled={isLoading}
                  >
                    Phone
                  </Checkbox>
                  <Checkbox
                    isSelected={selectedSearchFields.has('postalCode')}
                    onValueChange={(checked) =>
                      handleCheckboxChange('postalCode', checked)
                    }
                    isDisabled={isLoading}
                  >
                    Postal Code
                  </Checkbox>
                </div>
              </div>{' '}
              {/* Address Filters - Using Select Components */}
              <Select
                label="Country"
                placeholder="Select a country"
                selectedKeys={
                  filterState.filters.country
                    ? [filterState.filters.country]
                    : []
                }
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleFilterChange('country', value || undefined);
                }}
                variant="bordered"
                isDisabled={isLoading}
              >
                {Country.getAllCountries().map((country) => (
                  <SelectItem key={country.isoCode}>{country.name}</SelectItem>
                ))}
              </Select>
              <Select
                label="State"
                placeholder="Select a state"
                selectedKeys={
                  filterState.filters.state ? [filterState.filters.state] : []
                }
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleFilterChange('state', value || undefined);
                }}
                variant="bordered"
                isDisabled={isLoading || !selectedCountry}
              >
                {availableStates.map((state) => (
                  <SelectItem key={state.isoCode}>{state.name}</SelectItem>
                ))}
              </Select>
              <Select
                label="City"
                placeholder="Select a city"
                selectedKeys={
                  filterState.filters.city ? [filterState.filters.city] : []
                }
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleFilterChange('city', value || undefined);
                }}
                variant="bordered"
                isDisabled={isLoading || !selectedState}
              >
                {availableCities.map((city) => (
                  <SelectItem key={city.name}>{city.name}</SelectItem>
                ))}
              </Select>
              {/* Date Range Filters - Only Created filters */}
              <div className="col-span-1 sm:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Created After"
                    type="date"
                    variant="bordered"
                    value={
                      filterState.filters.createdAfter
                        ? filterState.filters.createdAfter.split('T')[0]
                        : ''
                    }
                    onValueChange={(value) => {
                      const isoString = value
                        ? `${value}T00:00:00.000Z`
                        : undefined;
                      handleFilterChange('createdAfter', isoString);
                    }}
                    isDisabled={isLoading}
                  />

                  <Input
                    label="Created Before"
                    type="date"
                    variant="bordered"
                    value={
                      filterState.filters.createdBefore
                        ? filterState.filters.createdBefore.split('T')[0]
                        : ''
                    }
                    onValueChange={(value) => {
                      const isoString = value
                        ? `${value}T23:59:59.999Z`
                        : undefined;
                      handleFilterChange('createdBefore', isoString);
                    }}
                    isDisabled={isLoading}
                  />
                </div>
              </div>
            </div>
          )}{' '}
        </CardBody>
      </Card>
    </div>
  );
};

export default UserSearchFilter;
