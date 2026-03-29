import { Button } from '@/modules/shared/components/ui/button';
import { lazy, Suspense } from 'react';
import type { ReservationHook } from '../types';

const LazyPayPalCheckout = lazy(() => import('../../PayPalCheckout'));

interface PaymentMethodsStepProps {
  hook: ReservationHook;
  totalPrice: number;
}

export default function PaymentMethodsStep({ hook, totalPrice }: PaymentMethodsStepProps) {
  const { submitting, submitPayment } = hook;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Selecciona Método de Pago</h1>
        <p className="text-muted-foreground text-lg">
          Total a pagar: <span className="font-bold text-primary text-2xl">${totalPrice}</span>
        </p>
      </div>

      <div className="space-y-3">
        {/* Zelle */}
        <PaymentMethodButton
          label="Zelle"
          description="Transferencia bancaria en EE.UU."
          icon="/zelle.svg"
          onClick={() => hook.goToStep('payment-zelle')}
        />

        {/* Bizum */}
        <PaymentMethodButton
          label="Bizum"
          description="Transferencia instantánea en España"
          icon="/bizum.svg"
          onClick={() => hook.goToStep('payment-bizum')}
        />

        {/* Stripe */}
        <PaymentMethodButton
          label="Stripe"
          description="Visa, Mastercard, American Express"
          icon="/stripe.svg"
          onClick={() => submitPayment('stripe')}
          disabled={submitting}
          highlighted
        />

        {/* PayPal */}
        <PayPalPaymentMethod hook={hook} />
      </div>

      {/* Back button */}
      <div className="pt-4">
        <Button variant="outline" onClick={() => hook.previousStep()} className="w-full">
          ← Volver a detalles
        </Button>
      </div>
    </div>
  );
}

interface PaymentMethodButtonProps {
  label: string;
  description: string;
  icon: string;
  onClick: () => void;
  disabled?: boolean;
  highlighted?: boolean;
}

function PaymentMethodButton({
  label,
  description,
  icon,
  onClick,
  disabled = false,
  highlighted = false,
}: PaymentMethodButtonProps) {
  const baseClass = "w-full border-2 border-border rounded-lg p-4 flex items-center gap-4 hover:border-primary hover:bg-primary/5 transition-all duration-300 group text-left";
  const highlightedClass = highlighted ? "border-2 border-primary/50 bg-primary/5 hover:border-primary hover:bg-primary/10" : "";
  const disabledClass = disabled ? "disabled:opacity-50 disabled:cursor-not-allowed" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${highlightedClass} ${disabledClass}`}
    >
      <img src={icon} alt={label} width={32} height={32} className="w-8 h-8 object-contain" />
      <div className="flex-1">
        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{label}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="text-xl text-muted-foreground group-hover:text-primary transition-colors">→</span>
    </button>
  );
}

interface PayPalPaymentMethodProps {
  hook: ReservationHook;
}

function PayPalPaymentMethod({ hook }: PayPalPaymentMethodProps) {
  const selectedRoom = null; // This will be passed from parent if needed

  return (
    <div className="w-full border-2 border-border rounded-lg p-4">
      <div className="flex items-center gap-4 mb-3">
        <img src="/paypal.svg" alt="PayPal" width={32} height={32} className="w-8 h-8 object-contain" />
        <div className="flex-1">
          <h3 className="font-semibold text-lg">PayPal</h3>
          <p className="text-sm text-muted-foreground">Paga de forma segura con PayPal</p>
        </div>
      </div>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Cargando PayPal...</p>}>
        <LazyPayPalCheckout hook={hook} room={selectedRoom} />
      </Suspense>
    </div>
  );
}






