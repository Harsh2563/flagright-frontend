export interface IPaginationUser {
  currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface IPaginationData {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ICustomPaginationProps {
  pagination: IPaginationData;
  onPageChange: (page: number) => void;
  isDisabled?: boolean;
  limit?: number;
}