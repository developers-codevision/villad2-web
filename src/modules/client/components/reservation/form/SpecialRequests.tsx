import { Label } from '@/modules/shared/components/ui/label';
import { Textarea } from '@/modules/shared/components/ui/textarea';

interface SpecialRequestsProps {
  notes: string;
  onNotesChange: (value: string) => void;
}

export default function SpecialRequests({
  notes,
  onNotesChange,
}: SpecialRequestsProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="requests">Notas o Peticiones Especiales (Opcional)</Label>
      <Textarea
        id="requests"
        rows={3}
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Llegada tardía, cuna para bebé, etc."
      />
    </div>
  );
}

