import { CalendarCheck } from "lucide-react";

export default function AdminReservas() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Reservas Pendientes</h1>
      <p className="text-muted-foreground mb-8">Gestiona las reservas entrantes del hostal.</p>
      <div className="border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-muted-foreground">
        <CalendarCheck size={48} className="mb-4 opacity-30" />
        <p className="font-medium">Sin reservas pendientes</p>
        <p className="text-sm mt-1">Las nuevas reservas aparecerán aquí.</p>
      </div>
    </div>
  );
}
