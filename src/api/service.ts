import { apiClient } from './client';
import { apiUrls } from './url-constants';

class ApiService {
  async addWallet(data: { address: string; providerId: string }): Promise<any | void> {
    try {
      return apiClient.put(apiUrls.wallets.addWallet, data);
    } catch (err) {
      console.error(err);
    }
  }

  async getByAddress(address: string): Promise<any | void> {
    try {
      return apiClient.get(apiUrls.wallets.address.replace('{address}', `${address}`));
    } catch (err) {
      console.error(err);
    }
  }

  async getTokenInfoByAddress(address: string): Promise<any | void> {
    try {
      return apiClient.get(apiUrls.tokens.getByAddress.replace('{address}', `${address}`));
    } catch (err) {
      console.error(err);
    }
  }
  async getListOfInactiveTokens(): Promise<any | void> {
    try {
      return apiClient.get(apiUrls.tokens.inactiveList);
    } catch (err) {
      console.error(err);
    }
  }
  async getListOfHiddenPairs(): Promise<any | void> {
    try {
      return apiClient.get(apiUrls.pairs.hiddenPairs);
    } catch (err) {
      console.error(err);
    }
  }

  async getPairInfo(token0: string, token1: string): Promise<any | void> {
    try {
      return apiClient.get(apiUrls.pairs.getPairInfo, {
        params: { token0, token1 },
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export const apiService = new ApiService();
