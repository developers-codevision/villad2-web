import { useState } from "react";
import { BedDouble, Plus, Pencil, Trash2 } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Habitacion {
  id: number;
  numero: string;
  nombre: string;
  descripcion: string;
  precio_por_noche: number;
  capacidad_personas: number;
  tipo_habitacion: string;
  amenities_habitacion: string[];
  amenities_banno: string[];
  estado: "disponible" | "ocupada" | "mantenimiento";
  foto_principal: string[];
  fotos_adicionales: string[];
}

const TIPOS = ["individual", "doble", "twin", "suite", "familiar", "compartido"];
const ESTADOS: Habitacion["estado"][] = ["disponible", "ocupada", "mantenimiento"];

const EMPTY: Omit<Habitacion, "id"> = {
  numero: "",
  nombre: "",
  descripcion: "",
  precio_por_noche: 0,
  capacidad_personas: 1,
  tipo_habitacion: "individual",
  amenities_habitacion: [],
  amenities_banno: [],
  estado: "disponible",
  foto_principal: [],
  fotos_adicionales: [],
};

const INITIAL_DATA: Habitacion[] = [
  {
    id: 1, numero: "101", nombre: "Habitación Individual", descripcion: "Perfecta para viajeros solitarios.",
    precio_por_noche: 35, capacidad_personas: 1, tipo_habitacion: "individual",
    amenities_habitacion: ["WiFi", "TV", "Escritorio"], amenities_banno: ["Ducha", "Toallas", "Secador"],
    estado: "disponible", foto_principal: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop"], fotos_adicionales: [],
  },
  {
    id: 2, numero: "201", nombre: "Suite Premium", descripcion: "Nuestra habitación más exclusiva.",
    precio_por_noche: 90, capacidad_personas: 2, tipo_habitacion: "suite",
    amenities_habitacion: ["WiFi", "TV 50\"", "Minibar", "Terraza"], amenities_banno: ["Bañera", "Ducha", "Toallas premium", "Albornoz"],
    estado: "disponible", foto_principal: ["https://images.unsplash.com/photo-1590490360182-c33d955fd166?w=600&h=400&fit=crop"], fotos_adicionales: [],
  },
];

function estadoBadge(estado: Habitacion["estado"]) {
  const map = { disponible: "default", ocupada: "destructive", mantenimiento: "secondary" } as const;
  return <Badge variant={map[estado]}>{estado.charAt(0).toUpperCase() + estado.slice(1)}</Badge>;
}

