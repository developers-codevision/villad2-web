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
      className="w-full font-bold text-lg py-6 h-auto whitespace-normal text-center flex-col gap-1"
      disabled={true}
    >
      <span>En desarrollo, puede reservar contactando directamente con el hostal</span>
      <span className="text-sm font-normal">In development, you can book by contacting the hostel directly</span>
    </Button>
  );
}
