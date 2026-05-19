import { HOSTAL } from "../data/hostal";
import { useLanguage } from "@/modules/client/contexts";

export default function WhatsAppFloatingButton() {
  const { t } = useLanguage();
  const whatsappNumber = HOSTAL.whatsapp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("¡Hola! Tengo una consulta sobre Villa D2.")}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 sm:bottom-6 right-6 z-50 flex flex-col items-end gap-2 group"
      aria-label="Contactar por WhatsApp"
    >
      {/* Tooltip bubble */}
      <span className="pointer-events-none whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {t("common.whatsapp.tooltip")}
      </span>

      {/* WhatsApp button circle */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform duration-300 hover:scale-110">
        <img
          src="/whatsapp.png"
          alt="WhatsApp"
          width={36}
          height={36}
          className="h-9 w-9"
        />
      </div>
    </a>
  );
}
