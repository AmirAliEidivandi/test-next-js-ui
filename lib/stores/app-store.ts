import { create } from "zustand";

interface AppState {
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Filter States (برای cache کردن فیلترها)
  customerFilters: Record<string, unknown> | null;
  setCustomerFilters: (filters: Record<string, unknown> | null) => void;

  orderFilters: Record<string, unknown> | null;
  setOrderFilters: (filters: Record<string, unknown> | null) => void;

  invoiceFilters: Record<string, unknown> | null;
  setInvoiceFilters: (filters: Record<string, unknown> | null) => void;

  // Selected Items (برای عملیات batch)
  selectedCustomers: string[];
  setSelectedCustomers: (ids: string[]) => void;

  selectedOrders: string[];
  setSelectedOrders: (ids: string[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  customerFilters: null,
  setCustomerFilters: (filters) => set({ customerFilters: filters }),

  orderFilters: null,
  setOrderFilters: (filters) => set({ orderFilters: filters }),

  invoiceFilters: null,
  setInvoiceFilters: (filters) => set({ invoiceFilters: filters }),

  selectedCustomers: [],
  setSelectedCustomers: (ids) => set({ selectedCustomers: ids }),

  selectedOrders: [],
  setSelectedOrders: (ids) => set({ selectedOrders: ids }),
}));

