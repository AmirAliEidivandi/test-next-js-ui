"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useProduce } from "@/lib/hooks/api/use-produces";

type ProduceDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produceId: string | null;
};

const toPersianDigits = (str: string): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/\d/g, (digit) => persianDigits[parseInt(digit, 10)]);
};

const formatDate = (date?: string) => {
  if (!date) return "-";
  return toPersianDigits(
    format(new Date(date), "yyyy/MM/dd", {
      locale: faIR,
    })
  );
};

const formatDateTime = (date?: string) => {
  if (!date) return "-";
  return toPersianDigits(
    format(new Date(date), "yyyy/MM/dd HH:mm", {
      locale: faIR,
    })
  );
};

export function ProduceDetailDialog({
  open,
  onOpenChange,
  produceId,
}: ProduceDetailDialogProps) {
  const { data: produce, isLoading } = useProduce(produceId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl mb-4">جزئیات تولید</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">
                در حال بارگذاری...
              </p>
            </div>
          </div>
        ) : produce ? (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                اطلاعات کلی
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">کد:</span>
                  <p className="text-sm font-medium">
                    {toPersianDigits(
                      produce.code.toLocaleString("fa-IR", {
                        useGrouping: false,
                      })
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    تاریخ تولید:
                  </span>
                  <p className="text-sm font-medium">
                    {formatDate(produce.production_date)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    میزان اضافات:
                  </span>
                  <p className="text-sm font-medium">
                    {toPersianDigits(produce.waste.toLocaleString("fa-IR"))}{" "}
                    کیلوگرم
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    میزان افت:
                  </span>
                  <p className="text-sm font-medium">
                    {toPersianDigits(produce.lost.toLocaleString("fa-IR"))}{" "}
                    کیلوگرم
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    تعداد کارتن:
                  </span>
                  <p className="text-sm font-medium">
                    {toPersianDigits(
                      produce.box_weight.toLocaleString("fa-IR")
                    )}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Input Product */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                محصول ورودی
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">
                    نام محصول:
                  </span>
                  <p className="text-sm font-medium">
                    {produce.input_product.product_title}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    کد محصول:
                  </span>
                  <p className="text-sm font-medium">
                    {toPersianDigits(
                      produce.input_product.product_code.toLocaleString(
                        "fa-IR",
                        {
                          useGrouping: false,
                        }
                      )
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    وزن خالص:
                  </span>
                  <p className="text-sm font-medium">
                    {toPersianDigits(
                      produce.input_product.net_weight.toLocaleString("fa-IR")
                    )}{" "}
                    کیلوگرم
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    وزن ناخالص:
                  </span>
                  <p className="text-sm font-medium">
                    {toPersianDigits(
                      produce.input_product.gross_weight.toLocaleString("fa-IR")
                    )}{" "}
                    کیلوگرم
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    مقدار واحد ثانویه:
                  </span>
                  <p className="text-sm font-medium">
                    {toPersianDigits(
                      produce.input_product.sec_unit_amount.toLocaleString(
                        "fa-IR"
                      )
                    )}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Output Products */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                محصولات خروجی
              </h3>
              {produce.output_products && produce.output_products.length > 0 ? (
                <div className="space-y-4">
                  {produce.output_products.map((product, index) => (
                    <div key={product.product_id} className="space-y-3">
                      {index > 0 && <Separator />}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-muted-foreground">
                            نام محصول:
                          </span>
                          <p className="text-sm font-medium">
                            {product.product_title}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">
                            کد محصول:
                          </span>
                          <p className="text-sm font-medium">
                            {toPersianDigits(
                              product.product_code.toLocaleString("fa-IR", {
                                useGrouping: false,
                              })
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">
                            وزن خالص:
                          </span>
                          <p className="text-sm font-medium">
                            {toPersianDigits(
                              product.net_weight.toLocaleString("fa-IR")
                            )}{" "}
                            کیلوگرم
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">
                            وزن ناخالص:
                          </span>
                          <p className="text-sm font-medium">
                            {toPersianDigits(
                              product.gross_weight.toLocaleString("fa-IR")
                            )}{" "}
                            کیلوگرم
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">
                            مقدار واحد ثانویه:
                          </span>
                          <p className="text-sm font-medium">
                            {toPersianDigits(
                              product.sec_unit_amount.toLocaleString("fa-IR")
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  محصول خروجی ثبت نشده است
                </p>
              )}
            </div>

            <Separator />

            {/* Dates */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                تاریخ‌ها
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">
                    تاریخ ایجاد:
                  </span>
                  <p className="text-sm font-medium">
                    {formatDateTime(produce.created_at)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    آخرین به‌روزرسانی:
                  </span>
                  <p className="text-sm font-medium">
                    {formatDateTime(produce.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            تولید یافت نشد
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
