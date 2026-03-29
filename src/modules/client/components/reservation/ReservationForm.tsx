import { FormEvent, useEffect } from 'react';
import type { ReservationFormProps } from './types';
import { usePricesData, handleTotalGuestsChange } from './utils';
import { Label } from '@/modules/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/shared/components/ui/select';

// Payment components
import { PaymentMethodsStep, PaymentZelleStep, PaymentBizumStep } from './payment';

// Confirmation component
import { ConfirmationStep } from './confirmation';

// Form components
import {
  DateSelection,
  PrimaryGuestDetails,
  AdditionalGuestsList,
  CheckInCheckOutOptions,
  TransportServices,
  BreakfastSelection,
  SpecialRequests,
  FormSubmitButton,
  ReservationSummary,
} from './form';

export default function ReservationForm({
  hook,
  rooms,
  loadingRooms = false,
  singleRoomId,
}: ReservationFormProps) {
  const prices = usePricesData();

  const {
    formData,
    step,
    submitting,
    confirmed,
    reservationSummary,
    updateFormField,
    selectRoom,
    resetForm,
    submitReservation,
    submitPayment,
    canSubmit,
    occupiedDates,
    setDateRange,
  } = hook;

  useEffect(() => {
    if (singleRoomId != null) {
      selectRoom(singleRoomId);
    }
  }, [singleRoomId, selectRoom]);

  const selectedRoom = rooms.find((r) => r.id === formData.roomId);
  const maxCapacity = selectedRoom
    ? selectedRoom.baseCapacity + selectedRoom.extraCapacity
    : 0;

  const { nights, totalPrice, breakdown } = reservationSummary(
    selectedRoom,
    prices
  ) as {
    nights: number;
    totalPrice: number;
    breakdown?: {
      baseTotal?: number;
      breakfastsCost?: number;
      earlyCheckInCost?: number;
      lateCheckOutCost?: number;
      transferOneWayCost?: number;
      transferReturnCost?: number;
    };
  };

  const handleRoomSelect = (roomId: number) => {
    selectRoom(roomId);
    if (formData.totalGuests > 0) {
      handleTotalGuestsChangeHelper(formData.totalGuests);
    }
  };

  const handleTotalGuestsChangeHelper = (total: number) => {
    handleTotalGuestsChange(total, selectedRoom, formData.additionalGuests, {
      updateFormField,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (canSubmit && selectedRoom) {
      submitReservation();
    }
  };

  // Payment method selection step
  if (step === 'payment') {
    return (
      <PaymentMethodsStep
        hook={hook}
        totalPrice={totalPrice}
      />
    );
  }

  // Payment Zelle page
  if (step === 'payment-zelle') {
    return (
      <PaymentZelleStep
        totalPrice={totalPrice}
        onConfirm={() => submitPayment('zelle')}
        onBack={() => hook.goToStep('payment')}
        submitting={submitting}
      />
    );
  }

  // Payment Bizum page
  if (step === 'payment-bizum') {
    return (
      <PaymentBizumStep
        totalPrice={totalPrice}
        onConfirm={() => submitPayment('bizum')}
        onBack={() => hook.goToStep('payment')}
        submitting={submitting}
      />
    );
  }

  // Confirmation page
  if (confirmed) {
    return (
      <ConfirmationStep
        hook={hook}
        selectedRoom={selectedRoom}
        nights={nights}
        totalPrice={totalPrice}
      />
    );
  }

  // Main reservation form
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Room Selection - Full Width */}
      <div className="space-y-2">
        <Label>Habitación</Label>
        <Select
          value={formData.roomId?.toString() || ''}
          onValueChange={(value) => handleRoomSelect(parseInt(value))}
          disabled={loadingRooms || !!singleRoomId}
        >
          <SelectTrigger>
            <SelectValue placeholder={loadingRooms ? "Cargando..." : "Seleccionar habitación"} />
          </SelectTrigger>
          <SelectContent>
            {rooms.map((r) => (
              <SelectItem key={r.id} value={r.id.toString()}>
                 {`# ${r.number}`} : {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Calendar - Full Width */}
      <DateSelection
        checkIn={formData.checkIn}
        checkOut={formData.checkOut}
        occupiedDates={occupiedDates}
        selectedRoomId={formData.roomId}
        onDateChange={(from, to) => setDateRange(from, to)}
      />

      {/* Guest Count - After Calendar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Huéspedes Totales</Label>
          <Select
            value={formData.totalGuests.toString()}
            onValueChange={(value) => handleTotalGuestsChangeHelper(parseInt(value))}
            disabled={!selectedRoom}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: Math.max(maxCapacity, 1) }, (_, i) => i + 1).map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} {n === 1 ? "huésped" : "huéspedes"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rest of form with summary sidebar - Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <PrimaryGuestDetails
            firstName={formData.guestFirstName}
            lastName={formData.guestLastName}
            sex={formData.guestSex}
            email={formData.guestEmail}
            phone={formData.guestPhone}
            onFirstNameChange={(value) => updateFormField('guestFirstName', value)}
            onLastNameChange={(value) => updateFormField('guestLastName', value)}
            onSexChange={(value) => updateFormField('guestSex', value)}
            onEmailChange={(value) => updateFormField('guestEmail', value)}
            onPhoneChange={(value) => updateFormField('guestPhone', value)}
          />

        <AdditionalGuestsList
          guests={formData.additionalGuests}
          onGuestChange={(index, guest) => {
            const newGuests = [...formData.additionalGuests];
            newGuests[index] = guest;
            updateFormField('additionalGuests', newGuests);
          }}
        />

        <CheckInCheckOutOptions
          earlyCheckIn={formData.earlyCheckIn}
          lateCheckOut={formData.lateCheckOut}
          onEarlyCheckInChange={(checked) => updateFormField('earlyCheckIn', checked)}
          onLateCheckOutChange={(checked) => updateFormField('lateCheckOut', checked)}
        />

        <TransportServices
          transferOneWay={formData.transferOneWay}
          transferRoundTrip={formData.transferRoundTrip}
          onTransferOneWayChange={(checked) => updateFormField('transferOneWay', checked)}
          onTransferRoundTripChange={(checked) => updateFormField('transferRoundTrip', checked)}
        />

        <BreakfastSelection
          breakfasts={formData.breakfasts}
          onBreakfastsChange={(value) => updateFormField('breakfasts', value)}
          breakfastPrice={prices.breakfastPrice}
        />

        <SpecialRequests
          notes={formData.notes}
          onNotesChange={(value) => updateFormField('notes', value)}
        />

        <FormSubmitButton submitting={submitting} canSubmit={canSubmit} />
      </div>

      <div className="lg:col-span-2">
        <ReservationSummary
          selectedRoom={selectedRoom}
          maxCapacity={maxCapacity}
          checkIn={formData.checkIn}
          checkOut={formData.checkOut}
          nights={nights}
          totalGuests={formData.totalGuests}
          extraGuestsCount={formData.extraGuestsCount}
          totalPrice={totalPrice}
          breakdown={breakdown}
          breakfasts={formData.breakfasts}
        />
      </div>
      </div>
    </form>
  );
}

