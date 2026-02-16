import { useState } from "react";
import { Tag, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { Textarea } from "@/modules/shared/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/modules/shared/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/modules/shared/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/shared/components/ui/table";
import ImageUploader from "@/modules/client/components/ImageUploader";
import { toast } from "sonner";

interface Promocion {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen: string[];
}

const INITIAL: Promocion[] = [
  {
    id: 1,
    titulo: "Escapada Romántica",
    descripcion: "Disfruta de una noche especial con cena incluida y decoración romántica.",
    precio: 89.99,
    imagen: [],
  },
  {
    id: 2,
    titulo: "Fin de Semana Relax",
    descripcion: "2 noches con acceso al spa y desayuno buffet.",
    precio: 149.0,
    imagen: [],
  },
];

const EMPTY: Omit<Promocion, "id"> = { titulo: "", descripcion: "", precio: 0, imagen: [] };

export default function AdminPromociones() {
  const [promos, setPromos] = useState<Promocion[]>(INITIAL);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Promocion | null>(null);
  const [form, setForm] = useState<Omit<Promocion, "id">>(EMPTY);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY, imagen: [] });
    setOpen(true);
  };

  const openEdit = (p: Promocion) => {
    setEditing(p);
    setForm({ titulo: p.titulo, descripcion: p.descripcion, precio: p.precio, imagen: [...p.imagen] });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.titulo.trim()) { toast.error("El título es obligatorio"); return; }
    if (form.precio <= 0) { toast.error("El precio debe ser mayor a 0"); return; }

    if (editing) {
      setPromos((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...form } : p)));
      toast.success("Promoción actualizada");
    } else {
      const newId = promos.length ? Math.max(...promos.map((p) => p.id)) + 1 : 1;
      setPromos((prev) => [...prev, { id: newId, ...form }]);
      toast.success("Promoción creada");
    }
    setOpen(false);
  };

  const handleDelete = () => {
    if (deleteId === null) return;
    setPromos((prev) => prev.filter((p) => p.id !== deleteId));
    toast.success("Promoción eliminada");
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Promociones</h1>
          <p className="text-muted-foreground">Crea y gestiona ofertas especiales para tus huéspedes.</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-1 h-4 w-4" />Nueva promoción</Button>
      </div>

      {promos.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-muted-foreground">
          <Tag size={48} className="mb-4 opacity-30" />
          <p className="font-medium">Sin promociones activas</p>
          <p className="text-sm mt-1">Crea tu primera promoción para atraer más huéspedes.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagen</TableHead>
                <TableHead>Título</TableHead>
                <TableHead className="hidden sm:table-cell">Descripción</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {p.imagen.length > 0 ? (
                      <img src={p.imagen[0]} alt={p.titulo} className="h-12 w-16 rounded object-cover" />
                    ) : (
                      <div className="h-12 w-16 rounded bg-muted flex items-center justify-center">
                        <Tag className="h-5 w-5 text-muted-foreground/40" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{p.titulo}</TableCell>
                  <TableCell className="hidden sm:table-cell max-w-[260px] truncate text-muted-foreground text-sm">
                    {p.descripcion}
                  </TableCell>
                  <TableCell className="font-semibold">${p.precio.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => setDeleteId(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar promoción" : "Nueva promoción"}</DialogTitle>
            <DialogDescription>
              {editing ? "Modifica los datos de la promoción." : "Completa los datos para crear una nueva promoción."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium">Título *</label>
              <Input value={form.titulo} onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} placeholder="Ej: Escapada Romántica" />
            </div>
            <div>
              <label className="text-sm font-medium">Descripción</label>
              <Textarea value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} placeholder="Describe la promoción..." rows={3} />
            </div>
            <div>
              <label className="text-sm font-medium">Precio ($) *</label>
              <Input type="number" min={0} step={0.01} value={form.precio || ""} onChange={(e) => setForm((f) => ({ ...f, precio: parseFloat(e.target.value) || 0 }))} placeholder="0.00" />
            </div>
            <ImageUploader
              label="Imagen del banner"
              images={form.imagen}
              onChange={(imgs) => setForm((f) => ({ ...f, imagen: imgs }))}
              maxImages={1}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editing ? "Guardar cambios" : "Crear promoción"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar promoción?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
