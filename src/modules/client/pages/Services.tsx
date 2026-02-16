import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { SERVICES_BASIC, SERVICES_TOURIST } from "@/modules/shared/data/hostal";

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
            Nuestros <span className="text-primary">Servicios</span>
          </h1>
          <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
            Todo lo que necesitas para disfrutar al máximo tu estancia.
          </p>

          {/* Basic */}
          <h2 className="text-2xl font-bold mb-6">Servicios del Hostal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {SERVICES_BASIC.map((s) => (
              <div key={s.name} className="bg-card rounded-lg p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow border border-border">
                <div className="bg-primary/10 rounded-full p-3 shrink-0">
                  <s.icon size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{s.name}</h3>
                  <p className="text-muted-foreground text-sm">{s.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tourist */}
          <h2 className="text-2xl font-bold mb-6">Actividades <span className="text-primary">Turísticas</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_TOURIST.map((s) => (
              <div key={s.name} className="bg-card rounded-lg p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow border border-border">
                <div className="bg-primary/10 rounded-full p-3 shrink-0">
                  <s.icon size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{s.name}</h3>
                  <p className="text-muted-foreground text-sm">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
