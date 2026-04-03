import { Button } from '@/modules/shared/components/ui/button';
import { useLanguage } from '@/modules/client/contexts';

interface FormSubmitButtonProps {
  submitting: boolean;
}

export default function FormSubmitButton({
  submitting,
}: FormSubmitButtonProps) {
  const { t } = useLanguage();

  return (
    <Button
      type="submit"
      size="lg"
      className="w-full font-bold text-lg py-6"
      disabled={submitting}
    >
      {submitting ? t("reservation.processing") : t("reservation.confirmReservation")}
    </Button>
  );
}
