// Settings API Service

import { apiClient, authenticatedApiClient } from './api';

export interface SettingRow {
  id: number;
  key: string;
  value: number;
  description: string;
  type: string;
}

export interface PricesResponse {
  earlyCheckInPrice: number;
  lateCheckOutPrice: number;
  transferOneWayPrice: number;
  transferRoundTripPrice: number;
  breakfastPrice: number;
}

/**
 * Settings Service - API calls for hostal settings management
 */
export const settingsService = {
  /**
   * Get all settings rows (each with id, key, value) — admin only
   */
  async getAll(): Promise<SettingRow[]> {
    return authenticatedApiClient.get<SettingRow[]>('/settings');
  },

  /**
   * Get prices as a plain object — public endpoint
   */
  async getPrices(): Promise<PricesResponse> {
    return apiClient.get<PricesResponse>('/settings/prices');
  },

  /**
   * Update a setting by its string key (admin only)
   */
  async updateByKey(key: string, value: number): Promise<void> {
    return authenticatedApiClient.patch<void>(`/settings/key/${key}`, { value });
  },
};


