// Settings API Service

import { authenticatedApiClient } from './api';

export interface SettingRow {
  id: number;
  key: string;
  value: number;
  description: string;
  type: string;
}

/**
 * Settings Service - API calls for hostal settings management
 */
export const settingsService = {
  /**
   * Get all settings rows (each with id, key, value)
   */
  async getAll(): Promise<SettingRow[]> {
    return authenticatedApiClient.get<SettingRow[]>('/settings');
  },

  /**
   * Update a setting by its string key (admin only)
   */
  async updateByKey(key: string, value: number): Promise<void> {
    return authenticatedApiClient.patch<void>(`/settings/key/${key}`, { value });
  },
};

