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
  ITransactionFilterState,
  ITransactionSearchFilters,
} from '../../types/transaction';

import { useUsers } from '@/contexts/UserContext';
import {
  TransactionStatus,
  TransactionType,
} from '@/types/enums/TransactionEnums';
import { PaymentMethodType } from '@/types/enums/UserEnums';
import { currencies } from '@/helper/helper';
import { useToastMessage } from '@/utils/toast';

interface TransactionSearchFiltersProps {
  filterState: ITransactionFilterState;
  onFilterChange: (newState: ITransactionFilterState) => void;
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
  const [localAmountMin, setLocalAmountMin] = useState(
    filterState.filters.amountMin?.toString() || ''
  );
  const [localAmountMax, setLocalAmountMax] = useState(
    filterState.filters.amountMax?.toString() || ''
  );
  const { users, getUserById } = useUsers();
  const toast = useToastMessage();

  useEffect(() => {
    if (filterState.searchText !== undefined) {
      setLocalSearchText(filterState.searchText);
    }
  }, [filterState.searchText]);

  useEffect(() => {
    if (filterState.filters.amountMin !== undefined) {
      setLocalAmountMin(filterState.filters.amountMin.toString());
    }
  }, [filterState.filters.amountMin]);

  useEffect(() => {
    if (filterState.filters.amountMax !== undefined) {
      setLocalAmountMax(filterState.filters.amountMax.toString());
    }
  }, [filterState.filters.amountMax]);

  const handleFilterChange = (
    key: keyof ITransactionSearchFilters,
    value: any
  ) => {
    const newFilters = { ...filterState.filters, [key]: value };

    onFilterChange({
      ...filterState,
      filters: newFilters,
    });
  };

