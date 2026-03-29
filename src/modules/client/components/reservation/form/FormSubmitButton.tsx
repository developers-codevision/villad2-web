import { Button } from '@/modules/shared/components/ui/button';

interface FormSubmitButtonProps {
  submitting: boolean;
}

export default function FormSubmitButton({
  submitting,
}: FormSubmitButtonProps) {
  return (
    <Button
      type="submit"
      size="lg"
      className="w-full font-bold text-lg py-6"
      disabled={submitting}
    >
      {submitting ? 'Procesando...' : 'Confirmar Reserva'}
    </Button>
  );
}
