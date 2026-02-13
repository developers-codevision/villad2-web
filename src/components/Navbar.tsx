import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOSTAL } from "@/data/hostal";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/habitaciones", label: "Habitaciones" },
  { to: "/servicios", label: "Servicios" },
  { to: "/reservas", label: "Reservas" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-secondary">
            <span className="text-primary">Sol</span> & Luna
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === l.to ? "text-primary" : "text-foreground"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link to="/reservas" className="hidden md:block">
          <Button className="font-semibold">Reservar Ahora</Button>
        </Link>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menú">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4">
          <ul className="flex flex-col gap-3">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`block py-2 text-sm font-medium ${
                    location.pathname === l.to ? "text-primary" : "text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/reservas" onClick={() => setOpen(false)}>
                <Button className="w-full font-semibold">Reservar Ahora</Button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
