import { Skeleton } from "@/modules/shared/components/ui/skeleton";

/**
 * Skeleton loader para el componente RoomCard
 * Muestra una estructura similar a la tarjeta real mientras cargan los datos
 */
export default function RoomCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {/* Imagen skeleton */}
      <Skeleton className="w-full aspect-[4/3]" />

      {/* Contenido skeleton */}
      <div className="p-5 space-y-3">
        {/* Header con título y capacidad */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-12" />
        </div>

        {/* Descripción */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />

        {/* Botones */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </div>
    </div>
  );
}

