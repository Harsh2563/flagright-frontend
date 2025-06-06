'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { title, subtitle } from '../../components/ui/primitives';
import { TransactionIcon } from '../../components/ui/icons';
import { TransactionCard } from '../../components/transaction/TransactionCard';
import { useTransactions } from '../../contexts/TransactionContext';

import TransactionSearchFilter from '@/components/transaction/TransactionSearchFilter';
import { ITransaction } from '@/types/transaction';
import { ITransactionFilterState } from '@/types/transaction';
import { searchTransactions } from '@/services/transactionService';
import CustomPagination from '@/components/ui/CustomPagination';
import { useToastMessage } from '@/utils/toast';

export default function TransactionsPage() {
  const {
    transactions: contextTransactions,
    pagination: contextPagination,
    loading: contextLoading,
    error: contextError,
  } = useTransactions();
  const [searchResults, setSearchResults] = useState<ITransaction[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(contextPagination);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [filterState, setFilterState] = useState<ITransactionFilterState>({
    filters: {},
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });
  const router = useRouter();
  const toast = useToastMessage();

  const performSearch = useCallback(async () => {
    console.log('Performing search with filter state:', filterState);
    setIsSearchMode(true);
    setSearchLoading(true);
    setSearchError(null);
    try {
      const response = await searchTransactions({
        page: filterState.page,
        limit: filterState.limit,
        sortBy: filterState.sortBy,
        sortOrder: filterState.sortOrder,
        filters: filterState.filters,
        searchText: filterState.searchText,
      });

      if (response.status === 'success') {
        setSearchResults(response.data.transactions);
        setPagination(response.data.pagination);
      } else {
        setSearchError('Failed to search transactions');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('An error occurred while searching transactions');
      setSearchError('An error occurred while searching transactions');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, [filterState]);

  // Automatically trigger search when pagination changes
  useEffect(() => {
    if (isSearchMode) {
      const shouldAutoSearch = ['page', 'limit', 'sortBy', 'sortOrder'].some(
        (key) => filterState[key as keyof ITransactionFilterState] !== undefined
      );

      if (shouldAutoSearch) {
        const timeoutId = setTimeout(() => {
          performSearch();
        }, 100); // Small delay to batch multiple rapid changes

        return () => clearTimeout(timeoutId);
      }
    }
  }, [
    filterState.page,
    filterState.limit,
    filterState.sortBy,
    filterState.sortOrder,
    isSearchMode,
    performSearch,
  ]);

  // Reset search state
  const handleReset = useCallback(() => {
    setFilterState({
      filters: {},
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 10,
      searchText: undefined,
    });
    setIsSearchMode(false);
    setSearchResults([]);
    setSearchError(null);
    setPagination(contextPagination);
  }, [contextPagination]);
  // Calculate pagination for context transactions when not in search mode
  const contextPaginationCalculated = React.useMemo(() => {
    if (!contextPagination || !contextPagination.totalTransactions) {
      return {
        currentPage: 1,
        totalPages: 1,
        totalTransactions: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    const totalTransactions = contextPagination.totalTransactions;
    const totalPages = Math.ceil(totalTransactions / filterState.limit);
    const currentPage = filterState.page;

    return {
      currentPage,
      totalPages,
      totalTransactions,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [contextPagination, filterState.page, filterState.limit]);

  // Get paginated context transactions for display
  const paginatedContextTransactions = React.useMemo(() => {
    if (!contextTransactions || contextTransactions.length === 0) return [];

    const startIndex = (filterState.page - 1) * filterState.limit;
    const endIndex = startIndex + filterState.limit;

    return contextTransactions.slice(startIndex, endIndex);
  }, [contextTransactions, filterState.page, filterState.limit]);

  const displayTransactions = isSearchMode
    ? searchResults
    : paginatedContextTransactions;
  const displayLoading = isSearchMode ? searchLoading : contextLoading;
  const displayError = isSearchMode ? searchError : contextError;
  const displayPagination = isSearchMode
    ? pagination
    : contextPaginationCalculated;

  return (
    <section className="container mx-auto px-4 py-8">
      {' '}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <TransactionIcon className="text-primary" size={24} />
          </div>
          <div>
            <h1 className={title({ size: 'sm' })}>Transactions</h1>
            <p className={subtitle({ class: 'w-full md:w-full mt-1' })}>
              View and monitor financial transactions across accounts
            </p>
          </div>
        </div>
        <button
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-1"
          onClick={() => router.push('/transactions/add-transaction')}
        >
          <svg
            fill="none"
            height="20"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="20"
          >
            <line x1="12" x2="12" y1="5" y2="19" />
            <line x1="5" x2="19" y1="12" y2="12" />
          </svg>
          Add Transaction
        </button>
      </div>
      {/* Search Filter Component */}{' '}
      <div className="mb-6">
        <TransactionSearchFilter
          currentPage={displayPagination.currentPage}
          filterState={filterState}
          isLoading={displayLoading}
          totalPages={displayPagination.totalPages}
          totalTransactions={displayPagination.totalTransactions}
          onFilterChange={setFilterState}
          onReset={handleReset}
          onSearch={performSearch}
        />
      </div>
      {displayLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      ) : displayError ? (
        <div className="text-danger text-center py-10">{displayError}</div>
      ) : !displayTransactions || displayTransactions?.length === 0 ? (
        <div className="text-center py-10 text-default-500">
          {isSearchMode
            ? 'No transactions found matching your search criteria.'
            : 'No transactions found.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayTransactions?.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
      {!displayLoading && !displayError && displayPagination.totalPages > 1 && (
        <div className="mt-6">
          <CustomPagination
            isDisabled={displayLoading}
            pagination={displayPagination}
            onPageChange={(page) => {
              setFilterState({
                ...filterState,
                page,
              });
            }}
          />
        </div>
      )}
    </section>
  );
}
