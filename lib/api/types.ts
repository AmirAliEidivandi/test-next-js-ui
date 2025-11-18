// API Base Types
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Auth Types
export interface LoginRequest {
  mobile: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  exp: number;
  refresh_expires_in: number;
  refresh_exp: number;
}

// file response
export interface FileSummary {
  id: string; // file id
  url: string; // file url
  thumbnail_url: string; // thumbnail url
}

export interface QueryStats {
  period?: "YESTERDAY" | "TODAY" | "LAST_WEEK" | "LAST_MONTH" | "ALL";
  customer_id?: string;
  seller_id?: string;
  support_id?: string;
  from?: Date;
  to?: Date;
  product_id?: string;
  capillary_sales_line_id?: string;
  min_purchases?: number;
  inactive_days?: number;
}

// products sales response
export interface GetProductsSalesResponse {
  count: number;
  total_price: number;
  data: {
    title: string;
    count: number;
    net_weight: number;
    total_price: number;
    head_category: string;
  }[];
}

// head category sales response
export interface GetHeadCategorySalesResponse {
  count: number;
  total_price: number;
  data: {
    title: string;
    count: number;
    net_weight: number;
    total_price: number;
  }[];
}

// top products sales response
export interface GetTopProductsSalesResponse {
  count: number;
  total_price: number;
  data: {
    title: string;
    count: number;
    net_weight: number;
    total_price: number;
  }[];
}

// sellers list response
export interface GetSellersResponse {
  id: string; // employee id
  roles: string[]; // name of the keycloak groups: ['$MEAT_FULL_ACCESS', '$MEAT_CARGO']
  profile: {
    id: string; // profile id
    kid: string; // keycloak id
    first_name: string; // first name
    last_name: string; // last name
  };
  branches: {
    id: string; // branch id
    name: string; // branch name
  }[];
  capillary_sales_lines: {
    id: string; // capillary sales line id
    name: string; // capillary sales line name
  }[];
}

// get profile info response
export interface GetProfileInfoResponse {
  id: string; // profile id
  kid: string; // keycloak id
  first_name: string; // first name
  last_name: string; // last name
  mobile: string; // mobile number
  email: string; // email address
  birth_date: string; // birth date
  national_code: string; // national code
  username: string; // username
  gender: "MALE" | "FEMALE"; // gender
  mobile_prefix: string; // mobile prefix
  mobile_verified: boolean; // mobile verified
  enabled: boolean; // enabled
  profile_image: FileSummary | null; // profile image
}

// get employee info response
export interface GetEmployeeInfoResponse {
  id: string; // employee id
  roles: string[]; // name of the keycloak groups: ['$MEAT_FULL_ACCESS', '$MEAT_CARGO']
  profile: {
    id: string; // profile id
    kid: string; // keycloak id
    first_name: string; // first name
    last_name: string; // last name
    email: string; // email address
    mobile_verified: boolean; // mobile verified
    username: string; // username
  };
  deleted: boolean; // deleted
  locked: boolean; // locked
}

// get profile's role
export type ProfileRoles = string[]; // name of the keycloak roles: ['VIEW_EMPLOYEE', 'VIEW_STATS', 'CREATE_CUSTOMER']
