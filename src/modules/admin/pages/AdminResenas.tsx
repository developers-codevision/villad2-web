import { Star } from "lucide-react";

export default function AdminResenas() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Reseñas</h1>
      <p className="text-muted-foreground mb-8">Consulta y modera las reseñas de los huéspedes.</p>
      <div className="border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-muted-foreground">
        <Star size={48} className="mb-4 opacity-30" />
        <p className="font-medium">Sin reseñas aún</p>
        <p className="text-sm mt-1">Las reseñas de tus huéspedes aparecerán aquí.</p>
      </div>
    </div>
  );
}
