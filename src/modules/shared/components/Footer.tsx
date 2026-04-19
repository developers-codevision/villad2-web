import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { HOSTAL } from "@/modules/shared/data/hostal";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/modules/client/contexts";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img
              src={logo}
              alt="Villa D2"
              width={192}
              height={48}
              loading="lazy"
              decoding="async"
              className="h-12 w-auto mb-2"
            />
            <p className="text-secondary-foreground/70 text-sm leading-relaxed">
              {HOSTAL.description}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">{t("footer.links")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">{t("footer.home")}</Link></li>
              <li><Link to="/habitaciones" className="hover:text-primary transition-colors">{t("footer.rooms")}</Link></li>
              <li><Link to="/servicios" className="hover:text-primary transition-colors">{t("footer.services")}</Link></li>
              <li>
                <Link to="/blog" className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#00c3ff] text-white font-medium hover:shadow-lg hover:shadow-[#00c3ff]/30 hover:scale-105 transition-all duration-300">
                  {t("footer.blog")}
                </Link>
              </li>
              <li><Link to="/reservas" className="hover:text-primary transition-colors">{t("footer.reservations")}</Link></li>
              <li><Link to="/preguntas-frecuentes" className="hover:text-primary transition-colors">{t("footer.faq")}</Link></li>
              <li><Link to="/politicas-reembolso" className="hover:text-primary transition-colors">{t("footer.refundPolicy")}</Link></li>
              <li><Link to="/terminos-condiciones" className="hover:text-primary transition-colors">{t("footer.terms")}</Link></li>
              <li><Link to="/politica-privacidad" className="hover:text-primary transition-colors">{t("footer.privacyPolicy")}</Link></li>
              <li><Link to="/politica-de-cookies" className="hover:text-primary transition-colors">{t("footer.cookiePolicy")}</Link></li>
              <li><Link to="/aviso-legal" className="hover:text-primary transition-colors">{t("footer.legalNotice")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <span className="font-medium">{t("footer.phones")}</span> {HOSTAL.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                {HOSTAL.email}
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-primary mt-0.5" />
                {HOSTAL.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-8 pt-6 flex items-center justify-between text-sm text-secondary-foreground/50">
          <span>© {new Date().getFullYear()} {HOSTAL.name}. {t("footer.copyright")}</span>
          <Link to="/login" className="hover:text-secondary-foreground/70 transition-colors">
            {t("footer.admin")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
