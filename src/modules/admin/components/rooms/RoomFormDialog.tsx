// Room Form Dialog Component

import ImageUploader from '@/modules/client/components/ImageUploader';
import { Button } from '@/modules/shared/components/ui/button';
import { Input } from '@/modules/shared/components/ui/input';
import { Label } from '@/modules/shared/components/ui/label';
import { Textarea } from '@/modules/shared/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/modules/shared/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/shared/components/ui/select';
import { RoomType, RoomStatus } from '@/modules/shared/types/api.types';
import { RoomFormData, getRoomTypes, getRoomStatuses } from '../../types/rooms.types';

interface RoomFormDialogProps {
  open: boolean;
  isEditing: boolean;
  saving: boolean;
  formData: RoomFormData;
  amenityInput: string;
  amenityBannoInput: string;
  onClose: () => void;
  onSave: () => void;
  onFormChange: <K extends keyof RoomFormData>(field: K, value: RoomFormData[K]) => void;
  onAmenityInputChange: (value: string) => void;
  onAmenityBannoInputChange: (value: string) => void;
  onMainPhotoChange: (files: File[]) => void;
  onAdditionalPhotosChange: (files: File[]) => void;
  onMainPhotoUrlsChange: (urls: string[]) => void;
  onAdditionalPhotoUrlsChange: (urls: string[]) => void;
}

export function RoomFormDialog({
  open,
  isEditing,
  saving,
  formData,
  amenityInput,
  amenityBannoInput,
  onClose,
  onSave,
  onFormChange,
  onAmenityInputChange,
  onAmenityBannoInputChange,
  onMainPhotoChange,
  onAdditionalPhotosChange,
  onMainPhotoUrlsChange,
  onAdditionalPhotoUrlsChange,
}: RoomFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Habitación' : 'Nueva Habitación'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Number and Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Número *</Label>
              <Input
                placeholder="101"
                value={formData.numero}
                onChange={e => onFormChange('numero', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input
                placeholder="Suite Presidencial"
                value={formData.nombre}
                onChange={e => onFormChange('nombre', e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea
              rows={3}
              placeholder="Descripción de la habitación..."
              value={formData.descripcion}
              onChange={e => onFormChange('descripcion', e.target.value)}
            />
          </div>

          {/* Price, Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Precio/noche ($)</Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={formData.precio_por_noche}
                onChange={e => onFormChange('precio_por_noche', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={formData.tipo_habitacion}
                onValueChange={v => onFormChange('tipo_habitacion', v as RoomType)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {getRoomTypes().map(type => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Base Capacity, Extra Capacity, Extra Guest Charge */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Capacidad Base</Label>
              <Input
                type="number"
                min={0}
                value={formData.baseCapacity}
                onChange={e => onFormChange('baseCapacity', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Capacidad Extra</Label>
              <Input
                type="number"
                min={0}
                value={formData.extraCapacity}
                onChange={e => onFormChange('extraCapacity', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Cargo Huésped Extra ($)</Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={formData.extraGuestCharge}
                onChange={e => onFormChange('extraGuestCharge', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select
              value={formData.estado}
              onValueChange={v => onFormChange('estado', v as RoomStatus)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {getRoomStatuses().map(status => (
                  <SelectItem key={status} value={status} className="capitalize">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Room Amenities */}
          <div className="space-y-2">
            <Label>
              Amenities habitación{' '}
              <span className="text-muted-foreground text-xs">(separados por coma)</span>
            </Label>
            <Input
              placeholder="WiFi, TV, Minibar, Escritorio"
              value={amenityInput}
              onChange={e => onAmenityInputChange(e.target.value)}
            />
          </div>

          {/* Bathroom Amenities */}
          <div className="space-y-2">
            <Label>
              Amenities baño{' '}
              <span className="text-muted-foreground text-xs">(separados por coma)</span>
            </Label>
            <Input
              placeholder="Ducha, Toallas, Secador de pelo"
              value={amenityBannoInput}
              onChange={e => onAmenityBannoInputChange(e.target.value)}
            />
          </div>

          {/* Main Photo */}
          <ImageUploader
            label="Foto principal"
            images={formData.foto_principal}
            onChange={onMainPhotoUrlsChange}
            onFilesChange={files => onMainPhotoChange(files)}
            maxImages={1}
          />

          {/* Additional Photos */}
          <ImageUploader
            label="Fotos adicionales"
            images={formData.fotos_adicionales}
            onChange={onAdditionalPhotoUrlsChange}
            onFilesChange={files => onAdditionalPhotosChange(files)}
            maxImages={10}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={onSave} disabled={saving}>
              {saving ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Habitación')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
