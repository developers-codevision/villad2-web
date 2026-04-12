import {
    Wifi,
    Coffee,
    Car,
    Shield,
    Flame,
    Camera,
    Lightbulb,
    MapPin,
    Luggage,
    Heart,
    Zap,
    Lock,
    Plane,
    Clock,
    Wine,
    Shirt,
    Beer,
    Gift,
    Scissors
} from "lucide-react";

export const HOSTAL = {
    name: "Villa D2",
    tagline: "Un viaje por la historia de la división administrativa de Cuba / A journey through the history of Cuba's administrative division",
    description: "",
    phone: "+53 78820045 / +53 63511623 /  +53 50970588",
    email: "hostal.villad2@gmail.com",
    whatsapp: "+53 63511623",
    address: "Calle 37 #14 e/Paseo y Calle 2 en el Vedado , La Habana , Cuba ",
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
// Use the roomsService from @/modules/shared/services/rooms.service
// and hooks from @/modules/client/hooks instead

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
    {
        icon: Camera,
        name: "Cámaras de Video-vigilancia / Video Surveillance Cameras",
        description: "Sistema completo de video-vigilancia en todas las áreas comunes para su seguridad. / Complete video surveillance system in all common areas for your safety."
    },
    {
        icon: Flame,
        name: "Extintores de Incendio / Fire Extinguishers",
        description: "Extintores estratégicamente ubicados y certificados en todas las áreas. / Strategically located and certified fire extinguishers in all areas."
    },
    {
        icon: Shield,
        name: "Sensores de Alarma contra Intrusos - Intruder Alarm Sensors",
        description: "Sistema de alarmas conectado a centrales de seguridad las 24 horas del día./ Alarm system connected 24 hours a day to security centers."
    },
    {
        icon: Lightbulb,
        name: "Adecuada Iluminación / Adequate Lighting",
        description: "Iluminación completa en todas las áreas comunes y exteriores. / Complete lighting in all common and exterior areas."
    },
    {
        icon: MapPin,
        name: "Señalética Completa / Complete Signage",
        description: "Señalización clara de todas las áreas, salidas de emergencia y servicios. / Clear signage of all areas, emergency exits and services."
    },
];

export const SERVICES_INCLUDED = [
    {
        icon: Wifi,
        name: "WIFI Gratuita / Free WIFI",
        description: "Conexión WIFI gratuita en todos los puntos de la Villa. / Free WIFI connection at all points of the Villa."
    },
    {
        icon: Car,
        name: "Parking Vigilado / Supervised Parking",
        description: "Área amplia exterior frente a la Villa, permanentemente vigilada. / Wide exterior area in front of the Villa, permanently supervised."
    },
    {
        icon: Luggage,
        name: "Servicio de Botones / Bell Service",
        description: "Personal especializado para facilitar movimientos del equipaje de los huéspedes. / Specialized staff to facilitate guest luggage movements."
    },
    {
        icon: Heart,
        name: "Botiquín y Primeros Auxilios / First Aid Kit",
        description: "Botiquín completo y personal entrenado. Servicios médicos cercanos disponibles. / Complete first aid kit and trained staff. Nearby medical services available."
    },
    {
        icon: Zap,
        name: "Plantas Eléctricas Auxiliares / Auxiliary Power Generators",
        description: "Sistema de respaldo eléctrico para emergencias. / Backup electrical system for emergencies."
    },
    {
        icon: Lock,
        name: "Caja de Seguridad / Safety Deposit Box",
        description: "Cajas de seguridad individuales en cada habitación. / Individual safety deposit boxes in each room."
    },
];

export const SERVICES_ADDITIONAL = [
    {
        icon: Plane,
        name: "Recogida y retorno al Aeropuerto / Airport Pickup and Return",
        description: "Servicio de recogida en el aeropuerto y retorno al finalizar la estancia. / Airport pickup service and return upon completion of stay."
    },
    {
        icon: Car,
        name: "Traslados por la Ciudad / City Transfers",
        description: "Traslados a cualquier punto de la ciudad según sus necesidades. / Transfers to any point in the city according to your needs."
    },
    {
        icon: Clock,
        name: "Servicio de Habitaciones 24h / 24h Room Service",
        description: "Servicio de habitaciones disponible las 24 horas del día. / Room service available 24 hours a day."
    },
    {
        icon: Wine,
        name: "Servicio de Minibar / Minibar Service",
        description: "Minibar en habitaciones con selección de bebidas y snacks. / Minibar in rooms with selection of drinks and snacks."
    },
    {
        icon: Shirt,
        name: "Lavado y Planchado Personalizado / Custom Laundry and Ironing",
        description: "Servicio profesional de lavandería y planchado. / Professional laundry and ironing service."
    },
    {
        icon: Beer,
        name: "Terraza-Bar / Terrace-Bar",
        description: "Terraza-Bar con bebidas y comidas ligeras, ambientación y juegos de mesa. / Terrace-Bar with drinks and light meals, ambiance and board games."
    },
    {
        icon: Coffee,
        name: "Servicio de Desayuno / Breakfast Service",
        description: "Desayuno completo con variedad de opciones. / Complete breakfast with a variety of options."
    },
    {
        icon: Gift,
        name: "Venta de Souvenirs / Souvenir Sales",
        description: "Souvenirs y artículos identificativos de la Villa. / Souvenirs and identifying items of the Villa."
    },
    {
        icon: Scissors,
        name: "Servicios de Belleza / Beauty Services",
        description: "Peluquería, barbería, peinados y servicios de belleza en general. / Hairdressing, barber, hairstyles and general beauty services."
    },
];

// Mantener compatibilidad con el código existente
export const SERVICES_BASIC = SERVICES_INCLUDED;
export const SERVICES_TOURIST = SERVICES_ADDITIONAL;
