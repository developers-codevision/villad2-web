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

    // Rooms Page
    'rooms.title': 'Nuestras Habitaciones',
    'rooms.subtitle': 'Encuentra la habitación ideal para tu estancia. Todas incluyen WiFi gratuito y desayuno.',
    'rooms.error': 'Por favor, intenta nuevamente más tarde.',
    'rooms.noRooms': 'No hay habitaciones disponibles en este momento.',

    // Services Page
    'services.title': 'Nuestros Servicios',
    'services.subtitle': 'Todo lo que necesitas para disfrutar al máximo tu estancia.',
    'services.security': 'Seguridad del Hostal',
    'services.included': 'Servicios Incluidos',
    'services.additional': 'Servicios Adicionales',

    // Reviews Page
    'reviews.title': 'Reseñas de Huéspedes',
    'reviews.subtitle': 'Comparte tu experiencia y ayuda a otros viajeros a conocer Villa D2.',
    'reviews.formTitle': 'Deja tu reseña',
    'reviews.name': 'Nombre *',
    'reviews.namePlaceholder': 'Tu nombre',
    'reviews.country': 'País',
    'reviews.countryPlaceholder': 'Tu país (opcional)',
    'reviews.titleLabel': 'Título',
    'reviews.titlePlaceholder': 'Un breve título para tu reseña',
    'reviews.comment': 'Comentario *',
    'reviews.commentPlaceholder': 'Cuéntanos sobre tu experiencia en Villa D2...',
    'reviews.rating': 'Puntuación *',
    'reviews.submit': 'Publicar Reseña',
    'reviews.submitting': 'Enviando...',
    'reviews.successTitle': '¡Gracias por tu reseña!',
    'reviews.successDesc': 'Tu opinión ha sido recibida, gracias por participar.',
    'reviews.errorTitle': 'Error',
    'reviews.errorDesc': 'No pudimos procesar tu reseña. Intenta de nuevo.',
    'reviews.requiredFields': 'Campos requeridos',
    'reviews.requiredFieldsDesc': 'Por favor completa tu nombre, puntuación y comentario.',

    // Login Page
    'login.title': 'Acceso Administración',
    'login.username': 'Usuario',
    'login.usernamePlaceholder': 'admin',
    'login.password': 'Contraseña',
    'login.passwordPlaceholder': '••••••••',
    'login.submit': 'Iniciar sesión',
    'login.submitting': 'Iniciando sesión...',
    'login.back': 'Volver',
    'login.errorCredentials': 'Introduce usuario y contraseña',
    'login.welcome': 'Bienvenido, ${name}!',
    'login.errorLogin': 'Error al iniciar sesión',

    // Places of Interest
    'places.title': 'Lugares de Interés Turístico',
    'places.subtitle': 'Descubre los mejores sitios turísticos, culturales y recreativos cercanos a Villa D2 y contacta en recepción para organizar la excursión de tu interés.',
    'places.visitSite': 'Visitar sitio',
    'places.checkAvailability': 'Consultar disponibilidad',

    // FAQ
    'faq.title': 'Preguntas Frecuentes',
    'faq.subtitle': 'Encuentra respuestas a las preguntas más comunes sobre tu estancia en Villa D2.',
    'faq.contactTitle': '¿No encontraste tu respuesta?',
    'faq.contactDesc': 'Nuestro equipo de atención al cliente está disponible para ayudarte. Contáctanos en cualquier momento.',
    'faq.email': 'Enviar Email',
    'faq.call': 'Llamar Ahora',

    // Home Page
    'home.heroTitle': 'Hostal Boutique',
    'home.bookNow': 'Reservar Ahora',
    'home.servicesTitle': 'Nuestros Servicios',
    'home.servicesSubtitle': 'Desde seguridad 24/7 hasta servicios premium, tenemos todo lo que necesitas para una estancia perfecta.',
    'home.viewAllServices': 'Ver Todos los Servicios',
    'home.reviewsTitle': 'Lo que dicen nuestros Huéspedes',
    'home.reviewsSubtitle': 'Experiencias reales de quienes ya nos visitaron.',
    'home.loadingReviews': 'Cargando reseñas...',
    'home.noReviews': 'No hay reseñas aprobadas aún. ¡Sé el primero en dejar una!',
    'home.hostalResponse': '💬 Respuesta del hostal',
    'home.contactTitle': 'Contacto y Ubicación',
    'home.phones': 'Teléfonos',
    'home.email': 'Email',
    'home.whatsapp': 'WhatsApp',
    'home.address': 'Dirección',
    'home.mapTitle': 'Ubicación del hostal',
    'home.loadMap': 'Cargar mapa interactivo',
    'home.clickHere': '(Haz clic aquí)',

    // Terrace Bar Section
    'terrace.title': 'La Terraza-Bar',
    'terrace.description': 'La Terraza-Bar, está decorada haciendo alusión a los "Cayos de Cuba", donde se reflejan los archipiélagos de Jardines del Rey, Jardines de la Reina, el archipiélago de los Canarreos y de los Colorados, como parte integrante del territorio de Cuba y su historia.',

    // Reception Section
    'reception.title': 'La Recepción',
    'reception.description': 'En la recepción se informa además a los huéspedes sobre los programas de visitas a todos los sitios de interés turístico, cultural y recreativo, y se establecen coordinaciones para el traslado hacia museos y centros recreativos.',

    // Exchange Rate Section
    'exchange.title': 'Tipos de Cambio',
    'exchange.description': 'Consulta los valores actuales del mercado cambiario en Cuba. Accede a CADECA para ver las cotizaciones en tiempo real y obtener la mejor tasa de cambio para tu conversión de divisas.',
    'exchange.button': 'Ver Tipos de Cambio en CADECA',
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

    // Rooms Page
    'rooms.title': 'Our Rooms',
    'rooms.subtitle': 'Find the perfect room for your stay. All include free WiFi and breakfast.',
    'rooms.error': 'Please try again later.',
    'rooms.noRooms': 'No rooms available at this time.',

    // Services Page
    'services.title': 'Our Services',
    'services.subtitle': 'Everything you need to enjoy your stay to the fullest.',
    'services.security': 'Hostal Security',
    'services.included': 'Included Services',
    'services.additional': 'Additional Services',

    // Reviews Page
    'reviews.title': 'Guest Reviews',
    'reviews.subtitle': 'Share your experience and help other travelers learn about Villa D2.',
    'reviews.formTitle': 'Leave your review',
    'reviews.name': 'Name *',
    'reviews.namePlaceholder': 'Your name',
    'reviews.country': 'Country',
    'reviews.countryPlaceholder': 'Your country (optional)',
    'reviews.titleLabel': 'Title',
    'reviews.titlePlaceholder': 'A brief title for your review',
    'reviews.comment': 'Comment *',
    'reviews.commentPlaceholder': 'Tell us about your experience at Villa D2...',
    'reviews.rating': 'Rating *',
    'reviews.submit': 'Publish Review',
    'reviews.submitting': 'Sending...',
    'reviews.successTitle': 'Thank you for your review!',
    'reviews.successDesc': 'Your opinion has been received, thank you for participating.',
    'reviews.errorTitle': 'Error',
    'reviews.errorDesc': 'We couldn\'t process your review. Please try again.',
    'reviews.requiredFields': 'Required fields',
    'reviews.requiredFieldsDesc': 'Please complete your name, rating and comment.',

    // Login Page
    'login.title': 'Administration Access',
    'login.username': 'Username',
    'login.usernamePlaceholder': 'admin',
    'login.password': 'Password',
    'login.passwordPlaceholder': '••••••••',
    'login.submit': 'Log in',
    'login.submitting': 'Logging in...',
    'login.back': 'Back',
    'login.errorCredentials': 'Enter username and password',
    'login.welcome': 'Welcome, ${name}!',
    'login.errorLogin': 'Error logging in',

    // Places of Interest
    'places.title': 'Places of Interest',
    'places.subtitle': 'Discover the best tourist, cultural and recreational sites near Villa D2 and contact reception to organize the excursion of your interest.',
    'places.visitSite': 'Visit site',
    'places.checkAvailability': 'Check availability',

    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Find answers to the most common questions about your stay at Villa D2.',
    'faq.contactTitle': 'Didn\'t find your answer?',
    'faq.contactDesc': 'Our customer service team is available to help you. Contact us at any time.',
    'faq.email': 'Send Email',
    'faq.call': 'Call Now',

    // Home Page
    'home.heroTitle': 'Boutique Hostal',
    'home.bookNow': 'Book Now',
    'home.servicesTitle': 'Our Services',
    'home.servicesSubtitle': 'From 24/7 security to premium services, we have everything you need for a perfect stay.',
    'home.viewAllServices': 'View All Services',
    'home.reviewsTitle': 'What Our Guests Say',
    'home.reviewsSubtitle': 'Real experiences from those who have visited us.',
    'home.loadingReviews': 'Loading reviews...',
    'home.noReviews': 'No approved reviews yet. Be the first to leave one!',
    'home.hostalResponse': '💬 Hostal response',
    'home.contactTitle': 'Contact and Location',
    'home.phones': 'Phones',
    'home.email': 'Email',
    'home.whatsapp': 'WhatsApp',
    'home.address': 'Address',
    'home.mapTitle': 'Hostal location',
    'home.loadMap': 'Load interactive map',
    'home.clickHere': '(Click here)',

    // Terrace Bar Section
    'terrace.title': 'The Terrace-Bar',
    'terrace.description': 'The Terrace-Bar is decorated making allusion to the "Keys of Cuba", where the archipelagos of Jardines del Rey, Jardines de la Reina, the Canarreos archipelago and the Colorados are reflected, as an integral part of the territory of Cuba and its history.',

    // Reception Section
    'reception.title': 'The Reception',
    'reception.description': 'At reception, guests are also informed about visit programs to all tourist, cultural and recreational sites of interest, and arrangements are made for transportation to museums and recreational centers.',

    // Exchange Rate Section
    'exchange.title': 'Exchange Rates',
    'exchange.description': 'Check the current values of the exchange market in Cuba. Access CADECA to see real-time quotes and get the best exchange rate for your currency conversion.',
    'exchange.button': 'View Exchange Rates on CADECA',
  },
};
