export interface UserSearchFilters {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export interface UserSearchParams {
  page?: number;
  limit?: number;
  sortBy?: 'firstName' | 'lastName' | 'email' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  filters?: UserSearchFilters;
}

export interface UserSearchResponse {
  status: string;
  message: string;
  data: {
    users: any[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalUsers: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface UserFilterState {
  filters: UserSearchFilters;
  sortBy: UserSearchParams['sortBy'];
  sortOrder: UserSearchParams['sortOrder'];
  page: number;
  limit: number;
}
