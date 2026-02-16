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
}
  description: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
export interface Service {

}
  whatsapp: string;
  address: string;
  email: string;
  phone: string;
  description: string;
  tagline: string;

