import { FILE_BASE_URL } from "@/lib/constants/files";

/**
 * Helper function to generate full file URLs
 * @param path - The file path from the API response (url or thumbnail_url)
 * @returns Full URL to the file or null if path is not provided
 */
export const fileUrl = (path?: string) => {
  if (!path) return null;
  return `${FILE_BASE_URL}/${path}`;
};
