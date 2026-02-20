// API Types and Interfaces - Single Source of Truth

// ============================================
// ENUMS
// ============================================

export enum RoomType {
  INDIVIDUAL = 'individual',
  DOUBLE = 'double',
  SUITE = 'suite',
  FAMILY = 'family',
  PRESIDENTIAL = 'presidential',
}

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

// ============================================
// ROOM INTERFACES
// ============================================

export interface Room {
  id: number;
  number: string;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  roomType: RoomType;
  roomAmenities: string[];
  bathroomAmenities: string[];
  status: RoomStatus;
  mainPhoto: string[];
  additionalPhotos: string[];
  floor?: number;
  hasJacuzzi?: boolean;
  hasTv?: boolean;
  hasAirConditioning?: boolean;
  hasHeating?: boolean;
  isPetFriendly?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomDto {
  number: string;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  roomType: RoomType;
  roomAmenities?: string[];
  bathroomAmenities?: string[];
  status?: RoomStatus;
}

export interface UpdateRoomDto extends Partial<CreateRoomDto> {}

// ============================================
// USER INTERFACES
// ============================================

export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  isActive: boolean;
  isVerified: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  email: string;
  fullName?: string;
  phone?: string;
  roles?: string[];
  isActive?: boolean;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  roles?: string[];
  isActive?: boolean;
  password?: string;
}

// ============================================
// AUTH INTERFACES
// ============================================

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  password: string;
  email: string;
  fullName?: string;
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
}

// ============================================
// RESERVATION INTERFACES
// ============================================

export interface Reservation {
  id: number;
  roomId: number;
  userId?: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: ReservationStatus;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationDto {
  roomId: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
}

export interface UpdateReservationDto {
  status?: ReservationStatus;
  specialRequests?: string;
}

// ============================================
// API ERROR INTERFACE
// ============================================

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

