// API Types and Interfaces

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
  user: User;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

