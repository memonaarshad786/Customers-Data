export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  region?: string;
  postalZip?: string;
  numberrange?: number;
}

export interface CustomerResponse {
  total: number;
  page: number;
  pages: number;
  size: number;
  count: number;
  customers: Customer[];
}

export interface CreateCustomerResponse {
  id: number;
}

export interface DeleteCustomerResponse {
  message: string;
  deletedId: number;
}

export interface ApiError {
  error: {
    message: string;
    code: number;
    fields?: string[];
  };
}

export const ERROR_CODES = {
  INVALID_INPUT: 100,
  INVALID_EMAIL: 101,
  MISSING_REQUIRED_FIELDS: 102,
  DUPLICATE_EMAIL: 200,
  NOT_FOUND: 300,
  SERVER_ERROR: 500,
} as const;
