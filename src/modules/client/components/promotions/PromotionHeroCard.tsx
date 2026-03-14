import { Clock, Users, ArrowRight, LogOut } from "lucide-react";
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

      {/* ── MOBILE: imagen cuadrada + texto debajo ── */}
      <div className="md:hidden flex flex-col">
        {/* Imagen cuadrada */}
        <div className="relative w-full aspect-square">
          {hasImage ? (
            <img
              src={getMediaUrl(promotion.photo!)}
              alt={promotion.title}
              width={1280}
              height={1280}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-secondary to-foreground" />
          )}
        </div>

        {/* Texto debajo */}
        <div className="bg-card p-6 space-y-4">
          <h2 className="text-2xl font-bold leading-tight">
            {promotion.title}
          </h2>
          {promotion.description && (
            <p className="text-muted-foreground text-sm line-clamp-4">
              {promotion.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 text-sm">
            {(promotion.minPeople || promotion.maxPeople) && (
              <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full">
                <Users size={14} />
                {promotion.maxPeople
                  ? `Hasta ${promotion.maxPeople} personas`
                  : `Desde ${promotion.minPeople} personas`}
              </span>
            )}
            {promotion.checkInTime && (
              <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full">
                <ArrowRight size={14} />
                Entrada: {formatTimeToAmPm(promotion.checkInTime)}
              </span>
            )}
            {promotion.checkOutTime && (
              <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full">
                <LogOut size={14} />
                Salida: {formatTimeToAmPm(promotion.checkOutTime)}
              </span>
            )}
            {promotion.time && (
              <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full">
                <Clock size={14} />
                {formatTimeToAmPm(promotion.time) || promotion.time}
              </span>
            )}
          </div>

          {services.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {services.map((service, idx) => {
                const clean = typeof service === 'string' ? service.replace(/[[\]"]/g, '').trim() : service;
                return (
                  <span key={idx} className="px-3 py-1 rounded-full border border-border text-xs">
                    {clean}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── DESKTOP: hero con texto encima de la imagen ── */}
      <div className="hidden md:flex relative min-h-[540px] items-end">
        {hasImage ? (
          <img
            src={getMediaUrl(promotion.photo!)}
            alt={promotion.title}
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary to-foreground" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 p-12 w-full max-w-3xl">
          <h2 className="text-4xl font-bold text-white mb-3 leading-tight">
            {promotion.title}
          </h2>
          {promotion.description && (
            <p className="text-white/80 text-lg mb-6 line-clamp-3">
              {promotion.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-white/90 text-sm">
            {(promotion.minPeople || promotion.maxPeople) && (
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Users size={14} />
                {promotion.maxPeople
                  ? `Hasta ${promotion.maxPeople} personas`
                  : `Desde ${promotion.minPeople} personas`}
              </span>
            )}
            {promotion.checkInTime && (
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <ArrowRight size={14} />
                Entrada: {formatTimeToAmPm(promotion.checkInTime)}
              </span>
            )}
            {promotion.checkOutTime && (
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <LogOut size={14} />
                Salida: {formatTimeToAmPm(promotion.checkOutTime)}
              </span>
            )}
            {promotion.time && (
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Clock size={14} />
                {formatTimeToAmPm(promotion.time) || promotion.time}
              </span>
            )}
          </div>

          {services.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {services.map((service, idx) => {
                const clean = typeof service === 'string' ? service.replace(/[[\]"]/g, '').trim() : service;
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
