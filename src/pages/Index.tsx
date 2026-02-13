import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoomCard from "@/components/RoomCard";
import { HOSTAL, ROOMS, SERVICES_BASIC, SERVICES_TOURIST } from "@/data/hostal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920&h=1080&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-secondary/60" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-secondary-foreground mb-4 leading-tight">
            Bienvenido a{" "}
            <span className="text-primary">{HOSTAL.name}</span>
          </h1>
          <p className="text-lg md:text-xl text-secondary-foreground/80 mb-8">
            {HOSTAL.tagline} — {HOSTAL.description}
          </p>
          <Link to="/reservas">
            <Button size="lg" className="text-lg px-10 py-6 font-bold">
              Reservar Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Rooms preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
            Nuestras <span className="text-primary">Habitaciones</span>
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Desde acogedoras individuales hasta suites premium, tenemos la opción perfecta para ti.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROOMS.slice(0, 6).map((room) => (
              <RoomCard key={room.id} room={room} compact />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/habitaciones">
              <Button variant="outline" size="lg" className="font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Ver Todas las Habitaciones
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-accent/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
            Nuestros <span className="text-primary">Servicios</span>
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Todo lo que necesitas para una estancia perfecta.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...SERVICES_BASIC.slice(0, 3), ...SERVICES_TOURIST.slice(0, 3)].map((s) => (
              <div key={s.name} className="bg-card rounded-lg p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 rounded-full p-3">
                  <s.icon size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{s.name}</h3>
                  <p className="text-muted-foreground text-sm">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/servicios">
              <Button variant="outline" size="lg" className="font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Ver Todos los Servicios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact + Map */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="text-primary">Contacto</span> y Ubicación
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3"><Phone className="text-primary" /></div>
                <div>
                  <p className="font-semibold">Teléfono</p>
                  <p className="text-muted-foreground">{HOSTAL.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3"><Mail className="text-primary" /></div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-muted-foreground">{HOSTAL.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3"><MessageCircle className="text-primary" /></div>
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-muted-foreground">{HOSTAL.whatsapp}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3"><MapPin className="text-primary" /></div>
                <div>
                  <p className="font-semibold">Dirección</p>
                  <p className="text-muted-foreground">{HOSTAL.address}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg h-[350px]">
              <iframe
                src={HOSTAL.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación del hostal"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
