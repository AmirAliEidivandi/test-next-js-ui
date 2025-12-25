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

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  exp: number;
  refresh_expires_in: number;
  refresh_exp: number;
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

export interface VerifyTokenRequest {
  token: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  message: string;
  current_time?: number;
  error?: string;
  exp?: number;
  time_remaining?: number;
  username?: string;
}

// file response
export interface FileSummary {
  id: string; // file id
  url: string; // file url
  name: string; // file name
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

export interface GetCategorySalesReportResponse {
  data: {
    title: string;
    total_sales_weight: number;
    total_sales_amount: number;
    products_count: number;
    products_with_sales: number;
    average_sales_weight: number;
    average_sales_amount: number;
  }[];
}

export interface GetPaymentsStatusResponse {
  count: number;
  data: {
    count: number;
    title: string;
  }[];
}

export interface GetDayOfPurchasesResponse {
  count: number;
  data: {
    title: string;
    count: number;
  }[];
}

export interface GetSellersReportResponse {
  report: {
    seller_id: string;
    seller_name: string;
    total_calls: number;
    successful_calls: number;
    failed_calls: number;
    successful_orders: number;
    failed_orders: number;
    delivered_orders: number;
    failed_order_reasons: {
      reason: string;
      count: number;
    }[];
    total_sales_amount: number;
    average_order_amount: number;
    highest_order_amount: number;
    lowest_order_amount: number;
    conversion_rate: number;
    finalization_rate: number;
    total_weight_sold: number;
    average_weight_per_order: number;
    unique_customers: number;
    new_customers: number;
    returning_customers: number;
    total_product_items: number;
    top_products: {
      product_title: string;
      total_weight: number;
      total_amount: number;
      order_count: number;
    }[];
    top_categories: {
      category_title: string;
      total_weight: number;
      total_amount: number;
    }[];
    performance_score: number;
  }[];
  generated_at: string;
  filters: {
    period: PeriodEnum;
  };
}

export interface GetNegativeInventoryReportResponse {
  total_products: number;
  report: {
    product_id: string;
    product_code: number;
    product_title: string;
    net_weight: number;
    gross_weight: number;
    sec_unit_amount: number;
    box_weight: number;
    categories: string;
    retail_price: number;
    wholesale_price: number;
  }[];
  generated_at: string;
  branch: string;
}

export interface GetActualCustomerDebtReportResponse {
  total_customers: number;
  totals: {
    total_accounting_debt: number;
    total_pending_cheques: number;
    total_actual_debt: number;
  };
  report: {
    customer_id: string;
    customer_code: number;
    customer_title: string;
    accounting_debt: number;
    pending_cheques_count: number;
    pending_cheques_total: number;
    actual_debt: number;
    pending_cheques_detail: {
      payment_id: string;
      amount: number;
      cheque_due_date: Date;
      date: Date;
    }[];
  }[];
  generated_at: string;
  branch: string;
}

export interface GetReturnedOrdersReportResponse {
  summary: {
    total_orders: number;
    fully_returned_count: number;
    partially_returned_count: number;
    total_returned_weight: number;
    total_returned_amount: number;
    average_return_percentage: number;
  };
  report: {
    order_id: string;
    order_code: number;
    order_step: OrderStepEnum;
    created_date: Date;
    delivery_date: Date;
    customer_id: string;
    customer_code: number;
    customer_title: string;
    seller_id: string;
    seller_name: string;
    person_name: string;
    person_mobile: string;
    total_ordered_weight: number;
    total_returned_weight: number;
    total_returned_amount: number;
    return_percentage: number;
    returned_products_count: number;
    returned_products: {
      product_id: string;
      product_code: number;
      product_title: string;
      ordered_weight: number;
      fulfilled_weight: number;
      returned_weight: number;
      price: number;
      returned_amount: number;
    }[];
  }[];
  generated_at: string;
  branch: string;
  filters: {
    from: string;
    to: string;
  };
}

export interface GetReturnedProductsReportResponse {
  summary: {
    total_unique_products: number;
    total_return_incidents: number;
    total_returned_weight: number;
    total_returned_amount: number;
    average_return_percentage: number;
    top_5_products: {
      product_title: string;
      returned_weight: number;
    }[];
  };
  report: {
    product_id: string;
    product_code: number;
    product_title: string;
    categories: string;
    total_return_count: number;
    total_returned_weight: number;
    total_ordered_weight: number;
    total_fulfilled_weight: number;
    total_returned_amount: number;
    return_percentage: number;
    avg_price: number;
    affected_orders_count: number;
    affected_customers_count: number;
    current_net_weight: number;
    current_gross_weight: number;
  }[];
  generated_at: string;
  branch: string;
  filters: {
    from: string;
    to: string;
  };
}

export interface GetInactiveCustomersReportResponse {
  summary: {
    total_inactive_customers: number;
    total_lost_revenue: number;
    avg_customer_value: number;
    avg_days_inactive: number;
    risk_breakdown: {
      high: number;
      medium: number;
      low: number;
    };
    top_5_valuable_customers: {
      customer_title: any;
      total_spent: number;
      days_inactive: number;
    }[];
  };
  report: {
    customer_id: string;
    customer_code: any;
    customer_title: any;
    customer_category: any;
    customer_phone: any;
    customer_address: any;
    seller_name: string;
    total_purchases: number;
    total_spent: number;
    avg_order_value: number;
    first_purchase_date: Date;
    last_purchase_date: Date;
    days_since_last_purchase: number;
    customer_lifetime_days: number;
    purchase_frequency: number;
    risk_level: string;
  }[];
  generated_at: string;
  branch: string;
  filters: {
    min_purchases: number;
    inactive_days: number;
    cutoff_date: string;
  };
}

export interface GetCustomersWithoutPurchaseReportResponse {
  summary: {
    total_customers_without_purchase: number;
    never_contacted: number;
    contacted_no_purchase: number;
    total_failed_attempts: number;
    avg_days_since_registration: number;
    top_5_not_purchased_reasons: {
      reason: string;
      count: number;
    }[];
    oldest_registered: {
      customer_title: string;
      days_since_registration: number;
      total_contacts: number;
    }[];
  };
  report: {
    customer_id: string;
    customer_code: number;
    customer_title: string;
    customer_category: CustomerCategoryEnum;
    customer_type: CustomerTypeEnum;
    customer_phone: string;
    customer_address: string;
    seller_name: string;
    registered_date: Date;
    days_since_registration: number;
    total_contacts: number;
    failed_orders: number;
    last_contact_date: Date;
    days_since_last_contact: number;
    most_common_not_purchased_reason: string;
    all_not_purchased_reasons: Record<string, number>;
    status: string;
  }[];
  generated_at: string;
  branch: string;
}

export interface GetProductsSummaryReportResponse {
  products: {
    product_id: string;
    product: {
      id: string;
      title: string;
      code: number;
      net_weight: number;
      gross_weight: number;
      sec_unit_amount: number;
    };
    warehouse_id: string;
    receiving_count: number;
    receiving_weight: number;
    receiving_amount: number;
    dispatching_count: number;
    dispatching_weight: number;
    dispatching_amount: number;
    produce_input_count: number;
    produce_input_weight: number;
    produce_output_count: number;
    produce_output_weight: number;
    cargo_dispatch_count: number;
    cargo_dispatch_weight: number;
    cargo_dispatch_amount: number;
    cargo_return_count: number;
    cargo_return_weight: number;
    cargo_return_amount: number;
    warehouse_inventory: number;
    calculated_remaining: number;
  }[];
  from: string;
  to: string;
  total_products: number;
  current_page: number;
  page_size: number;
  total_pages: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

export interface GetProductsPeriodReportResponse {
  data: {
    product_code: number;
    product_title: string;
    product_hp_title: string;
    product_id: string;
    product_hp_code: number;
    opening_quantity: number;
    opening_count: number;
    purchase_quantity: number;
    purchase_count: number;
    sales_quantity: number;
    sales_count: number;
    closing_quantity: number;
    closing_count: number;
  }[];
  count: number;
  from: string;
  to: string;
  total_products: number;
  current_page: number;
  page_size: number;
  total_pages: number;
  has_next_page: boolean;
  has_previous_page: boolean;
  generated_at: string;
  branch: string;
}

export enum PeriodEnum {
  TODAY = "TODAY",
  YESTERDAY = "YESTERDAY",
  LAST_WEEK = "LAST_WEEK",
  LAST_MONTH = "LAST_MONTH",
  ALL = "ALL",
}

export interface GetOnlineCustomersReportResponse {
  summary: {
    total_customers_in_branch: number;
    total_online_customers: number;
    total_offline_customers: number;
    online_customers_in_period: number;
    registration_breakdown: {
      total_registered: number;
      with_purchases: number;
      without_purchases: number;
      active_customers: number;
      inactive_customers: number;
    };
    financial_summary: {
      total_purchase_amount: number;
      total_debt: number;
      avg_customer_value: number;
    };
    order_statistics: {
      total_orders: number;
      successful_orders: number;
      failed_orders: number;
      avg_conversion_rate: number;
    };
    mobile_verification: { verified: number; not_verified: number };
    top_5_customers: {
      customer_title: string;
      customer_code: number;
      total_purchase_amount: number;
      successful_orders: number;
    }[];
    top_5_debtors: {
      customer_title: string;
      customer_code: number;
      debt: number;
      mobile: string;
    }[];
  };
  report: {
    customer_id: string;
    customer_code: number;
    customer_title: string;
    customer_type: string;
    customer_category: string;
    mobile: string;
    mobile_verified: boolean;
    full_name: string;
    registration_date: string;
    days_since_registration: number;
    total_orders: number;
    successful_orders: number;
    failed_orders: number;
    conversion_rate: number;
    total_purchase_amount: number;
    avg_order_value: number;
    wallet_balance: number;
    credit_cap: number;
    debt: number;
    last_order_date: string;
    days_since_last_order: number;
    is_active: boolean;
    status: string;
  }[];
  generated_at: string;
  branch: string;
  filters: {
    period: PeriodEnum;
    from?: Date;
    to?: Date;
  };
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

export type GetEmployeesResponse = Array<{
  id: string;
  profile_id: string;
  kid: string;
  deleted: boolean;
  locked: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  roles: string[];
  profile: {
    id: string;
    kid: string;
    first_name: string;
    last_name: string;
  };
  capillary_sales_lines: {
    id: string;
    title: string;
  }[];
  branches: {
    id: string;
    name: string;
  }[];
}>;

// get profile's role
export type ProfileRoles = string[]; // name of the keycloak roles: ['VIEW_EMPLOYEE', 'VIEW_STATS', 'CREATE_CUSTOMER']

// customer query
export interface QueryCustomer {
  page?: number;
  "page-size"?: number;
  deleted?: boolean;
  branch_id?: string;
  locked?: boolean;
  created_at_max?: Date;
  created_at_min?: Date;
  code?: string;
  id?: string;
  person_id?: string;
  min_order_count?: number;
  lat?: number;
  long?: number;
  mobile?: string; // شماره موبایل همراه اشخاص در مشتری
  title?: string;
  phone?: string; // تلفن ثابت
  type?: "PERSONAL" | "CORPORATE"; // حقیقی - حقوقی
  category?:
    | "RESTAURANT" // رستوران
    | "HOTEL" // هتل
    | "CHAIN_STORE" // فروشگاه زنجیره ای
    | "GOVERNMENTAL" // ارگان های دولتی
    | "FAST_FOOD" // فست فود
    | "CHARITY" // خیریه
    | "BUTCHER" // قصابی
    | "WHOLESALER" // عمده فروش
    | "FELLOW" // همکار
    | "CATERING" // کترینگ
    | "KEBAB" // کبابی-بریانی
    | "DISTRIBUTOR" // پخش کننده
    | "HOSPITAL" // بیمارستان
    | "FACTORY"; // کارخانه
  is_property_owner?: boolean; // صاحب ملک
  age?: number;
  credibility_by_seller?:
    | "NOT_EVALUATED" // ارزیابی نشده
    | "LOW" // کم اعتبار
    | "MEDIUM" // متوسط
    | "TRUSTED" // معتبر
    | "FULLY_TRUSTED"; // کاملا معتبر
  behavior_tags?: Array<
    | "MANNERED" // خوش اخلاق
    | "POLITE" // مودب
    | "ANGRY" // عصبی
    | "PATIENCE" // صبور
    | "RUDE" // بی ادب
    | "HASTY" // عجول
  >;
  seller_id?: string;
  capillary_sales_line_id?: string;
  hp_code?: string; // کد حسابداری
  hp_title?: string; // عنوان حسابداری
}

export enum CustomerTypeEnum {
  PERSONAL = "PERSONAL",
  CORPORATE = "CORPORATE",
}

export enum CustomerCategoryEnum {
  RESTAURANT = "RESTAURANT",
  HOTEL = "HOTEL",
  CHAIN_STORE = "CHAIN_STORE",
  GOVERNMENTAL = "GOVERNMENTAL",
  FAST_FOOD = "FAST_FOOD",
  CHARITY = "CHARITY",
  BUTCHER = "BUTCHER",
  WHOLESALER = "WHOLESALER",
  FELLOW = "FELLOW",
  CATERING = "CATERING",
  KEBAB = "KEBAB",
  DISTRIBUTOR = "DISTRIBUTOR",
  HOSPITAL = "HOSPITAL",
  FACTORY = "FACTORY",
}

export enum CustomerCredibilityBySellerEnum {
  NOT_EVALUATED = "NOT_EVALUATED",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  TRUSTED = "TRUSTED",
  FULLY_TRUSTED = "FULLY_TRUSTED",
}

export enum CustomerCredibilityBySalesManagerEnum {
  NOT_EVALUATED = "NOT_EVALUATED",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  TRUSTED = "TRUSTED",
  FULLY_TRUSTED = "FULLY_TRUSTED",
}

export enum CustomerBehaviorTagsEnum {
  MANNERED = "MANNERED",
  POLITE = "POLITE",
  PATIENCE = "PATIENCE",
  ANGRY = "ANGRY",
  HASTY = "HASTY",
  RUDE = "RUDE",
}
export interface GetCustomersResponse {
  count: number;
  data: Array<{
    id: string;
    title: string;
    type: "PERSONAL" | "CORPORATE";
    category: CustomerCategoryEnum;
    is_property_owner: boolean;
    did_we_contact: boolean;
    phone: string;
    address: string;
    age: number;
    credibility_by_seller: CustomerCredibilityBySellerEnum;
    credibility_by_sales_manager: CustomerCredibilityBySalesManagerEnum;
    behavior_tags: Array<CustomerBehaviorTagsEnum>;
    national_id: string;
    branch_id: string;
    seller_id: string;
    support_id: string;
    capillary_sales_line_id: string;
    deleted: boolean;
    chat_id: string | null;
    description: string;
    locked: boolean;
    location: {
      type: string; // Point type
      coordinates: [number, number];
    };
    code: number;
    status: string | null;
    status_history: [];
    hp_code: number;
    hp_title: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    capillary_sales_line: {
      id: string;
      line_number: number;
      title: string;
      description: string;
      branch_id: string;
      deleted: boolean;
      locked: boolean;
      created_at: Date;
      updated_at: Date;
      deleted_at: Date | null;
    };
    seller: {
      id: string;
      profile: {
        id: string;
        kid: string;
        first_name: string;
        last_name: string;
      };
    };
    people: [
      {
        id: string;
        profile_id: string;
        title: string;
        deleted: boolean;
        locked: boolean;
        branch_id: string;
        kid: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        profile: {
          id: string;
          kid: string;
          first_name: string;
          last_name: string;
          email: string | null;
          mobile: string;
          mobile_prefix: string;
          mobile_country_code: string;
          mobile_verified: boolean;
          enabled: boolean;
          gender: "MALE" | "FEMALE";
          groups: string[];
          clients: string[];
          username: string;
          national_code: string | null;
          timestamps: [];
          roles: [];
          third_party_provider: string | null;
          is_verified_via_third_party: boolean | null;
          created_at: Date;
          updated_at: Date;
          deleted_at: Date | null;
          birth_date: Date | null;
        };
      }
    ];
    representative_name: string; // نماینده ی مشتری
    is_online: boolean;
  }>;
}

export interface GetCustomerResponse {
  id: string;
  title: string;
  type: CustomerTypeEnum;
  category: CustomerCategoryEnum;
  phone: string;
  code: number;
  hp_code: number;
  capillary_sales_line: {
    id: string;
    line_number: number;
    title: string;
  };
  seller: {
    id: string;
    profile: {
      id: string;
      kid: string;
      first_name: string;
      last_name: string;
    };
  };
  wallet: {
    id: string;
    balance: number;
  };
  representative_name: string;
  is_online: boolean;
}

export interface CapillarySalesLinesResponse {
  count: number;
  data: {
    id: string;
    title: string;
    line_number: number;
    description: string;
  }[];
}

export interface QueryCapillarySalesLine {
  page?: number;
  "page-size"?: number;
}

export interface GetCustomersByDebtResponse {
  count: number;
  metadata: {
    total_debt: number;
  };
  data: {
    id: string;
    type: CustomerTypeEnum;
    title: string;
    category: CustomerCategoryEnum;
    phone: string;
    code: number;
    hp_code: number;
    capillary_sales_line: {
      id: string;
      line_number: number;
      title: string;
    };
    seller: {
      id: string;
      profile: {
        id: string;
        kid: string;
        first_name: string;
        last_name: string;
      };
    };
    wallet: {
      id: string;
      balance: number;
    };
    representative_name: string;
    is_online: boolean;
  }[];
}

export enum OrderStepEnum {
  SELLER = "SELLER",
  SALES_MANAGER = "SALES_MANAGER",
  PROCESSING = "PROCESSING",
  INVENTORY = "INVENTORY",
  ACCOUNTING = "ACCOUNTING",
  CARGO = "CARGO",
  PARTIALLY_DELIVERED = "PARTIALLY_DELIVERED",
  DELIVERED = "DELIVERED",
  RETURNED = "RETURNED",
  PARTIALLY_RETURNED = "PARTIALLY_RETURNED",
}

export enum PaymentStatusEnum {
  PAID = "PAID", // پرداخت شده
  NOT_PAID = "NOT_PAID", // پرداخت نشده
  PARTIALLY_PAID = "PARTIALLY_PAID", // پرداخت جزئی
}
export interface GetCustomerReportResponse {
  count: number;
  data: {
    id: string;
    title: string;
    type: CustomerTypeEnum;
    category: CustomerCategoryEnum;
    code: number;
    hp_code: number;
    capillary_sales_line: {
      id: string;
      line_number: number;
      title: string;
    };
    seller: {
      id: string;
      profile: {
        id: string;
        kid: string;
        first_name: string;
        last_name: string;
      };
    };
    wallet: {
      id: string;
      balance: number;
    };
    representative_name: string;
    is_online: boolean;
    last_order: {
      id: string;
      code: number;
      payment_status: PaymentStatusEnum; // پرداخت شده - پرداخت نشده - پرداخت جزئی
      step: OrderStepEnum; // مرحله
      created_at: Date;
      total_amount: number;
    };
  }[];
}

export enum DeliveryMethodEnum {
  FREE_OUR_TRUCK = "FREE_OUR_TRUCK",
  FREE_OTHER_SERVICES = "FREE_OTHER_SERVICES",
  PAID = "PAID",
  AT_INVENTORY = "AT_INVENTORY",
}

export interface QueryOrder {
  page?: number;
  "page-size"?: number;
  code?: number;
  hp_invoice_code?: number;
  step?: OrderStepEnum; // مرحله
  seller_id?: string;
  archived?: boolean; // وضعیت آرشیو: آرشیو شده - آرشیو نشده
  created_date_min?: Date;
  created_date_max?: Date;
  capillary_sales_line_id?: string;
  bought?: boolean;
  answered?: boolean; // وضعیت تماس: جواب داد - جواب نداد
  new_customer?: boolean; // وضعیت مشتری: مشتری جدید - مشتری قدیمی
  delivery_method?: DeliveryMethodEnum; // روش تحویل
  customer_id?: string;
  did_we_contact?: boolean; // تماس از جانب: ما - مشتری
  delivery_date_min?: Date; // تاریخ تحویل: از تاریخ
  delivery_date_max?: Date; // تاریخ تحویل: تا تاریخ
  person_id?: string; // نماینده
  in_person_order?: boolean; // شیوه خرید: حضوری - غیرحضوری
}

export interface GetOrdersResponse {
  count: number;
  data: {
    id: string;
    code: number;
    delivery_date: Date;
    payment_status: PaymentStatusEnum; // پرداخت شده - پرداخت نشده - پرداخت جزئی
    hp_invoice_code: number; // کد حسابداری فاکتور
    step: OrderStepEnum; // مرحله
    created_at: Date;
    delivery_method: DeliveryMethodEnum; // رایگان با ماشین شرکت - رایگان با سرویس خارجی - ارسال با هزینه مشتری - تحویل درب انبار
    customer: {
      id: string;
      title: string;
    };
    seller: {
      id: string;
      profile: {
        id: string;
        kid: string;
        first_name: string;
        last_name: string;
      };
    };
    bought: boolean;
    is_online: boolean;
    representative_name: string;
    day_index: number; // 0 - 1 - 2 - 3 - 4 - 5 - 6: شنبه - یکشنبه - دوشنبه - سه شنبه - چهارشنبه - پنجشنبه - جمعه
  }[];
}

export enum NotPurchasedReasonEnum {
  CUSTOMER_STOCK_FULL_OUR_PRODUCT = "CUSTOMER_STOCK_FULL_OUR_PRODUCT",
  CUSTOMER_STOCK_FULL_COMPETITORS_PRODUCT = "CUSTOMER_STOCK_FULL_COMPETITORS_PRODUCT",
  OUR_SERVICE_DID_NOT_SATISFY = "OUR_SERVICE_DID_NOT_SATISFY",
  INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK",
  COULD_NOT_REACH_CUSTOMER = "COULD_NOT_REACH_CUSTOMER",
  LONG_PAYMENT_PERIOD = "LONG_PAYMENT_PERIOD",
  PRICE_DIFFERENCE_WITH_COMPETITORS = "PRICE_DIFFERENCE_WITH_COMPETITORS",
  NOT_INTERESTED_TO_WORK_WITH_US = "NOT_INTERESTED_TO_WORK_WITH_US",
  MARKET_LOCKED = "MARKET_LOCKED",
  PRODUCT_LOCKED = "PRODUCT_LOCKED",
  OLD_PRICE = "OLD_PRICE",
  CUSTOMER_IS_LOCKED = "CUSTOMER_IS_LOCKED",
  OTHER = "OTHER",
}

export enum CargoTypeEnum {
  DISPATCH = "DISPATCH", // مرسوله
  RETURN = "RETURN", // مرجوعی
}

export interface GetOrderResponse {
  id: string;
  code: number;
  delivery_date: Date;
  payment_status: PaymentStatusEnum;
  hp_invoice_code: number;
  step: OrderStepEnum;
  created_at: Date;
  delivery_method: DeliveryMethodEnum;
  created_date: Date;
  updated_at: Date;
  behavior_tags: CustomerBehaviorTagsEnum[];
  description: string;
  settlements: {
    date: Date;
    method: SettlementMethodEnum;
    description: string | null;
  }[];
  fulfilled: boolean;
  customer: {
    id: string;
    title: string;
    code: number;
    type: CustomerTypeEnum;
    category: CustomerCategoryEnum;
    capillary_sales_line: {
      id: string;
      line_number: number;
      title: string;
    } | null;
  };
  seller: {
    id: string;
    profile: {
      id: string;
      kid: string;
      first_name: string;
      last_name: string;
    };
  };
  order_creator: {
    id: string;
    profile: {
      id: string;
      kid: string;
      first_name: string;
      last_name: string;
    };
  };
  bought: boolean;
  is_online: boolean;
  representative_name: string;
  day_index: number;
  ordered_basket:
    | {
        price: number;
        weight: number;
        cancelled_weight: number;
        inventory_net_weight: number;
        fulfilled_weight: number;
        fulfilled: boolean;
        product_title: string;
        product_id: string;
        product_code: number;
        online_price: number;
        retail_price: number;
        wholesale_price: number;
        sec_unit_amount: number;
      }[]
    | null;
  failed_basket:
    | {
        price: number;
        weight: number;
        reason: NotPurchasedReasonEnum;
        product_title: string;
        product_id: string;
        product_code: number;
        online_price: number;
        retail_price: number;
        wholesale_price: number;
        locked: boolean;
      }[]
    | null;
  cargos: {
    id: string;
    description: string;
    code: number;
    type: CargoTypeEnum;
    date: Date;
    delivery_method: DeliveryMethodEnum;
    truck_license_plate: string;
    truck_driver: {
      first_name: string;
      last_name: string;
    };
    employee_id: string;
    employee: {
      id: string;
      profile: {
        id: string;
        kid: string;
        first_name: string;
        last_name: string;
      };
    };
    created_at: Date;
    updated_at: Date;
    deleted: boolean;
    deleted_at: Date;
    products: {
      product_id: string;
      product_title: string;
      product_code: number;
      net_weight: number;
      box_weight: number;
      gross_weight: number;
      sec_unit_amount: number;
      online_price: number;
      retail_price: number;
      wholesale_price: number;
    }[];
  }[];
}

export enum InvoiceTypeEnum {
  PURCHASE = "PURCHASE",
  RETURN_FROM_PURCHASE = "RETURN_FROM_PURCHASE",
  SELL = "SELL",
}

export interface QueryInvoice {
  page?: number;
  "page-size"?: number;
  code?: number;
  customer_id?: string;
  seller_id?: string;
  order_id?: string;
  due_date_min?: Date;
  due_date_max?: Date;
  from?: Date;
  to?: Date;
  amount_min?: number;
  amount_max?: number;
  payment_status?: PaymentStatusEnum;
  type?: InvoiceTypeEnum;
}

export interface GetInvoicesResponse {
  count: number;
  data: {
    id: string;
    amount: number;
    code: number;
    created_at: Date;
    customer: {
      id: string;
      title: string;
      code: number;
    };
    date: Date; // تاریخ
    due_date: Date; // تاریخ سررسید
    order?: {
      id: string;
      code: number;
    };
    payment_status: PaymentStatusEnum; // پرداخت شده - پرداخت نشده - پرداخت جزئی
    type: InvoiceTypeEnum; // خرید - بازگشت از خرید - فروش
  }[];
}

export enum PaymentMethodEnum {
  ONLINE = "ONLINE", // آنلاین
  WALLET = "WALLET", // کیف پول
  BANK_RECEIPT = "BANK_RECEIPT", // فیش بانکی
}

export enum CustomerRequestStatusEnum {
  PENDING = "PENDING", // درحال انتظار
  CONVERTED_TO_ORDER = "CONVERTED_TO_ORDER", // تبدیل به سفارش
  PROCESSING = "PROCESSING", // آماده سازی
  APPROVED = "APPROVED", // تایید شده
  REJECTED = "REJECTED", // رد شده
  CANCELLED = "CANCELLED", // لغو شده
  DELIVERED = "DELIVERED", // تحویل شده
}

export interface QueryCustomerRequest {
  page?: number;
  "page-size"?: number;
  payment_method?: PaymentMethodEnum;
  status?: CustomerRequestStatusEnum;
  customer_id?: string;
  code?: number;
  created_at_min?: Date;
  created_at_max?: Date;
}

export interface GetCustomerRequestsResponse {
  count: number;
  data: {
    id: string;
    code: number;
    created_at: Date;
    customer: {
      id: string;
      title: string;
      code: number;
    };
    payment_method: PaymentMethodEnum; // نوع پرداخت: نقدی - آنلاین - کیف پول
    products_count: number; // تعداد محصولات
    representative_name: string; // نماینده
    total_items: number; // تعداد محصولات
    total_price?: number; // قیمت کل
    status: CustomerRequestStatusEnum; // وضعیت: درحال انتظار - تبدیل به سفارش - تایید شده - رد شده
  }[];
}

// get branches info response
export type GetBranchesInfoResponse = Array<{
  id: string;
  name: string;
  locked: boolean;
  warehouses: Array<{
    id: string;
    name: string;
  }>;
}>;

// get warehouses response
export type GetWarehousesResponse = Array<{
  id: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  address: string;
  manager_id: string;
  branch_id: string;
  deleted: false;
  are_prices_updated: boolean;
  code: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  branch: {
    id: string;
    name: string;
    locked: false;
    address: string;
    manager_id: string;
    are_prices_updated: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  };
  manager?: {
    profile: {
      id: string;
      first_name: string;
      last_name: string;
    };
  };
}>;

export interface GetWarehouseResponse {
  id: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  address: string;
  manager_id: string;
  branch_id: string;
  deleted: false;
  are_prices_updated: boolean;
  code: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  branch: {
    id: string;
    name: string;
    locked: false;
    address: string;
    manager_id: string;
    are_prices_updated: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  };
  manager?: {
    id: string;
    profile: {
      id: string;
      first_name: string;
      last_name: string;
    };
  };
}

export interface GetVisitorsResponse {
  count: number;
  data: {
    id: string;
    locked: boolean;
    roles: string[];
    profile_id: string;
    kid: string;
    capillary_sales_lines: {
      id: string;
      locked: boolean;
      title: string;
      line_number: number;
    }[];
    profile: {
      id: string;
      kid: string;
      first_name: string;
      last_name: string;
    };
  }[];
}

export enum TicketStatusEnum {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  REOPENED = "REOPENED",
  RESOLVED = "RESOLVED",
  WAITING_CUSTOMER = "WAITING_CUSTOMER",
  WAITING_SUPPORT = "WAITING_SUPPORT",
}

export enum TicketPriorityEnum {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum TicketLastSenderTypeEnum {
  CUSTOMER_PERSON = "CUSTOMER_PERSON",
  EMPLOYEE = "EMPLOYEE",
}

export interface QueryTicket {
  page?: number;
  "page-size"?: number;
  customer_id?: string;
  person_id?: string;
  creator_person_id?: string;
  employee_id?: string;
  assigned_to_id?: string;
  status?: TicketStatusEnum; // باز - بسته - باز شده - حل شده - در انتظار مشتری - در انتظار پشتیبان
  priority?: TicketPriorityEnum; // کم - متوسط - زیاد - بسیار زیاد
  sort_by?: "last_message" | "updated_at"; // آخرین پیام - آخرین به روز رسانی
  sort_order?: "asc" | "desc"; // صعودی - نزولی
  created_at_min?: Date; // تاریخ ایجاد از
  created_at_max?: Date; // تاریخ ایجاد تا
  deleted?: boolean; // حذف شده
  search?: string; // جستجو
  last_sender_type?: TicketLastSenderTypeEnum; // نوع آخرین ارسال کننده: مشتری - پشتیبان
}

export interface GetTicketsResponse {
  count: number;
  page: number;
  page_size: number;
  data: {
    id: string;
    subject: string;
    status: string;
    priority: string;
    created_at: string;
    updated_at: string;
    customer: {
      id: string;
      title: string;
      code: number;
      type: string;
      category: string;
      capillary_sales_line: {
        id: string;
        line_number: number;
        title: string;
      };
    };
    creator_person: {
      id: string;
      profile: {
        first_name: string;
        last_name: string;
      };
    } | null;
    assigned_to: {
      id: string;
      profile: {
        id: string;
        kid: string;
        first_name: string;
        last_name: string;
      };
    } | null;
    messages_count: number;
    last_message: {
      id: string;
      sender_type: string;
      message: string;
      created_at: string;
      sender_profile: {
        id: string;
        kid: string;
        first_name: string;
        last_name: string;
      };
    } | null;
  }[];
}

export interface GetTicketResponse {
  id: string;
  subject: string;
  status: string;
  priority: string;
  closed_at: Date | null;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  customer: {
    id: string;
    title: string;
    code: number;
    type: CustomerTypeEnum;
    category: CustomerCategoryEnum;
    capillary_sales_line: {
      id: string;
      line_number: number;
      title: string;
    };
  };
  creator_person: {
    id: string;
    profile: {
      id: string;
      kid: string;
      first_name: string;
      last_name: string;
    };
  } | null;
  assigned_to: {
    id: string;
    profile: {
      id: string;
      kid: string;
      first_name: string;
      last_name: string;
    };
  } | null;
  attachments: FileSummary[];
}

export interface GetTicketMessagesResponse {
  count: number;
  data: {
    id: string;
    ticket_id: string;
    sender_type: TicketLastSenderTypeEnum;
    employee_id: string | null;
    person_id: string | null;
    message: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    employee: {
      id: string;
      profile: {
        id: string;
        kid: string;
        first_name: string;
        last_name: string;
      };
    } | null;
    person: {
      id: string;
      profile: {
        id: string;
        kid: string;
        first_name: string;
        last_name: string;
      };
    } | null;
    attachments: FileSummary[];
  }[];
}

export interface CreateTicketRequest {
  subject: string;
  priority: string;
  customer_id: string;
  message: string;
  attachment_ids: string[];
}

export interface ReplyTicketRequest {
  message: string;
  attachment_ids: string[];
}

export interface CreateTicketResponse {
  ticket: {
    id: string;
    subject: string;
    priority: string;
    message: string;
    status: TicketStatusEnum;
    creator_person_id: string;
    customer_id: string;
    created_at: Date;
  };
  message: {
    sender_type: TicketLastSenderTypeEnum;
    message: string;
    created_at: Date;
  };
  attachments: FileSummary[];
}

export interface ReplyTicketResponse {
  ticket: {
    id: string;
    status: TicketStatusEnum;
  };
  message: {
    id: string;
    sender_type: TicketLastSenderTypeEnum;
    employee?: {
      id: string;
      profile: {
        id: string;
        kid: string;
        first_name: string;
        last_name: string;
      };
    } | null;
    person?: {
      id: string;
      profile: {
        id: string;
        kid: string;
        first_name: string;
        last_name: string;
      };
    } | null;
    message: string;
    created_at: Date;
    attachments: FileSummary[];
  };
}

export interface UploadFileResponse {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  thumbnail_url: string;
  created_at: Date;
  updated_at: Date;
}

export interface QueryReturnRequest {
  page?: number;
  "page-size"?: number;
  customer_id?: string;
}

export enum ReturnRequestStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  RECEIVED = "RECEIVED",
}

export enum ReturnRequestReasonEnum {
  NOT_GOOD = "NOT_GOOD",
}

export interface GetReturnRequestsResponse {
  data: {
    id: string;
    status: ReturnRequestStatusEnum;
    reason: ReturnRequestReasonEnum;
    order: {
      id: string;
      code: number;
      address: string;
    };
    request: {
      id: string;
      code: number;
      address: string;
      status: CustomerRequestStatusEnum;
    };
    created_at: Date;
    customer: {
      id: string;
      title: string;
      code: number;
    };
    representative_name: string;
    return_items_count: number;
  }[];
  count: number;
}

export interface GetReturnRequestResponse {
  id: string;
  reason: ReturnRequestReasonEnum;
  description: string | null;
  status: ReturnRequestStatusEnum;
  customer: {
    id: string;
    title: string;
    code: number;
  };
  representative_name: string;
  order: {
    id: string;
    code: number;
    step: OrderStepEnum;
    created_at: Date;
    address: string;
  };
  request: {
    id: string;
    code: number;
    address: string;
    status: CustomerRequestStatusEnum;
    created_at: Date;
    updated_at: Date;
    payment_method: PaymentMethodEnum;
  };
  person: {
    id: string;
    profile: {
      id: string;
      kid: string;
      first_name: string;
      last_name: string;
      mobile: string;
      username: string;
    };
  };
  return_items: {
    request_item_id: string;
    product_id: string;
    product_title: string;
    weight: number;
    online_price: number;
    total_price: number;
  }[];
}

export interface QueryReminder {
  page?: number;
  "page-size"?: number;
  from?: Date;
  to?: Date;
  employee_id?: string;
  seen?: boolean;
}

export interface GetRemindersResponse {
  count: number;
  data: {
    id: string;
    message: string;
    date: Date;
    seen: boolean;
    representative_name: string;
    customer: {
      id: string;
      title: string;
      code: number;
    };
    created_at: Date;
  }[];
}

export interface UpdateReminderRequest {
  seen?: boolean;
}

export interface UpdateReminderResponse {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  branch_id: string;
  customer_id: string;
  order_id: string | null;
  date: Date;
  employee_id: string;
  message: string;
  hour: string | null;
  seen: boolean | null;
}

export interface GetReminderResponse {
  id: string;
  date: Date;
  seen: boolean;
  message: string;
  representative_name: string;
  customer: {
    id: string;
    title: string;
    code: number;
    type: CustomerTypeEnum;
    category: CustomerCategoryEnum;
  };
  created_at: Date;
  order: {
    id: string;
    code: number;
    address: string;
    step: OrderStepEnum;
    created_at: Date;
  } | null;
}

export interface QueryFollowUp {
  page?: number;
  "page-size"?: number;
  employee_id?: string;
  capillary_sales_line_id?: string;
}

export enum FollowUpResultEnum {
  CUSTOMER = "CUSTOMER",
  NOT_CUSTOMER = "NOT_CUSTOMER",
  REQUIRES_FOLLOW_UP = "REQUIRES_FOLLOW_UP",
  NOT_ANSWERED = "NOT_ANSWERED",
}

export interface GetFollowUpsResponse {
  count: number;
  data: {
    id: string;
    description: string;
    attempt: number;
    result: FollowUpResultEnum;
    employee: {
      id: string;
      profile: {
        id: string;
        kid: string;
        first_name: string;
        last_name: string;
      };
    };
    customer: {
      id: string;
      title: string;
      code: number;
    };
    created_at: Date;
    updated_at: Date;
  }[];
}

export enum CheckStatusEnum {
  RECEIVED_BY_ACCOUNTING = "RECEIVED_BY_ACCOUNTING", // دریافت چک توسط حسابداری
  DELIVERED_TO_PROCUREMENT = "DELIVERED_TO_PROCUREMENT", // تحویل به کارپرداز
  DELIVERED_TO_BANK = "DELIVERED_TO_BANK", // تحویل به بانک
  CLEARED = "CLEARED", // پاس شده
  RETURNED = "RETURNED", // برگشت خورده
}

export enum BankEnum {
  // بانک‌های دولتی
  Sepah = "SEPAH",
  Melli = "MELLI",
  Tejarat = "TEJARAT",
  Refah = "REFAH",
  Maskan = "MASKAN",
  Keshavarzi = "KESHAVARZI",
  Sanat_Va_Madan = "SANAT_VA_MADAN",
  Post_Bank = "POST_BANK",
  // بانک‌های خصوصی
  Mellat = "MELLAT",
  Saderat = "SADERAT",
  Parsian = "PARSIAN",
  Pasargad = "PASARGAD",
  Saman = "SAMAN",
  Eghtesad_Novin = "EGHTESAD_NOVIN",
  Dey = "DEY",
  Karafarin = "KARAFARIN",
  Sina = "SINA",
  Sarmayeh = "SARMAYEH",
  Shahr = "SHAHR",
  Ayandeh = "AYANDEH",
  Ansar = "ANSAR",
  Gardeshgari = "GARDESHGARI",
  Hekmat_Iranian = "HEKMAT_IRANIAN",
  Mehregan = "MEHREGAN",
  Resalat = "RESALAT",
  Kosar = "KOSAR",
  Middle_East = "MIDDLE_EAST",
  Iran_Zamin = "IRAN_ZAMIN",
  // موسسات اعتباری
  Mehr_Eghtesad = "MEHR_EGHTESAD",
  Tosee_Taavon = "TOSEE_TAAVON",
  Export_Development_Bank = "EXPORT_DEVELOPMENT_BANK",
  Tosee_Credit = "TOSEE_CREDIT",
  Mehr_Iran = "MEHR_IRAN",
  Noor = "NOOR",
  // سایر
  Other = "OTHER",
}

export interface QueryCheck {
  page?: number;
  "page-size"?: number;
  check_date_min?: Date;
  check_date_max?: Date;
  amount_min?: number;
  amount_max?: number;
  status?: CheckStatusEnum;
}

export interface GetChecksResponse {
  count: number;
  data: {
    id: string;
    check_date: string; // ISO date string from API
    check_number: number;
    account_number: string;
    amount: number;
    issuer_bank: BankEnum;
    destination_bank: BankEnum | null;
    status: CheckStatusEnum;
    created_at: string; // ISO date string from API
    updated_at: string; // ISO date string from API
    deleted_at: string | null; // ISO date string from API
  }[];
}

export interface GetCheckResponse {
  id: string;
  check_date: string; // ISO date string from API
  check_number: number;
  account_number: string;
  amount: number;
  issuer_bank: BankEnum;
  description: string | null;
  destination_bank: BankEnum | null;
  status: CheckStatusEnum;
  created_at: string; // ISO date string from API
  updated_at: string; // ISO date string from API
  deleted_at: string | null; // ISO date string from API
  image: FileSummary | null;
  customer: {
    id: string;
    title: string;
    code: number;
  } | null;
}

export interface QueryProduce {
  page?: number;
  "page-size"?: number;
  code?: number;
  box_weight?: number;
  lost?: number;
  waste?: number;
  product_id?: string;
  production_date_min?: Date;
  production_date_max?: Date;
}

export interface GetProducesResponse {
  count: number;
  data: {
    id: string;
    code: number;
    lost: number;
    waste: number;
    box_weight: number;
    production_date: string; // ISO date string from API
    input_product: {
      product_id: string;
      product_title: string;
      net_weight: number;
      gross_weight: number;
      sec_unit_amount: number;
    };
    output_products: {
      product_id: string;
      product_title: string;
      net_weight: number;
      gross_weight: number;
      sec_unit_amount: number;
    }[];
    created_at: string; // ISO date string from API
    updated_at: string; // ISO date string from API
    deleted_at: string | null; // ISO date string from API
  }[];
}

export interface GetProduceResponse {
  id: string;
  code: number;
  lost: number;
  waste: number;
  box_weight: number;
  production_date: string; // ISO date string from API
  input_product: {
    product_id: string;
    product_title: string;
    product_code: number;
    net_weight: number;
    gross_weight: number;
    sec_unit_amount: number;
  };
  output_products: {
    product_id: string;
    product_title: string;
    product_code: number;
    net_weight: number;
    gross_weight: number;
    sec_unit_amount: number;
  }[];
  created_at: string; // ISO date string from API
  updated_at: string; // ISO date string from API
  deleted_at: string | null; // ISO date string from API
}

export enum TemperatureTypeEnum {
  COLD = "COLD", // سرد
  HOT = "HOT", // گرم
}

export type GetCategoriesResponse = Array<{
  id: string;
  title: string;
  parent_id: string | null;
  warehouse_id: string;
  deleted: boolean;
  code: number;
  priority: number;
  temperature_type: TemperatureTypeEnum; // نوع
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  _count: {
    products: number;
  };
  children: GetCategoriesResponse;
}>;

export interface GetCategoryResponse {
  id: string;
  title: string;
  parent_id: string | null;
  warehouse_id: string;
  deleted: boolean;
  code: number;
  priority: number;
  temperature_type: TemperatureTypeEnum;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  _count: {
    products: number;
  };
  children: GetCategoryResponse[];
  parent: GetCategoryResponse | null;
  image: FileSummary | null;
}

export interface UpdateCategoryRequest {
  title?: string;
  parent_id?: string | null;
  priority?: number;
  temperature_type?: TemperatureTypeEnum;
  image_id?: string | null;
}

export interface UpdateCategoryResponse {
  id: string;
  title: string;
  parent_id: string | null;
  warehouse_id: string;
  deleted: boolean;
  code: number;
  priority: number;
  temperature_type: TemperatureTypeEnum;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  _count: {
    products: number;
  };
  children: GetCategoryResponse[];
  parent: GetCategoryResponse | null;
  image: FileSummary | null;
}

export type GetProductsResponse = Array<{
  id: string;
  title: string;
  code: number;
  category_ids: string[];
  categories: {
    id: string;
    title: string;
    code: number;
    products_count: number;
  }[];
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  hp_code: number | null;
  hp_title: string | null;
  is_online: boolean;
  is_special: boolean;
  net_weight: number;
  gross_weight: number;
  online_price: number;
  retail_price: number;
  wholesale_price: number;
}>;

export enum SettlementMethodEnum {
  CASH = "CASH",
  CHEQUE = "CHEQUE",
  CREDIT = "CREDIT",
}

export interface GetProductResponse {
  id: string;
  title: string;
  code: number;
  category_ids: string[];
  categories: {
    id: string;
    title: string;
    code: number;
    products_count: number;
  }[];
  description: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  hp_code: number | null;
  hp_title: string | null;
  invoice_title: string | null;
  gross_weight: number;
  net_weight: number;
  online_price: number;
  retail_price: number;
  wholesale_price: number;
  is_online: boolean;
  is_special: boolean;
  images: FileSummary[];
  locked: boolean;
  purchase_price: number;
  settlement_methods: SettlementMethodEnum[];
}

export interface UpdateProductRequest {
  title?: string;
  description?: string;
  hp_code?: number;
  hp_title?: string;
  invoice_title?: string;
  settlement_methods?: SettlementMethodEnum[];
  is_online?: boolean;
  is_special?: boolean;
  image_ids?: string[];
}

export interface UpdateProductResponse {
  id: string;
  title: string;
  code: number;
  category_ids: string[];
  categories: {
    id: string;
    title: string;
    code: number;
    products_count: number;
  }[];
  description: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  hp_code: number | null;
  hp_title: string | null;
  invoice_title: string | null;
  gross_weight: number;
  net_weight: number;
  online_price: number;
  retail_price: number;
  wholesale_price: number;
  is_online: boolean;
  is_special: boolean;
  images: FileSummary[];
  locked: boolean;
  purchase_price: number;
  settlement_methods: SettlementMethodEnum[];
}

export enum ProductKardexType {
  CargoDispatch = "CARGO_DISPATCH", // مرسوله ارسالی
  CargoReturn = "CARGO_RETURN", // مرجوعی
  Receiving = "RECEIVING", // ورودی انبار
  Dispatching = "DISPATCHING", // خروجی انبار
  AdvanceInventory = "ADVANCE_INVENTORY", // موجودی قبل
  ProduceInput = "PRODUCE_INPUT", // استفاده شده در تولید
  ProduceOutput = "PRODUCE_OUTPUT", // تولید شده
}

export interface QueryProductKardex {
  product_id: string;
  from?: Date;
  to?: Date;
}

export interface GetProductKardexResponse {
  product_id: string;
  product: {
    id: string;
    title: string;
    net_weight: number;
    warehouse_id: string;
    code: number;
  };
  date: Date;
  warehouse_id: string;
  items: {
    net_weight: number;
    remaining: number;
    type: ProductKardexType;
    code: number;
    date: Date;
    fee: number;
    amount: number;
    customer: {
      id: string;
      code: number;
      title: string;
    } | null;
    import: number | null;
    export: number | null;
  }[];
}

export enum TruckTypeEnum {
  NISSAN = "NISSAN", // نیسان
  TRUCK = "TRUCK", // کامیون
  CAMIONET = "CAMIONET", // کامیونت
}

export interface GetTrucksResponse {
  count: number;
  data: {
    id: string;
    license_plate: string;
    type: TruckTypeEnum;
    capacity: number;
    insurance_exp_date: Date;
    body_insurance_exp_date: Date;
    code: number;
    created_at: Date;
    driver: {
      id: string;
      kid: string;
      first_name: string;
      last_name: string;
    };
  }[];
}

export interface GetTruckResponse {
  id: string;
  license_plate: string;
  type: string;
  capacity: number;
  insurance_exp_date: Date;
  body_insurance_exp_date: Date;
  code: number;
  created_at: Date;
  updated_at: Date;
  driver: {
    id: string;
    kid: string;
    first_name: string;
    last_name: string;
  };
}

export enum ReceivingSourceEnum {
  Purchased = "PURCHASED", // خرید
  Returned = "RETURNED", // برگشت از خرید
  Inventory = "INVENTORY", // انبار گردانی
}

export interface QueryReceiving {
  page?: number;
  "page-size"?: number;
  product_id?: string;
  customer_id?: string;
  source?: ReceivingSourceEnum;
  from?: Date;
  to?: Date;
  code?: number;
}

export interface GetReceivingsResponse {
  count: number;
  data: {
    id: string;
    code: number;
    date: Date;
    created_at: Date;
    license_plate: string;
    driver_name: string;
    source: ReceivingSourceEnum;
    customer: {
      id: string;
      title: string;
      code: number;
      type: CustomerTypeEnum;
      category: CustomerCategoryEnum;
    } | null;
    employee: {
      id: string;
      profile: {
        id: string;
        first_name: string;
        last_name: string;
      };
    };
    products_count: number;
  }[];
}

export interface GetReceivingResponse {
  id: string;
  code: number;
  date: Date;
  created_at: Date;
  license_plate: string;
  driver_name: string;
  source: ReceivingSourceEnum;
  customer: {
    id: string;
    title: string;
    code: number;
    type: CustomerTypeEnum;
    category: CustomerCategoryEnum;
  } | null;
  employee: {
    id: string;
    profile: {
      id: string;
      first_name: string;
      last_name: string;
    };
  };
  products_count: number;
  products: {
    net_weight: number;
    gross_weight: number;
    sec_unit_amount: number;
    purchase_price: number;
    origin_net_weight: number;
    origin_gross_weight: number;
    product_title: string;
    product_id: string;
  }[];
  invoices: {
    id: string;
    driver_id: string | null;
    type: InvoiceTypeEnum;
    warehouse_id: string;
    deleted: boolean;
    code: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    description: string | null;
    hp_code: number | null;
    hp_title: string | null;
    seller_id: string;
    customer_id: string;
    amount: number;
    wallet_id: string;
    order_id: string | null;
    date: Date | null;
    payment_status: PaymentStatusEnum;
    due_date: Date;
    cargo_id: string | null;
    dispatching_id: string | null;
    receiving_id: string | null;
  }[];
  waybill: FileSummary | null;
  veterinary: FileSummary | null;
  origin_scale: FileSummary | null;
  destination_scale: FileSummary | null;
  other_files: FileSummary[];
}

export enum DispatchingSourceEnum {
  RETURN_FROM_RECEIVING = "RETURN_FROM_RECEIVING", // برگشت از ورودی انبار
  MANUAL = "MANUAL", // دستی
  AUTOMATIC_FROM_CARGO = "AUTOMATIC_FROM_CARGO", // اتوماتیک با مرسوله ارسالی
}

export interface QueryDispatching {
  page?: number;
  "page-size"?: number;
}

export interface GetDispatchingsResponse {
  count: number;
  data: {
    id: string;
    code: number;
    date: Date;
    source: DispatchingSourceEnum;
    created_at: Date;
    license_plate: string | null;
    driver_name: string | null;
    employee: {
      id: string;
      profile: {
        id: string;
        first_name: string;
        last_name: string;
      };
    };
    products_count: number;
  }[];
}

export interface GetDispatchingResponse {
  id: string;
  code: number;
  date: Date;
  created_at: Date;
  license_plate: string | null;
  driver_name: string | null;
  source: DispatchingSourceEnum;
  employee: {
    id: string;
    profile: {
      id: string;
      first_name: string;
      last_name: string;
    };
  };
  products_count: number;
  products: {
    product_id: string;
    product_title: string;
    net_weight: number;
    gross_weight: number;
    sec_unit_amount: number;
    box_weight: number;
    purchase_price: number;
  }[];
}

export interface QueryWallet {
  page?: number;
  "page-size"?: number;
}

export interface GetWalletsResponse {
  count: number;
  data: {
    id: string;
    customer_id: string;
    balance: number;
    credit_cap: number;
    description: string | null;
    initial_balance: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    customer: {
      id: string;
      code: number;
      title: string;
      type: CustomerTypeEnum;
      category: CustomerCategoryEnum;
      capillary_sales_line: {
        id: string;
        line_number: number;
        title: string;
      } | null;
    };
  }[];
}

export interface GetWalletResponse {
  id: string;
  description: string | null;
  customer_id: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  balance: number; // موجودی حسابداری
  credit_cap: number; // حد اعتبار
  initial_balance: number | null; // موجودی اولیه
  customer: {
    id: string;
    code: number;
    title: string;
    type: CustomerTypeEnum;
    category: CustomerCategoryEnum;
    capillary_sales_line: {
      id: string;
      line_number: number;
    } | null;
  };
  actual_balance: number; // موجودی واقعی
  actual_credit: number; // اعتبار واقعی
  pending_cheques_total: number; // مجموع چک‌های در انتظار
  pending_cheques_count: number; // تعداد چک‌های در انتظار
}

export interface GetCustomerRequestResponse {
  id: string;
  code: number;
  status: CustomerRequestStatusEnum;
  payment_method: PaymentMethodEnum;
  total_price: number;
  created_at: Date;
  description: string | null;
  freight_price: number; // هزینه باربری
  address: string;
  customer: {
    id: string;
    code: number;
    title: string;
    phone: string;
    address: string;
  };
  request_items: {
    product_id: string;
    product_title: string;
    product_code: number;
    weight: number;
    online_price: number;
    total_price: number;
    images: FileSummary[];
  }[];
  person: {
    id: string;
    profile: {
      id: string;
      kid: string;
      first_name: string;
      last_name: string;
      mobile: string;
      username: string;
    };
  };
  representative_name: string;
  orders:
    | {
        id: string;
        code: number;
        step: OrderStepEnum;
        created_at: Date;
        delivery_method: DeliveryMethodEnum;
        payment_status: PaymentStatusEnum;
        address: string;
        ordered_basket: {
          product_id: string;
          product_title: string;
          product_code: number;
          weight: number;
          online_price: number;
          price: number;
          fulfilled_weight: number;
          fulfilled: boolean;
          returned_weight: number;
          sec_unit_amount: number;
          cancelled_weight: number;
          inventory_net_weight: number;
        }[];
        invoices: {
          id: string;
          code: number;
          amount: number;
          date: Date;
          description: string | null;
          payment_status: PaymentStatusEnum;
        }[];
      }[]
    | null;
}

export enum OrderChangeTypeEnum {
  CREATED = "CREATED", // ایجاد سفارش
  STEP_CHANGED = "STEP_CHANGED", // تغییر مرحله
  PAYMENT_STATUS_CHANGED = "PAYMENT_STATUS_CHANGED", // تغییر وضعیت پرداخت
  FULFILLED_STATUS_CHANGED = "FULFILLED_STATUS_CHANGED", // تغییر وضعیت تحویل
  ARCHIVED_STATUS_CHANGED = "ARCHIVED_STATUS_CHANGED", // تغییر وضعیت آرشیو
  DELIVERY_DATE_CHANGED = "DELIVERY_DATE_CHANGED", // تغییر تاریخ تحویل
  DELIVERY_METHOD_CHANGED = "DELIVERY_METHOD_CHANGED", // تغییر روش تحویل
  SELLER_CHANGED = "SELLER_CHANGED", // تغییر فروشنده
  VISITOR_CHANGED = "VISITOR_CHANGED", // تغییر نماینده
  WAREHOUSE_CHANGED = "WAREHOUSE_CHANGED", // تغییر انبار
  PRODUCTS_CHANGED = "PRODUCTS_CHANGED", // تغییر محصولات
  CUSTOMER_CHANGED = "CUSTOMER_CHANGED", // تغییر مشتری
  DELETED = "DELETED", // حذف سفارش
  RESTORED = "RESTORED", // بازیابی سفارش
}

export interface QueryOrderHistory {
  page?: number;
  "page-size"?: number;
}

export interface GetOrdersHistoryResponse {
  count: number;
  data: {
    id: string;
    order_id: string;
    old_order: {
      id: string;
      code: number;
      step: OrderStepEnum;
      payment_status: PaymentStatusEnum;
      created_at: Date;
      updated_at: Date;
      delivery_date: Date;
    } | null;
    new_order: {
      id: string;
      code: number;
      step: OrderStepEnum;
      payment_status: PaymentStatusEnum;
      created_at: Date;
      updated_at: Date;
      delivery_date: Date;
    };
    order: {
      id: string;
      code: number;
      step: OrderStepEnum;
      payment_status: PaymentStatusEnum;
      created_at: Date;
      updated_at: Date;
      delivery_date: Date;
    };
    payment_status_before: PaymentStatusEnum;
    payment_status_after: PaymentStatusEnum;
    step_before: OrderStepEnum;
    step_after: OrderStepEnum;
    by_system: boolean;
    created_at: Date;
    updated_at: Date;
    change_type: OrderChangeTypeEnum;
    delivery_date_before: Date;
    delivery_date_after: Date;
    delivery_method_before: DeliveryMethodEnum;
    delivery_method_after: DeliveryMethodEnum;
  }[];
}

export interface GetOrderHistoryResponse {
  id: string;
  order_id: string;
  old_order: {
    id: string;
    code: number;
    step: OrderStepEnum;
    bought: boolean;
    cargos: any[];
    ordered_basket: {
      id: "ef2ee6a7-ee3e-45ad-80f8-dde0b8439550";
      price: 7250000;
      weight: 20;
      product: {
        id: "96267434-7eae-483a-9201-de2582730904";
        code: 1006;
        title: "سردست گوسفند گرم";
        locked: false;
        deleted: false;
        hp_code: 10007;
        hp_title: "سردست گوسفند گرم";
        is_online: true;
        box_weight: 0;
        created_at: "2025-06-01T11:21:50.217Z";
        deleted_at: null;
        is_special: true;
        net_weight: -20;
        updated_at: "2025-12-04T11:47:34.765Z";
        description: "سردست گوسفند گرم بخش جلویی لاشه است که ترکیبی از گوشت لطیف، چربی متعادل و استخوان دارد و به‌خاطر طعم قوی و آب‌دار بودن معروف است. این قسمت برای خورشت، آبگوشت و پخت‌های طولانی عالی و از نظر قیمت هم انتخاب اقتصادی‌تر و خوش‌عطرتر نسبت به ران محسوب می‌شود.";
        gross_weight: -25;
        online_price: 7250000;
        retail_price: 7000000;
        warehouse_id: "cca265b7-d095-4897-a145-fd4a52ff927f";
        invoice_title: null;
        purchase_price: 1;
        sec_unit_amount: -5;
        wholesale_price: 6500000;
        origin_net_weight: 0;
        settlement_methods: ["CASH"];
        origin_gross_weight: 0;
      };
      order_id: "bb003f93-51eb-446c-bf99-187cdab7f3bd";
      fulfilled: true;
      product_id: "96267434-7eae-483a-9201-de2582730904";
      online_price: 7250000;
      retail_price: 7000000;
      returned_weight: 0;
      sec_unit_amount: null;
      wholesale_price: 6500000;
      cancelled_weight: 0;
      fulfilled_weight: 20;
      inventory_net_weight: 0;
    }[];
    payment_status: PaymentStatusEnum;
    delivery_method: DeliveryMethodEnum;
    hp_invoice_code: number;
    in_person_order: boolean;
    consumption_time: Date | null;
    order_creator_id: string;
    customer_request_id: string | null;
    not_purchased_reason: NotPurchasedReasonEnum | null;
    address: string;
    customer: {
      id: string;
      title: string;
      code: number;
      type: CustomerTypeEnum;
      phone: string;
      address: string;
      category: CustomerCategoryEnum;
    };
    person: {
      id: string;
      kid: string;
      title: string;
    } | null;
    seller: {
      id: string;
      kid: string;
    } | null;
    warehouse: {
      id: string;
      code: number;
      name: string;
      address: string;
    } | null;
    created_at: Date;
    updated_at: Date;
    delivery_date: Date | null;
  } | null;
  new_order: {
    id: string;
    code: number;
    step: OrderStepEnum;
    bought: boolean;
    address: string;
    customer: {
      id: string;
      title: string;
      code: number;
      type: CustomerTypeEnum;
      phone: string;
      address: string;
      category: CustomerCategoryEnum;
    };
    person: {
      id: string;
      kid: string;
      title: string;
    } | null;
    seller: {
      id: string;
      kid: string;
    } | null;
    warehouse: {
      id: string;
      code: number;
      name: string;
      address: string;
    } | null;
    created_at: Date;
    updated_at: Date;
    delivery_date: Date | null;
    cargos: any[];
    ordered_basket:
      | {
          id: string;
          price: number;
          weight: number;
          product: {
            id: string;
            code: number;
            title: string;
            locked: boolean;
            deleted: boolean;
            hp_code: number;
            hp_title: string;
            is_online: boolean;
            box_weight: number;
            created_at: Date;
            deleted_at: null;
            is_special: boolean;
            net_weight: number;
            updated_at: Date;
            description: string;
            gross_weight: number;
            online_price: number;
            retail_price: number;
            warehouse_id: string;
            invoice_title: string | null;
            purchase_price: number;
            sec_unit_amount: number | null;
            wholesale_price: number;
            origin_net_weight: number;
            settlement_methods: SettlementMethodEnum[];
            origin_gross_weight: number;
          };
          order_id: string;
          fulfilled: boolean;
          product_id: string;
          online_price: number;
          retail_price: number;
          returned_weight: number;
          sec_unit_amount: number | null;
          wholesale_price: number;
          cancelled_weight: number;
          fulfilled_weight: number;
          inventory_net_weight: number;
        }[]
      | null;
    payment_status: PaymentStatusEnum;
    delivery_method: DeliveryMethodEnum;
    hp_invoice_code: number;
    in_person_order: boolean;
    consumption_time: Date | null;
    order_creator_id: string;
    customer_request_id: string | null;
    not_purchased_reason: NotPurchasedReasonEnum | null;
  };
  employee_id: string;
  by_system: boolean;
  change_type: OrderChangeTypeEnum;
  step_before: OrderStepEnum;
  step_after: OrderStepEnum;
  payment_status_before: PaymentStatusEnum;
  payment_status_after: PaymentStatusEnum;
  fulfilled_before: boolean;
  fulfilled_after: boolean;
  archived_before: boolean;
  archived_after: boolean;
  delivery_date_before: Date | null;
  delivery_date_after: Date | null;
  delivery_method_before: DeliveryMethodEnum;
  delivery_method_after: DeliveryMethodEnum;
  seller_id_before: string;
  seller_id_after: string;
  deleted_changed: boolean;
  reason: string;
  ip_address: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  order: {
    id: string;
    code: number;
    customer: {
      id: string;
      title: string;
    };
    person: {
      id: string;
      profile: {
        id: string;
        kid: string;
        first_name: string;
        last_name: string;
      };
    };
    ordered_basket:
      | {
          id: string;
          order_id: string;
          product_id: string;
          price: number;
          weight: number;
          retail_price: number;
          wholesale_price: number;
          online_price: number;
          inventory_net_weight: number;
          fulfilled_weight: number;
          cancelled_weight: number;
          returned_weight: number;
          fulfilled: boolean;
          sec_unit_amount: number | null;
          product: {
            id: string;
            title: string;
          };
        }[]
      | null;
    failed_basket: [];
  };
  employee: {
    id: string;
    profile: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

export enum GenderEnum {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export interface QueryProfile {
  page?: number;
  "page-size"?: number;
  enabled?: boolean;
  mobile?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  gender?: GenderEnum;
  created_at_min?: Date;
  created_at_max?: Date;
}

export interface CreateProfileDto {
  first_name: string;
  last_name: string;
  email: string;
  gender: GenderEnum;
  mobile: string;
  groups: string[];
  enabled: boolean;
  birth_date?: string;
  national_code?: string;
  username?: string;
  capillary_sales_line_ids?: string[];
}

export interface GetGroupsResponse {
  data: {
    id: string;
    name: string;
    path: string;
    attributes: {
      client: string[];
    };
    clientRoles: Record<string, string[]>;
    roles: { id: string; name: string }[];
    clientId: string;
  }[];
  success: boolean;
  msg: string;
  count: number;
}

export interface UpdateEmployeeProfileRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  gender?: GenderEnum;
  mobile?: string;
  groups?: string[];
  enabled?: boolean;
  birth_date?: string;
  national_code?: string;
  username?: string;
  capillary_sales_line_ids?: string[];
}

export interface GetProfilesResponse {
  data: {
    id: string;
    first_name: string;
    last_name: string;
    enabled: boolean;
    mobile: string;
    username: string;
  }[];
  count: number;
  msg: string;
  success: boolean;
}

export interface GetProfileResponse {
  count: number;
  data: {
    id: string;
    first_name: string;
    last_name: string;
    enabled: boolean;
    mobile: string;
    mobile_prefix: string;
    mobile_country_code: string;
    mobile_verified: boolean;
    username: string;
    birth_date: Date;
    national_code: string;
    gender: GenderEnum;
    groups: {
      id: string;
      name: string;
      path: string;
    }[];
    person: {
      id: string;
      title: string;
    };
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    clients: string[];
    roles: {
      id: string;
      name: string;
      client_id: string;
    }[];
    third_party_provider: string | null;
    is_verified_via_third_party: boolean | null;
  }[];
  msg: string;
  success: boolean;
}

export interface GetEmployeeProfileResponse {
  count: number;
  data: {
    id: string;
    first_name: string;
    last_name: string;
    enabled: boolean;
    mobile: string;
    mobile_prefix: string;
    mobile_country_code: string;
    mobile_verified: boolean;
    username: string;
    birth_date: Date;
    national_code: string;
    gender: GenderEnum;
    groups: {
      id: string;
      name: string;
      path: string;
    }[];
    employee: {
      id: string;
      created_at: Date;
      kid: string;
      locked: boolean;
      roles: string[];
      updated_at: Date;
      deleted_at: Date | null;
      deleted: boolean;
    };
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    clients: string[];
    roles: {
      id: string;
      name: string;
      client_id: string;
    }[];
    third_party_provider: string | null;
    is_verified_via_third_party: boolean | null;
  }[];
  msg: string;
  success: boolean;
}

export interface GetWithdrawalRequestsResponse {
  data: {
    id: string;
    created_at: Date;
    status: WithdrawalRequestStatusEnum;
    customer: {
      id: string;
      title: string;
      code: number;
    };
    amount: number;
  }[];
  count: number;
}

export enum WithdrawalRequestStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REVIEWING = "REVIEWING",
  PROCESSING = "PROCESSING",
}

export interface GetWithdrawalRequestDetailsResponse {
  id: string;
  created_at: Date;
  status: WithdrawalRequestStatusEnum;
  customer: {
    id: string;
    title: string;
    code: number;
  };
  amount: number;
  representative_name: string;
  person: {
    id: string;
    profile: {
      id: string;
      kid: string;
      first_name: string;
      last_name: string;
      mobile: string;
      username: string;
    };
  };
  requested_at: Date;
  reviewed_at: Date;
  reject_reason: string;
  bank_card: {
    id: string;
    is_verified: boolean;
    bank_name: string;
  };
  reviewed_by_employee: {
    id: string;
    profile: {
      id: string;
      kid: string;
      first_name: string;
      last_name: string;
      mobile: string;
      username: string;
    };
  };
  processed_by_employee: {
    id: string;
    profile: {
      id: string;
      kid: string;
      first_name: string;
      last_name: string;
      mobile: string;
      username: string;
    };
  };
}

export interface QueryWithdrawalRequestDto {
  page?: number;
  "page-size"?: number;
  customer_id?: string;
  status?: WithdrawalRequestStatusEnum;
}

export enum CreatedTypeEnum {
  CUSTOMER = "CUSTOMER",
  EMPLOYEE = "EMPLOYEE",
}

export interface QueryBankCardsDto {
  page?: number;
  "page-size"?: number;
  person_id?: string;
  created_type?: CreatedTypeEnum;
  employee_id?: string;
  customer_id?: string;
}

export interface BankCardsResponse {
  data: {
    id: string;
    is_verified: boolean;
    bank_name: string;
    iban: string;
    masked_pan: string;
    created_at: Date;
    person: {
      id: string;
      profile: {
        id: string;
        kid: string;
        first_name: string;
        last_name: string;
        mobile: string;
        username: string;
      };
    } | null;
    account_number: string;
    created_type: CreatedTypeEnum;
    employee: {
      id: string;
      profile: {
        id: string;
        kid: string;
        first_name: string;
        last_name: string;
        mobile: string;
        username: string;
      };
    } | null;
    customer: {
      id: string;
      title: string;
      code: number;
    } | null;
  }[];
  count: number;
}

export interface BankCardDetailsResponse {
  id: string;
  is_verified: boolean;
  bank_name: string;
  iban: string;
  masked_pan: string;
  created_at: Date;
  person: {
    id: string;
    profile: {
      id: string;
      kid: string;
      first_name: string;
      last_name: string;
      mobile: string;
      username: string;
    };
  } | null;
  account_number: string;
  created_type: CreatedTypeEnum;
  employee: {
    id: string;
    profile: {
      id: string;
      kid: string;
      first_name: string;
      last_name: string;
      mobile: string;
      username: string;
    };
  } | null;
  customer: {
    id: string;
    title: string;
    code: number;
  } | null;
}

export enum InventoryAdjustmentTypeEnum {
  SURPLUS = "SURPLUS",
  SHORTAGE = "SHORTAGE",
}

export enum InventoryAdjustmentReasonEnum {
  SCALE_CALIBRATION_ERROR = "SCALE_CALIBRATION_ERROR",
  WEIGHING_ERROR = "WEIGHING_ERROR",
  DATA_ENTRY_ERROR = "DATA_ENTRY_ERROR",
  OPERATIONAL_HANDLING_ERROR = "OPERATIONAL_HANDLING_ERROR",
  NATURAL_SHRINKAGE = "NATURAL_SHRINKAGE",
  SPOilage = "SPOILAGE",
  LOSS = "LOSS",
  THEFT = "THEFT",
  SYSTEM_MISCOUNT = "SYSTEM_MISCOUNT",
  DUPLICATE_RECORD = "DUPLICATE_RECORD",
  STOCKTAKING_ADJUSTMENT = "STOCKTAKING_ADJUSTMENT",
  MANAGEMENT_CORRECTION = "MANAGEMENT_CORRECTION",
  OTHER = "OTHER",
}
export enum InventoryAdjustmentStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface GetInventoryAdjustmentListResponse {
  data: {
    items_count: number;
    type: InventoryAdjustmentTypeEnum;
    date: Date;
    reason: InventoryAdjustmentReasonEnum;
    id: string;
    created_at: Date;
    code: number;
    status: InventoryAdjustmentStatusEnum;
  }[];
  count: number;
}

export interface GetInventoryAdjustmentDetailsResponse {
  id: string;
  type: InventoryAdjustmentTypeEnum;
  date: Date;
  reason: InventoryAdjustmentReasonEnum;
  code: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: Date;
  items: {
    product_id: string;
    product_title: string;
    product_code: number;
    expected_net_weight: number;
    expected_gross_weight: number;
    diff_net_weight: number;
    actual_net_weight: number;
    actual_gross_weight: number;
    diff_gross_weight: number;
    actual_sec_unit_amount: number;
    diff_sec_unit_amount: number;
    expected_sec_unit_amount: number;
  }[];
  created_by: {
    id: string;
    profile: {
      id: string;
      first_name: string;
      last_name: string;
    };
  };
  approved_at: Date | null;
  approved_by: {
    id: string;
    profile: {
      id: string;
      first_name: string;
      last_name: string;
    };
  } | null;
  warehouse: {
    id: string;
    name: string;
  };
  description: string | null;
  reference: string | null;
  updated_at: Date;
  items_count: number;
}

export interface QueryInventoryAdjustmentDto {
  page?: number;
  "page-size"?: number;
  warehouse_id?: string;
  date?: Date;
  reason?: InventoryAdjustmentReasonEnum;
  status?: InventoryAdjustmentStatusEnum;
}
