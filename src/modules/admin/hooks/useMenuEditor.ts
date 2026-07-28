import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { menuService } from '@/modules/shared/services';
import type { MenuCategory, MenuProduct, MenuSubtitle, MenuFormData } from '@/modules/shared/types/menu.types';

const emptyFormData: MenuFormData = {
  name: '',
  description: '',
  schedule: '',
  order: 0,
  active: true,
  categories: [],
  subtitulos: [],
};

let nextTempId = 1;
function tempId(): number {
  return nextTempId++;
}

function emptyProduct(): MenuProduct {
  return { name: '', description: null, price: 0, active: true, featured: false };
}

function emptyCategory(): MenuCategory {
  return { name: '', description: null, active: true, order: 0, products: [] };
}

function emptySubtitle(): MenuSubtitle {
  return { text: '', order: 0 };
}

export function useMenuEditor(menuId?: number) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<MenuFormData>(emptyFormData);

  useEffect(() => {
    if (menuId) {
      loadMenu(menuId);
    }
  }, [menuId]);

  const loadMenu = async (id: number) => {
    setLoading(true);
    try {
      const menu = await menuService.getById(id);
      setFormData({
        name: menu.name || '',
        description: menu.description || '',
        schedule: menu.schedule || '',
        order: menu.order ?? 0,
        active: menu.active ?? true,
        categories: menu.categories.map((cat) => ({
          ...cat,
          products: cat.products.map((p) => ({ ...p })),
        })),
        subtitulos: menu.subtitulos.map((s) => ({ ...s })),
      });
    } catch (error) {
      console.error('Error loading menu:', error);
      toast.error('Error al cargar el menú');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = useCallback(<K extends keyof MenuFormData>(field: K, value: MenuFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addCategory = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, { ...emptyCategory(), order: prev.categories.length }],
    }));
  }, []);

  const removeCategory = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }));
  }, []);

  const updateCategory = useCallback((index: number, field: keyof MenuCategory, value: unknown) => {
    setFormData((prev) => {
      const cats = [...prev.categories];
      cats[index] = { ...cats[index], [field]: value };
      return { ...prev, categories: cats };
    });
  }, []);

  const addProduct = useCallback((catIndex: number) => {
    setFormData((prev) => {
      const cats = [...prev.categories];
      const products = [...cats[catIndex].products, emptyProduct()];
      cats[catIndex] = { ...cats[catIndex], products };
      return { ...prev, categories: cats };
    });
  }, []);

  const removeProduct = useCallback((catIndex: number, prodIndex: number) => {
    setFormData((prev) => {
      const cats = [...prev.categories];
      const products = cats[catIndex].products.filter((_, i) => i !== prodIndex);
      cats[catIndex] = { ...cats[catIndex], products };
      return { ...prev, categories: cats };
    });
  }, []);

  const updateProduct = useCallback((catIndex: number, prodIndex: number, field: keyof MenuProduct, value: unknown) => {
    setFormData((prev) => {
      const cats = [...prev.categories];
      const products = [...cats[catIndex].products];
      products[prodIndex] = { ...products[prodIndex], [field]: value };
      cats[catIndex] = { ...cats[catIndex], products };
      return { ...prev, categories: cats };
    });
  }, []);

  const addSubtitle = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      subtitulos: [...prev.subtitulos, { ...emptySubtitle(), order: prev.subtitulos.length }],
    }));
  }, []);

  const removeSubtitle = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      subtitulos: prev.subtitulos.filter((_, i) => i !== index),
    }));
  }, []);

  const updateSubtitle = useCallback((index: number, field: keyof MenuSubtitle, value: unknown) => {
    setFormData((prev) => {
      const subs = [...prev.subtitulos];
      subs[index] = { ...subs[index], [field]: value };
      return { ...prev, subtitulos: subs };
    });
  }, []);

  const validate = useCallback((): boolean => {
    if (!formData.name.trim()) {
      toast.error('El nombre del menú es obligatorio');
      return false;
    }
    for (let i = 0; i < formData.categories.length; i++) {
      const cat = formData.categories[i];
      if (!cat.name.trim()) {
        toast.error(`La categoría ${i + 1} debe tener un nombre`);
        return false;
      }
      for (let j = 0; j < cat.products.length; j++) {
        const prod = cat.products[j];
        if (!prod.name.trim()) {
          toast.error(`Producto ${j + 1} de "${cat.name}" debe tener un nombre`);
          return false;
        }
      }
    }
    return true;
  }, [formData]);

  const save = useCallback(async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name: formData.name,
        description: formData.description || null,
        schedule: formData.schedule || null,
        order: formData.order,
        active: formData.active,
        categories: formData.categories.map((cat) => ({
          ...(cat.id ? { id: cat.id } : {}),
          name: cat.name,
          description: cat.description || null,
          active: cat.active,
          order: cat.order,
          products: cat.products.map((prod) => ({
            ...(prod.id ? { id: prod.id } : {}),
            name: prod.name,
            description: prod.description || null,
            price: prod.price,
            active: prod.active,
            featured: prod.featured,
          })),
        })),
        subtitulos: formData.subtitulos.map((sub) => ({
          ...(sub.id ? { id: sub.id } : {}),
          text: sub.text,
          order: sub.order,
        })),
      };

      if (menuId) {
        await menuService.update(menuId, body);
        toast.success('Menú actualizado correctamente');
      } else {
        await menuService.create(body);
        toast.success('Menú creado correctamente');
        setFormData(emptyFormData);
      }
    } catch (error) {
      console.error('Error saving menu:', error);
      toast.error(menuId ? 'Error al actualizar el menú' : 'Error al crear el menú');
    } finally {
      setSaving(false);
    }
  }, [formData, menuId, validate]);

  return {
    loading,
    saving,
    formData,
    handleChange,
    addCategory,
    removeCategory,
    updateCategory,
    addProduct,
    removeProduct,
    updateProduct,
    addSubtitle,
    removeSubtitle,
    updateSubtitle,
    save,
  };
}
