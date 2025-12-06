"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filesApi } from "@/lib/api/files";
import type { UpdateProductRequest } from "@/lib/api/types";
import { SettlementMethodEnum } from "@/lib/api/types";
import { useProduct, useUpdateProduct } from "@/lib/hooks/api/use-products";
import { fileUrl } from "@/lib/utils/file-url";
import { Loader2, Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

const settlementMethodOptions: {
  value: SettlementMethodEnum;
  label: string;
}[] = [
  { value: SettlementMethodEnum.CASH, label: "نقدی" },
  { value: SettlementMethodEnum.CHEQUE, label: "چک" },
  { value: SettlementMethodEnum.CREDIT, label: "اعتباری" },
];

type Props = {
  productId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductEditDialog({ productId, open, onOpenChange }: Props) {
  const { data: product, isLoading: isLoadingProduct } = useProduct(productId);
  const updateMutation = useUpdateProduct();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [hpCode, setHpCode] = React.useState<number | null>(null);
  const [hpTitle, setHpTitle] = React.useState("");
  const [invoiceTitle, setInvoiceTitle] = React.useState("");
  const [settlementMethods, setSettlementMethods] = React.useState<
    SettlementMethodEnum[]
  >([]);
  const [isOnline, setIsOnline] = React.useState(false);
  const [isSpecial, setIsSpecial] = React.useState(false);
  const [imageFiles, setImageFiles] = React.useState<File[]>([]);
  const [uploadedImageIds, setUploadedImageIds] = React.useState<string[]>([]);
  const [currentImages, setCurrentImages] = React.useState<
    Array<{ id: string; url: string; thumbnail_url: string }>
  >([]);
  const [isUploading, setIsUploading] = React.useState(false);

  // Initialize form when product loads
  React.useEffect(() => {
    if (product) {
      setTitle(product.title);
      setDescription(product.description || "");
      setHpCode(product.hp_code);
      setHpTitle(product.hp_title || "");
      setInvoiceTitle(product.invoice_title || "");
      setSettlementMethods(product.settlement_methods || []);
      setIsOnline(product.is_online);
      setIsSpecial(product.is_special);
      setCurrentImages(
        product.images.map((img) => ({
          id: img.id,
          url: img.url,
          thumbnail_url: img.thumbnail_url || img.url,
        }))
      );
      setUploadedImageIds([]);
      setImageFiles([]);
    }
  }, [product]);

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setHpCode(null);
      setHpTitle("");
      setInvoiceTitle("");
      setSettlementMethods([]);
      setIsOnline(false);
      setIsSpecial(false);
      setImageFiles([]);
      setUploadedImageIds([]);
      setCurrentImages([]);
    }
  }, [open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length !== files.length) {
      toast.error("لطفا فقط فایل تصویر انتخاب کنید");
    }
    if (imageFiles.length > 0) {
      setImageFiles((prev) => [...prev, ...imageFiles]);
    }
  };

  const removeImageFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeCurrentImage = (imageId: string) => {
    setCurrentImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleUploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];

    setIsUploading(true);
    try {
      const results = await filesApi.uploadFiles(imageFiles);
      const newImageIds = results.map((r) => r.id);
      setUploadedImageIds((prev) => [...prev, ...newImageIds]);
      setImageFiles([]);
      toast.success("عکس‌ها با موفقیت آپلود شدند");
      return newImageIds;
    } catch (error: any) {
      toast.error(error.message || "خطا در آپلود عکس‌ها");
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const toggleSettlementMethod = (method: SettlementMethodEnum) => {
    setSettlementMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) {
      toast.error("خطا در شناسایی محصول");
      return;
    }

    // Upload images if selected but not uploaded yet
    let newUploadedIds: string[] = [];
    if (imageFiles.length > 0) {
      newUploadedIds = await handleUploadImages();
      if (imageFiles.length > 0 && newUploadedIds.length === 0) {
        // Upload failed, don't proceed
        return;
      }
    }

    const allImageIds = [
      ...currentImages.map((img) => img.id),
      ...uploadedImageIds,
      ...newUploadedIds,
    ];

    const updateData: UpdateProductRequest = {
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      hp_code: hpCode || undefined,
      hp_title: hpTitle.trim() || undefined,
      invoice_title: invoiceTitle.trim() || undefined,
      settlement_methods:
        settlementMethods.length > 0 ? settlementMethods : undefined,
      is_online: isOnline,
      is_special: isSpecial,
      image_ids: allImageIds.length > 0 ? allImageIds : undefined,
    };

    updateMutation.mutate(
      { id: productId, data: updateData },
      {
        onSuccess: () => {
          toast.success("محصول با موفقیت بروزرسانی شد");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error.message || "خطا در بروزرسانی محصول");
        },
      }
    );
  };

  if (!productId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ویرایش محصول</DialogTitle>
          <DialogDescription>ویرایش اطلاعات محصول</DialogDescription>
        </DialogHeader>

        {isLoadingProduct ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">عنوان</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان محصول"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">توضیحات</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات محصول"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* HP Code */}
            <div className="space-y-2">
              <Label htmlFor="hp-code">کد حسابداری</Label>
              <Input
                id="hp-code"
                type="number"
                value={hpCode || ""}
                onChange={(e) =>
                  setHpCode(e.target.value ? parseInt(e.target.value) : null)
                }
                placeholder="کد حسابداری"
              />
            </div>

            {/* HP Title */}
            <div className="space-y-2">
              <Label htmlFor="hp-title">عنوان حسابداری</Label>
              <Input
                id="hp-title"
                value={hpTitle}
                onChange={(e) => setHpTitle(e.target.value)}
                placeholder="عنوان حسابداری"
              />
            </div>

            {/* Invoice Title */}
            <div className="space-y-2">
              <Label htmlFor="invoice-title">عنوان فاکتور</Label>
              <Input
                id="invoice-title"
                value={invoiceTitle}
                onChange={(e) => setInvoiceTitle(e.target.value)}
                placeholder="عنوان فاکتور"
              />
            </div>

            {/* Settlement Methods */}
            <div className="space-y-2">
              <Label>روش‌های تسویه</Label>
              <div className="flex flex-wrap gap-4">
                {settlementMethodOptions.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`settlement-${option.value}`}
                      checked={settlementMethods.includes(option.value)}
                      onCheckedChange={() =>
                        toggleSettlementMethod(option.value)
                      }
                    />
                    <Label
                      htmlFor={`settlement-${option.value}`}
                      className="cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Checkboxes */}
            <div className="space-y-2">
              <Label>وضعیت</Label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="is-online"
                    checked={isOnline}
                    onCheckedChange={(checked) => setIsOnline(checked === true)}
                  />
                  <Label htmlFor="is-online" className="cursor-pointer">
                    آنلاین
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="is-special"
                    checked={isSpecial}
                    onCheckedChange={(checked) =>
                      setIsSpecial(checked === true)
                    }
                  />
                  <Label htmlFor="is-special" className="cursor-pointer">
                    ویژه
                  </Label>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label>عکس‌های محصول</Label>
              <div className="space-y-3">
                {/* Current Images */}
                {currentImages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentImages.map((image) => {
                      const imageUrl = fileUrl(
                        image.thumbnail_url || image.url
                      );
                      if (!imageUrl) return null;
                      return (
                        <div
                          key={image.id}
                          className="relative group border rounded-lg overflow-hidden bg-muted"
                        >
                          <div className="relative w-24 h-24 flex items-center justify-center">
                            <img
                              src={imageUrl}
                              alt="Product"
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 left-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeCurrentImage(image.id)}
                          >
                            <X className="size-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* New Image Files Preview */}
                {imageFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {imageFiles.map((file, index) => {
                      const previewUrl = URL.createObjectURL(file);
                      return (
                        <div
                          key={index}
                          className="relative group border rounded-lg overflow-hidden bg-muted"
                        >
                          <div className="relative w-24 h-24 flex items-center justify-center">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 left-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              removeImageFile(index);
                              URL.revokeObjectURL(previewUrl);
                            }}
                          >
                            <X className="size-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Upload Controls */}
                <div className="flex items-center gap-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="product-images-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="size-4 ml-2" />
                    انتخاب عکس
                  </Button>
                  {imageFiles.length > 0 && !isUploading && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUploadImages}
                    >
                      آپلود عکس‌ها
                    </Button>
                  )}
                  {isUploading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      در حال آپلود...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateMutation.isPending}
              >
                انصراف
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending || isUploading}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 ml-2 animate-spin" />
                    در حال ذخیره...
                  </>
                ) : (
                  "ذخیره تغییرات"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
