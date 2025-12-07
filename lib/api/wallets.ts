import { apiClient } from "./client";
import { GetWalletResponse, GetWalletsResponse, QueryWallet } from "./types";

const buildWalletQueryString = (query?: QueryWallet) => {
  const params = new URLSearchParams();
  if (query?.page) {
    params.append("page", query.page.toString());
  }
  if (query?.["page-size"]) {
    params.append("page-size", query["page-size"].toString());
  }
  return params.toString();
};

export const walletsApi = {
  async getWallets(query?: QueryWallet): Promise<GetWalletsResponse> {
    const queryString = buildWalletQueryString(query);
    const endpoint = `/wallets${queryString ? `?${queryString}` : ""}`;
    return apiClient.get<GetWalletsResponse>(endpoint);
  },
  async getWallet(walletId: string): Promise<GetWalletResponse> {
    const endpoint = `/wallets/${walletId}`;
    return apiClient.get<GetWalletResponse>(endpoint);
  },
};
