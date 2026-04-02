import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'es') ? saved : 'es';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Traducciones para las vistas del cliente
const translations: Record<Language, Record<string, string>> = {
  es: {
    // Navbar
    'nav.home': 'Inicio',
    'nav.rooms': 'Habitaciones',
    'nav.services': 'Servicios',
    'nav.promotions': 'Promociones',
    'nav.reservations': 'Reservas',
    'nav.reviews': 'Reseñas',
    'nav.places': 'Lugares de Interés',
    'nav.bookNow': 'Reservar Ahora',

    // Room Detail
    'room.allRooms': 'Todas las habitaciones',
    'room.upTo': 'Hasta',
    'room.person': 'persona',
    'room.persons': 'personas',
    'room.includes': 'La habitación cuenta con',
    'room.bathroom': 'El baño cuenta con',
    'room.bookRoom': 'Reserva esta',
    'room.room': 'Habitación',
    'room.morePhotos': 'Más',
    'room.photos': 'Fotos',
    'room.services': 'Descubre nuestros',
    'room.servicesDesc': 'Tours guiados, alquiler de bicicletas, traslados al aeropuerto y mucho más para que tu estancia sea perfecta.',
    'room.exploreServices': 'Explorar Servicios',
    'room.notFound': 'Habitación no encontrada',
    'room.viewRooms': 'Ver habitaciones',
    'room.notAvailable': 'Esta habitación no está disponible',
    'room.notAvailableDesc': 'La habitación que buscas no se encuentra disponible en este momento.',
    'room.viewAvailable': 'Ver habitaciones disponibles',

    // Promotions
    'promo.exclusive': 'Ofertas exclusivas',
    'promo.title': 'Promociones Especiales',
    'promo.subtitle': 'Descubre nuestras ofertas diseñadas para brindarte la mejor experiencia. Aprovecha estas promociones limitadas y vive momentos inolvidables.',
    'promo.none': 'Sin promociones disponibles',
    'promo.noneDesc': 'Vuelve más tarde para ver nuestras nuevas ofertas.',
    'promo.upTo': 'Hasta',
    'promo.from': 'Desde',
    'promo.persons': 'personas',
    'promo.checkIn': 'Entrada',
    'promo.checkOut': 'Salida',
    'promo.book': 'Reservar',

    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
  },
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.rooms': 'Rooms',
    'nav.services': 'Services',
    'nav.promotions': 'Promotions',
    'nav.reservations': 'Reservations',
    'nav.reviews': 'Reviews',
    'nav.places': 'Places of Interest',
    'nav.bookNow': 'Book Now',

    // Room Detail
    'room.allRooms': 'All rooms',
    'room.upTo': 'Up to',
    'room.person': 'person',
    'room.persons': 'persons',
    'room.includes': 'Room includes',
    'room.bathroom': 'Bathroom includes',
    'room.bookRoom': 'Book this',
    'room.room': 'Room',
    'room.morePhotos': 'More',
    'room.photos': 'Photos',
    'room.services': 'Discover our',
    'room.servicesDesc': 'Guided tours, bicycle rentals, airport transfers and much more to make your stay perfect.',
    'room.exploreServices': 'Explore Services',
    'room.notFound': 'Room not found',
    'room.viewRooms': 'View rooms',
    'room.notAvailable': 'This room is not available',
    'room.notAvailableDesc': 'The room you are looking for is not available at this time.',
    'room.viewAvailable': 'View available rooms',

    // Promotions
    'promo.exclusive': 'Exclusive offers',
    'promo.title': 'Special Promotions',
    'promo.subtitle': 'Discover our offers designed to give you the best experience. Take advantage of these limited promotions and live unforgettable moments.',
    'promo.none': 'No promotions available',
    'promo.noneDesc': 'Come back later to see our new offers.',
    'promo.upTo': 'Up to',
    'promo.from': 'From',
    'promo.persons': 'persons',
    'promo.checkIn': 'Check-in',
    'promo.checkOut': 'Check-out',
    'promo.book': 'Book',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
  },
};