export default function AdminHabitaciones() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>(INITIAL_DATA);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Habitacion | null>(null);
  const [form, setForm] = useState<Omit<Habitacion, "id">>(EMPTY);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Temp inputs for comma-separated fields
  const [amenityInput, setAmenityInput] = useState("");
  const [amenityBannoInput, setAmenityBannoInput] = useState("");

  const nextId = habitaciones.length > 0 ? Math.max(...habitaciones.map(h => h.id)) + 1 : 1;

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setAmenityInput("");
    setAmenityBannoInput("");
    setOpen(true);
  }

  function openEdit(h: Habitacion) {
    setEditing(h);
    const { id, ...rest } = h;
    setForm(rest);
    setAmenityInput(h.amenities_habitacion.join(", "));
    setAmenityBannoInput(h.amenities_banno.join(", "));
    setOpen(true);
  }

  function handleSave() {
    if (!form.numero.trim() || !form.nombre.trim()) {
      toast.error("Número y nombre son obligatorios.");
      return;
    }
    // Check unique numero
    const dup = habitaciones.find(h => h.numero === form.numero.trim() && h.id !== editing?.id);
    if (dup) {
      toast.error(`Ya existe una habitación con el número "${form.numero}".`);
      return;
    }

    const data: Omit<Habitacion, "id"> = {
      ...form,
      numero: form.numero.trim(),
      nombre: form.nombre.trim(),
      amenities_habitacion: amenityInput.split(",").map(s => s.trim()).filter(Boolean),
      amenities_banno: amenityBannoInput.split(",").map(s => s.trim()).filter(Boolean),
      foto_principal: form.foto_principal,
      fotos_adicionales: form.fotos_adicionales,
    };

    if (editing) {
      setHabitaciones(prev => prev.map(h => h.id === editing.id ? { ...data, id: editing.id } : h));
      toast.success("Habitación actualizada.");
    } else {
      setHabitaciones(prev => [...prev, { ...data, id: nextId }]);
      toast.success("Habitación creada.");
    }
    setOpen(false);
  }

  function handleDelete(id: number) {
    setHabitaciones(prev => prev.filter(h => h.id !== id));
    setDeleteConfirm(null);
    toast.success("Habitación eliminada.");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Habitaciones</h1>
          <p className="text-muted-foreground">Administra las habitaciones y su disponibilidad.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Nueva Habitación</Button>
      </div>

      {habitaciones.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-muted-foreground">
          <BedDouble size={48} className="mb-4 opacity-30" />
          <p className="font-medium">No hay habitaciones registradas</p>
          <p className="text-sm mt-1">Crea la primera habitación con el botón de arriba.</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Precio/noche</TableHead>
                <TableHead className="text-center">Capacidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {habitaciones.map(h => (
                <TableRow key={h.id}>
                  <TableCell className="font-mono font-semibold">{h.numero}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {h.foto_principal[0] && (
                        <img src={h.foto_principal[0]} alt={h.nombre} className="w-10 h-10 rounded object-cover" />
                      )}
                      <span className="font-medium">{h.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{h.tipo_habitacion}</TableCell>
                  <TableCell className="text-right">{h.precio_por_noche}€</TableCell>
                  <TableCell className="text-center">{h.capacidad_personas}</TableCell>
                  <TableCell>{estadoBadge(h.estado)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(h)}><Pencil className="h-4 w-4" /></Button>
                      {deleteConfirm === h.id ? (
                        <div className="flex items-center gap-1">
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(h.id)}>Sí</Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)}>No</Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(h.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Habitación" : "Nueva Habitación"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {/* Row: numero + nombre */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Número *</Label>
                <Input placeholder="101" value={form.numero} onChange={e => setForm(f => ({ ...f, numero: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input placeholder="Suite Presidencial" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea rows={3} placeholder="Descripción de la habitación..." value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
            </div>

            {/* Row: precio + capacidad + tipo */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Precio/noche (€)</Label>
                <Input type="number" min={0} step={0.01} value={form.precio_por_noche} onChange={e => setForm(f => ({ ...f, precio_por_noche: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div className="space-y-2">
                <Label>Capacidad</Label>
                <Input type="number" min={1} value={form.capacidad_personas} onChange={e => setForm(f => ({ ...f, capacidad_personas: parseInt(e.target.value) || 1 }))} />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={form.tipo_habitacion} onValueChange={v => setForm(f => ({ ...f, tipo_habitacion: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIPOS.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={form.estado} onValueChange={v => setForm(f => ({ ...f, estado: v as Habitacion["estado"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ESTADOS.map(e => <SelectItem key={e} value={e} className="capitalize">{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Amenities habitación */}
            <div className="space-y-2">
              <Label>Amenities habitación <span className="text-muted-foreground text-xs">(separados por coma)</span></Label>
              <Input placeholder="WiFi, TV, Minibar, Escritorio" value={amenityInput} onChange={e => setAmenityInput(e.target.value)} />
            </div>

            {/* Amenities baño */}
            <div className="space-y-2">
              <Label>Amenities baño <span className="text-muted-foreground text-xs">(separados por coma)</span></Label>
              <Input placeholder="Ducha, Toallas, Secador de pelo" value={amenityBannoInput} onChange={e => setAmenityBannoInput(e.target.value)} />
            </div>

            {/* Foto principal */}
            <ImageUploader
              label="Foto principal"
              images={form.foto_principal}
              onChange={(imgs) => setForm(f => ({ ...f, foto_principal: imgs }))}
              maxImages={1}
            />

            {/* Fotos adicionales */}
            <ImageUploader
              label="Fotos adicionales"
              images={form.fotos_adicionales}
              onChange={(imgs) => setForm(f => ({ ...f, fotos_adicionales: imgs }))}
              maxImages={10}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>{editing ? "Guardar Cambios" : "Crear Habitación"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteConfirm !== null} onOpenChange={(o) => { if (!o) setDeleteConfirm(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Eliminar habitación?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Esta acción no se puede deshacer.</p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Eliminar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
