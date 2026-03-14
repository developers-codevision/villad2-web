import { Clock, Users } from "lucide-react";
import { Promotion } from "@/modules/shared/types/api.types";
import { getMediaUrl } from "@/modules/shared/services";
import { parseServices, formatTimeToAmPm } from "@/modules/client/utils/promotionHelpers";

interface Props {
  promotion: Promotion;
}

export default function PromotionGlassCard({ promotion }: Props) {
  const services = parseServices(promotion.services);
  const hasImage = !!promotion.photo;

  return (
    <div className="relative rounded-2xl overflow-hidden group h-full min-h-[380px] flex flex-col justify-end">
      {hasImage ? (
        <img
          src={getMediaUrl(promotion.photo!)}
          alt={promotion.title}
          width={1280}
          height={853}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-muted to-secondary" />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

      {/* Glass panel */}
      <div className="relative z-10 m-4 p-5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
        <h3 className="text-xl font-bold text-white mb-2">{promotion.title}</h3>
        
        {promotion.description && (
          <p className="text-white/70 text-sm mb-4 line-clamp-2">{promotion.description}</p>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-white/80">
          {(promotion.minPeople || promotion.maxPeople) && (
            <span className="flex items-center gap-1">
              <Users size={12} />
              {promotion.minPeople && promotion.maxPeople
                ? `${promotion.minPeople}–${promotion.maxPeople}`
                : promotion.maxPeople || promotion.minPeople} pers.
            </span>
          )}
          {promotion.time && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatTimeToAmPm(promotion.time) || promotion.time}
            </span>
          )}
        </div>

        {services.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {services.slice(0, 4).map((service, idx) => {
              const clean = typeof service === 'string' ? service.replace(/[[\]"]/g, '').trim() : service;
              return (
                <span key={idx} className="px-2 py-0.5 rounded-full bg-primary/80 text-primary-foreground text-[10px] font-semibold">
                  {clean}
                </span>
              );
            })}
            {services.length > 4 && (
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px]">
                +{services.length - 4} más
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
