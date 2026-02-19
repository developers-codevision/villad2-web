import { useState, useEffect } from "react";
import { BedDouble, Plus, Pencil, Trash2 } from "lucide-react";
import ImageUploader from "@/modules/client/components/ImageUploader";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { Textarea } from "@/modules/shared/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/shared/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/modules/shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/shared/components/ui/select";
import { Badge } from "@/modules/shared/components/ui/badge";
import { toast } from "sonner";
import { roomsService } from "@/modules/shared/services/rooms.service";
import { Room, RoomType, RoomStatus } from "@/modules/shared/types/api.types";
import { parsePhotos } from "@/modules/client/utils/roomHelpers";


interface FormData {
  numero: string;
  nombre: string;
  descripcion: string;
  precio_por_noche: number;
  capacidad_personas: number;
  tipo_habitacion: RoomType;
  amenities_habitacion: string[];
  amenities_banno: string[];
  estado: RoomStatus;
  foto_principal: string[];
  fotos_adicionales: string[];
}

const TIPOS: RoomType[] = [
  RoomType.INDIVIDUAL,
  RoomType.DOUBLE,
  RoomType.SUITE,
  RoomType.FAMILY,
  RoomType.PRESIDENTIAL,
];

const ESTADOS: RoomStatus[] = [
  RoomStatus.AVAILABLE,
  RoomStatus.OCCUPIED,
  RoomStatus.MAINTENANCE,
];

const EMPTY_FORM: FormData = {
  numero: "",
  nombre: "",
  descripcion: "",
  precio_por_noche: 0,
  capacidad_personas: 1,
  tipo_habitacion: RoomType.INDIVIDUAL,
  amenities_habitacion: [],
  amenities_banno: [],
  estado: RoomStatus.AVAILABLE,
  foto_principal: [],
  fotos_adicionales: [],
};

function estadoBadge(estado: RoomStatus) {
  const map = {
    [RoomStatus.AVAILABLE]: "default",
    [RoomStatus.OCCUPIED]: "destructive",
    [RoomStatus.MAINTENANCE]: "secondary"
  } as const;
  const labels = {
    [RoomStatus.AVAILABLE]: "Disponible",
    [RoomStatus.OCCUPIED]: "Ocupada",
    [RoomStatus.MAINTENANCE]: "Mantenimiento"
  };
  return <Badge variant={map[estado]}>{labels[estado]}</Badge>;
}

