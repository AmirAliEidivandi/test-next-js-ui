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

export interface GetCustomersResponse {
  count: number;
  data: Array<{
    id: string;
    title: string;
    type: "PERSONAL" | "CORPORATE";
    category:
      | "RESTAURANT"
      | "HOTEL"
      | "CHAIN_STORE"
      | "GOVERNMENTAL"
      | "FAST_FOOD"
      | "CHARITY"
      | "BUTCHER"
      | "WHOLESALER"
      | "FELLOW"
      | "CATERING"
      | "KEBAB"
      | "DISTRIBUTOR"
      | "HOSPITAL"
      | "FACTORY";
    is_property_owner: boolean;
    did_we_contact: boolean;
    phone: string;
    address: string;
    age: number;
    credibility_by_seller:
      | "NOT_EVALUATED"
      | "LOW"
      | "MEDIUM"
      | "TRUSTED"
      | "FULLY_TRUSTED";
    credibility_by_sales_manager:
      | "NOT_EVALUATED"
      | "LOW"
      | "MEDIUM"
      | "TRUSTED"
      | "FULLY_TRUSTED";
    behavior_tags: Array<
      "MANNERED" | "POLITE" | "PATIENCE" | "ANGRY" | "HASTY" | "RUDE"
    >;
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
  }>;
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
    type: "PERSONAL" | "CORPORATE";
    title: string;
    category:
      | "RESTAURANT"
      | "HOTEL"
      | "CHAIN_STORE"
      | "GOVERNMENTAL"
      | "FAST_FOOD"
      | "CHARITY"
      | "BUTCHER"
      | "WHOLESALER"
      | "FELLOW"
      | "CATERING"
      | "KEBAB"
      | "DISTRIBUTOR"
      | "HOSPITAL"
      | "FACTORY";
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
  }[];
}

export interface GetCustomerReportResponse {
  count: number;
  data: {
    id: string;
    title: string;
    type: "PERSONAL" | "CORPORATE";
    category:
      | "RESTAURANT"
      | "HOTEL"
      | "CHAIN_STORE"
      | "GOVERNMENTAL"
      | "FAST_FOOD"
      | "CHARITY"
      | "BUTCHER"
      | "WHOLESALER"
      | "FELLOW"
      | "CATERING"
      | "KEBAB"
      | "DISTRIBUTOR"
      | "HOSPITAL"
      | "FACTORY";
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
    last_order: {
      id: string;
      code: number;
      payment_status: "PAID" | "NOT_PAID" | "PARTIALLY_PAID"; // پرداخت شده - پرداخت نشده - پرداخت جزئی
      step:
        | "SELLER" // فروشنده
        | "SALES_MANAGER" // مدیر فروش
        | "PROCESSING" // آماده سازی
        | "INVENTORY" // انبار
        | "ACCOUNTING" // حسابداری
        | "CARGO" // مرسوله
        | "PARTIALLY_DELIVERED" // تحویل جزئی
        | "DELIVERED" // تحویل شده
        | "RETURNED" // مرجوعی کامل
        | "PARTIALLY_RETURNED"; // مرجوعی جزئی
      created_at: Date;
      total_amount: number;
    };
  }[];
}

export interface QueryOrder {
  page?: number;
  "page-size"?: number;
  code?: number;
  hp_invoice_code?: number;
  step?:
    | "SELLER"
    | "SALES_MANAGER"
    | "PROCESSING"
    | "INVENTORY"
    | "ACCOUNTING"
    | "CARGO"
    | "PARTIALLY_DELIVERED"
    | "DELIVERED"
    | "RETURNED"
    | "PARTIALLY_RETURNED"; // مرحله
  seller_id?: string;
  archived?: boolean; // وضعیت آرشیو: آرشیو شده - آرشیو نشده
  created_date_min?: Date;
  created_date_max?: Date;
  capillary_sales_line_id?: string;
  bought?: boolean;
  answered?: boolean; // وضعیت تماس: جواب داد - جواب نداد
  new_customer?: boolean; // وضعیت مشتری: مشتری جدید - مشتری قدیمی
  delivery_method?:
    | "FREE_OUR_TRUCK"
    | "FREE_OTHER_SERVICES"
    | "PAID"
    | "AT_INVENTORY"; // روش تحویل
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
    payment_status: "PAID" | "NOT_PAID" | "PARTIALLY_PAID"; // پرداخت شده - پرداخت نشده - پرداخت جزئی
    hp_invoice_code: number; // کد حسابداری فاکتور
    step:
      | "SELLER" // فروشنده
      | "SALES_MANAGER" // مدیر فروش
      | "PROCESSING" // آماده سازی
      | "INVENTORY" // انبار
      | "ACCOUNTING" // حسابداری
      | "CARGO" // مرسوله
      | "PARTIALLY_DELIVERED" // تحویل جزئی
      | "DELIVERED" // تحویل شده
      | "RETURNED" // مرجوعی کامل
      | "PARTIALLY_RETURNED"; // مرجوعی جزئی
    created_at: Date;
    delivery_method:
      | "FREE_OUR_TRUCK"
      | "FREE_OTHER_SERVICES"
      | "PAID"
      | "AT_INVENTORY"; // رایگان با ماشین شرکت - رایگان با سرویس خارجی - ارسال با هزینه مشتری - تحویل درب انبار
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
    representative_name: string;
    day_index: number; // 0 - 1 - 2 - 3 - 4 - 5 - 6: شنبه - یکشنبه - دوشنبه - سه شنبه - چهارشنبه - پنجشنبه - جمعه
  }[];
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
  payment_status?: "PAID" | "NOT_PAID" | "PARTIALLY_PAID";
  type?: "PURCHASE" | "RETURN_FROM_PURCHASE" | "SELL";
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
    payment_status: "PAID" | "NOT_PAID" | "PARTIALLY_PAID"; // پرداخت شده - پرداخت نشده - پرداخت جزئی
    type: "PURCHASE" | "RETURN_FROM_PURCHASE" | "SELL"; // خرید - بازگشت از خرید - فروش
  }[];
}

