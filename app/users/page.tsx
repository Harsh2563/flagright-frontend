'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { title, subtitle } from '../../components/ui/primitives';
import { AddIcon, UsersIcon } from '../../components/ui/icons';
import { UserCard } from '../../components/user/UserCard';
import { ShortestPathFinder } from '../../components/user/ShortestPathFinder';
import { useUsers } from '../../contexts/UserContext';
import { useRouter } from 'next/navigation';
import { UserSearchFilter } from '../../components/user/UserSearchFilter';
import { CustomPagination } from '../../components/ui/CustomPagination';
import { UserFilterState } from '../../types/userFilter';
import { searchUsers } from '../../services/userService';
import { IUser } from '../../types/user';
import { useToastMessage } from '@/utils/toast';

export default function UsersPage() {
  const {
    users: contextUsers,
    loading: contextLoading,
    error: contextError,
    pagination: contextPagination,
  } = useUsers();
  const router = useRouter();

  // State for search functionality
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(contextPagination);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [filterState, setFilterState] = useState<UserFilterState>({
    filters: {},
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 30,
  });
  const toast = useToastMessage();

  const performSearch = useCallback(async () => {
    setIsSearchMode(true);
    setSearchLoading(true);
    setSearchError(null);
    try {
      const response = await searchUsers({
        page: filterState.page,
        limit: filterState.limit,
        sortBy: filterState.sortBy,
        sortOrder: filterState.sortOrder,
        filters: filterState.filters,
      });

      if (response.status === 'success') {
        setSearchResults(response.data.users);
        setPagination(response.data.pagination);
      } else {
        setSearchError('Failed to search users');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('An error occurred while searching users');
      toast.error('An error occurred while searching users');
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
      limit: 30,
    });
    setIsSearchMode(false);
    setSearchResults([]);
    setSearchError(null);
    setPagination(contextPagination);
  }, []);

  // Calculate pagination for context users when not in search mode
  const contextPaginationCalculated = React.useMemo(() => {
    if (!contextPagination || contextPagination.totalUsers === 0) {
      return contextPagination;
    }

    const totalUsers = contextPagination.totalUsers;
    const totalPages = Math.ceil(totalUsers / filterState.limit);
    const currentPage = filterState.page;

    return {
      currentPage,
      totalPages,
      totalUsers,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [contextUsers, filterState.page, filterState.limit]);

  // Get paginated context users for display
  const paginatedContextUsers = React.useMemo(() => {
    if (!contextUsers || contextUsers.length === 0) return [];

    const startIndex = (filterState.page - 1) * filterState.limit;
    const endIndex = startIndex + filterState.limit;
    return contextUsers.slice(startIndex, endIndex);
  }, [contextUsers, filterState.page, filterState.limit]);

  const displayUsers = isSearchMode ? searchResults : paginatedContextUsers;
  const displayLoading = isSearchMode ? searchLoading : contextLoading;
  const displayError = isSearchMode ? searchError : contextError;
  const displayPagination = isSearchMode
    ? pagination
    : contextPaginationCalculated;

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <UsersIcon size={24} className="text-primary" />
          </div>
          <div>
            <h1 className={title({ size: 'sm' })}>Users</h1>
            <p className={subtitle({ class: 'w-full md:w-full mt-1' })}>
              View and manage user accounts and their relationships
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push('/users/add-user')}
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-1"
        >
          <AddIcon size={16} />
          Add User
        </button>
      </div>
      {/* Search Filter Component */}
      <div className="mb-6">
        <UserSearchFilter
          filterState={filterState}
          onFilterChange={setFilterState}
          onSearch={performSearch}
          onReset={handleReset}
          isLoading={displayLoading}
          totalPages={displayPagination.totalPages}
          currentPage={displayPagination.currentPage}
          totalUsers={displayPagination.totalUsers}
        />
      </div>{' '}
      {/* Shortest Path Component */}
      <ShortestPathFinder users={contextUsers} isLoading={contextLoading} />
      {/* Results */}
      {displayLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : displayError ? (
        <div className="text-danger text-center py-10">{displayError}</div>
      ) : !displayUsers || displayUsers.length === 0 ? (
        <div className="text-center py-10 text-default-500">
          {isSearchMode
            ? 'No users found matching your search criteria.'
            : 'No users found.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {displayUsers.map((user) => (
            <UserCard key={user.id} user={user} />
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
