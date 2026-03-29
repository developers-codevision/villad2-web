import { Label } from '@/modules/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/shared/components/ui/select';

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
  return (
    <div className="space-y-2">
      <Label htmlFor="breakfasts">
        Desayunos Incluidos{' '}
        {breakfastPrice > 0 && (
          <span className="text-muted-foreground font-normal text-sm">
            (${breakfastPrice}/desayuno)
          </span>
        )}
      </Label>
      <Select value={breakfasts.toString()} onValueChange={(value) => onBreakfastsChange(parseInt(value))}>
        <SelectTrigger id="breakfasts">
          <SelectValue placeholder="Seleccionar cantidad de desayunos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">Sin desayunos</SelectItem>
          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n} {n === 1 ? "desayuno" : "desayunos"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

