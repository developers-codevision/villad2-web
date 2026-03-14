import { Clock, Users, LogIn, LogOut } from "lucide-react";
import { Promotion } from "@/modules/shared/types/api.types";
import { getMediaUrl } from "@/modules/shared/services";
import { parseServices, formatTimeToAmPm } from "@/modules/client/utils/promotionHelpers";

interface Props {
  promotion: Promotion;
  reverse?: boolean;
}

export default function PromotionHorizontalCard({ promotion, reverse = false }: Props) {
  const services = parseServices(promotion.services);
  const hasImage = !!promotion.photo;

  return (
    <div className={`col-span-full rounded-2xl overflow-hidden border border-border bg-card group flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
      {/* Image side */}
      <div className="relative w-full md:w-2/5 min-h-[240px] md:min-h-[320px] overflow-hidden">
        {hasImage ? (
          <img
            src={getMediaUrl(promotion.photo!)}
            alt={promotion.title}
            width={1280}
            height={853}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent to-muted" />
        )}
      </div>

      {/* Content side */}
      <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="h-1 w-8 rounded-full bg-primary" />
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Promoción</span>
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-card-foreground mb-3 leading-tight">
          {promotion.title}
        </h3>

        {promotion.description && (
          <p className="text-muted-foreground mb-6 leading-relaxed">{promotion.description}</p>
        )}

        {/* Info chips */}
        <div className="flex flex-wrap gap-3 mb-5">
          {(promotion.minPeople || promotion.maxPeople) && (
            <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2 text-sm">
              <Users size={16} className="text-primary" />
              <span className="text-card-foreground font-medium">
                {promotion.minPeople && promotion.maxPeople
                  ? `${promotion.minPeople}–${promotion.maxPeople} personas`
                  : promotion.maxPeople
                    ? `Hasta ${promotion.maxPeople}`
                    : `Desde ${promotion.minPeople}`}
              </span>
            </div>
          )}
          {promotion.time && (
            <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2 text-sm">
              <Clock size={16} className="text-primary" />
              <span className="text-card-foreground font-medium">{formatTimeToAmPm(promotion.time) || promotion.time}</span>
            </div>
          )}
          {promotion.checkInTime && (
            <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2 text-sm">
              <LogIn size={16} className="text-primary" />
              <span className="text-card-foreground font-medium">{formatTimeToAmPm(promotion.checkInTime)}</span>
            </div>
          )}
          {promotion.checkOutTime && (
            <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2 text-sm">
              <LogOut size={16} className="text-primary" />
              <span className="text-card-foreground font-medium">{formatTimeToAmPm(promotion.checkOutTime)}</span>
            </div>
          )}
        </div>

        {/* Services */}
        {services.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Incluye</p>
            <div className="flex flex-wrap gap-2">
              {services.map((service, idx) => {
                const clean = typeof service === 'string' ? service.replace(/[\[\]"]/g, '').trim() : service;
                return (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    {clean}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
