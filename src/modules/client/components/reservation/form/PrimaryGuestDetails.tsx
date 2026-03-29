import { Label } from '@/modules/shared/components/ui/label';
import { Input } from '@/modules/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/shared/components/ui/select';

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
  const hasError = (fieldName: string) => {
    return validationErrors.some(error =>
      error.toLowerCase().includes(fieldName.toLowerCase())
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Datos del Huésped Principal</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            placeholder="Juan"
            className={hasError('nombre') ? "border-red-500 focus:border-red-500" : ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            placeholder="Pérez"
            className={hasError('apellido') ? "border-red-500 focus:border-red-500" : ""}
          />
        </div>
      </div>
       <div className="space-y-2">
        <Label htmlFor="idNumber">CI o Pasaporte</Label>
        <Input
          id="idNumber"
          value={idNumber}
          onChange={(e) => onIdNumberChange(e.target.value)}
          placeholder="12345678"
          className={hasError('identificación') ? "border-red-500 focus:border-red-500" : ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sex">Sexo</Label>
        <Select value={sex || ""} onValueChange={(value) => onSexChange(value as 'M' | 'F' | 'otro')}>
          <SelectTrigger className={hasError('sexo') ? "border-red-500 focus:border-red-500" : ""}>
            <SelectValue placeholder="Seleccionar sexo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="M">Masculino</SelectItem>
            <SelectItem value="F">Femenino</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="tu@email.com"
            className={hasError('email') ? "border-red-500 focus:border-red-500" : ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+51 987 654 321"
            className={hasError('teléfono') ? "border-red-500 focus:border-red-500" : ""}
          />
        </div>
      </div>
    </div>
  );
}
