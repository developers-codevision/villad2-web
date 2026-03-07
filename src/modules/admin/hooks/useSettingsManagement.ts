// Admin Settings Hook - Business logic for settings management

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { settingsService } from '@/modules/shared/services';

export interface SettingsFormData {
  earlyCheckInPrice: string;
  lateCheckOutPrice: string;
  transferOneWayPrice: string;
  transferRoundTripPrice: string;
  breakfastPrice: string;
}

// Internal map of key → { id, value }
interface SettingRecord {
  id: number;
  value: string;
}

type SettingsMap = {
  earlyCheckInPrice: SettingRecord;
  lateCheckOutPrice: SettingRecord;
  transferOneWayPrice: SettingRecord;
  transferRoundTripPrice: SettingRecord;
  breakfastPrice: SettingRecord;
};

const API_KEY_MAP: Record<keyof SettingsFormData, string> = {
  earlyCheckInPrice: 'early_check_in_price',
  lateCheckOutPrice: 'late_check_out_price',
  transferOneWayPrice: 'transfer_one_way_price',
  transferRoundTripPrice: 'transfer_round_trip_price',
  breakfastPrice: 'breakfast_price',
};

/**
 * Custom hook for managing hostal settings in admin panel.
 * Each setting is its own DB row (key-value) with its own id.
 */
export function useSettingsManagement() {
  const [settingsMap, setSettingsMap] = useState<SettingsMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<SettingsFormData>({
    earlyCheckInPrice: '',
    lateCheckOutPrice: '',
    transferOneWayPrice: '',
    transferRoundTripPrice: '',
    breakfastPrice: '',
  });

  // ============================================
  // DATA LOADING
  // ============================================

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const all = await settingsService.getAll();

      // Build a lookup by key
      const byKey: Record<string, SettingRecord> = {};
      for (const s of all) {
        byKey[s.key] = { id: s.id, value: String(s.value) };
      }

      const map: SettingsMap = {
        earlyCheckInPrice: byKey['early_check_in_price'],
        lateCheckOutPrice: byKey['late_check_out_price'],
        transferOneWayPrice: byKey['transfer_one_way_price'],
        transferRoundTripPrice: byKey['transfer_round_trip_price'],
        breakfastPrice: byKey['breakfast_price'],
      };

      setSettingsMap(map);
      setFormData({
        earlyCheckInPrice: map.earlyCheckInPrice.value,
        lateCheckOutPrice: map.lateCheckOutPrice.value,
        transferOneWayPrice: map.transferOneWayPrice.value,
        transferRoundTripPrice: map.transferRoundTripPrice.value,
        breakfastPrice: map.breakfastPrice.value,
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // ============================================
  // FORM HANDLERS
  // ============================================

  const handleFieldChange = useCallback(
    (field: keyof SettingsFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const saveSettings = useCallback(async () => {
    if (!settingsMap) return;

    // Validate
    for (const [key, value] of Object.entries(formData) as [keyof SettingsFormData, string][]) {
      if (value.trim() === '' || isNaN(Number(value)) || Number(value) < 0) {
        toast.error(`El valor de "${API_KEY_MAP[key]}" no es válido`);
        return;
      }
    }

    setSaving(true);
    try {
      // Only patch fields that actually changed
      const updates: Promise<unknown>[] = [];

      for (const [field, apiKey] of Object.entries(API_KEY_MAP) as [keyof SettingsFormData, string][]) {
        const record = settingsMap[field];
        const newValue = Number(formData[field]).toFixed(2);
        if (newValue !== Number(record.value).toFixed(2)) {
          updates.push(
            settingsService.updateByKey(apiKey, Number(newValue))
          );
        }
      }

      await Promise.all(updates);
      toast.success('Configuración guardada correctamente');
      await loadSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  }, [settingsMap, formData, loadSettings]);

  const resetForm = useCallback(() => {
    if (!settingsMap) return;
    setFormData({
      earlyCheckInPrice: settingsMap.earlyCheckInPrice.value,
      lateCheckOutPrice: settingsMap.lateCheckOutPrice.value,
      transferOneWayPrice: settingsMap.transferOneWayPrice.value,
      transferRoundTripPrice: settingsMap.transferRoundTripPrice.value,
      breakfastPrice: settingsMap.breakfastPrice.value,
    });
  }, [settingsMap]);

  const isDirty =
    settingsMap !== null &&
    (Number(formData.earlyCheckInPrice).toFixed(2) !== Number(settingsMap.earlyCheckInPrice.value).toFixed(2) ||
      Number(formData.lateCheckOutPrice).toFixed(2) !== Number(settingsMap.lateCheckOutPrice.value).toFixed(2) ||
      Number(formData.transferOneWayPrice).toFixed(2) !== Number(settingsMap.transferOneWayPrice.value).toFixed(2) ||
      Number(formData.transferRoundTripPrice).toFixed(2) !== Number(settingsMap.transferRoundTripPrice.value).toFixed(2) ||
      Number(formData.breakfastPrice).toFixed(2) !== Number(settingsMap.breakfastPrice.value).toFixed(2));

  return {
    loading,
    saving,
    formData,
    isDirty,
    handleFieldChange,
    saveSettings,
    resetForm,
  };
}
