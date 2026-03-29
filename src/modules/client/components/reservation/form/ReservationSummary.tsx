import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ImageWithPlaceholder } from '@/modules/shared/components';
import { parsePhotos } from '@/modules/client/utils/roomHelpers';
import { roomsService } from '@/modules/shared/services/rooms.service';
import { ROOM_TYPE_LABELS } from "@/modules/admin/types/rooms.types.ts";
import type { Room } from '@/modules/shared/types/api.types';
import type { ReservationBreakdown } from '../types';

interface ReservationSummaryProps {
  selectedRoom: Room | undefined;
  maxCapacity: number;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  nights: number;
  totalGuests: number;
  extraGuestsCount: number;
  totalPrice: number;
  breakdown: ReservationBreakdown | undefined;
  breakfasts: number;
}

export default function ReservationSummary({
  selectedRoom,
  maxCapacity,
  checkIn,
  checkOut,
  nights,
  totalGuests,
  extraGuestsCount,
  totalPrice,
  breakdown,
  breakfasts,
}: ReservationSummaryProps) {
  const breakfastsCost = breakdown?.breakfastsCost ?? 0;
  const earlyCheckInCost = breakdown?.earlyCheckInCost ?? 0;
  const lateCheckOutCost = breakdown?.lateCheckOutCost ?? 0;
  const transferOneWayCost = breakdown?.transferOneWayCost ?? 0;
  const transferReturnCost = breakdown?.transferReturnCost ?? 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
      <h3 className="font-bold text-lg mb-4">Resumen de Reserva</h3>
      {selectedRoom ? (
        <>
          {(() => {
            const mainPhotoArray = parsePhotos(selectedRoom.mainPhoto);
            const mainImage = mainPhotoArray.length > 0
              ? roomsService.getMediaUrl(mainPhotoArray[0])
              : '/placeholder.svg';
            return (
              <ImageWithPlaceholder
                src={mainImage}
                alt={selectedRoom.name}
                className="rounded-lg w-full h-40 object-cover mb-4"
                loading="lazy"
              />
            );
          })()}
          <p className="font-semibold">{selectedRoom.name}</p>
          <p className="text-sm text-muted-foreground mb-4">
            {ROOM_TYPE_LABELS[selectedRoom.roomType]} · Hasta {maxCapacity} {maxCapacity === 1 ? "persona" : "personas"}
          </p>
        </>
      ) : (
        <p className="text-muted-foreground text-sm mb-4">Selecciona una habitación</p>
      )}
      <div className="border-t border-border pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Check-in</span>
          <span>{checkIn ? format(checkIn, "dd MMM yyyy", { locale: es }) : "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Check-out</span>
          <span>{checkOut ? format(checkOut, "dd MMM yyyy", { locale: es }) : "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Noches</span>
          <span>{nights}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Huéspedes</span>
          <span>{totalGuests}</span>
        </div>
        {breakfasts > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Desayunos ({breakfasts})</span>
              <span>${breakfastsCost}</span>
            </div>
          </div>
        )}
        {earlyCheckInCost > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Early check-in</span>
            <span>${earlyCheckInCost}</span>
          </div>
        )}
        {lateCheckOutCost > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Late check-out</span>
            <span>${lateCheckOutCost}</span>
          </div>
        )}
        {transferOneWayCost > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Transporte ida</span>
            <span>${transferOneWayCost}</span>
          </div>
        )}
        {transferReturnCost > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Transporte vuelta</span>
            <span>${transferReturnCost}</span>
          </div>
        )}
        {selectedRoom && (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Precio/noche</span>
              <span>${selectedRoom.pricePerNight}</span>
            </div>
            {extraGuestsCount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Huéspedes adicionales</span>
              </div>
            )}
          </>
        )}
      </div>
      <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
        <span className="font-bold text-lg">Total</span>
        <span className="font-bold text-2xl text-primary">${totalPrice}</span>
      </div>
    </div>
  );
}

