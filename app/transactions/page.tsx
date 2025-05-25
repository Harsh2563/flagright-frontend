'use client';

import { title, subtitle } from '../../components/ui/primitives';
import { TransactionIcon } from '../../components/ui/icons';
import { TransactionCard } from '../../components/transaction/TransactionCard';
import { useTransactions } from '../../contexts/TransactionContext';
import { useRouter } from 'next/navigation';
import TransactionSearchFilter from '@/components/transaction/TransactionSearchFilter';
import React, { useCallback, useEffect, useState } from 'react';
import { ITransaction } from '@/types/transaction';
import { TransactionFilterState } from '@/types/transactionFilter';
import { searchTransactions } from '@/services/transactionService';
import CustomPagination from '@/components/ui/CustomPagination';

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
  const [filterState, setFilterState] = useState<TransactionFilterState>({
    filters: {},
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });
  const router = useRouter();

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
      setSearchError('An error occurred while searching transactions');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, [filterState]);

  // Automatically trigger search when filter state changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 100); // Small delay to batch multiple rapid changes

    return () => clearTimeout(timeoutId);
  }, [performSearch]);

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
            <TransactionIcon size={24} className="text-primary" />
          </div>
          <div>
            <h1 className={title({ size: 'sm' })}>Transactions</h1>
            <p className={subtitle({ class: 'w-full md:w-full mt-1' })}>
              View and monitor financial transactions across accounts
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push('/transactions/add-transaction')}
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-1"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Transaction
        </button>
      </div>
      {/* Search Filter Component */}{' '}
      <div className="mb-6">
        <TransactionSearchFilter
          filterState={filterState}
          onFilterChange={setFilterState}
          onSearch={performSearch}
          onReset={handleReset}
          isLoading={displayLoading}
          totalPages={displayPagination.totalPages}
          currentPage={displayPagination.currentPage}
          totalTransactions={displayPagination.totalTransactions}
        />
      </div>
      {displayLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
            pagination={displayPagination}
            onPageChange={(page) => {
              setFilterState({
                ...filterState,
                page,
              });
            }}
            isDisabled={displayLoading}
          />
        </div>
      )}
    </section>
  );
}
