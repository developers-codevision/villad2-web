import { Label } from '@/modules/shared/components/ui/label';
import { Input } from '@/modules/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/shared/components/ui/select';
import { useLanguage } from '@/modules/client/contexts';

interface AdditionalGuest {
  firstName: string;
  lastName: string;
  sex: 'M' | 'F' | 'otro' | undefined;
  idNumber?: string;
}

interface AdditionalGuestsListProps {
  guests: AdditionalGuest[];
  onGuestChange: (index: number, guest: AdditionalGuest) => void;
  validationErrors?: string[];
}

export default function AdditionalGuestsList({
  guests,
  onGuestChange,
  validationErrors = [],
}: AdditionalGuestsListProps) {
  const { t } = useLanguage();

  const hasError = (guestIndex: number, fieldName: string) => {
    const guestNumber = guestIndex + 2; // Primary guest is #1, additional start from #2
    return validationErrors.some(error =>
      error.toLowerCase().includes(`huésped #${guestNumber}`) &&
      error.toLowerCase().includes(fieldName.toLowerCase())
    );
  };

  if (guests.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {guests.map((guest, index) => (
        <div key={index} className="border border-border rounded-lg p-4 space-y-4">
          <h4 className="font-medium">{t("reservation.guestDetails")}{index + 1}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("reservation.firstName")}</Label>
              <Input
                value={guest.firstName}
                onChange={(e) =>
                  onGuestChange(index, { ...guest, firstName: e.target.value })
                }
                placeholder=""
                className={hasError(index, 'nombre') ? "border-red-500 focus:border-red-500" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("reservation.lastName")}</Label>
              <Input
                value={guest.lastName}
                onChange={(e) =>
                  onGuestChange(index, { ...guest, lastName: e.target.value })
                }
                placeholder=""
                className={hasError(index, 'apellido') ? "border-red-500 focus:border-red-500" : ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("reservation.sex")}</Label>
            <Select
              value={guest.sex || ""}
              onValueChange={(value) =>
                onGuestChange(index, { ...guest, sex: value as 'M' | 'F' | 'otro' })
              }
            >
              <SelectTrigger className={hasError(index, 'sexo') ? "border-red-500 focus:border-red-500" : ""}>
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">{t("reservation.male")}</SelectItem>
                <SelectItem value="F">{t("reservation.female")}</SelectItem>
                <SelectItem value="otro">{t("reservation.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("reservation.idNumber")}</Label>
            <Input
              value={guest.idNumber || ''}
              onChange={(e) =>
                onGuestChange(index, { ...guest, idNumber: e.target.value })
              }
              placeholder={""}
              className=""
            />
          </div>
        </div>
      ))}
    </div>
  );
}
