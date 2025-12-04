import { UploadFileResponse } from "@/lib/api";
import { filesApi } from "@/lib/api/files";
import { useMutation } from "@tanstack/react-query";

// Hooks
export function useUploadFile() {
  return useMutation<UploadFileResponse, Error, File>({
    mutationFn: (file: File) => filesApi.uploadFile(file),
  });
}
