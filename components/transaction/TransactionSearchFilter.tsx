'use client';

import React, { useState, useEffect } from 'react';
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
} from '@heroui/react';
import { SearchIcon, FilterIcon, RefreshIcon } from '../ui/icons';
import {
  TransactionFilterState,
  TransactionSearchFilters,
} from '../../types/transactionFilter';
import { useUsers } from '@/contexts/UserContext';
import {
  TransactionStatus,
  TransactionType,
} from '@/types/enums/TransactionEnums';
import { PaymentMethodType } from '@/types/enums/UserEnums';
import { currencies } from '@/helper/helper';

interface TransactionSearchFiltersProps {
  filterState: TransactionFilterState;
  onFilterChange: (newState: TransactionFilterState) => void;
  onSearch: () => void;
  onReset: () => void;
  isLoading?: boolean;
  totalPages?: number;
  currentPage?: number;
  totalTransactions?: number;
}

export const TransactionSearchFilter: React.FC<
  TransactionSearchFiltersProps
> = ({ filterState, onFilterChange, onSearch, onReset, isLoading = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSearchText, setLocalSearchText] = useState(
    filterState.searchText || ''
  );
  const { users, getUserById } = useUsers();

  useEffect(() => {
    if (filterState.searchText !== undefined) {
      setLocalSearchText(filterState.searchText);
    }
  }, [filterState.searchText]);

  const handleFilterChange = (
    key: keyof TransactionSearchFilters,
    value: any
  ) => {
    const newFilters = { ...filterState.filters, [key]: value };

    onFilterChange({
      ...filterState,
      filters: newFilters,
    });
  };

  const handleSortChange = (
    sortBy: TransactionFilterState['sortBy'],
    sortOrder: TransactionFilterState['sortOrder']
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
    setSelectedSearchFields(new Set());
    onFilterChange({
      ...filterState,
      filters: {},
      searchText: undefined,
      page: 1,
    });
    onReset();
  };

  const sortOptions = [
    { label: 'Amount', value: 'amount' },
    { label: 'Created At', value: 'createdAt' },
  ];
  const [selectedSearchFields, setSelectedSearchFields] = useState<Set<string>>(
    new Set()
  );

  const handleSearch = () => {
    const newFilters = { ...filterState.filters };

    onFilterChange({
      ...filterState,
      filters: newFilters,
      searchText: localSearchText || undefined,
      page: 1,
    });
    onSearch();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardBody className="space-y-4">
          {/* Main Search Bar */}
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Search transactions by description..."
              value={localSearchText}
              onValueChange={setLocalSearchText}
              startContent={
                <SearchIcon className="text-default-400" size={18} />
              }
              variant="bordered"
              className="flex-1"
              isDisabled={isLoading}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleSearch();
                }
              }}
            />{' '}
            {/* Search Button */}
            <Button
              color="primary"
              onPress={handleSearch}
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
          </div>
          {/* Active Filters Display */}
          {(hasActiveFilters() || selectedSearchFields.size > 0) && (
            <div className="flex flex-wrap gap-2">
              {' '}
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
              {filterState.searchText && (
                <Chip
                  size="sm"
                  variant="flat"
                  color="primary"
                  onClose={() => {
                    setLocalSearchText('');
                    onFilterChange({
                      ...filterState,
                      searchText: undefined,
                    });
                  }}
                >
                  Search: {filterState.searchText}
                </Chip>
              )}
              {Object.entries(filterState.filters).map(([key, value]) => {
                if (['description'].includes(key)) {
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
                        key as keyof TransactionSearchFilters,
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
              {/* Personal Information Filters*/}
              <div className="space-y-3 col-span-full">
                <p className="text-sm font-medium text-default-700">
                  Search Fields
                </p>
              </div>{' '}
              {/* Address Filters*/}{' '}
              <Select
                label="senderId"
                placeholder="Select a sender"
                selectedKeys={
                  filterState.filters.senderId
                    ? [filterState.filters.senderId]
                    : []
                }
                renderValue={() => {
                  return filterState.filters.senderId ? (
                    <div className="flex items-center gap-2">
                      {getUserById(filterState.filters.senderId)?.firstName}{' '}
                      {getUserById(filterState.filters.senderId)?.lastName}
                    </div>
                  ) : null;
                }}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleFilterChange('senderId', value || undefined);
                }}
                variant="bordered"
                isDisabled={isLoading}
              >
                {users?.map((user) => (
                  <SelectItem key={user.id}>
                    {user.firstName} {user?.lastName}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="ReceiverId"
                placeholder="Select a receiver"
                selectedKeys={
                  filterState.filters.receiverId
                    ? [filterState.filters.receiverId]
                    : []
                }
                renderValue={() => {
                  return filterState.filters.receiverId ? (
                    <div className="flex items-center gap-2">
                      {getUserById(filterState.filters.receiverId)?.firstName}{' '}
                      {getUserById(filterState.filters.receiverId)?.lastName}
                    </div>
                  ) : null;
                }}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleFilterChange('receiverId', value || undefined);
                }}
                variant="bordered"
                isDisabled={isLoading || !users}
              >
                {users?.map((user) => (
                  <SelectItem key={user?.id}>
                    {user?.firstName} {user?.lastName}
                  </SelectItem>
                ))}
              </Select>
              {/* Transaction Type */}
              <Select
                label="Transaction Type"
                placeholder="Select type"
                selectedKeys={
                  filterState.filters.transactionType
                    ? [filterState.filters.transactionType]
                    : []
                }
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleFilterChange(
                    'transactionType',
                    value ? (value as TransactionType) : undefined
                  );
                }}
                variant="bordered"
                isDisabled={isLoading}
              >
                {Object.values(TransactionType).map((type) => (
                  <SelectItem key={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </Select>
              {/* Status */}
              <Select
                label="Status"
                placeholder="Select status"
                selectedKeys={
                  filterState.filters.status ? [filterState.filters.status] : []
                }
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleFilterChange(
                    'status',
                    value ? (value as TransactionStatus) : undefined
                  );
                }}
                variant="bordered"
                isDisabled={isLoading}
              >
                {Object.values(TransactionStatus).map((status) => (
                  <SelectItem key={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </Select>
              {/* Currency */}
              <Select
                label="Currency"
                placeholder="Select currency"
                selectedKeys={
                  filterState.filters.currency
                    ? [filterState.filters.currency]
                    : []
                }
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleFilterChange('currency', value || undefined);
                }}
                variant="bordered"
                isDisabled={isLoading}
              >
                {currencies.map((currency) => (
                  <SelectItem key={currency}>{currency}</SelectItem>
                ))}
              </Select>
              {/* Payment Method */}
              <Select
                label="Payment Method"
                placeholder="Select payment method"
                selectedKeys={
                  filterState.filters.paymentMethod
                    ? [filterState.filters.paymentMethod]
                    : []
                }
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleFilterChange(
                    'paymentMethod',
                    value ? (value as PaymentMethodType) : undefined
                  );
                }}
                variant="bordered"
                isDisabled={isLoading}
              >
                {Object.values(PaymentMethodType).map((method) => (
                  <SelectItem key={method}>
                    {method.replace('_', ' ').charAt(0).toUpperCase() +
                      method.replace('_', ' ').slice(1)}
                  </SelectItem>
                ))}
              </Select>
              {/* Amount Min */}
              <Input
                type="number"
                label="Min Amount"
                placeholder="Minimum amount"
                value={filterState.filters.amountMin?.toString() || ''}
                onValueChange={(value) => {
                  const numValue = value ? Number(value) : undefined;
                  handleFilterChange('amountMin', numValue);
                }}
                variant="bordered"
                isDisabled={isLoading || !filterState.filters.currency}
                description={
                  !filterState.filters.currency ? 'Select a currency first' : ''
                }
              />
              {/* Amount Max */}
              <Input
                type="number"
                label="Max Amount"
                placeholder="Maximum amount"
                value={filterState.filters.amountMax?.toString() || ''}
                onValueChange={(value) => {
                  const numValue = value ? Number(value) : undefined;
                  handleFilterChange('amountMax', numValue);
                }}
                variant="bordered"
                isDisabled={isLoading || !filterState.filters.currency}
                description={
                  !filterState.filters.currency ? 'Select a currency first' : ''
                }
              />
              {/* Date Range Filters*/}
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

export default TransactionSearchFilter;
