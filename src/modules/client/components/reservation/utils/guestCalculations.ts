import type { Room } from '@/modules/shared/types/api.types';

export function handleTotalGuestsChange(
  total: number,
  selectedRoom: Room | undefined,
  additionalGuests: Array<{ firstName: string; lastName: string; sex: 'M' | 'F' | 'otro' }>,
  callbacks: {
    updateFormField: (field: string, value: any) => void;
  }
) {
  if (!selectedRoom) return;

  const baseGuestsCount = Math.min(total, selectedRoom.baseCapacity);
  const extraGuestsCount = Math.max(total - selectedRoom.baseCapacity, 0);

  callbacks.updateFormField('totalGuests', total);
  callbacks.updateFormField('baseGuestsCount', baseGuestsCount);
  callbacks.updateFormField('extraGuestsCount', extraGuestsCount);

  const otherGuestsCount = total - 1;
  const newAdditional = Array.from({ length: otherGuestsCount }, (_, i) =>
    additionalGuests[i] || { firstName: '', lastName: '', sex: 'M' as const }
  );
  callbacks.updateFormField('additionalGuests', newAdditional);
}

