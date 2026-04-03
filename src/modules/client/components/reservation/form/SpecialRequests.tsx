import { Label } from '@/modules/shared/components/ui/label';
import { Textarea } from '@/modules/shared/components/ui/textarea';
import { useLanguage } from '@/modules/client/contexts';

interface SpecialRequestsProps {
  notes: string;
  onNotesChange: (value: string) => void;
}

export default function SpecialRequests({
  notes,
  onNotesChange,
}: SpecialRequestsProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label htmlFor="requests">{t("reservation.specialRequestsLabel")}</Label>
      <Textarea
        id="requests"
        rows={3}
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder={t("reservation.specialRequestsPlaceholder")}
      />
    </div>
  );
}
