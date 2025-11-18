"use client"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { AuthGuard } from "@/components/auth-guard"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-mr-1" />
            <Separator orientation="vertical" className="ml-2 h-4" />
            <div className="flex flex-1 items-center gap-2">
              <h1 className="text-lg font-semibold">پنل مدیریت</h1>
            </div>
            <ThemeToggle />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}

