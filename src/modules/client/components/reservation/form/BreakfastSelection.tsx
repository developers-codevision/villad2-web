import { Label } from '@/modules/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/shared/components/ui/select';
import { useLanguage } from '@/modules/client/contexts';

interface BreakfastSelectionProps {
  breakfasts: number;
  onBreakfastsChange: (value: number) => void;
  breakfastPrice: number;
}

export default function BreakfastSelection({
  breakfasts,
  onBreakfastsChange,
  breakfastPrice,
}: BreakfastSelectionProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label htmlFor="breakfasts">
        {t("reservation.breakfastIncluded")}{' '}
        {breakfastPrice > 0 && (
          <span className="text-muted-foreground font-normal text-sm">
            (${breakfastPrice}/{t("reservation.perBreakfast")})
          </span>
        )}
      </Label>
      <Select value={breakfasts.toString()} onValueChange={(value) => onBreakfastsChange(parseInt(value))}>
        <SelectTrigger id="breakfasts">
          <SelectValue placeholder={t("reservation.selectBreakfastQuantity")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">{t("reservation.noBreakfast")}</SelectItem>
          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n} {n === 1 ? t("reservation.breakfast") : t("reservation.breakfasts")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

