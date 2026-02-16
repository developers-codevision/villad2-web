// Shared types for the application

export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  image: string;
  amenities: string[];
}

export interface Reservation {
  id: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Hostal {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
}

export interface Service {
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface Review {
  id: string;
  name: string;
  country: string;
  rating: number;
  text: string;
  createdAt: string;
}
