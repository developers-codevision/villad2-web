import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { menuService } from '@/modules/shared/services';
import type { MenuListItem } from '@/modules/shared/types/menu.types';

export function useMenuManagement() {
  const [menus, setMenus] = useState<MenuListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const loadMenus = useCallback(async () => {
    setLoading(true);
    try {
      const data = await menuService.getAll();
      setMenus(data);
    } catch (error) {
      console.error('Error loading menus:', error);
      toast.error('Error al cargar los menús');
      setMenus([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  const toggleActive = useCallback(async (menu: MenuListItem) => {
    setSaving(true);
    try {
      const updated = await menuService.update(menu.id, {
        ...menu,
        active: !menu.active,
      });
      setMenus((prev) =>
        prev.map((m) =>
          m.id === menu.id ? { ...m, active: updated.active } : m
        )
      );
      toast.success(updated.active ? 'Menú activado' : 'Menú desactivado');
    } catch (error) {
      console.error('Error toggling menu status:', error);
      toast.error('Error al cambiar el estado del menú');
    } finally {
      setSaving(false);
    }
  }, []);

  const confirmDelete = useCallback(async () => {
    if (deleteConfirm === null) return;
    setSaving(true);
    try {
      await menuService.delete(deleteConfirm);
      toast.success('Menú eliminado correctamente');
      setDeleteConfirm(null);
      await loadMenus();
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast.error('Error al eliminar el menú');
    } finally {
      setSaving(false);
    }
  }, [deleteConfirm, loadMenus]);

  return {
    menus,
    loading,
    saving,
    deleteConfirm,
    setDeleteConfirm,
    closeDeleteDialog: () => setDeleteConfirm(null),
    confirmDelete,
    toggleActive,
  };
}
