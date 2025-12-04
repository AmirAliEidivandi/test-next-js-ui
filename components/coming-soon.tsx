"use client";

import { ArrowRight, Clock, Rocket, Sparkles } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";

type ComingSoonProps = {
  title?: string;
  description?: string;
  showBackButton?: boolean;
};

export function ComingSoon({
  title = "به زودی",
  description = "این صفحه در حال طراحی و توسعه است و به زودی در دسترس قرار خواهد گرفت.",
  showBackButton = true,
}: ComingSoonProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
      <div className="mx-auto max-w-2xl text-center">
        {/* Animated Icon */}
        <div className="mb-8">
          <div className="relative mx-auto mb-8 inline-flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-32 rounded-full bg-primary/10 blur-3xl animate-pulse" />
            </div>
            <div className="relative rounded-full bg-primary/5 p-6 backdrop-blur-sm">
              <Rocket className="size-16 text-primary animate-bounce" />
            </div>
          </div>

          {/* Floating sparkles */}
          <div className="relative">
            <Sparkles className="absolute -left-8 top-4 size-6 text-primary/30 animate-pulse delay-75" />
            <Sparkles className="absolute -right-8 top-8 size-5 text-primary/40 animate-pulse delay-150" />
            <Sparkles className="absolute left-1/2 -translate-x-1/2 -top-4 size-4 text-primary/20 animate-pulse delay-300" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Clock className="size-5 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {title}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mt-8">
          <div className="mx-auto max-w-xs">
            <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>در حال توسعه</span>
              <span className="font-medium">...</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        </div>

        {/* Actions */}
        {showBackButton && (
          <div className="mt-8">
            <Button asChild size="lg" variant="outline" className="group">
              <Link href="/dashboard">
                بازگشت به داشبورد
                <ArrowRight className="mr-2 size-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/2 -top-1/2 size-[500px] rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 size-[500px] rounded-full bg-primary/5 blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  );
}

