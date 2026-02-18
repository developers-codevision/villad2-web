import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/modules/shared/components/ui/card";
import { Button } from "@/modules/shared/components/ui/button";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/modules/shared/context";

export default function AdminSelector() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Bienvenido, {user?.fullName || user?.username}
        </h1>
        <p className="text-muted-foreground mt-1">Selecciona a dónde deseas ir</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
        <Card
          className="cursor-pointer hover:border-primary transition-colors group"
          onClick={() => navigate("/admin")}
        >
          <CardContent className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <LayoutDashboard className="text-primary" size={28} />
            </div>
            <span className="font-semibold text-foreground">Panel de Administración</span>
            <span className="text-xs text-muted-foreground text-center">
              Gestiona reservas, habitaciones, promociones y reseñas
            </span>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:border-primary transition-colors group"
          onClick={() => navigate("/gestion")}
        >
          <CardContent className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Settings className="text-primary" size={28} />
            </div>
            <span className="font-semibold text-foreground">Sistema de Gestión</span>
            <span className="text-xs text-muted-foreground text-center">
              Accede al sistema de gestión del hostal
            </span>
          </CardContent>
        </Card>
      </div>

      <Button
        variant="ghost"
        className="mt-8 text-muted-foreground"
        onClick={handleLogout}
      >
        <LogOut size={18} className="mr-2" />
        Cerrar sesión
      </Button>
    </div>
  );
}
