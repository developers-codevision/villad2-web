import { BedDouble } from "lucide-react";

export default function AdminHabitaciones() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Habitaciones</h1>
      <p className="text-muted-foreground mb-8">Administra las habitaciones y su disponibilidad.</p>
      <div className="border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-muted-foreground">
        <BedDouble size={48} className="mb-4 opacity-30" />
        <p className="font-medium">Módulo en construcción</p>
        <p className="text-sm mt-1">Pronto podrás gestionar habitaciones desde aquí.</p>
      </div>
    </div>
  );
}
