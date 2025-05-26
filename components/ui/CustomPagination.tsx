'use client';

import React from 'react';
import { Button } from '@heroui/react';

import { ChevronLeftIcon, ChevronRightIcon } from './icons';

import { ICustomPaginationProps } from '@/types/pagination';

export const CustomPagination: React.FC<ICustomPaginationProps> = ({
  pagination,
  onPageChange,
  isDisabled = false,
  limit = 10,
}) => {
  const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination;

  // Get the total items count (users or transactions)
  const totalResponses =
    'totalUsers' in pagination
      ? pagination.totalUsers
      : 'totalTransactions' in pagination
        ? pagination.totalTransactions
        : 0;

  // Calculate the range of users being displayed
  const startPage = Math.min((currentPage - 1) * limit + 1, totalResponses);
  const endPage = Math.min(currentPage * limit, totalResponses);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 3;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page if more than 1 page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-default-500">
          Showing {startPage} - {endPage} of {totalResponses} items
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-default-500">
        Showing {startPage} - {endPage} of {totalResponses} items
      </span>

      <div className="flex items-center gap-1">
        {/* Previous button */}
        <Button
          isIconOnly
          className="min-w-8 w-8 h-8"
          isDisabled={!hasPreviousPage || isDisabled}
          size="sm"
          variant="light"
          onPress={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeftIcon size={16} />
        </Button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-default-400">
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isCurrentPage = pageNumber === currentPage;

          return (
            <Button
              key={pageNumber}
              className="min-w-8 w-8 h-8"
              color={isCurrentPage ? 'primary' : 'default'}
              isDisabled={isDisabled}
              size="sm"
              variant={isCurrentPage ? 'solid' : 'light'}
              onPress={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          );
        })}

        {/* Next button */}
        <Button
          isIconOnly
          className="min-w-8 w-8 h-8"
          isDisabled={!hasNextPage || isDisabled}
          size="sm"
          variant="light"
          onPress={() => onPageChange(currentPage + 1)}
        >
          <ChevronRightIcon size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CustomPagination;
