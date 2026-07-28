import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
import { CalendarCheck, BedDouble, Tag, Star, LogOut, ArrowLeft, Menu, X, Settings, FileText, MessageCircle, ClipboardList } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/modules/shared/lib/utils";
import { useAuth } from "@/modules/shared/context";
import { useState } from "react";

const navItems = [
  { label: "Reservas Pendientes", to: "/admin", icon: CalendarCheck },
  { label: "Habitaciones", to: "/admin/habitaciones", icon: BedDouble },
  { label: "Promociones", to: "/admin/promociones", icon: Tag },
  { label: "Blog", to: "/admin/blog", icon: FileText },
  { label: "Menús", to: "/admin/menus", icon: ClipboardList },
  { label: "Reseñas", to: "/admin/resenas", icon: Star },
  { label: "Comentarios", to: "/admin/comentarios", icon: MessageCircle },
  { label: "Configuración", to: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-secondary-foreground/10">
        <h2 className="font-bold text-lg">
          <span className="text-primary">Villa</span> D2
        </h2>
        <p className="text-xs text-secondary-foreground/50 mt-1">Panel de Administración</p>
        {user && (
          <p className="text-xs text-secondary-foreground/70 mt-2 font-medium">
            {user.fullName || user.username}
          </p>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.to === "/admin"
            ? location.pathname === "/admin"
            : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              onClick={closeMobileMenu}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-secondary-foreground/70 hover:bg-secondary-foreground/5 hover:text-secondary-foreground"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-secondary-foreground/10 space-y-1">
        <Button
          variant="ghost"
          onClick={() => {
            navigate("/admin-selector");
            closeMobileMenu();
          }}
          className="w-full justify-start text-secondary-foreground/70 hover:text-secondary-foreground"
        >
          <ArrowLeft size={18} className="mr-2" />
          Volver al Selector
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            handleLogout();
            closeMobileMenu();
          }}
          className="w-full justify-start text-secondary-foreground/70 hover:text-secondary-foreground"
        >
          <LogOut size={18} className="mr-2" />
          Cerrar sesión
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden bg-secondary text-secondary-foreground p-4 flex items-center justify-between sticky top-0 z-50 border-b border-secondary-foreground/10">
        <h2 className="font-bold text-lg">
          <span className="text-primary">Villa</span> D2
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-secondary-foreground"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside
        className={cn(
          "bg-secondary text-secondary-foreground flex flex-col shrink-0 transition-transform duration-300 ease-in-out",
          // Desktop styles
          "lg:w-64 lg:static lg:translate-x-0",
          // Mobile styles
          "fixed inset-y-0 left-0 w-64 z-50",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
