import { Label } from '@/modules/shared/components/ui/label';
import { Input } from '@/modules/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/shared/components/ui/select';
import { useLanguage } from '@/modules/client/contexts';
import { getErrorClassName, hasFieldError } from '../utils';

interface PrimaryGuestDetailsProps {
  firstName: string;
  lastName: string;
  sex: 'M' | 'F' | 'otro' | undefined;
  email: string;
  phone: string;
  idNumber: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onSexChange: (value: 'M' | 'F' | 'otro') => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onIdNumberChange: (value: string) => void;
  validationErrors?: string[];
}

export default function PrimaryGuestDetails({
  firstName,
  lastName,
  sex,
  email,
  phone,
  idNumber,
  onFirstNameChange,
  onLastNameChange,
  onSexChange,
  onEmailChange,
  onPhoneChange,
  onIdNumberChange,
  validationErrors = [],
}: PrimaryGuestDetailsProps) {
  const { t } = useLanguage();


  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{t("reservation.guestDetails")}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t("reservation.firstName")}</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            placeholder=""
            className={getErrorClassName('nombre', validationErrors)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">{t("reservation.lastName")}</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            placeholder=""
            className={getErrorClassName('apellido', validationErrors)}
          />
        </div>
      </div>
       <div className="space-y-2">
        <Label htmlFor="idNumber">{t("reservation.idNumber")}</Label>
        <Input
          id="idNumber"
          value={idNumber}
          onChange={(e) => onIdNumberChange(e.target.value)}
          placeholder={""}
          className={getErrorClassName('identificación', validationErrors)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sex">{t("reservation.sex")}</Label>
        <Select value={sex || ""} onValueChange={(value) => onSexChange(value as 'M' | 'F' | 'otro')}>
          <SelectTrigger className={getErrorClassName('sexo', validationErrors)}>
            <SelectValue placeholder={t("reservation.selectSex")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="M">{t("reservation.male")}</SelectItem>
            <SelectItem value="F">{t("reservation.female")}</SelectItem>
            <SelectItem value="otro">{t("reservation.other")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t("reservation.email")}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder=""
            className={getErrorClassName('email', validationErrors)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("reservation.phone")}</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder=""
            className={getErrorClassName('teléfono', validationErrors)}
          />
        </div>
      </div>
    </div>
  );
}
