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
  PENDING = 'pendiente',
  CONFIRMED = 'confirmada',
  CANCELLED = 'cancelada',
  COMPLETED = 'completada',
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
  baseCapacity: number;
  extraCapacity: number;
  extraGuestCharge: number;
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
  baseCapacity: number;
  extraCapacity: number;
  extraGuestCharge: number;
  roomType: RoomType;
  roomAmenities?: string[];
  bathroomAmenities?: string[];
  status?: RoomStatus;
  floor?: number;
  hasJacuzzi?: boolean;
  hasTv?: boolean;
  hasAirConditioning?: boolean;
  hasHeating?: boolean;
  isPetFriendly?: boolean;
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

export interface GuestInfo {
  firstName: string;
  lastName: string;
  sex: 'M' | 'F' | 'otro';
}

export interface MainGuestInfo extends GuestInfo {
  email: string;
  phone: string;
}

export interface Reservation {
  id: number;
  roomId: number;
  userId?: number;
  checkInDate: string;
  checkOutDate: string;
  mainGuest: MainGuestInfo;
  baseGuestsCount: number;
  extraGuestsCount: number;
  totalPrice: number;
  status: ReservationStatus;
  notes?: string;
  additionalGuests?: GuestInfo[];
  earlyCheckIn: boolean;
  lateCheckOut: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationDto {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  mainGuest: MainGuestInfo;
  baseGuestsCount: number;
  extraGuestsCount: number;
  status?: ReservationStatus;
  notes?: string;
  additionalGuests?: GuestInfo[];
  earlyCheckIn?: boolean;
  lateCheckOut?: boolean;
}

export interface UpdateReservationDto {
  status?: ReservationStatus;
  notes?: string;
  checkInDate?: string;
  checkOutDate?: string;
  baseGuestsCount?: number;
  extraGuestsCount?: number;
  earlyCheckIn?: boolean;
  lateCheckOut?: boolean;
}

// ============================================
// API ERROR INTERFACE
// ============================================

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}
