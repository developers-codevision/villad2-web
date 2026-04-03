import { FormEvent, useEffect } from 'react';
import type { ReservationFormProps } from './types';
import { usePricesData, handleTotalGuestsChange } from './utils';
import { useLanguage } from '@/modules/client/contexts';

// ...existing code...
import { PaymentMethodsStep, PaymentZelleStep, PaymentBizumStep } from './payment';

// Confirmation component
import { ConfirmationStep } from './confirmation';

// Form components
import {
  RoomSelectionSection,
  GuestCountSection,
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
  const { t } = useLanguage();

  const {
    formData,
    step,
    submitting,
    confirmed,
    reservationSummary,
    updateFormField,
    selectRoom,
    submitReservation,
    submitPayment,
    validationErrors,
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
    submitReservation();
  };

  // Render components based on step
  if (step === 'payment') {
    return (
      <PaymentMethodsStep
        hook={hook}
        totalPrice={totalPrice}
      />
    );
  }

  // Zelle payment page
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

  // Bizum payment page
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
      {/* Room and guest selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RoomSelectionSection
          roomId={formData.roomId}
          rooms={rooms}
          loadingRooms={loadingRooms}
          disabled={!!singleRoomId}
          onRoomSelect={handleRoomSelect}
          validationErrors={validationErrors}
        />

        <GuestCountSection
          totalGuests={formData.totalGuests}
          maxCapacity={maxCapacity}
          disabled={!selectedRoom}
          onGuestCountChange={handleTotalGuestsChangeHelper}
          validationErrors={validationErrors}
        />
      </div>

      {/* Calendar */}
      <DateSelection
        checkIn={formData.checkIn}
        checkOut={formData.checkOut}
        occupiedDates={occupiedDates}
        selectedRoomId={formData.roomId}
        onDateChange={(from, to) => setDateRange(from, to)}
        validationErrors={validationErrors}
      />

      {/* Main grid: Form + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <PrimaryGuestDetails
            firstName={formData.guestFirstName}
            lastName={formData.guestLastName}
            sex={formData.guestSex}
            email={formData.guestEmail}
            phone={formData.guestPhone}
            idNumber={formData.guestIdNumber}
            onFirstNameChange={(value) => updateFormField('guestFirstName', value)}
            onLastNameChange={(value) => updateFormField('guestLastName', value)}
            onSexChange={(value) => updateFormField('guestSex', value)}
            onEmailChange={(value) => updateFormField('guestEmail', value)}
            onPhoneChange={(value) => updateFormField('guestPhone', value)}
            onIdNumberChange={(value) => updateFormField('guestIdNumber', value)}
            validationErrors={validationErrors}
          />

        <AdditionalGuestsList
          guests={formData.additionalGuests}
          onGuestChange={(index, guest) => {
            const newGuests = [...formData.additionalGuests];
            newGuests[index] = guest;
            updateFormField('additionalGuests', newGuests);
          }}
          validationErrors={validationErrors}
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

        <FormSubmitButton submitting={submitting} />

        {validationErrors.length > 0 && (
          <p className="text-red-600 text-sm text-center mt-2">
            {t("reservation.completeRequiredFields")}
          </p>
        )}
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
