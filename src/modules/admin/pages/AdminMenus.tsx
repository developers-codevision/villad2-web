import { useNavigate } from "react-router-dom";
import { ClipboardList, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/modules/shared/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/shared/components/ui/table";
import { useMenuManagement } from "../hooks/useMenuManagement";

export default function AdminMenus() {
  const navigate = useNavigate();
  const {
    menus, loading, saving, deleteConfirm,
    setDeleteConfirm, closeDeleteDialog, confirmDelete, toggleActive,
  } = useMenuManagement();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold mb-1">Menús Digitales</h1>
          <p className="text-sm text-muted-foreground">Gestiona los menús del hostal.</p>
        </div>
        <Button onClick={() => navigate('/admin/menus/nuevo')} className="w-full sm:w-auto">
          <Plus className="mr-1 h-4 w-4" />Nuevo menú
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando menús...</p>
        </div>
      ) : menus.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-muted-foreground">
          <ClipboardList size={48} className="mb-4 opacity-30" />
          <p className="font-medium">Sin menús</p>
          <p className="text-sm mt-1">Crea el primer menú digital.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="hidden lg:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menus.map((menu) => (
                  <TableRow key={menu.id}>
                    <TableCell className="font-medium">{menu.name}</TableCell>
                    <TableCell className="text-sm">{menu.schedule || '-'}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={menu.active ? "default" : "outline"}
                        onClick={() => toggleActive(menu)}
                        disabled={saving}
                      >
                        {menu.active ? (
                          <><Eye className="h-3 w-3 mr-1" /> Activo</>
                        ) : (
                          <><EyeOff className="h-3 w-3 mr-1" /> Inactivo</>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon" variant="ghost"
                          onClick={() => navigate(`/admin/menus/${menu.id}`)}
                          disabled={saving}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon" variant="ghost"
                          onClick={() => setDeleteConfirm(menu.id)}
                          disabled={saving}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="lg:hidden space-y-4">
            {menus.map((menu) => (
              <div key={menu.id} className="border rounded-lg p-4 bg-card space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base">{menu.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {menu.description || menu.schedule || '-'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant={menu.active ? "default" : "outline"}
                    onClick={() => toggleActive(menu)}
                    disabled={saving}
                    className="flex-1"
                  >
                    {menu.active ? "Activo" : "Inactivo"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/admin/menus/${menu.id}`)} disabled={saving}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(menu.id)} disabled={saving}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AlertDialog open={deleteConfirm !== null} onOpenChange={(v) => !v && closeDeleteDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar menú?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminarán todas las categorías y productos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={saving} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
