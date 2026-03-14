import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { HOSTAL } from "@/modules/shared/data/hostal";
import logo from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img src={logo} alt="Villa D2" className="h-12 w-auto mb-2" />
            <p className="text-secondary-foreground/70 text-sm leading-relaxed">
              {HOSTAL.description}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link to="/habitaciones" className="hover:text-primary transition-colors">Habitaciones</Link></li>
              <li><Link to="/servicios" className="hover:text-primary transition-colors">Servicios</Link></li>
              <li><Link to="/reservas" className="hover:text-primary transition-colors">Reservas</Link></li>
              <li><Link to="/preguntas-frecuentes" className="hover:text-primary transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link to="/politicas-reembolso" className="hover:text-primary transition-colors">Política de Reembolsos</Link></li>
              <li><Link to="/terminos-condiciones" className="hover:text-primary transition-colors">Términos y Condiciones</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <span className="font-medium">Teléfonos:</span> {HOSTAL.phone}
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
          <span>© {new Date().getFullYear()} {HOSTAL.name}. Todos los derechos reservados.</span>
          <Link to="/login" className="hover:text-secondary-foreground/70 transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
