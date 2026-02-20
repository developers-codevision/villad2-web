import { Wifi, Coffee, Car, Shield, Flame, Camera, Lightbulb, MapPin, Luggage, Heart, Zap, Lock, Plane, Clock, Wine, Shirt, Beer, Gift, Scissors } from "lucide-react";

export const HOSTAL = {
  name: "Villa D2",
  tagline: "Un viaje por la historia de Cuba",
  description: "Nuestras 7 habitaciones llevan los nombres de las antiguas provincias (hasta 1976) e Isla de Pinos, contando la evolución territorial del país hasta la actualidad.",
  phone: "+5378820045 / +53 63511623",
  email: "contacto@villad2.com",
  whatsapp: "+53 63511623",
  address: "calle 37 #14 e/Paseo y calle 2. Vedado, Plaza",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3669.231226280096!2d-82.39041!3d23.125222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjPCsDA3JzMwLjgiTiA4MsKwMjMnMjUuNSJX!5e0!3m2!1ses!2sus!4v1771298124259!5m2!1ses!2sus",
  social: {
    instagram: "https://instagram.com/hostalsolyluna",
    facebook: "https://facebook.com/hostalsolyluna",
  },
};

// ============================================================
// DEPRECATED: Mock room data - Now using API from backend
// ============================================================
// The room data is now fetched from the API at http://localhost:3000/rooms
// Use the roomsService and useRooms hook from @/modules/client/services/rooms.service
// and @/modules/client/hooks/useRooms instead

/*
export interface Room {
  id: string;
  name: string;
  type: string;
  description: string;
  capacity: number;
  price: number;
  amenities: string[];
  bathroomAmenities: string[];
  image: string;
  gallery: string[];
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
    bathroomAmenities: ["Ducha", "Toallas", "Secador de pelo", "Gel y champú"],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
    ],
  },
  // ... more rooms
];
*/
// ============================================================

export const SERVICES_SECURITY = [
  { icon: Camera, name: "Cámaras de Video-vigilancia", description: "Sistema completo de video-vigilancia en todas las áreas comunes para su seguridad." },
  { icon: Flame, name: "Extintores de Incendio", description: "Extintores estratégicamente ubicados y certificados en todas las áreas." },
  { icon: Shield, name: "Sensores de Alarma contra Intrusos", description: "Sistema de alarmas conectado a centrales de seguridad 24/7." },
  { icon: Lightbulb, name: "Adecuada Iluminación", description: "Iluminación completa en todas las áreas comunes y exteriores." },
  { icon: MapPin, name: "Señalética Completa", description: "Señalización clara de todas las áreas, salidas de emergencia y servicios." },
];

export const SERVICES_INCLUDED = [
  { icon: Wifi, name: "WIFI Gratuita", description: "Conexión WIFI gratuita en todos los puntos de la Villa." },
  { icon: Car, name: "Parking Vigilado", description: "Área amplia exterior frente a la Villa, permanentemente vigilada." },
  { icon: Luggage, name: "Servicio de Botones", description: "Personal especializado para facilitar movimientos del equipaje de los huéspedes." },
  { icon: Heart, name: "Botiquín y Primeros Auxilios", description: "Botiquín completo y personal entrenado. Servicios médicos cercanos disponibles." },
  { icon: Zap, name: "Plantas Eléctricas Auxiliares", description: "Sistema de respaldo eléctrico para emergencias." },
  { icon: Lock, name: "Caja de Seguridad", description: "Cajas de seguridad individuales en cada habitación." },
];

export const SERVICES_ADDITIONAL = [
  { icon: Plane, name: "Recogida en Aeropuerto", description: "Servicio de recogida en el aeropuerto y retorno al finalizar la estancia." },
  { icon: Car, name: "Traslados por la Ciudad", description: "Traslados a cualquier punto de la ciudad según sus necesidades." },
  { icon: Clock, name: "Servicio de Habitaciones 24h", description: "Servicio de habitaciones disponible las 24 horas del día." },
  { icon: Wine, name: "Servicio de Minibar", description: "Minibar en habitaciones con selección de bebidas y snacks." },
  { icon: Shirt, name: "Lavado y Planchado Personalizado", description: "Servicio profesional de lavandería y planchado." },
  { icon: Beer, name: "Terraza-Bar", description: "Terraza-Bar con bebidas y comidas ligeras, ambientación y juegos de mesa." },
  { icon: Coffee, name: "Servicio de Desayuno", description: "Desayuno completo con variedad de opciones." },
  { icon: Gift, name: "Venta de Souvenirs", description: "Souvenirs y artículos identificativos de la Villa." },
  { icon: Scissors, name: "Servicios de Belleza", description: "Peluquería, barbería, peinados y servicios de belleza en general." },
];

// Mantener compatibilidad con el código existente
export const SERVICES_BASIC = SERVICES_INCLUDED;
export const SERVICES_TOURIST = SERVICES_ADDITIONAL;

