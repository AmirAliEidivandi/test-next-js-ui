"use client";

import { filesApi } from "@/lib/api/files";
import type {
  GetCategoriesResponse,
  GetCategoryResponse,
  TemperatureTypeEnum,
  UpdateCategoryRequest,
} from "@/lib/api/types";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategory, useUpdateCategory } from "@/lib/hooks/api/use-categories";
import { fileUrl } from "@/lib/utils/file-url";
import { Loader2, Snowflake, Thermometer, Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

const temperatureLabels: Record<string, string> = {
  COLD: "سرد",
  HOT: "گرم",
};

const temperatureOptions: { value: TemperatureTypeEnum; label: string }[] = [
  { value: "COLD", label: "سرد" },
  { value: "HOT", label: "گرم" },
];

// Helper function to flatten categories tree and filter out the current category and its children
function getAvailableParents(
  categories: GetCategoriesResponse,
  currentCategoryId: string
): GetCategoriesResponse {
  const result: GetCategoriesResponse = [];
  const excludeIds = new Set<string>([currentCategoryId]);

  // First, collect all children IDs of the current category
  function collectChildrenIds(
    cats: GetCategoriesResponse,
    parentId: string
  ) {
    for (const cat of cats) {
      if (cat.parent_id === parentId) {
        excludeIds.add(cat.id);
        if (cat.children && cat.children.length > 0) {
          collectChildrenIds(cat.children, cat.id);
        }
      }
    }
  }

  // Find the current category and collect its children
  function findAndCollect(cats: GetCategoriesResponse) {
    for (const cat of cats) {
      if (cat.id === currentCategoryId) {
        if (cat.children && cat.children.length > 0) {
          collectChildrenIds(cat.children, cat.id);
        }
        return;
      }
      if (cat.children && cat.children.length > 0) {
        findAndCollect(cat.children);
      }
    }
  }

  findAndCollect(categories);

  // Now collect all categories except excluded ones
  function traverse(cats: GetCategoriesResponse) {
    for (const cat of cats) {
      if (!excludeIds.has(cat.id)) {
        result.push(cat);
      }
      if (cat.children && cat.children.length > 0) {
        traverse(cat.children);
      }
    }
  }

  traverse(categories);
  return result;
}

type Props = {
  categoryId: string | null;
  categories: GetCategoriesResponse | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CategoryEditDialog({
  categoryId,
  categories,
  open,
  onOpenChange,
}: Props) {
  const { data: category, isLoading: isLoadingCategory } = useCategory(
    categoryId
  );
  const updateMutation = useUpdateCategory();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [title, setTitle] = React.useState("");
  const [priority, setPriority] = React.useState(0);
  const [temperatureType, setTemperatureType] =
    React.useState<TemperatureTypeEnum>("COLD");
  const [parentId, setParentId] = React.useState<string | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [uploadedImageId, setUploadedImageId] = React.useState<
    string | null | ""
  >(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [currentImage, setCurrentImage] = React.useState<
    { url: string; thumbnail_url: string } | null
  >(null);
  const [imageRemoved, setImageRemoved] = React.useState(false);

  // Initialize form when category loads
  React.useEffect(() => {
    if (category) {
      setTitle(category.title);
      setPriority(category.priority);
      setTemperatureType(category.temperature_type);
      setParentId(category.parent_id);
      setCurrentImage(category.image);
      setUploadedImageId(null);
      setImageFile(null);
      setImageRemoved(false);
    }
  }, [category]);

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setTitle("");
      setPriority(0);
      setTemperatureType("COLD");
      setParentId(null);
      setImageFile(null);
      setUploadedImageId(null);
      setCurrentImage(null);
      setImageRemoved(false);
    }
  }, [open]);

  const availableParents = React.useMemo(() => {
    if (!categories || !categoryId) return [];
    return getAvailableParents(categories, categoryId);
  }, [categories, categoryId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("لطفا فقط فایل تصویر انتخاب کنید");
        return;
      }
      setImageFile(file);
      setCurrentImage(null); // Clear current image when new file is selected
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setUploadedImageId(null);
    setCurrentImage(null);
    setImageRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) return;

    setIsUploading(true);
    try {
      const result = await filesApi.uploadFile(imageFile);
      setUploadedImageId(result.id);
      setCurrentImage({
        url: result.url,
        thumbnail_url: result.thumbnail_url || result.url,
      });
      toast.success("عکس با موفقیت آپلود شد");
    } catch (error: any) {
      toast.error(error.message || "خطا در آپلود عکس");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId) return;

    // Upload image if selected but not uploaded yet
    if (imageFile && !uploadedImageId) {
      await handleUploadImage();
      if (!uploadedImageId) return; // Wait for upload
    }

    const updateData: UpdateCategoryRequest = {
      title: title.trim(),
      priority: priority || 0,
      temperature_type: temperatureType,
      parent_id: parentId,
      image_id: imageRemoved
        ? null
        : uploadedImageId || category?.image?.id || null,
    };

    updateMutation.mutate(
      { id: categoryId, data: updateData },
      {
        onSuccess: () => {
          toast.success("دسته‌بندی با موفقیت بروزرسانی شد");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error.message || "خطا در بروزرسانی دسته‌بندی");
        },
      }
    );
  };

  const imagePreview = imageFile
    ? URL.createObjectURL(imageFile)
    : currentImage
    ? fileUrl(currentImage.thumbnail_url || currentImage.url)
    : null;

  if (!categoryId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ویرایش دسته‌بندی</DialogTitle>
          <DialogDescription>
            ویرایش اطلاعات دسته‌بندی
          </DialogDescription>
        </DialogHeader>

        {isLoadingCategory ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>عکس دسته‌بندی</Label>
              <div className="space-y-3">
                {imagePreview && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 left-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="category-image-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="size-4 ml-2" />
                    {imageFile ? "تغییر عکس" : "انتخاب عکس"}
                  </Button>
                  {imageFile && !uploadedImageId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUploadImage}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="size-4 ml-2 animate-spin" />
                          در حال آپلود...
                        </>
                      ) : (
                        "آپلود عکس"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">عنوان *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان دسته‌بندی"
                required
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">اولویت</Label>
              <Input
                id="priority"
                type="number"
                min="0"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            {/* Temperature Type */}
            <div className="space-y-2">
              <Label htmlFor="temperature-type">نوع دما</Label>
              <Select
                value={temperatureType}
                onValueChange={(value) =>
                  setTemperatureType(value as TemperatureTypeEnum)
                }
              >
                <SelectTrigger id="temperature-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {temperatureOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.value === "COLD" ? (
                          <Snowflake className="size-4" />
                        ) : (
                          <Thermometer className="size-4" />
                        )}
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Parent Category */}
            <div className="space-y-2">
              <Label htmlFor="parent">دسته‌بندی والد</Label>
              <Select
                value={parentId || "none"}
                onValueChange={(value) =>
                  setParentId(value === "none" ? null : value)
                }
              >
                <SelectTrigger id="parent">
                  <SelectValue placeholder="بدون والد (دسته‌بندی اصلی)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون والد (دسته‌بندی اصلی)</SelectItem>
                  {availableParents.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

