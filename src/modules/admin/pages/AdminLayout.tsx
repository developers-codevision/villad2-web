import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
import { CalendarCheck, BedDouble, Tag, Star, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/modules/shared/lib/utils";
import { useAuth } from "@/modules/shared/context";

const navItems = [
  { label: "Reservas Pendientes", to: "/admin", icon: CalendarCheck },
  { label: "Habitaciones", to: "/admin/habitaciones", icon: BedDouble },
  { label: "Promociones", to: "/admin/promociones", icon: Tag },
  { label: "Reseñas", to: "/admin/resenas", icon: Star },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-secondary-foreground flex flex-col shrink-0">
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
            onClick={() => navigate("/admin-selector")}
            className="w-full justify-start text-secondary-foreground/70 hover:text-secondary-foreground"
          >
            <ArrowLeft size={18} className="mr-2" />
            Volver al Selector
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-secondary-foreground/70 hover:text-secondary-foreground"
          >
            <LogOut size={18} className="mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
