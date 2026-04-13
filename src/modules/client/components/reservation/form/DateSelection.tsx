import { Label } from '@/modules/shared/components/ui/label';
import { Calendar } from '@/modules/shared/components/ui/calendar';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useToast } from '@/modules/shared/hooks/use-toast';
import { useLanguage } from '@/modules/client/contexts';

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
  const { toast } = useToast();
  const { t, language } = useLanguage();

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
    if (!range) {
      onDateChange(undefined, undefined);
      return;
    }

    if (range.from && range.to) {

      // Prevent selecting same day or invalid ranges
      const nights = Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24));
      if (nights < 1) {
        // If clicking the same date or invalid range, just clear it to allow deselection
        onDateChange(undefined, undefined);
        return;
      }
      onDateChange(range.from, range.to);
    } else {
      onDateChange(range.from, range.to);
    }
  };

  const hasDateError = () => {
    return validationErrors.some((error) =>
      error.toLowerCase().includes('fecha') ||
      error.toLowerCase().includes('entrada') ||
      error.toLowerCase().includes('salida')
    );
  };

  const handleCalendarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // If we clicked on a TD, look for button inside
    let button: HTMLButtonElement | null;

    if (target.tagName === 'TD') {
      button = target.querySelector('button');
    } else if (target.tagName === 'BUTTON') {
      button = target as HTMLButtonElement;
    } else {
      button = target.closest('button') as HTMLButtonElement;
    }

    if (button) {
      // Check if button is disabled (using HTML disabled attribute)
      const isDisabled = button.disabled;

      if (isDisabled) {
        if (!selectedRoomId) {
          toast({
            title: t("reservation.roomRequired"),
            description: t("reservation.selectRoomFirst"),
            variant: "destructive",
          });
          return;
        }

        toast({
          title: t("reservation.dayOccupied"),
          description: t("reservation.tryAnotherRoom"),
          variant: "destructive",
        });
      }
    }
  };

  const locale = language === 'es' ? es : enUS;

  return (
    <div className="space-y-2">
      <Label className="text-base">{t("reservation.stayDates")}</Label>
      <div className={`border rounded-lg  md:p-6 w-full overflow-hidden ${hasDateError() ? 'border-red-500' : 'border-border'}`}>
        <div className="w-full flex justify-center " onClick={handleCalendarClick}>
          <div className="w-full max-w-full overflow-x-auto flex justify-center">
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
              locale={locale}
              className="pointer-events-auto mx-auto"
            />
          </div>
        </div>
      </div>
      {checkIn && checkOut && (
        <p className="text-sm text-muted-foreground text-center">
          {format(checkIn, "dd MMM yyyy", { locale })} — {format(checkOut, "dd MMM yyyy", { locale })}
        </p>
      )}
    </div>
  );
}
