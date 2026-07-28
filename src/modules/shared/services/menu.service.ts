import { authenticatedApiClient } from './api';
import type { Menu, MenuListItem } from '../types/menu.types';

function mapApiMenuToFrontend(api: any): Menu {
  return {
    id: api.id,
    name: api.name || '',
    description: api.description || null,
    schedule: api.schedule || null,
    order: api.order ?? 0,
    active: api.active ?? true,
    createdAt: api.createdAt || '',
    updatedAt: api.updatedAt || '',
    categories: (api.categories || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name || '',
      description: cat.description || null,
      active: cat.active ?? true,
      order: cat.order ?? 0,
      menuId: cat.menuId,
      products: (cat.categoryProducts || []).map((cp: any) => ({
        id: cp.product?.id,
        name: cp.product?.name || '',
        description: cp.product?.description || null,
        price: Number(cp.product?.price) || 0,
        active: cp.product?.active ?? true,
        featured: cp.product?.featured ?? false,
      })),
    })),
    subtitulos: (api.subtitulos || []).map((sub: any) => ({
      id: sub.id,
      text: sub.text || '',
      order: sub.order ?? 0,
      menuId: sub.menuId,
    })),
  };
}

function mapApiMenuListItem(api: any): MenuListItem {
  return {
    id: api.id,
    name: api.name || '',
    description: api.description || null,
    schedule: api.schedule || null,
    order: api.order ?? 0,
    active: api.active ?? true,
  };
}

export const menuService = {
  async getAll(): Promise<MenuListItem[]> {
    const res = await authenticatedApiClient.get<any[]>('/api/menus');
    return res.map(mapApiMenuListItem);
  },

  async getById(id: number): Promise<Menu> {
    const res = await authenticatedApiClient.get<any>(`/api/menus/${id}`);
    return mapApiMenuToFrontend(res);
  },

  async create(data: Record<string, unknown>): Promise<Menu> {
    const res = await authenticatedApiClient.post<any>('/api/menus', data);
    return mapApiMenuToFrontend(res);
  },

  async update(id: number, data: Record<string, unknown>): Promise<Menu> {
    const res = await authenticatedApiClient.put<any>(`/api/menus/${id}`, data);
    return mapApiMenuToFrontend(res);
  },

  async delete(id: number): Promise<void> {
    await authenticatedApiClient.delete<void>(`/api/menus/${id}`);
  },
};
