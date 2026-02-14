import { useState } from "react";
import { CalendarCheck, Check, X, User, BedDouble, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Reserva {
  id: number;
  huesped: string;
  email: string;
  telefono: string;
  habitacion: string;
  tipo_habitacion: string;
  fecha_entrada: string;
  fecha_salida: string;
  noches: number;
  personas: number;
  precio_total: number;
  metodo_pago: string;
  estado: "pendiente" | "aceptada" | "cancelada";
  fecha_solicitud: string;
  notas: string;
}

const MOCK_RESERVAS: Reserva[] = [
  {
    id: 1, huesped: "María García López", email: "maria@email.com", telefono: "+34 612 345 678",
    habitacion: "101", tipo_habitacion: "Doble", fecha_entrada: "2026-03-01", fecha_salida: "2026-03-05",
    noches: 4, personas: 2, precio_total: 320, metodo_pago: "Stripe",
    estado: "pendiente", fecha_solicitud: "2026-02-13", notas: "Llegada tardía (~22h)"
  },
  {
    id: 2, huesped: "Carlos Ruiz Pérez", email: "carlos@email.com", telefono: "+34 698 765 432",
    habitacion: "205", tipo_habitacion: "Suite", fecha_entrada: "2026-02-20", fecha_salida: "2026-02-23",
    noches: 3, personas: 2, precio_total: 450, metodo_pago: "Bizum",
    estado: "pendiente", fecha_solicitud: "2026-02-12", notas: ""
  },
  {
    id: 3, huesped: "Ana Martínez Solís", email: "ana.m@email.com", telefono: "+34 611 222 333",
    habitacion: "102", tipo_habitacion: "Individual", fecha_entrada: "2026-02-28", fecha_salida: "2026-03-02",
    noches: 2, personas: 1, precio_total: 120, metodo_pago: "Zelle",
    estado: "pendiente", fecha_solicitud: "2026-02-14", notas: "Necesita cuna para bebé"
  },
];

export default function AdminReservas() {
  const [reservas, setReservas] = useState<Reserva[]>(MOCK_RESERVAS);
  const [confirmAction, setConfirmAction] = useState<{ id: number; action: "aceptar" | "cancelar" } | null>(null);

  const pendientes = reservas.filter(r => r.estado === "pendiente");
  const procesadas = reservas.filter(r => r.estado !== "pendiente");

  const handleConfirm = () => {
    if (!confirmAction) return;
    const { id, action } = confirmAction;
    setReservas(prev =>
      prev.map(r => r.id === id ? { ...r, estado: action === "aceptar" ? "aceptada" : "cancelada" } : r)
    );
    toast.success(action === "aceptar" ? "Reserva aceptada" : "Reserva cancelada");
    setConfirmAction(null);
  };

  const selectedReserva = confirmAction ? reservas.find(r => r.id === confirmAction.id) : null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Reservas Pendientes</h1>
      <p className="text-muted-foreground mb-6">Gestiona las reservas entrantes del hostal.</p>

      {pendientes.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-muted-foreground">
          <CalendarCheck size={48} className="mb-4 opacity-30" />
          <p className="font-medium">Sin reservas pendientes</p>
          <p className="text-sm mt-1">Las nuevas reservas aparecerán aquí.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendientes.map(r => (
            <Card key={r.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Info */}
                  <div className="flex-1 p-5 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-muted-foreground" />
                        <span className="font-semibold">{r.huesped}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{r.fecha_solicitud}</Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Habitación</span>
                        <p className="font-medium flex items-center gap-1"><BedDouble size={14} /> {r.habitacion} — {r.tipo_habitacion}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Entrada</span>
                        <p className="font-medium">{r.fecha_entrada}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Salida</span>
                        <p className="font-medium">{r.fecha_salida}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Noches / Personas</span>
                        <p className="font-medium">{r.noches} noches · {r.personas} pers.</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pago</span>
                        <p className="font-medium flex items-center gap-1"><CreditCard size={14} /> {r.metodo_pago}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total</span>
                        <p className="font-semibold text-primary">${r.precio_total}</p>
                      </div>
                    </div>

                    {r.notas && (
                      <p className="text-sm text-muted-foreground italic border-l-2 border-border pl-3">{r.notas}</p>
                    )}

                    <div className="text-xs text-muted-foreground">
                      {r.email} · {r.telefono}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col items-center justify-end gap-2 p-4 md:border-l border-t md:border-t-0 border-border bg-muted/30">
                    <Button size="sm" className="gap-1.5" onClick={() => setConfirmAction({ id: r.id, action: "aceptar" })}>
                      <Check size={16} /> Aceptar
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5 text-destructive hover:text-destructive" onClick={() => setConfirmAction({ id: r.id, action: "cancelar" })}>
                      <X size={16} /> Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Procesadas */}
      {procesadas.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">Historial reciente</h2>
          <div className="space-y-2">
            {procesadas.map(r => (
              <div key={r.id} className="flex items-center justify-between border border-border rounded-lg px-4 py-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{r.huesped}</span>
                  <span className="text-muted-foreground">Hab. {r.habitacion}</span>
                  <span className="text-muted-foreground">{r.fecha_entrada} → {r.fecha_salida}</span>
                </div>
                <Badge variant={r.estado === "aceptada" ? "default" : "destructive"}>
                  {r.estado === "aceptada" ? "Aceptada" : "Cancelada"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.action === "aceptar" ? "¿Aceptar reserva?" : "¿Cancelar reserva?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedReserva && (
                <>Reserva de <strong>{selectedReserva.huesped}</strong> — Hab. {selectedReserva.habitacion} ({selectedReserva.fecha_entrada} a {selectedReserva.fecha_salida})</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={confirmAction?.action === "cancelar" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            >
              {confirmAction?.action === "aceptar" ? "Sí, aceptar" : "Sí, cancelar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
