import { Skeleton } from "@/modules/shared/components/ui/skeleton";

/**
 * Skeleton loader para la página RoomDetail
 * Muestra la estructura completa de la página mientras cargan los datos
 */
export default function RoomDetailSkeleton() {
  return (
    <main className="pb-20">
      {/* Hero Skeleton */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden mt-16">
        <Skeleton className="w-full h-full" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-10 w-96 mb-2" />
            <Skeleton className="h-6 w-full max-w-2xl mb-4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-32 rounded-full" />
              <Skeleton className="h-6 w-40" />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-12">
        {/* Amenities Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <Skeleton className="h-8 w-64 mb-4" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-8 w-64 mb-4" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Booking Form Skeleton */}
        <section className="mb-16">
          <Skeleton className="h-10 w-96 mx-auto mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-3 space-y-6">
              <Skeleton className="h-96 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-40 rounded-lg" />
            </div>

            {/* Resumen */}
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] rounded-lg" />
            </div>
          </div>
        </section>

        {/* Gallery Skeleton */}
        <section className="mb-16">
          <Skeleton className="h-10 w-64 mx-auto mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Skeleton className="col-span-2 row-span-2 h-96 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </section>
      </div>
    </main>
  );
}

