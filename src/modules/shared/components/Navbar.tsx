import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Languages } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { HOSTAL } from "@/modules/shared/data/hostal";
import logo from "@/assets/logo.png";
import SocialLinks from "./SocialLinks";
import { useLanguage } from "@/modules/client/contexts";

const getLinks = (t: (key: string) => string) => [
  { to: "/", label: t("nav.home") },
  { to: "/habitaciones", label: t("nav.rooms") },
  { to: "/servicios", label: t("nav.services") },
  { to: "/promociones", label: t("nav.promotions") },
  { to: "/reservas", label: t("nav.reservations") },
  { to: "/blog", label: t("nav.blog") },
  { to: "/resenas", label: t("nav.reviews") },
  { to: "/lugares-interes", label: t("nav.places") },
];

export default function Navbar() {
 const [open, setOpen] = useState(false);
 const location = useLocation();
 const { language, setLanguage, t } = useLanguage();
 const links = getLinks(t);

 const toggleLanguage = () => {
  setLanguage(language === 'es' ? 'en' : 'es');
 };

 return (
  <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
  <nav className="container mx-auto flex items-center h-16 px-4">

   {/* Logo — solo mobile */}
   <Link to="/" className="desk:hidden">
    <img
     src={logo}
     alt={HOSTAL.name}
     width={160}
     height={40}
     decoding="async"
     className="h-10 w-auto"
    />
   </Link>

   {/* Desktop: grid 3 columnas iguales */}
   <div className="hidden desk:grid desk:grid-cols-[1fr_auto_1fr] desk:items-center desk:w-full">
    {/* Columna izquierda — vacía (contrapeso) */}
    <div />

    {/* Columna centro — links */}
<ul className="flex items-center justify-center p-6 gap-8">
      {links.map((l) => {
        const isBlog = l.to === '/blog';
        return (
       <li key={l.to}>
        <Link
         to={l.to}
         className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${
          location.pathname === l.to ? "text-primary" : "text-foreground"
         } ${isBlog ? "px-4 py-1.5 rounded-full bg-[#00c3ff] text-white hover:shadow-lg hover:shadow-[#00c3ff]/30 hover:scale-105 font-semibold" : "hover:text-primary"}`}
        >
         {l.label}
        </Link>
       </li>
      );
      })}
     </ul>

    {/* Columna derecha — redes + botón + idioma */}
    <div className="flex items-center justify-end gap-6">
     {/* Cambiado w-40 por w-max para que los iconos mantengan su forma circular */}
     <div className="flex items-center justify-center w-max border-r border-border pr-4 mr-2 shrink-0">
       <SocialLinks
        facebookUrl="https://www.facebook.com/people/Hostal-Villa-D2/61557501643727/"
        twitterUrl="https://x.com/villad2"
        youtubeUrl="https://youtube.com/villad2"
        whatsappUrl="https://wa.me/5350970588"
       />
     </div>
     <Link to="/reservas" className="shrink-0">
      <Button className="font-semibold">{t("nav.bookNow")}</Button>
     </Link>
     <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-accent transition-colors shrink-0"
      aria-label="Cambiar idioma"
     >
      <Languages size={18} />
      <span className="text-sm font-medium uppercase">{language}</span>
     </button>
    </div>
   </div>

   {/* Mobile toggle */}
   <button className="desk:hidden ml-auto" onClick={() => setOpen(!open)} aria-label="Menú">
    {open ? <X size={24} /> : <Menu size={24} />}
   </button>
  </nav>

   {/* Mobile menu */}
   {open && (
    <div className="desk:hidden bg-background border-b border-border px-4 pb-6">
<ul className="flex flex-col gap-3">
       {links.map((l) => {
        const isBlog = l.to === '/blog';
        return (
        <li key={l.to}>
         <Link
          to={l.to}
          onClick={() => setOpen(false)}
          className={`block py-2 text-sm font-medium ${
           location.pathname === l.to ? "text-primary" : "text-foreground"
          } ${isBlog ? "px-4 py-2 rounded-full bg-[#00c3ff] text-white font-semibold" : ""}`}
         >
          {l.label}
         </Link>
        </li>
       );
       })}
      <li className="pt-2">
       <Link to="/reservas" onClick={() => setOpen(false)}>
        <Button className="w-full font-semibold">{t("nav.bookNow")}</Button>
       </Link>
      </li>
      <li>
       <button
        onClick={toggleLanguage}
        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-md bg-accent hover:bg-accent/80 transition-colors mt-2"
        aria-label="Cambiar idioma"
       >
        <Languages size={18} />
        <span className="text-sm font-medium">{language === 'es' ? 'Español' : 'English'}</span>
       </button>
      </li>
<li className="flex justify-center pt-5 mt-3 border-t border-border">
        <SocialLinks
         facebookUrl="https://www.facebook.com/people/Hostal-Villa-D2/61557501643727/"
         youtubeUrl="https://youtube.com/@villad2"
         whatsappUrl="https://wa.me/5350970588"
        />
       </li>
     </ul>
    </div>
   )}
  </header>
 );
}