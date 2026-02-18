import { useState, useEffect } from 'react';
import { roomsService, Room } from '../services/rooms.service';

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await roomsService.getAll();
        setRooms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las habitaciones');
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return { rooms, loading, error };
};

export const useRoom = (id: number) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await roomsService.getById(id);
        setRoom(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la habitación');
        console.error('Error fetching room:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoom();
    }
  }, [id]);

  return { room, loading, error };
};

