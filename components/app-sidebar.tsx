"use client";

import {
  BarChart3,
  Bell,
  Box,
  ChevronLeft,
  Clock,
  CreditCard,
  FileCheck,
  FileText,
  FolderTree,
  History,
  LayoutDashboard,
  MessageSquare,
  Package,
  ShoppingCart,
  Store,
  Ticket,
  Truck,
  Users,
  Wallet,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { profileApi } from "@/lib/api/profile";
import type { GetProfileInfoResponse } from "@/lib/api/types";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type MenuItem = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  subItems?: Array<{ title: string; href: string }>;
};

const menuItems: MenuItem[] = [
  {
    title: "داشبورد",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "مشتریان",
    icon: Users,
    subItems: [
      { title: "لیست مشتریان", href: "/dashboard/customers" },
      { title: "مشتریان بدهکار", href: "/dashboard/customers/debtors" },
      { title: "گزارش مشتری ها", href: "/dashboard/customers/reports" },
    ],
  },
  {
    title: "سفارشات",
    icon: ShoppingCart,
    href: "/dashboard/orders",
  },
  {
    title: "تاریخچه سفارشات",
    icon: History,
    href: "/dashboard/orders/history",
  },
  {
    title: "تاریخچه پرداخت ها",
    icon: CreditCard,
    href: "/dashboard/payments/history",
  },
  {
    title: "فاکتور ها",
    icon: FileText,
    href: "/dashboard/invoices",
  },
  {
    title: "تاریخچه مرسوله ها",
    icon: Package,
    href: "/dashboard/shipments/history",
  },
  {
    title: "درخواست های مشتریان",
    icon: MessageSquare,
    href: "/dashboard/customer-requests",
  },
  {
    title: "دسته بندی ها",
    icon: FolderTree,
    href: "/dashboard/categories",
  },
  {
    title: "محصولات",
    icon: Box,
    href: "/dashboard/products",
  },
  {
    title: "لیست انبار ها",
    icon: Warehouse,
    href: "/dashboard/warehouses",
  },
  {
    title: "پخش مویرگی",
    icon: Truck,
    subItems: [
      {
        title: "لیست خط های فروش",
        href: "/dashboard/distribution/sales-lines",
      },
      { title: "لیست ویزیتور ها", href: "/dashboard/distribution/visitors" },
      {
        title: "مشتری های ویزیتور",
        href: "/dashboard/distribution/visitor-customers",
      },
      { title: "لیست پیگیری ها", href: "/dashboard/distribution/follow-ups" },
    ],
  },
  {
    title: "تیکت ها",
    icon: Ticket,
    href: "/dashboard/tickets",
  },
  {
    title: "کیف پول ها",
    icon: Wallet,
    href: "/dashboard/wallets",
  },
  {
    title: "تاریخچه کیف پول",
    icon: Clock,
    href: "/dashboard/wallets/history",
  },
  {
    title: "لاگ ها و رهگیری",
    icon: FileCheck,
    href: "/dashboard/logs",
  },
  {
    title: "چک ها",
    icon: FileText,
    href: "/dashboard/checks",
  },
  {
    title: "یادآور ها",
    icon: Bell,
    href: "/dashboard/reminders",
  },
  {
    title: "آمار ها",
    icon: BarChart3,
    subItems: [
      { title: "آمار مشتریان", href: "/dashboard/statistics/customers" },
      { title: "آمار سفارشات", href: "/dashboard/statistics/orders" },
      { title: "آمار فروشندگان", href: "/dashboard/statistics/sellers" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = React.useState<GetProfileInfoResponse | null>(
    null
  );

  React.useEffect(() => {
    profileApi
      .getProfileInfo()
      .then(setProfile)
      .catch(() => {
        // Silent fail
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      toast.success("خروج با موفقیت انجام شد");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, redirect to login
      router.push("/");
    }
  };

  return (
    <Sidebar collapsible="icon" side="right">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Store className="size-4" />
          </div>
          <div className="grid flex-1 text-right text-sm leading-tight">
            <span className="truncate font-semibold">سیستم مدیریت</span>
            <span className="truncate text-xs text-muted-foreground">
              {profile?.username || "پنل ادمین"}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2.5">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const hasSubItems = item.subItems && item.subItems.length > 0;

                if (hasSubItems) {
                  const isSubItemActive = item.subItems?.some(
                    (subItem) => pathname === subItem.href
                  );
                  const [open, setOpen] = React.useState(isSubItemActive);

                  return (
                    <Collapsible
                      key={item.title}
                      open={open}
                      onOpenChange={setOpen}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={isSubItemActive}
                            className="h-11 text-base px-3 py-2.5 gap-3"
                          >
                            <item.icon className="size-5" />
                            <span>{item.title}</span>
                            <ChevronLeft
                              className={`mr-auto transition-transform size-4 ${
                                open ? "-rotate-90" : ""
                              }`}
                            />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="gap-1.5 mt-1.5">
                            {item.subItems?.map((subItem) => {
                              const isSubActive = pathname === subItem.href;
                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isSubActive}
                                    className="h-9 text-sm px-3"
                                  >
                                    <Link href={subItem.href}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                if (!item.href) return null;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      className="h-11 text-base px-3 py-2.5 gap-3"
                    >
                      <Link href={item.href}>
                        <item.icon className="size-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            <span>خروج</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
