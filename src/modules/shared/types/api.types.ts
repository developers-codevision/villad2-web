// API Types and Interfaces - Single Source of Truth

// ============================================
// ENUMS
// ============================================

export enum RoomType {
  STANDARD_ECONOMIC = 'standard_economic',
  STANDARD = 'standard',
  STANDARD_PLUS = 'standard_plus',
  SUITE_BALCONY = 'suite_balcony',
}

export enum RoomStatus {
  VACIA_LIMPIA = 'vacia_limpia',
  VACIA_SUCIA = 'vacia_sucia',
  FUERA_DE_ORDEN = 'fuera_de_orden',
  OCUPADA = 'ocupada',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum ReservationStatus {
  PENDING = 'pendiente',
  CONFIRMED = 'confirmada',
  CANCELLED = 'cancelada',
  FINISHED = 'terminada',
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

export type UpdateRoomDto = Partial<CreateRoomDto>;

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
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

// ============================================
// RESERVATION INTERFACES
// ============================================

export interface GuestInfo {
  firstName: string;
  lastName: string;
  sex: 'M' | 'F' | 'otro' | undefined;
  idNumber?: string;
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
  transferOneWay: boolean;
  transferRoundTrip: boolean;
  breakfasts: number;
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
  transferOneWay?: boolean;
  transferRoundTrip?: boolean;
  breakfasts?: number;
  paymentMethod?: 'paypal' | 'stripe' | 'zelle' | 'bizum';
  stripeCustomerId?: string;
  paymentType?: 'reservation';
  currency?: string;
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
  transferOneWay?: boolean;
  transferRoundTrip?: boolean;
  breakfasts?: number;
}

// ============================================
// REVIEW INTERFACES
// ============================================

export enum ReviewStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface Review {
  id: number;
  name: string;
  title?: string;
  country: string;
  content: string;
  stars: number;
  response?: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewDto {
  name: string;
  title:string;
  country: string;
  content: string;
  stars: number;
  response?: string;
  status?: ReviewStatus;
}

export interface UpdateReviewDto {
  name?: string;
  country?: string;
  content?: string;
  stars?: number;
  response?: string;
  status?: ReviewStatus;
}

// ============================================
// PROMOTION INTERFACES
// ============================================

export enum PromotionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface Promotion {
  id: number;
  title: string;
  maxPeople?: number;
  minPeople?: number;
  time?: string;
  services?: string[];
  description?: string;
  checkInTime?: string;
  checkOutTime?: string;
  photo?: string;
  status: PromotionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromotionDto {
  title: string;
  maxPeople?: number;
  minPeople?: number;
  time?: string;
  services?: string[];
  description?: string;
  checkInTime?: string;
  checkOutTime?: string;
  photo?: string;
  status?: PromotionStatus;
}

export interface UpdatePromotionDto {
  title?: string;
  maxPeople?: number;
  minPeople?: number;
  time?: string;
  services?: string[];
  description?: string;
  checkInTime?: string;
  checkOutTime?: string;
  photo?: string;
  status?: PromotionStatus;
}

// ============================================
// SETTINGS INTERFACES
// ============================================

export interface Settings {
  id: number;
  earlyCheckInPrice: string;
  lateCheckOutPrice: string;
  transferOneWayPrice: string;
  transferRoundTripPrice: string;
  breakfastPrice: string;
}

export interface UpdateSettingsDto {
  earlyCheckInPrice?: string;
  lateCheckOutPrice?: string;
  transferOneWayPrice?: string;
  transferRoundTripPrice?: string;
  breakfastPrice?: string;
}

// ============================================
// API ERROR INTERFACE
// ============================================

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export interface OccupiedRange {
  start: string; // e.g. "14:00" or full ISO timestamp
  end: string;   // e.g. "18:00" or full ISO timestamp
}

export interface OccupiedDay {
  date: string; // YYYY-MM-DD
  occupiedRanges: OccupiedRange[];
}
