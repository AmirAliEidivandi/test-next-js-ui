"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { filesApi } from "@/lib/api/files";
import { useReplyTicket } from "@/lib/hooks/api/use-tickets";
import { UploadFileResponse } from "@/lib/api/types";
import { X, Paperclip, Send, Loader2 } from "lucide-react";
import { fileUrl } from "@/lib/utils/file-url";

type Props = {
  ticketId: string;
  ticketStatus?: string;
  onSuccess?: () => void;
};

export function TicketReplyForm({ ticketId, ticketStatus, onSuccess }: Props) {
  const isClosed = ticketStatus === "CLOSED";
  const [message, setMessage] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = React.useState<
    UploadFileResponse[]
  >([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const replyMutation = useReplyTicket();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const results = await filesApi.uploadFiles(files);
      setUploadedFiles((prev) => [...prev, ...results]);
      setFiles([]);
      toast.success("فایل‌ها با موفقیت آپلود شدند");
    } catch (error: any) {
      toast.error(error.message || "خطا در آپلود فایل‌ها");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() && uploadedFiles.length === 0) {
      toast.error("لطفا پیام یا فایلی وارد کنید");
      return;
    }

    // Upload remaining files if any
    if (files.length > 0) {
      try {
        setIsUploading(true);
        const results = await filesApi.uploadFiles(files);
        setUploadedFiles((prev) => [...prev, ...results]);
        setFiles([]);
      } catch (error: any) {
        toast.error(error.message || "خطا در آپلود فایل‌ها");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const attachmentIds = uploadedFiles.map((f) => f.id);

    replyMutation.mutate(
      {
        ticketId,
        data: {
          message: message.trim(),
          attachment_ids: attachmentIds,
        },
      },
      {
        onSuccess: () => {
          toast.success("پاسخ با موفقیت ارسال شد");
          setMessage("");
          setFiles([]);
          setUploadedFiles([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          onSuccess?.();
        },
        onError: (error: any) => {
          toast.error(error.message || "خطا در ارسال پاسخ");
        },
      }
    );
  };

  const isImage = (file: File | UploadFileResponse) => {
    if (file instanceof File) {
      return file.type.startsWith("image/");
    }
    const url = file.thumbnail_url || file.url;
    return (
      url.includes(".jpg") ||
      url.includes(".jpeg") ||
      url.includes(".png") ||
      url.includes(".gif") ||
      url.includes(".webp")
    );
  };

  const getFileName = (file: File | UploadFileResponse) => {
    if (file instanceof File) {
      return file.name;
    }
    return file.name || "فایل";
  };

  if (isClosed) {
    return (
      <div className="border rounded-lg p-4 bg-muted/50 text-center">
        <p className="text-sm text-muted-foreground">
          این تیکت بسته است و امکان ارسال پیام جدید وجود ندارد.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {uploadedFiles.map((file, index) => {
            const fullUrl = fileUrl(file.thumbnail_url || file.url);
            const isImg = isImage(file);

            return (
              <div
                key={file.id}
                className="relative group border rounded-lg overflow-hidden bg-muted"
              >
                {isImg && fullUrl ? (
                  <div className="relative w-20 h-20">
                    <img
                      src={fullUrl}
                      alt={getFileName(file)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center">
                    <Paperclip className="size-6 text-muted-foreground" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeUploadedFile(index)}
                  className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="size-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                  {getFileName(file)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Files Preview */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => {
            const isImg = isImage(file);
            const previewUrl = isImg ? URL.createObjectURL(file) : null;

            return (
              <div
                key={index}
                className="relative group border rounded-lg overflow-hidden bg-muted"
              >
                {isImg && previewUrl ? (
                  <div className="relative w-20 h-20">
                    <img
                      src={previewUrl}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center">
                    <Paperclip className="size-6 text-muted-foreground" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    removeFile(index);
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                    }
                  }}
                  className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="size-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                  {file.name}
                </div>
              </div>
            );
          })}
          {!isUploading && (
            <Button
              type="button"
              onClick={handleUploadFiles}
              size="sm"
              variant="outline"
            >
              آپلود فایل‌ها
            </Button>
          )}
        </div>
      )}

      {/* File Input */}
      <div className="flex items-start gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="ticket-file-input"
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0"
          disabled={isUploading || replyMutation.isPending}
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          {isUploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Paperclip className="size-4" />
          )}
        </Button>

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="پیام خود را بنویسید..."
          className="min-h-[80px] resize-none"
          disabled={replyMutation.isPending || isUploading}
        />

        <Button
          type="submit"
          size="icon"
          className="shrink-0"
          disabled={
            (!message.trim() && uploadedFiles.length === 0) ||
            replyMutation.isPending ||
            isUploading ||
            files.length > 0
          }
        >
          {replyMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </div>
    </form>
  );
}

