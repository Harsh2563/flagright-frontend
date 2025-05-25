export interface IPaginationUser {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IPaginationDataUser {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IPaginationTransaction {
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IPaginationDataTransaction {
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ICustomPaginationProps {
  pagination:
    | IPaginationDataUser
    | IPaginationDataTransaction
    | IPaginationUser
    | IPaginationTransaction;
  onPageChange: (page: number) => void;
  isDisabled?: boolean;
  limit?: number;
}
