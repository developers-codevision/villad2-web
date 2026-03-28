import { DollarSign, Save, RotateCcw } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/shared/components/ui/card";
import { useSettingsManagement } from "../hooks/useSettingsManagement";

interface PriceFieldProps {
  label: string;
  description: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}

function PriceField({ label, description, value, onChange, disabled }: PriceFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="pl-7"
        />
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const {
    loading,
    saving,
    formData,
    isDirty,
    handleFieldChange,
    saveSettings,
    resetForm,
  } = useSettingsManagement();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Configuración</h1>
          <p className="text-muted-foreground">
            Gestiona los precios de los servicios adicionales que se aplican al calcular reservas.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando configuración...</p>
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          {/* Prices Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <CardTitle>Precios de Servicios Adicionales</CardTitle>
              </div>
              <CardDescription>
                Estos precios se usan para calcular el total de cada reserva.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <PriceField
                label="Early check-in "
                description="Cargo por llegada antes de la hora estándar"
                value={formData.earlyCheckInPrice}
                onChange={(v) => handleFieldChange("earlyCheckInPrice", v)}
                disabled={saving}
              />
              <PriceField
                label="Late check-out "
                description="Cargo por salida después de la hora estándar"
                value={formData.lateCheckOutPrice}
                onChange={(v) => handleFieldChange("lateCheckOutPrice", v)}
                disabled={saving}
              />
              <PriceField
                label="Recogida del aeropuerto"
                description="Precio del servicio de traslado solo de ida al aeropuerto"
                value={formData.transferOneWayPrice}
                onChange={(v) => handleFieldChange("transferOneWayPrice", v)}
                disabled={saving}
              />
              <PriceField
                label="Retorno al aeropuerto"
                description="Precio del servicio de traslado solo de vuelta al aeropuerto"
                value={formData.transferRoundTripPrice}
                onChange={(v) => handleFieldChange("transferRoundTripPrice", v)}
                disabled={saving}
              />
              <PriceField
                label="Desayuno (por persona)"
                description="Precio por desayuno por persona"
                value={formData.breakfastPrice}
                onChange={(v) => handleFieldChange("breakfastPrice", v)}
                disabled={saving}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={saveSettings}
              disabled={saving || !isDirty}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
            <Button
              variant="outline"
              onClick={resetForm}
              disabled={saving || !isDirty}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Descartar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

