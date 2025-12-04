import { UploadFileResponse } from "./types";

export const filesApi = {
  /**
   * Upload a single file
   */
  async uploadFile(file: File): Promise<UploadFileResponse> {
    const formData = new FormData();
    formData.append("files", file);

    // We need to make a direct request for file uploads since it's multipart/form-data
    const response = await fetch("/api/proxy/files", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText || "خطایی رخ داد",
      }));

      throw new Error(errorData.message || "خطایی رخ داد");
    }

    const result = await response.json();
    // If server returns an array, return the first item
    // Otherwise return the result directly
    return Array.isArray(result) ? result[0] : result;
  },

  /**
   * Upload multiple files at once
   */
  async uploadFiles(files: File[]): Promise<UploadFileResponse[]> {
    if (files.length === 0) {
      return [];
    }

    const formData = new FormData();
    // Append all files with the same field name "files"
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch("/api/proxy/files", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText || "خطایی رخ داد",
      }));

      throw new Error(errorData.message || "خطایی رخ داد");
    }

    const result = await response.json();
    // Server should return an array
    return Array.isArray(result) ? result : [result];
  },
};
