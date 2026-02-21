// Reservation Stats Component - Display quick statistics

import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/modules/shared/components/ui/card';
import { ReservationWithDetails } from '../../types/reservations.types';
import { ReservationStatus } from '@/modules/shared/types/api.types';
import { getTodayCheckIns, getTodayCheckOuts } from '../../utils/reservations.utils';

interface ReservationStatsProps {
  reservations: ReservationWithDetails[];
}

export function ReservationStats({ reservations }: ReservationStatsProps) {
  const pending = reservations.filter(r => r.status === ReservationStatus.PENDING).length;
  const confirmed = reservations.filter(r => r.status === ReservationStatus.CONFIRMED).length;
  const cancelled = reservations.filter(r => r.status === ReservationStatus.CANCELLED).length;
  const todayCheckIns = getTodayCheckIns(reservations).length;
  const todayCheckOuts = getTodayCheckOuts(reservations).length;

  const stats = [
    {
      label: 'Pendientes',
      value: pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Confirmadas',
      value: confirmed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Entradas Hoy',
      value: todayCheckIns,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Salidas Hoy',
      value: todayCheckOuts,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon size={24} className={stat.color} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

