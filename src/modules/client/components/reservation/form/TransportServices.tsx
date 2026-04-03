import { Label } from '@/modules/shared/components/ui/label';
import { Checkbox } from '@/modules/shared/components/ui/checkbox';
import { useLanguage } from '@/modules/client/contexts';

interface TransportServicesProps {
  transferOneWay: boolean;
  transferRoundTrip: boolean;
  onTransferOneWayChange: (checked: boolean) => void;
  onTransferRoundTripChange: (checked: boolean) => void;
}

export default function TransportServices({
  transferOneWay,
  transferRoundTrip,
  onTransferOneWayChange,
  onTransferRoundTripChange,
}: TransportServicesProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">{t("reservation.transportServices")}</h3>
      <div className="flex items-center gap-3">
        <Checkbox
          id="transferOneWay"
          checked={transferOneWay}
          onCheckedChange={(checked) => onTransferOneWayChange(!!checked)}
        />
        <Label htmlFor="transferOneWay" className="cursor-pointer font-normal">
          {t("reservation.airportPickup")}
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox
          id="transferRoundTrip"
          checked={transferRoundTrip}
          onCheckedChange={(checked) => onTransferRoundTripChange(!!checked)}
        />
        <Label htmlFor="transferRoundTrip" className="cursor-pointer font-normal">
          {t("reservation.airportReturn")}
        </Label>
      </div>
    </div>
  );
}
