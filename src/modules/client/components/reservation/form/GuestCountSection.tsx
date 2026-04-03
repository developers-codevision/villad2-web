import { Label } from '@/modules/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/shared/components/ui/select';
import { getErrorClassName } from '../utils';
import { useLanguage } from '@/modules/client/contexts';

interface GuestCountSectionProps {
  totalGuests: number;
  maxCapacity: number;
  disabled?: boolean;
  onGuestCountChange: (count: number) => void;
  validationErrors?: string[];
}

export default function GuestCountSection({
  totalGuests,
  maxCapacity,
  disabled = false,
  onGuestCountChange,
  validationErrors = [],
}: GuestCountSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label>{t("reservation.totalGuests")}</Label>
      <Select
        value={totalGuests > 0 ? totalGuests.toString() : ""}
        onValueChange={(value) => onGuestCountChange(parseInt(value))}
        disabled={disabled}
      >
        <SelectTrigger className={getErrorClassName('huéspedes', validationErrors)}>
          <SelectValue placeholder={t("reservation.selectDates")} />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: Math.max(maxCapacity, 1) }, (_, i) => i + 1).map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n} {n === 1 ? t("reservation.guest") : t("reservation.guests")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

