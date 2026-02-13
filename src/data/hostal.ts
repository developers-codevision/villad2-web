import { Wifi, Coffee, Car, Sparkles, Map, Bike, Plane, Mountain, UtensilsCrossed, ShieldCheck, Clock, Waves } from "lucide-react";

export const HOSTAL = {
  name: "Hostal Sol & Luna",
  tagline: "Tu hogar lejos de casa",
  description: "Ubicado en el corazón de la ciudad, nuestro hostal combina confort moderno con la calidez de un hogar. Disfruta de habitaciones acogedoras, servicios de primera y la mejor ubicación para explorar la zona.",
  phone: "+34 612 345 678",
  email: "info@hostalsolyluna.com",
  whatsapp: "+34 612 345 678",
  address: "Calle del Sol 42, 28001 Madrid, España",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.6!2d-3.7038!3d40.4168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDI1JzAwLjUiTiAzwrA0MicxMy43Ilc!5e0!3m2!1ses!2ses!4v1700000000000",
  social: {
    instagram: "https://instagram.com/hostalsolyluna",
    facebook: "https://facebook.com/hostalsolyluna",
  },
};

export interface Room {
  id: string;
  name: string;
  type: string;
  description: string;
  capacity: number;
  price: number;
  amenities: string[];
  image: string;
}

export const ROOMS: Room[] = [
  {
    id: "individual",
    name: "Habitación Individual",
    type: "Individual",
    description: "Perfecta para viajeros solitarios. Cama individual cómoda, escritorio de trabajo y baño privado.",
    capacity: 1,
    price: 35,
    amenities: ["WiFi", "Baño privado", "TV", "Escritorio"],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
  },
  {
    id: "doble",
    name: "Habitación Doble",
    type: "Doble",
    description: "Ideal para parejas o amigos. Cama doble queen-size, baño privado y vistas a la calle.",
    capacity: 2,
    price: 55,
    amenities: ["WiFi", "Baño privado", "TV", "Minibar", "Vistas"],
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=400&fit=crop",
  },
  {
    id: "twin",
    name: "Habitación Twin",
    type: "Twin",
    description: "Dos camas individuales separadas, perfecta para amigos o compañeros de viaje.",
    capacity: 2,
    price: 50,
    amenities: ["WiFi", "Baño privado", "TV", "Armario"],
    image: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=600&h=400&fit=crop",
  },
  {
    id: "suite",
    name: "Suite Premium",
    type: "Suite",
    description: "Nuestra habitación más exclusiva. Amplia sala de estar, cama king-size y terraza privada.",
    capacity: 2,
    price: 90,
    amenities: ["WiFi", "Baño premium", "TV 50\"", "Minibar", "Terraza", "Bata y zapatillas"],
    image: "https://images.unsplash.com/photo-1590490360182-c33d955fd166?w=600&h=400&fit=crop",
  },
  {
    id: "familiar",
    name: "Habitación Familiar",
    type: "Familiar",
    description: "Espaciosa habitación con cama doble y dos individuales. Ideal para familias con niños.",
    capacity: 4,
    price: 80,
    amenities: ["WiFi", "Baño privado", "TV", "Cuna disponible", "Espacio extra"],
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=400&fit=crop",
  },
  {
    id: "dormitorio-4",
    name: "Dormitorio Compartido (4 camas)",
    type: "Compartido",
    description: "Literas cómodas en dormitorio compartido. Precio por cama, incluye taquilla personal.",
    capacity: 1,
    price: 18,
    amenities: ["WiFi", "Taquilla", "Baño compartido", "Ropa de cama"],
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop",
  },
  {
    id: "dormitorio-8",
    name: "Dormitorio Compartido (8 camas)",
    type: "Compartido",
    description: "Nuestro dormitorio más económico. Precio por cama con todas las comodidades básicas.",
    capacity: 1,
    price: 14,
    amenities: ["WiFi", "Taquilla", "Baño compartido", "Ropa de cama"],
    image: "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?w=600&h=400&fit=crop",
  },
];

export const SERVICES_BASIC = [
  { icon: Wifi, name: "WiFi Gratuito", description: "Conexión de alta velocidad en todas las áreas del hostal." },
  { icon: Coffee, name: "Desayuno Incluido", description: "Desayuno continental cada mañana de 7:00 a 10:30." },
  { icon: Car, name: "Parking Privado", description: "Plaza de garaje disponible bajo reserva (10€/día)." },
  { icon: Sparkles, name: "Limpieza Diaria", description: "Servicio de limpieza y cambio de sábanas incluido." },
  { icon: ShieldCheck, name: "Recepción 24h", description: "Atención al cliente las 24 horas del día." },
  { icon: UtensilsCrossed, name: "Cocina Compartida", description: "Cocina totalmente equipada para uso de los huéspedes." },
];

export const SERVICES_TOURIST = [
  { icon: Map, name: "Tours Guiados", description: "Recorridos por la ciudad con guías locales expertos. Diarios a las 10:00 y 16:00." },
  { icon: Bike, name: "Alquiler de Bicicletas", description: "Explora la ciudad sobre dos ruedas. Desde 8€/día." },
  { icon: Plane, name: "Traslados Aeropuerto", description: "Servicio de recogida y traslado al aeropuerto. Reserva con 24h de antelación." },
  { icon: Mountain, name: "Excursiones", description: "Excursiones a la sierra y pueblos cercanos cada fin de semana." },
  { icon: Clock, name: "Late Check-out", description: "Extiende tu estancia hasta las 14:00 por solo 15€." },
  { icon: Waves, name: "Actividades Acuáticas", description: "Kayak, paddle surf y más en los ríos cercanos (temporada de verano)." },
];
