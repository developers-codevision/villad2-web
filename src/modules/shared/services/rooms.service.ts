// Rooms API Service

import { authenticatedApiClient, apiClient } from './api';
import { Room, CreateRoomDto, UpdateRoomDto, RoomStatus, RoomType } from '../types/api.types';

export const roomsService = {
  /**
   * Get all rooms (public endpoint)
   * @param type Optional filter by room type
   */
  async getAll(type?: RoomType): Promise<Room[]> {
    const query = type ? `?type=${type}` : '';
    return apiClient.get<Room[]>(`/rooms${query}`);
  },

  /**
   * Get a room by ID (public endpoint)
   */
  async getById(id: number): Promise<Room> {
    return apiClient.get<Room>(`/rooms/${id}`);
  },

  /**
   * Create a new room (admin only)
   * Handles file uploads with FormData
   */
  async create(data: CreateRoomDto, mainPhoto?: File, additionalPhotos?: File[]): Promise<Room> {
    const formData = new FormData();

    // Append basic fields
    formData.append('number', data.number);
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('pricePerNight', data.pricePerNight.toString());
    formData.append('capacity', data.capacity.toString());
    formData.append('roomType', data.roomType);

    if (data.status) {
      formData.append('status', data.status);
    }

    // Append arrays as JSON strings
    if (data.roomAmenities && data.roomAmenities.length > 0) {
      formData.append('roomAmenities', JSON.stringify(data.roomAmenities));
    }

    if (data.bathroomAmenities && data.bathroomAmenities.length > 0) {
      formData.append('bathroomAmenities', JSON.stringify(data.bathroomAmenities));
    }

    // Append photos
    if (mainPhoto) {
      formData.append('mainPhoto', mainPhoto);
    }

    if (additionalPhotos && additionalPhotos.length > 0) {
      additionalPhotos.forEach(photo => {
        formData.append('additionalPhotos', photo);
      });
    }

    return authenticatedApiClient.postFormData<Room>('/rooms', formData);
  },

  /**
   * Update a room (admin only)
   */
  async update(id: number, data: UpdateRoomDto, mainPhoto?: File, additionalPhotos?: File[], keepPhotos?: string[]): Promise<Room> {
    const formData = new FormData();

    // Append only fields that are present
    if (data.number !== undefined) formData.append('number', data.number);
    if (data.name !== undefined) formData.append('name', data.name);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.pricePerNight !== undefined) formData.append('pricePerNight', data.pricePerNight.toString());
    if (data.capacity !== undefined) formData.append('capacity', data.capacity.toString());
    if (data.roomType !== undefined) formData.append('roomType', data.roomType);
    if (data.status !== undefined) formData.append('status', data.status);

    if (data.roomAmenities !== undefined) {
      formData.append('roomAmenities', JSON.stringify(data.roomAmenities));
    }

    if (data.bathroomAmenities !== undefined) {
      formData.append('bathroomAmenities', JSON.stringify(data.bathroomAmenities));
    }

    // Send keepPhotos array to preserve existing photos
    if (keepPhotos && keepPhotos.length > 0) {
      formData.append('keepPhotos', JSON.stringify(keepPhotos));
    }

    if (mainPhoto) {
      formData.append('mainPhoto', mainPhoto);
    }

    if (additionalPhotos && additionalPhotos.length > 0) {
      additionalPhotos.forEach(photo => {
        formData.append('additionalPhotos', photo);
      });
    }

    return authenticatedApiClient.putFormData<Room>(`/rooms/${id}`, formData);
  },

  /**
   * Delete a room (admin only)
   */
  async delete(id: number): Promise<void> {
    return authenticatedApiClient.delete<void>(`/rooms/${id}`);
  },

  /**
   * Update room status (admin only)
   */
  async updateStatus(id: number, status: RoomStatus): Promise<Room> {
    return authenticatedApiClient.put<Room>(`/rooms/${id}/status/${status}`, {});
  },

  /**
   * Get media URL for room photos
   */
  getMediaUrl(path: string): string {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
  },
};