export interface QueryCustomerRequest {
  page?: number;
  "page-size"?: number;
  payment_method?: "CASH" | "ONLINE" | "WALLET";
  status?: "PENDING" | "CONVERTED_TO_ORDER" | "APPROVED" | "REJECTED";
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
    payment_method: "CASH" | "ONLINE" | "WALLET"; // نوع پرداخت: نقدی - آنلاین - کیف پول
    products_count: number; // تعداد محصولات
    representative_name: string; // نماینده
    total_items: number; // تعداد محصولات
    total_price?: number; // قیمت کل
    status: "PENDING" | "CONVERTED_TO_ORDER" | "APPROVED" | "REJECTED"; // وضعیت: درحال انتظار - تبدیل به سفارش - تایید شده - رد شده
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

export interface QueryTicket {
  page?: number;
  "page-size"?: number;
  customer_id?: string;
  person_id?: string;
  creator_person_id?: string;
  employee_id?: string;
  assigned_to_id?: string;
  status?:
    | "OPEN" // باز
    | "CLOSED" // بسته
    | "REOPENED" // باز شده
    | "RESOLVED" // حل شده
    | "WAITING_CUSTOMER" // در انتظار مشتری
    | "WAITING_SUPPORT"; // در انتظار پشتیبان
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT"; // کم - متوسط - زیاد - بسیار زیاد
  sort_by?: "last_message" | "updated_at"; // آخرین پیام - آخرین به روز رسانی
  sort_order?: "asc" | "desc"; // صعودی - نزولی
  created_at_min?: Date; // تاریخ ایجاد از
  created_at_max?: Date; // تاریخ ایجاد تا
  deleted?: boolean; // حذف شده
  search?: string; // جستجو
  last_sender_type?: "CUSTOMER_PERSON" | "EMPLOYEE"; // نوع آخرین ارسال کننده: مشتری - پشتیبان
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
    type: "PERSONAL" | "CORPORATE";
    category:
      | "RESTAURANT"
      | "HOTEL"
      | "CHAIN_STORE"
      | "GOVERNMENTAL"
      | "FAST_FOOD"
      | "CHARITY"
      | "BUTCHER"
      | "WHOLESALER"
      | "FELLOW"
      | "CATERING"
      | "KEBAB"
      | "DISTRIBUTOR"
      | "HOSPITAL"
      | "FACTORY";
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
    sender_type: "CUSTOMER_PERSON" | "EMPLOYEE";
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
    status:
      | "OPEN"
      | "CLOSED"
      | "REOPENED"
      | "RESOLVED"
      | "WAITING_CUSTOMER"
      | "WAITING_SUPPORT";
    creator_person_id: string;
    customer_id: string;
    created_at: Date;
  };
  message: {
    sender_type: "CUSTOMER_PERSON" | "EMPLOYEE";
    message: string;
    created_at: Date;
  };
  attachments: FileSummary[];
}

export interface ReplyTicketResponse {
  ticket: {
    id: string;
    status:
      | "OPEN"
      | "CLOSED"
      | "REOPENED"
      | "RESOLVED"
      | "WAITING_CUSTOMER"
      | "WAITING_SUPPORT";
  };
  message: {
    id: string;
    sender_type: "CUSTOMER_PERSON" | "EMPLOYEE";
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

export interface GetReturnRequestsResponse {
  data: {
    id: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "RECEIVED";
    reason: "NOT_GOOD";
    order: {
      id: string;
      code: number;
      address: string;
    };
    request: {
      id: string;
      code: number;
      address: string;
      status: "PENDING" | "CONVERTED_TO_ORDER" | "APPROVED" | "REJECTED";
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
