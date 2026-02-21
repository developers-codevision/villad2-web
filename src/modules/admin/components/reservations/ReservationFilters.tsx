// Reservation Filters Component

import { Search, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Input } from '@/modules/shared/components/ui/input';
import { Button } from '@/modules/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/shared/components/ui/select';
import { Calendar } from '@/modules/shared/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/shared/components/ui/popover';
import { ReservationFilterState, getFilterableStatuses } from '../../types/reservations.types';

interface ReservationFiltersProps {
  filters: ReservationFilterState;
  onFilterChange: <K extends keyof ReservationFilterState>(
    field: K,
    value: ReservationFilterState[K]
  ) => void;
  onClearFilters: () => void;
}

export function ReservationFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: ReservationFiltersProps) {
  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.dateFrom !== undefined ||
    filters.dateTo !== undefined ||
    filters.searchQuery !== '';

  return (
    <div className="bg-muted/30 p-4 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-xs"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Buscar huésped, email, habitación..."
            value={filters.searchQuery}
            onChange={e => onFilterChange('searchQuery', e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={value => onFilterChange('status', value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {getFilterableStatuses().map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date From */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateFrom ? (
                format(filters.dateFrom, 'dd/MM/yyyy', { locale: es })
              ) : (
                <span>Desde</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.dateFrom}
              onSelect={date => onFilterChange('dateFrom', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Date To */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateTo ? (
                format(filters.dateTo, 'dd/MM/yyyy', { locale: es })
              ) : (
                <span>Hasta</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.dateTo}
              onSelect={date => onFilterChange('dateTo', date)}
              disabled={date => (filters.dateFrom ? date < filters.dateFrom : false)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

