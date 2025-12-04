"use client";

import * as React from "react";
import { useTicketMessages } from "@/lib/hooks/api/use-tickets";
import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { fileUrl } from "@/lib/utils/file-url";
import { FileSummary } from "@/lib/api/types";
import { Download, Image as ImageIcon, File, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  ticketId: string;
  className?: string;
};

const AttachmentPreview = ({ attachment }: { attachment: FileSummary }) => {
  const fullUrl = fileUrl(attachment.url);
  const thumbnailUrl = fileUrl(attachment.thumbnail_url);
  const isImageFile =
    attachment.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
    attachment.thumbnail_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  if (!fullUrl) return null;

  if (isImageFile && thumbnailUrl) {
    return (
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group block rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
      >
        <div className="relative w-full h-48 bg-muted">
          <img
            src={thumbnailUrl}
            alt="پیوست"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Download className="size-6 text-white drop-shadow-lg" />
            </div>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={fullUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors group"
    >
      <div className="p-2 bg-muted rounded group-hover:bg-primary/10 transition-colors">
        {isImageFile ? (
          <ImageIcon className="size-5 text-muted-foreground" />
        ) : (
          <File className="size-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">
          {attachment.url.split("/").pop() || "فایل پیوست"}
        </div>
        <div className="text-xs text-muted-foreground">دانلود فایل</div>
      </div>
      <Download className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
    </a>
  );
};

export default function TicketMessages({ ticketId, className }: Props) {
  const { data: resp, isLoading } = useTicketMessages(ticketId);
  const messages = resp?.data || [];

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const bottomRef = React.useRef<HTMLDivElement | null>(null);

  // auto scroll to bottom when messages change
  React.useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages.length]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <div className="flex flex-col items-center gap-2">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">در حال بارگذاری پیام‌ها...</p>
        </div>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <div className="text-center text-muted-foreground">
          <Paperclip className="size-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">هیچ پیامی برای نمایش وجود ندارد</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col h-full overflow-hidden",
        className
      )}
    >
      <div className="flex-1 overflow-y-auto space-y-6 px-4 py-6 min-h-0">
        {messages.map((m) => {
          const isEmployee = m.sender_type === "EMPLOYEE";
          const name = isEmployee
            ? m.employee?.profile
              ? `${m.employee.profile.first_name} ${m.employee.profile.last_name}`
              : "پشتیبان"
            : m.person?.profile
            ? `${m.person.profile.first_name} ${m.person.profile.last_name}`
            : "مشتری";

          const date = m.created_at ? new Date(m.created_at) : new Date();
          const dateStr = format(date, "yyyy/MM/dd HH:mm", { locale: faIR });

          return (
            <div
              key={m.id}
              className={cn(
                "flex flex-col gap-2",
                isEmployee ? "items-start" : "items-end"
              )}
            >
              {/* Sender Info */}
              <div className="flex items-center gap-2 px-1">
                {isEmployee ? (
                  <>
                    <div className="text-xs font-medium">{name}</div>
                    <div className="text-xs text-muted-foreground">{dateStr}</div>
                  </>
                ) : (
                  <>
                    <div className="text-xs text-muted-foreground">{dateStr}</div>
                    <div className="text-xs font-medium">{name}</div>
                  </>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  "flex flex-col gap-2 max-w-[80%]",
                  isEmployee ? "items-start" : "items-end"
                )}
              >
                {/* Message Text */}
                {m.message && (
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 break-words whitespace-pre-wrap text-sm shadow-sm",
                      isEmployee
                        ? "bg-primary text-primary-foreground rounded-bl-md"
                        : "bg-muted text-foreground rounded-br-md"
                    )}
                  >
                    {m.message}
                  </div>
                )}

                {/* Attachments */}
                {m.attachments && m.attachments.length > 0 && (
                  <div
                    className={cn(
                      "flex flex-col gap-2 w-full",
                      isEmployee ? "items-start" : "items-end"
                    )}
                  >
                    {m.attachments.map((attachment) => (
                      <div key={attachment.id} className="w-full max-w-sm">
                        <AttachmentPreview attachment={attachment} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div ref={bottomRef} />
    </div>
  );
}
