"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { getAccessToken } from "@/lib/auth/token"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = React.useState(true)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)

  React.useEffect(() => {
    const checkAuth = () => {
      const token = getAccessToken()
      
      if (!token) {
        // No token, redirect to login
        if (pathname?.startsWith("/dashboard")) {
          router.push("/")
        }
        setIsAuthenticated(false)
      } else {
        setIsAuthenticated(true)
      }
      
      setIsChecking(false)
    }

    checkAuth()
  }, [router, pathname])

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">در حال بررسی...</p>
        </div>
      </div>
    )
  }

  // If not authenticated and on dashboard, don't render children (redirect will happen)
  if (!isAuthenticated && pathname?.startsWith("/dashboard")) {
    return null
  }

  return <>{children}</>
}

