import { Clock, Users, ArrowRight } from "lucide-react";
import { Promotion } from "@/modules/shared/types/api.types";
import { getMediaUrl } from "@/modules/shared/services";
import { parseServices, formatTimeToAmPm } from "@/modules/client/utils/promotionHelpers";

interface Props {
  promotion: Promotion;
}

export default function PromotionHeroCard({ promotion }: Props) {
  const services = parseServices(promotion.services);
  const hasImage = !!promotion.photo;

  return (
    <div className="relative rounded-2xl overflow-hidden group col-span-full">
      {/* Background image with overlay */}
      <div className="relative min-h-[420px] md:min-h-[480px] flex items-end">
        {hasImage ? (
          <img
            src={getMediaUrl(promotion.photo!)}
            alt={promotion.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary to-foreground" />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 p-8 md:p-12 w-full max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider mb-4">
            Destacada
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            {promotion.title}
          </h2>
          {promotion.description && (
            <p className="text-white/80 text-base md:text-lg mb-6 line-clamp-3">
              {promotion.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-4 text-white/90 text-sm">
            {(promotion.minPeople || promotion.maxPeople) && (
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Users size={14} />
                {promotion.minPeople && promotion.maxPeople
                  ? `${promotion.minPeople}–${promotion.maxPeople} personas`
                  : promotion.maxPeople
                    ? `Hasta ${promotion.maxPeople} personas`
                    : `Desde ${promotion.minPeople} personas`}
              </span>
            )}
            {promotion.time && (
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Clock size={14} />
                {formatTimeToAmPm(promotion.time) || promotion.time}
              </span>
            )}
            {promotion.checkInTime && (
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <ArrowRight size={14} />
                Entrada: {formatTimeToAmPm(promotion.checkInTime)}
              </span>
            )}
          </div>

          {services.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {services.map((service, idx) => {
                const clean = typeof service === 'string' ? service.replace(/[\[\]"]/g, '').trim() : service;
                return (
                  <span key={idx} className="px-3 py-1 rounded-full border border-white/20 text-white/90 text-xs backdrop-blur-sm">
                    {clean}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
