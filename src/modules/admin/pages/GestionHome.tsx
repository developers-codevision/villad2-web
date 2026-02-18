import { useNavigate } from "react-router-dom";
import { Button } from "@/modules/shared/components/ui/button";
import { ArrowLeft, Construction } from "lucide-react";

export default function GestionHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center px-4">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Construction className="text-primary" size={32} />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Sistema de Gestión</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Esta sección se encuentra en desarrollo. Próximamente podrás acceder a las herramientas de gestión del hostal.
      </p>
      <Button variant="outline" onClick={() => navigate("/admin-selector")}>
        <ArrowLeft size={18} className="mr-2" />
        Volver a selección
      </Button>
    </div>
  );
}
