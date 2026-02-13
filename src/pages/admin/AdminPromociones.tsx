import { Tag } from "lucide-react";

export default function AdminPromociones() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Promociones</h1>
      <p className="text-muted-foreground mb-8">Crea y gestiona ofertas especiales para tus huéspedes.</p>
      <div className="border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-muted-foreground">
        <Tag size={48} className="mb-4 opacity-30" />
        <p className="font-medium">Sin promociones activas</p>
        <p className="text-sm mt-1">Crea tu primera promoción para atraer más huéspedes.</p>
      </div>
    </div>
  );
}
