"use client";

import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check authentication via server-side API
        const response = await fetch("/api/auth/check", {
          credentials: "same-origin",
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.authenticated);

          if (!data.authenticated && pathname?.startsWith("/dashboard")) {
            router.push("/");
          }
        } else {
          setIsAuthenticated(false);
          if (pathname?.startsWith("/dashboard")) {
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        if (pathname?.startsWith("/dashboard")) {
          router.push("/");
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">در حال بررسی...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and on dashboard, don't render children (redirect will happen)
  if (!isAuthenticated && pathname?.startsWith("/dashboard")) {
    return null;
  }

  return <>{children}</>;
}
