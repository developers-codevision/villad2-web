import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Star } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { Switch } from "@/modules/shared/components/ui/switch";
import { Label } from "@/modules/shared/components/ui/label";
import { useMenuEditor } from "../hooks/useMenuEditor";
import type { MenuCategory, MenuProduct, MenuSubtitle } from "@/modules/shared/types/menu.types";

export default function MenuEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const {
    loading, saving, formData, handleChange,
    addCategory, removeCategory, updateCategory,
    addProduct, removeProduct, updateProduct,
    addSubtitle, removeSubtitle, updateSubtitle,
    save,
  } = useMenuEditor(Number(id) || undefined);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Cargando menú...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate('/admin/menus')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a menús
        </Button>
        <Button onClick={save} disabled={saving}>
          {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear menú'}
        </Button>
      </div>

      <div className="space-y-8">
        {/* Datos del menú */}
        <section className="bg-card border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold">Datos del Menú</h2>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ej: Desayunos"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Breve descripción del menú"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule">Horario</Label>
            <Input
              id="schedule"
              value={formData.schedule}
              onChange={(e) => handleChange('schedule', e.target.value)}
              placeholder="Ej: 7:30 am a 10 am"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="space-y-2">
              <Label htmlFor="order">Orden</Label>
              <Input
                id="order"
                type="number"
                min={0}
                value={formData.order}
                onChange={(e) => handleChange('order', Number(e.target.value))}
                className="w-20"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(v) => handleChange('active', v)}
              />
              <Label htmlFor="active">Activo</Label>
            </div>
          </div>
        </section>

        {/* Categorías */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Categorías</h2>
            <Button size="sm" variant="outline" onClick={addCategory}>
              <Plus className="h-4 w-4 mr-1" /> Agregar categoría
            </Button>
          </div>

          {formData.categories.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-xl">
              No hay categorías. Agrega la primera.
            </p>
          )}

          {formData.categories.map((cat, catIdx) => (
            <CategoryCard
              key={cat.id ?? `cat-${catIdx}`}
              category={cat}
              catIdx={catIdx}
              onRemove={() => removeCategory(catIdx)}
              onChange={(field, value) => updateCategory(catIdx, field, value)}
              onAddProduct={() => addProduct(catIdx)}
              onRemoveProduct={(prodIdx) => removeProduct(catIdx, prodIdx)}
              onUpdateProduct={(prodIdx, field, value) => updateProduct(catIdx, prodIdx, field, value)}
            />
          ))}
        </section>

        {/* Subtítulos */}
        <section className="bg-card border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Subtítulos</h2>
            <Button size="sm" variant="outline" onClick={addSubtitle}>
              <Plus className="h-4 w-4 mr-1" /> Añadir
            </Button>
          </div>

          {formData.subtitulos.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
              Sin subtítulos (ej: "Precios en USD + 10% Servicio")
            </p>
          )}

          <div className="space-y-2">
            {formData.subtitulos.map((sub, idx) => (
              <div key={sub.id ?? `sub-${idx}`} className="flex items-center gap-2">
                <Input
                  value={sub.text}
                  onChange={(e) => updateSubtitle(idx, 'text', e.target.value)}
                  placeholder="Texto del subtítulo"
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={0}
                  value={sub.order}
                  onChange={(e) => updateSubtitle(idx, 'order', Number(e.target.value))}
                  className="w-16"
                  placeholder="Ord"
                />
                <Button size="icon" variant="ghost" onClick={() => removeSubtitle(idx)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function CategoryCard({
  category, catIdx, onRemove, onChange, onAddProduct, onRemoveProduct, onUpdateProduct,
}: {
  category: MenuCategory;
  catIdx: number;
  onRemove: () => void;
  onChange: (field: keyof MenuCategory, value: unknown) => void;
  onAddProduct: () => void;
  onRemoveProduct: (prodIdx: number) => void;
  onUpdateProduct: (prodIdx: number, field: keyof MenuProduct, value: unknown) => void;
}) {
  return (
    <div className="bg-card border rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-xs">Nombre</Label>
            <Input
              value={category.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Nombre de la categoría"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Orden</Label>
            <Input
              type="number"
              min={0}
              value={category.order}
              onChange={(e) => onChange('order', Number(e.target.value))}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-5">
          <Switch
            checked={category.active}
            onCheckedChange={(v) => onChange('active', v)}
          />
          <Button size="icon" variant="ghost" onClick={onRemove}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      {/* Productos */}
      <div className="pl-0 sm:pl-4 border-l-2 border-border/50 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Productos ({category.products.length})
          </span>
          <Button size="sm" variant="ghost" onClick={onAddProduct}>
            <Plus className="h-3 w-3 mr-1" /> Agregar producto
          </Button>
        </div>

        {category.products.length === 0 && (
          <p className="text-xs text-muted-foreground py-3 text-center border border-dashed rounded-lg">
            Sin productos
          </p>
        )}

        {category.products.map((prod, prodIdx) => (
          <div key={prod.id ?? `prod-${prodIdx}`} className="bg-muted/30 rounded-lg p-3 space-y-2">
            <div className="flex items-start gap-2">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Nombre ES</Label>
                  <Input
                    value={prod.name}
                    onChange={(e) => onUpdateProduct(prodIdx, 'name', e.target.value)}
                    placeholder="Español"
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Descripción</Label>
                  <Input
                    value={prod.description ?? ''}
                    onChange={(e) => onUpdateProduct(prodIdx, 'description', e.target.value || null)}
                    placeholder="Opcional"
                    className="text-sm"
                  />
                </div>
              </div>
              <Button size="icon" variant="ghost" className="shrink-0 mt-5" onClick={() => onRemoveProduct(prodIdx)}>
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24">
                <Label className="text-xs">Precio ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  value={prod.price}
                  onChange={(e) => onUpdateProduct(prodIdx, 'price', Number(e.target.value))}
                  className="text-sm"
                />
              </div>
              <div className="flex items-center gap-1 pt-5">
                <Switch
                  checked={prod.featured}
                  onCheckedChange={(v) => onUpdateProduct(prodIdx, 'featured', v)}
                />
                <Star className={`h-3.5 w-3.5 ${prod.featured ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex items-center gap-1 pt-5">
                <Switch
                  checked={prod.active}
                  onCheckedChange={(v) => onUpdateProduct(prodIdx, 'active', v)}
                />
                <span className="text-xs text-muted-foreground">Activo</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
