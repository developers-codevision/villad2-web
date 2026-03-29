import { Label } from '@/modules/shared/components/ui/label';
import { Input } from '@/modules/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/shared/components/ui/select';

interface PrimaryGuestDetailsProps {
  firstName: string;
  lastName: string;
  sex: 'M' | 'F' | 'otro';
  email: string;
  phone: string;
  idNumber: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onSexChange: (value: 'M' | 'F' | 'otro') => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onIdNumberChange: (value: string) => void;
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
}: PrimaryGuestDetailsProps) {
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
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            placeholder="Pérez"
            required
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
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sex">Sexo</Label>
        <Select value={sex} onValueChange={onSexChange}>
          <SelectTrigger id="sex">
            <SelectValue />
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
            required
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
            required
          />
        </div>
      </div>
    </div>
  );
}
