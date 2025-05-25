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
  const { currentPage, totalPages, totalUsers, hasNextPage, hasPreviousPage } =
    pagination;

  // Calculate the range of users being displayed
  const startUser = Math.min((currentPage - 1) * limit + 1, totalUsers);
  const endUser = Math.min(currentPage * limit, totalUsers);

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
          Showing {startUser} - {endUser} of {totalUsers} users
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-default-500">
        Showing {startUser} - {endUser} of {totalUsers} users
      </span>

      <div className="flex items-center gap-1">
        {/* Previous button */}
        <Button
          isIconOnly
          variant="light"
          size="sm"
          isDisabled={!hasPreviousPage || isDisabled}
          onPress={() => onPageChange(currentPage - 1)}
          className="min-w-8 w-8 h-8"
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
              variant={isCurrentPage ? 'solid' : 'light'}
              color={isCurrentPage ? 'primary' : 'default'}
              size="sm"
              isDisabled={isDisabled}
              onPress={() => onPageChange(pageNumber)}
              className="min-w-8 w-8 h-8"
            >
              {pageNumber}
            </Button>
          );
        })}

        {/* Next button */}
        <Button
          isIconOnly
          variant="light"
          size="sm"
          isDisabled={!hasNextPage || isDisabled}
          onPress={() => onPageChange(currentPage + 1)}
          className="min-w-8 w-8 h-8"
        >
          <ChevronRightIcon size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CustomPagination;
