import { Button } from '@/modules/shared/components/ui/button';
import { useLanguage } from '@/modules/client/contexts';

interface PaymentBizumStepProps {
  totalPrice: number;
  onConfirm: () => void;
  onBack: () => void;
  submitting: boolean;
}

export default function PaymentBizumStep({
  totalPrice,
  onConfirm,
  onBack,
  submitting,
}: PaymentBizumStepProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-center">{t("reservation.paymentWithBizum")}</h1>
        <p className="text-muted-foreground text-center">
          {t("reservation.totalToPay")}: <span className="font-bold text-primary text-2xl">${totalPrice}</span>
        </p>
      </div>

      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6 space-y-4">
        <h2 className="font-semibold text-lg">{t("reservation.bizumInformation")}</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">{t("reservation.phoneNumber")}:</p>
            <p className="font-bold text-lg">+34 600 123 456</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("reservation.receiverName")}:</p>
            <p className="font-bold text-lg">Luis Manuel López González</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("reservation.amountToTransfer")}:</p>
            <p className="font-bold text-lg text-primary">${totalPrice}</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold">{t("reservation.instructions")}:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>{t("reservation.bizumStep1")}</li>
          <li>{t("reservation.bizumStep2")}</li>
          <li>{t("reservation.bizumStep3")}</li>
          <li>{t("reservation.bizumStep4").replace("${amount}", `$${totalPrice}`)}</li>
          <li>{t("reservation.bizumStep6")}</li>
          <li>{t("reservation.bizumStep7")}</li>
        </ol>
      </div>

      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-2">
        <p className="text-sm font-semibold">{t("reservation.remember")}:</p>
        <p className="text-sm text-muted-foreground">
          {t("reservation.bizumReminder")}
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          ← {t("reservation.back")}
        </Button>
        <Button onClick={onConfirm} disabled={submitting} className="flex-1 font-semibold">
          {submitting ? t("reservation.processing") : t("reservation.confirmPayment")}
        </Button>
      </div>
    </div>
  );
}

