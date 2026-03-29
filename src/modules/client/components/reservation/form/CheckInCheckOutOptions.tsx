import { Label } from '@/modules/shared/components/ui/label';
import { Checkbox } from '@/modules/shared/components/ui/checkbox';

interface CheckInCheckOutOptionsProps {
  earlyCheckIn: boolean;
  lateCheckOut: boolean;
  onEarlyCheckInChange: (checked: boolean) => void;
  onLateCheckOutChange: (checked: boolean) => void;
}

export default function CheckInCheckOutOptions({
  earlyCheckIn,
  lateCheckOut,
  onEarlyCheckInChange,
  onLateCheckOutChange,
}: CheckInCheckOutOptionsProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">Opciones de Llegada y Salida</h3>
      <div className="flex items-center gap-3">
        <Checkbox
          id="earlyCheckIn"
          checked={earlyCheckIn}
          onCheckedChange={(checked) => onEarlyCheckInChange(!!checked)}
        />
        <Label htmlFor="earlyCheckIn" className="cursor-pointer font-normal">
          Early check-in
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox
          id="lateCheckOut"
          checked={lateCheckOut}
          onCheckedChange={(checked) => onLateCheckOutChange(!!checked)}
        />
        <Label htmlFor="lateCheckOut" className="cursor-pointer font-normal">
          Late check-out
        </Label>
      </div>
    </div>
  );
}