  const handleSortChange = (
    sortBy: ITransactionFilterState['sortBy'],
    sortOrder: ITransactionFilterState['sortOrder']
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
    setLocalAmountMin('');
    setLocalAmountMax('');
    setSelectedSearchFields(new Set());
    onFilterChange({
      ...filterState,
      filters: {},
      searchText: undefined,
      page: 1,
    });
    toast.info('All filters cleared');
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

    if (localAmountMin) {
      newFilters.amountMin = Number(localAmountMin);
    } else {
      newFilters.amountMin = undefined;
    }

    if (localAmountMax) {
      newFilters.amountMax = Number(localAmountMax);
    } else {
      newFilters.amountMax = undefined;
    }

    onFilterChange({
      ...filterState,
      filters: newFilters,
      searchText: localSearchText || undefined,
      page: 1,
    });

    toast.success('Search filters applied');
    onSearch();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardBody className="space-y-4">
          {/* Main Search Bar */}
          <div className="flex gap-2 items-center">
            <Input
              className="flex-1"
              isDisabled={isLoading}
              placeholder="Search transactions by description..."
              startContent={
                <SearchIcon className="text-default-400" size={18} />
              }
              value={localSearchText}
              variant="bordered"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleSearch();
                }
              }}
              onValueChange={setLocalSearchText}
            />{' '}
            {/* Search Button */}
            <Button
              className="shrink-0"
              color="primary"
              isDisabled={isLoading}
              startContent={<SearchIcon size={16} />}
              onPress={handleSearch}
            >
              Search
            </Button>
            <Button
              isIconOnly
              className="shrink-0"
              isDisabled={isLoading}
              variant="bordered"
              onPress={() => setIsExpanded(!isExpanded)}
            >
              <FilterIcon size={18} />
            </Button>
            {hasActiveFilters() && (
              <Button
                isIconOnly
                className="shrink-0"
                isDisabled={isLoading}
                variant="bordered"
                onPress={clearAllFilters}
              >
                <RefreshIcon size={18} />
              </Button>
            )}
            {/* Sort Dropdown */}
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="shrink-0"
                  isDisabled={isLoading}
                  variant="bordered"
                >
                  Sort:{' '}
                  {
                    sortOptions.find((opt) => opt.value === filterState.sortBy)
                      ?.label
                  }
                  ({filterState.sortOrder?.toUpperCase()})
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Sort Options">
                <div>
                  {sortOptions.map((option) => (
                    <DropdownItem
                      key={option.value}
                      onClick={() =>
                        handleSortChange(option.value as any, 'asc')
                      }
                    >
                      {option.label} (ASC)
                    </DropdownItem>
                  ))}
                </div>
                <div>
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
                </div>
              </DropdownMenu>
            </Dropdown>
          </div>
          {/* Active Filters Display */}
          {(hasActiveFilters() || selectedSearchFields.size > 0) && (
            <div className="flex flex-wrap gap-2">
              {' '}
              {selectedSearchFields.size > 0 && (
                <Chip
                  color="primary"
                  size="sm"
                  variant="flat"
                  onClose={() => setSelectedSearchFields(new Set())}
                >
                  Search in: {Array.from(selectedSearchFields).join(', ')}
                </Chip>
              )}
              {filterState.searchText && (
                <Chip
                  color="primary"
                  size="sm"
                  variant="flat"
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
                        key as keyof ITransactionSearchFilters,
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
                isDisabled={isLoading}
                label="senderId"
                placeholder="Select a sender"
                renderValue={() => {
                  return filterState.filters.senderId ? (
                    <div className="flex items-center gap-2">
                      {getUserById(filterState.filters.senderId)?.firstName}{' '}
                      {getUserById(filterState.filters.senderId)?.lastName}
                    </div>
                  ) : null;
                }}
                selectedKeys={
                  filterState.filters.senderId
                    ? [filterState.filters.senderId]
                    : []
                }
                variant="bordered"
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;

                  handleFilterChange('senderId', value || undefined);
                }}
              >
                {users?.map((user) => (
                  <SelectItem key={user.id}>
                    {user.firstName} {user?.lastName}
                  </SelectItem>
                ))}
              </Select>
              <Select
                isDisabled={isLoading || !users}
                label="ReceiverId"
                placeholder="Select a receiver"
                renderValue={() => {
                  return filterState.filters.receiverId ? (
                    <div className="flex items-center gap-2">
                      {getUserById(filterState.filters.receiverId)?.firstName}{' '}
                      {getUserById(filterState.filters.receiverId)?.lastName}
                    </div>
                  ) : null;
                }}
                selectedKeys={
                  filterState.filters.receiverId
                    ? [filterState.filters.receiverId]
                    : []
                }
                variant="bordered"
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;

                  handleFilterChange('receiverId', value || undefined);
                }}
              >
                {users?.map((user) => (
                  <SelectItem key={user?.id}>
                    {user?.firstName} {user?.lastName}
                  </SelectItem>
                ))}
              </Select>
              {/* Transaction Type */}
              <Select
                isDisabled={isLoading}
                label="Transaction Type"
                placeholder="Select type"
                selectedKeys={
                  filterState.filters.transactionType
                    ? [filterState.filters.transactionType]
                    : []
                }
                variant="bordered"
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;

                  handleFilterChange(
                    'transactionType',
                    value ? (value as TransactionType) : undefined
                  );
                }}
              >
                {Object.values(TransactionType).map((type) => (
                  <SelectItem key={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </Select>
              {/* Status */}
              <Select
                isDisabled={isLoading}
                label="Status"
                placeholder="Select status"
                selectedKeys={
                  filterState.filters.status ? [filterState.filters.status] : []
                }
                variant="bordered"
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;

                  handleFilterChange(
                    'status',
                    value ? (value as TransactionStatus) : undefined
                  );
                }}
              >
                {Object.values(TransactionStatus).map((status) => (
                  <SelectItem key={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </Select>
              {/* Currency */}
              <Select
                isDisabled={isLoading}
                label="Currency"
                placeholder="Select currency"
                selectedKeys={
                  filterState.filters.currency
                    ? [filterState.filters.currency]
                    : []
                }
                variant="bordered"
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;

                  handleFilterChange('currency', value || undefined);
                }}
              >
                {currencies.map((currency) => (
                  <SelectItem key={currency}>{currency}</SelectItem>
                ))}
              </Select>
              {/* Payment Method */}
              <Select
                isDisabled={isLoading}
                label="Payment Method"
                placeholder="Select payment method"
                selectedKeys={
                  filterState.filters.paymentMethod
                    ? [filterState.filters.paymentMethod]
                    : []
                }
                variant="bordered"
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;

                  handleFilterChange(
                    'paymentMethod',
                    value ? (value as PaymentMethodType) : undefined
                  );
                }}
              >
                {Object.values(PaymentMethodType).map((method) => (
                  <SelectItem key={method}>
                    {method.replace('_', ' ').charAt(0).toUpperCase() +
                      method.replace('_', ' ').slice(1)}
                  </SelectItem>
                ))}
              </Select>{' '}
              {/* Amount Min */}
              <Input
                description={
                  !filterState.filters.currency ? 'Select a currency first' : ''
                }
                isDisabled={isLoading || !filterState.filters.currency}
                label="Min Amount"
                placeholder="Minimum amount"
                type="number"
                value={localAmountMin}
                variant="bordered"
                onValueChange={(value) => {
                  setLocalAmountMin(value);
                }}
              />{' '}
              {/* Amount Max */}
              <Input
                description={
                  !filterState.filters.currency ? 'Select a currency first' : ''
                }
                isDisabled={isLoading || !filterState.filters.currency}
                label="Max Amount"
                placeholder="Maximum amount"
                type="number"
                value={localAmountMax}
                variant="bordered"
                onValueChange={(value) => {
                  setLocalAmountMax(value);
                }}
              />
              {/* Date Range Filters*/}
              <div className="col-span-1 sm:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    isDisabled={isLoading}
                    label="Created After"
                    type="date"
                    value={
                      filterState.filters.createdAfter
                        ? filterState.filters.createdAfter.split('T')[0]
                        : ''
                    }
                    variant="bordered"
                    onValueChange={(value) => {
                      const isoString = value
                        ? `${value}T00:00:00.000Z`
                        : undefined;

                      handleFilterChange('createdAfter', isoString);
                    }}
                  />

                  <Input
                    isDisabled={isLoading}
                    label="Created Before"
                    type="date"
                    value={
                      filterState.filters.createdBefore
                        ? filterState.filters.createdBefore.split('T')[0]
                        : ''
                    }
                    variant="bordered"
                    onValueChange={(value) => {
                      const isoString = value
                        ? `${value}T23:59:59.999Z`
                        : undefined;

                      handleFilterChange('createdBefore', isoString);
                    }}
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