export default function AdminHabitaciones() {
  const [habitaciones, setHabitaciones] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Temp inputs for comma-separated fields
  const [amenityInput, setAmenityInput] = useState("");
  const [amenityBannoInput, setAmenityBannoInput] = useState("");

  // Photo files for upload
  const [mainPhotoFile, setMainPhotoFile] = useState<File | null>(null);
  const [additionalPhotoFiles, setAdditionalPhotoFiles] = useState<File[]>([]);

  // Keep track of original photo URLs (relative paths from server)
  const [originalMainPhoto, setOriginalMainPhoto] = useState<string[]>([]);
  const [originalAdditionalPhotos, setOriginalAdditionalPhotos] = useState<string[]>([]);

  // Load rooms on mount
  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    try {
      setLoading(true);
      const rooms = await roomsService.getAll();
      setHabitaciones(rooms);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al cargar habitaciones";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setAmenityInput("");
    setAmenityBannoInput("");
    setMainPhotoFile(null);
    setAdditionalPhotoFiles([]);
    setOriginalMainPhoto([]);
    setOriginalAdditionalPhotos([]);
    setOpen(true);
  }

  function openEdit(room: Room) {
    setEditing(room);

    // Store original relative URLs
    setOriginalMainPhoto(room.mainPhoto || []);
    setOriginalAdditionalPhotos(room.additionalPhotos || []);

    // Convert relative URLs to full URLs for preview
    const mainPhotoUrls = (room.mainPhoto || []).map(getImageUrl);
    const additionalPhotoUrls = (room.additionalPhotos || []).map(getImageUrl);

    setForm({
      numero: room.number,
      nombre: room.name,
      descripcion: room.description,
      precio_por_noche: room.pricePerNight,
      capacidad_personas: room.capacity,
      tipo_habitacion: room.roomType,
      amenities_habitacion: room.roomAmenities || [],
      amenities_banno: room.bathroomAmenities || [],
      estado: room.status,
      foto_principal: mainPhotoUrls,
      fotos_adicionales: additionalPhotoUrls,
    });
    setAmenityInput((room.roomAmenities || []).join(", "));
    setAmenityBannoInput((room.bathroomAmenities || []).join(", "));
    setMainPhotoFile(null);
    setAdditionalPhotoFiles([]);
    setOpen(true);
  }

  async function handleSave() {
    if (!form.numero.trim() || !form.nombre.trim()) {
      toast.error("Número y nombre son obligatorios.");
      return;
    }

    setSaving(true);

    try {
      const amenities = amenityInput.split(",").map(s => s.trim()).filter(Boolean);
      const amenitiesBanno = amenityBannoInput.split(",").map(s => s.trim()).filter(Boolean);

      if (editing) {
        // Update existing room
        // Calculate which original photos are still present
        const originalMainUrls = originalMainPhoto.map(getImageUrl);
        const originalAdditionalUrls = originalAdditionalPhotos.map(getImageUrl);

        const keptMainPhotos = originalMainPhoto.filter((_, i) =>
          form.foto_principal.includes(originalMainUrls[i])
        );
        const keptAdditionalPhotos = originalAdditionalPhotos.filter((_, i) =>
          form.fotos_adicionales.includes(originalAdditionalUrls[i])
        );

        // Combine kept photos with new ones
        const existingPhotos = [...keptMainPhotos, ...keptAdditionalPhotos];

        const updatedRoom = await roomsService.update(
          editing.id,
          {
            number: form.numero.trim(),
            name: form.nombre.trim(),
            description: form.descripcion.trim(),
            pricePerNight: form.precio_por_noche,
            capacity: form.capacidad_personas,
            roomType: form.tipo_habitacion,
            roomAmenities: amenities,
            bathroomAmenities: amenitiesBanno,
            status: form.estado,
          },
          mainPhotoFile || undefined,
          additionalPhotoFiles.length > 0 ? additionalPhotoFiles : undefined,
          existingPhotos.length > 0 ? existingPhotos : undefined
        );

        setHabitaciones(prev => prev.map(h => h.id === editing.id ? updatedRoom : h));
        toast.success("Habitación actualizada correctamente");
      } else {
        // Create new room
        const newRoom = await roomsService.create(
          {
            number: form.numero.trim(),
            name: form.nombre.trim(),
            description: form.descripcion.trim(),
            pricePerNight: form.precio_por_noche,
            capacity: form.capacidad_personas,
            roomType: form.tipo_habitacion,
            roomAmenities: amenities,
            bathroomAmenities: amenitiesBanno,
            status: form.estado,
          },

          mainPhotoFile || undefined,
          additionalPhotoFiles.length > 0 ? additionalPhotoFiles : undefined
        );
        console.log(newRoom)

        setHabitaciones(prev => [...prev, newRoom]);
        toast.success("Habitación creada correctamente");
      }

      setOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al guardar habitación";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await roomsService.delete(id);
      setHabitaciones(prev => prev.filter(h => h.id !== id));
      setDeleteConfirm(null);
      toast.success("Habitación eliminada correctamente");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al eliminar habitación";
      toast.error(message);
    }
  }

  function getImageUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return roomsService.getMediaUrl(path);
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

      {loading ? (
        <div className="border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-muted-foreground">
          <p className="font-medium">Cargando habitaciones...</p>
        </div>
      ) : habitaciones.length === 0 ? (
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
              {habitaciones.map(h => {
                const mainPhotoArray = parsePhotos(h.mainPhoto);
                return (
                  <TableRow key={h.id}>
                    <TableCell className="font-mono font-semibold">{h.number}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {mainPhotoArray.length > 0 && (
                          <img src={getImageUrl(mainPhotoArray[0])} alt={h.name} className="w-10 h-10 rounded object-cover" />
                        )}
                        <span className="font-medium">{h.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{h.roomType}</TableCell>
                    <TableCell className="text-right">{h.pricePerNight}$</TableCell>
                    <TableCell className="text-center">{h.capacity}</TableCell>
                    <TableCell>{estadoBadge(h.status)}</TableCell>
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
                );
              })}
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
                <Label>Precio/noche ($)</Label>
                <Input type="number" min={0} step={0.01} value={form.precio_por_noche} onChange={e => setForm(f => ({ ...f, precio_por_noche: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div className="space-y-2">
                <Label>Capacidad</Label>
                <Input type="number" min={1} value={form.capacidad_personas} onChange={e => setForm(f => ({ ...f, capacidad_personas: parseInt(e.target.value) || 1 }))} />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={form.tipo_habitacion} onValueChange={v => setForm(f => ({ ...f, tipo_habitacion: v as RoomType }))}>
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
              <Select value={form.estado} onValueChange={v => setForm(f => ({ ...f, estado: v as RoomStatus }))}>
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
              onFilesChange={(files) => setMainPhotoFile(files[0] || null)}
              maxImages={1}
            />

            {/* Fotos adicionales */}
            <ImageUploader
              label="Fotos adicionales"
              images={form.fotos_adicionales}
              onChange={(imgs) => setForm(f => ({ ...f, fotos_adicionales: imgs }))}
              onFilesChange={(files) => setAdditionalPhotoFiles(files)}
              maxImages={10}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Guardando..." : (editing ? "Guardar Cambios" : "Crear Habitación")}
              </Button>
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
