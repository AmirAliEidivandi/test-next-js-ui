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
  PAID = "PAID",
  NOT_PAID = "NOT_PAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
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
  CASH = "CASH",
  ONLINE = "ONLINE",
  WALLET = "WALLET",
}

export enum CustomerRequestStatusEnum {
  PENDING = "PENDING",
  CONVERTED_TO_ORDER = "CONVERTED_TO_ORDER",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
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
