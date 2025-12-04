import { ArrowRight, Home, Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
      <div className="mx-auto max-w-2xl text-center">
        {/* Animated 404 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold tracking-tighter text-primary/20 sm:text-[12rem]">
            404
          </h1>
          <div className="relative -mt-24 mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-32 rounded-full bg-primary/10 blur-3xl animate-pulse" />
            </div>
            <div className="relative">
              <Search className="mx-auto size-24 text-primary/40" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            صفحه مورد نظر یافت نشد
          </h2>
          <p className="text-lg text-muted-foreground">
            متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="group">
            <Link href="/dashboard">
              <Home className="ml-2 size-4 transition-transform group-hover:-translate-x-1" />
              بازگشت به داشبورد
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="group">
            <Link href="/dashboard">
              جستجو
              <Search className="mr-2 size-4 transition-transform group-hover:scale-110" />
            </Link>
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="mt-16 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>یا</span>
          <Link
            href="/dashboard"
            className="group flex items-center gap-1 font-medium text-primary transition-colors hover:text-primary/80"
          >
            به صفحه اصلی بروید
            <ArrowRight className="size-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/2 -top-1/2 size-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 size-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>
    </div>
  );
}

