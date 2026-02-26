import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/modules/shared/components/ui/button';

/**
 * Stripe Return Page
 * Handles the redirect back from Stripe-hosted checkout
 */
export default function StripeReturn() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get the session_id from URL params
    const sessionIdParam = searchParams.get('session_id');
    const canceledParam = searchParams.get('canceled');

    setSessionId(sessionIdParam);

    if (canceledParam === 'true') {
      setStatus('error');
      setMessage('Pago cancelado. Puedes continuar navegando y reservar cuando estés listo.');
    } else if (sessionIdParam) {
      // If we have a session_id, the payment was successful
      setStatus('success');
      setMessage('¡Pago completado con éxito! Recibirás un correo de confirmación.');

      // Optional: You can call your backend to verify the session status
      // fetch(`/api/payment/verify-session?session_id=${sessionIdParam}`)
      //   .then(res => res.json())
      //   .then(data => {
      //     if (data.status === 'complete') {
      //       setStatus('success');
      //     } else {
      //       setStatus('error');
      //     }
      //   })
      //   .catch(() => {
      //     setStatus('error');
      //     setMessage('Error al verificar el estado del pago.');
      //   });
    } else {
      setStatus('error');
      setMessage('No se pudo verificar el estado del pago.');
    }
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Procesando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {status === 'success' ? (
          <>
            <CheckCircle className="h-20 w-20 mx-auto text-green-500" />
            <h1 className="text-3xl font-bold text-green-700">¡Pago Exitoso!</h1>
            <p className="text-muted-foreground">{message}</p>
            {sessionId && (
              <div className="bg-muted/30 rounded-lg p-4 text-sm">
                <p className="text-muted-foreground">ID de sesión:</p>
                <p className="font-mono text-xs break-all">{sessionId}</p>
              </div>
            )}
            <div className="space-y-3 pt-4">
              <Button asChild className="w-full">
                <Link to="/">Volver al Inicio</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/habitaciones">Ver Habitaciones</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <XCircle className="h-20 w-20 mx-auto text-red-500" />
            <h1 className="text-3xl font-bold text-red-700">Pago Cancelado</h1>
            <p className="text-muted-foreground">{message}</p>
            <div className="space-y-3 pt-4">
              <Button asChild className="w-full">
                <Link to="/reservas">Intentar de Nuevo</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/">Volver al Inicio</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

