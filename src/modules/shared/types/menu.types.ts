export interface MenuListItem {
  id: number;
  name: string;
  description: string | null;
  schedule: string | null;
  order: number;
  active: boolean;
}

export interface MenuProduct {
  id?: number;
  name: string;
  description: string | null;
  price: number;
  active: boolean;
  featured: boolean;
}

export interface MenuCategory {
  id?: number;
  name: string;
  description: string | null;
  active: boolean;
  order: number;
  menuId?: number;
  products: MenuProduct[];
}

export interface MenuSubtitle {
  id?: number;
  text: string;
  order: number;
  menuId?: number;
}

export interface Menu {
  id: number;
  name: string;
  description: string | null;
  schedule: string | null;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  categories: MenuCategory[];
  subtitulos: MenuSubtitle[];
}

export interface MenuFormData {
  name: string;
  description: string;
  schedule: string;
  order: number;
  active: boolean;
  categories: MenuCategory[];
  subtitulos: MenuSubtitle[];
}
