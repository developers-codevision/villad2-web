import { Label } from '@/modules/shared/components/ui/label';
import { Calendar } from '@/modules/shared/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';

interface DateSelectionProps {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  occupiedDates: string[];
  selectedRoomId: number | undefined;
  onDateChange: (from: Date | undefined, to: Date | undefined) => void;
  validationErrors?: string[];
}

export default function DateSelection({
  checkIn,
  checkOut,
  occupiedDates,
  selectedRoomId,
  onDateChange,
  validationErrors = [],
}: DateSelectionProps) {
  const [numberOfMonths, setNumberOfMonths] = useState(1);

  // Ajustar cantidad de meses según tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setNumberOfMonths(2);
      } else {
        setNumberOfMonths(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      // Prevent selecting same day or invalid ranges
      const nights = Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24));
      if (nights < 1) {
        // Don't call onDateChange for invalid ranges
        return;
      }
      onDateChange(range.from, range.to);
    } else {
      onDateChange(range?.from, range?.to);
    }
  };

  const hasDateError = () => {
    return validationErrors.some((error) =>
      error.toLowerCase().includes('fecha') ||
      error.toLowerCase().includes('entrada') ||
      error.toLowerCase().includes('salida')
    );
  };

  return (
    <div className="space-y-2">
      <Label className="text-base">Fechas de estancia</Label>
      <div className={`border rounded-lg p-4 md:p-6 w-full overflow-hidden ${hasDateError() ? 'border-red-500' : 'border-border'}`}>
        <div className="w-full flex justify-center -mx-4 md:-mx-6 px-4 md:px-6">
          <div className="w-full max-w-full overflow-x-auto">
            <Calendar
              mode="range"
              selected={{
                from: checkIn,
                to: checkOut,
              }}
              onSelect={handleSelect}
              numberOfMonths={numberOfMonths}
              disabled={(d) =>
                !selectedRoomId ||
                d < new Date(new Date().setHours(0, 0, 0, 0)) ||
                occupiedDates.includes(format(d, 'yyyy-MM-dd'))
              }
              locale={es}
              className="pointer-events-auto mx-auto"
            />
          </div>
        </div>
      </div>
      {checkIn && checkOut && (
        <p className="text-sm text-muted-foreground text-center">
          {format(checkIn, "dd MMM yyyy", { locale: es })} — {format(checkOut, "dd MMM yyyy", { locale: es })}
        </p>
      )}
    </div>
  );
}
