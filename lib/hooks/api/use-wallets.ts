import { walletsApi } from "@/lib/api/wallets";
import type { QueryWallet } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const walletKeys = {
  all: ["wallets"] as const,
  lists: () => [...walletKeys.all, "list"] as const,
  list: (query?: QueryWallet) => [...walletKeys.lists(), query] as const,
  detail: (id: string) => [...walletKeys.all, "detail", id] as const,
};

// Hooks
export function useWallets(query?: QueryWallet) {
  return useQuery({
    queryKey: walletKeys.list(query),
    queryFn: () => walletsApi.getWallets(query),
  });
}

export function useWallet(id: string | null) {
  return useQuery({
    queryKey: walletKeys.detail(id || ""),
    queryFn: () => {
      if (!id) {
        throw new Error("Wallet ID is required");
      }
      return walletsApi.getWallet(id);
    },
    enabled: !!id,
  });
}

