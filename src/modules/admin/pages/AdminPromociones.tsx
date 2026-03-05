import { Tag, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/modules/shared/components/ui/select";
import ImageUploader from "@/modules/client/components/ImageUploader";
import { usePromotionManagement } from "../hooks/usePromotionManagement";
import { PromotionStatus } from "@/modules/shared/types/api.types";
import { getMediaUrl } from "@/modules/shared/services";

export default function AdminPromociones() {
  const {
    promotions,
    loading,
    statusFilter,
    currentPage,
    totalPages,
    formState,
    formData,
    setStatusFilter,
    setCurrentPage,
    handleFormChange,
    handlePhotoChange,
    openCreate,
    openEdit,
    closeForm,
    savePromotion,
    deletePromotion,
    closeDeleteDialog,
    confirmDelete,
    toggleStatus,
  } = usePromotionManagement();


  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Promociones</h1>
          <p className="text-muted-foreground">Crea y gestiona ofertas especiales para tus huéspedes.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-1 h-4 w-4" />Nueva promoción</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PromotionStatus | 'all')}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value={PromotionStatus.ACTIVE}>Activas</SelectItem>
            <SelectItem value={PromotionStatus.INACTIVE}>Inactivas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando promociones...</p>
        </div>
      ) : promotions.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-muted-foreground">
          <Tag size={48} className="mb-4 opacity-30" />
          <p className="font-medium">Sin promociones</p>
          <p className="text-sm mt-1">Crea tu primera promoción para atraer más huéspedes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden sm:table-cell">Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      {p.photo ? (
                        <img src={getMediaUrl(p.photo)} alt={p.title} className="h-12 w-16 rounded object-cover" />
                      ) : (
                        <div className="h-12 w-16 rounded bg-muted flex items-center justify-center">
                          <Tag className="h-5 w-5 text-muted-foreground/40" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell className="hidden sm:table-cell max-w-[260px] truncate text-muted-foreground text-sm">
                      {p.description}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={p.status === PromotionStatus.ACTIVE ? "default" : "outline"}
                        onClick={() => toggleStatus(p)}
                        disabled={formState.saving}
                      >
                        {p.status === PromotionStatus.ACTIVE ? "Activa" : "Inactiva"}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(p)} disabled={formState.saving}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deletePromotion(p.id)} disabled={formState.saving}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || loading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={formState.open} onOpenChange={closeForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formState.editing ? "Editar promoción" : "Nueva promoción"}</DialogTitle>
            <DialogDescription>
              {formState.editing ? "Modifica los datos de la promoción." : "Completa los datos para crear una nueva promoción."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium">Título *</label>
              <Input
                value={formData.title}
                onChange={(e) => handleFormChange("title", e.target.value)}
                placeholder="Ej: Escapada Romántica"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                placeholder="Describe la promoción..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Mín. personas</label>
                <Input
                  type="number"
                  min={0}
                  value={formData.minPeople || ""}
                  onChange={(e) => handleFormChange("minPeople", parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Máx. personas</label>
                <Input
                  type="number"
                  min={0}
                  value={formData.maxPeople || ""}
                  onChange={(e) => handleFormChange("maxPeople", parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Servicios incluidos</label>
              <Input
                value={formData.servicesInput}
                onChange={(e) => handleFormChange("servicesInput", e.target.value)}
                placeholder="Desayuno incluido, Traslado al aeropuerto, Masaje relajante"
              />
              <p className="text-xs text-muted-foreground mt-1">Separados por coma</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Entrada</label>
                <Input
                  type="time"
                  value={formData.checkInTime}
                  onChange={(e) => handleFormChange("checkInTime", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Salida</label>
                <Input
                  type="time"
                  value={formData.checkOutTime}
                  onChange={(e) => handleFormChange("checkOutTime", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Estado</label>
              <Select value={formData.status} onValueChange={(v) => handleFormChange("status", v as PromotionStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PromotionStatus.ACTIVE}>Activa</SelectItem>
                  <SelectItem value={PromotionStatus.INACTIVE}>Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Imagen</label>
              <ImageUploader
                label=""
                images={formData.photoPreview ? [formData.photoPreview] : []}
                onChange={(urls) => {
                  // When user selects new images via uploader
                  if (urls.length > 0) {
                    handleFormChange('photoPreview', urls[0]);
                  } else {
                    // removed all images -> clear preview and file
                    handleFormChange('photoPreview', '');
                    handlePhotoChange(null);
                  }
                }}
                onFilesChange={(files) => {
                  if (files.length > 0) {
                    handlePhotoChange(files[0]);
                  } else {
                    // cleared files from uploader
                    handlePhotoChange(null);
                  }
                }}
                maxImages={1}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeForm} disabled={formState.saving}>
              Cancelar
            </Button>
            <Button onClick={savePromotion} disabled={formState.saving}>
              {formState.saving ? "Guardando..." : formState.editing ? "Guardar cambios" : "Crear promoción"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Delete confirmation */}
      <AlertDialog open={formState.deleteConfirm !== null} onOpenChange={(v) => !v && closeDeleteDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar promoción?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={formState.saving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={formState.saving}>
              {formState.saving ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
