"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BarChart3,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Smartphone,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ApiError } from "@/lib/api/types";

const loginFormSchema = z.object({
  mobile: z
    .string()
    .min(1, "شماره موبایل الزامی است")
    .regex(/^09\d{9}$/, "شماره موبایل باید با 09 شروع شود و 11 رقم باشد"),
  password: z
    .string()
    .min(1, "رمز عبور الزامی است")
    .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      mobile: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);

    try {
      // Use Next.js API route for login (tokens stored in httpOnly cookies)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          mobile: data.mobile,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText || "خطایی رخ داد",
        }));

        const apiError = errorData as ApiError;

        let errorMessage = "خطایی در ورود رخ داد. لطفا دوباره تلاش کنید.";

        if (apiError.message) {
          errorMessage = apiError.message;
        } else if (apiError.errors) {
          const firstError = Object.values(apiError.errors)[0];
          if (firstError && firstError.length > 0) {
            errorMessage = firstError[0];
          }
        }

        toast.error("خطا در ورود", {
          description: errorMessage,
        });
        return;
      }

      toast.success("ورود با موفقیت انجام شد", {
        description: "به حساب کاربری خود خوش آمدید",
      });

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      const apiError = error as ApiError;

      let errorMessage = "خطایی در ورود رخ داد. لطفا دوباره تلاش کنید.";

      if (apiError.message) {
        errorMessage = apiError.message;
      } else if (apiError.errors) {
        const firstError = Object.values(apiError.errors)[0];
        if (firstError && firstError.length > 0) {
          errorMessage = firstError[0];
        }
      }

      toast.error("خطا در ورود", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row-reverse bg-gradient-to-bl from-background via-background to-muted/30 dark:from-background dark:via-background dark:to-muted/20">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Left Side - Welcome Section (First in HTML, appears on left in RTL) */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-gradient-to-br from-muted/40 via-muted/20 to-background dark:from-muted/30 dark:via-muted/15 dark:to-background border-l border-border/50">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                              linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center space-y-8">
          {/* Logo/Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="relative bg-primary/10 dark:bg-primary/20 p-6 rounded-2xl backdrop-blur-sm border border-primary/20">
              <Store className="size-16 text-primary" />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="space-y-4 max-w-md">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              به پنل اتوماسیون میت خوش آمدید
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              سیستم مدیریت یکپارچه برای مدیریت کامل کسب و کار شما
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 w-full max-w-md mt-8">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/60 backdrop-blur-sm border border-border/50 shadow-sm">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="size-5 text-primary" />
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">آمار و گزارش‌گیری</p>
                <p className="text-sm text-muted-foreground">
                  تحلیل کامل عملکرد کسب و کار
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/60 backdrop-blur-sm border border-border/50 shadow-sm">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="size-5 text-primary" />
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">مدیریت مشتریان</p>
                <p className="text-sm text-muted-foreground">
                  مدیریت کامل اطلاعات مشتریان
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/60 backdrop-blur-sm border border-border/50 shadow-sm">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="size-5 text-primary" />
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">بهینه‌سازی فروش</p>
                <p className="text-sm text-muted-foreground">
                  افزایش کارایی و سودآوری
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      </div>

      {/* Right Side - Login Form (Second in HTML, appears on right in RTL) */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-background">
        <Card className="w-full max-w-md shadow-2xl border-border/50 backdrop-blur-sm bg-card/95 dark:bg-card/90">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Store className="size-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              ورود به حساب کاربری
            </CardTitle>
            <CardDescription className="text-base">
              لطفا شماره موبایل و رمز عبور خود را وارد کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        شماره موبایل
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground z-10" />
                          <Input
                            {...field}
                            type="tel"
                            placeholder="09123456789"
                            className="pr-10 h-12 text-base"
                            dir="ltr"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        رمز عبور
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground z-10" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="رمز عبور خود را وارد کنید"
                            className="pr-10 pl-10 h-12 text-base"
                            dir="ltr"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute left-1 top-1/2 -translate-y-1/2 size-8 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="size-4 text-muted-foreground" />
                            ) : (
                              <Eye className="size-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">در حال ورود...</span>
                      <div className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    </>
                  ) : (
                    "ورود"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
