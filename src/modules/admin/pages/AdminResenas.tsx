import { Star, MessageSquare, CheckCircle, XCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { Textarea } from "@/modules/shared/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/modules/shared/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/modules/shared/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/shared/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/modules/shared/components/ui/select";
import { useReviewManagement } from "../hooks/useReviewManagement";
import { ReviewStatus } from "@/modules/shared/types/api.types";

export default function AdminResenas() {
  const {
    reviews,
    loading,
    statusFilter,
    currentPage,
    totalPages,
    formState,
    responseFormData,
    setStatusFilter,
    setCurrentPage,
    setResponseFormData,
    openReviewDetails,
    closeReviewDetails,
    openResponseDialog,
    closeResponseDialog,
    saveResponse,
    changeStatus,
    deleteReview,
    confirmDelete,
  } = useReviewManagement();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Reseñas</h1>
          <p className="text-muted-foreground">Consulta, modera y responde a las reseñas de tus huéspedes.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value={ReviewStatus.ACTIVE}>Aprobadas</SelectItem>
            <SelectItem value={ReviewStatus.INACTIVE}>Pendientes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando reseñas...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-muted-foreground">
          <Star size={48} className="mb-4 opacity-30" />
          <p className="font-medium">Sin reseñas</p>
          <p className="text-sm mt-1">Las reseñas de tus huéspedes aparecerán aquí.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader onClick={() => openReviewDetails(review)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {review.country}
                      </span>
                    </div>
                    <CardDescription>
                      {new Date(review.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {review.status === ReviewStatus.ACTIVE ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent onClick={() => openReviewDetails(review)} className="space-y-3">
                <p className="text-sm text-foreground leading-relaxed">{review.content}</p>
                {review.response && (
                  <div className="bg-muted p-3 rounded-md border-l-2 border-primary">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Tu respuesta:</p>
                    <p className="text-sm">{review.response}</p>
                  </div>
                )}
              </CardContent>
              <div className="flex gap-2 px-6 pb-4">
                {!review.response && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      openResponseDialog(review.id);
                    }}
                    disabled={formState.saving}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Responder
                  </Button>
                )}
                {review.response && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      openResponseDialog(review.id, review.response);
                    }}
                    disabled={formState.saving}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Editar respuesta
                  </Button>
                )}
                {review.status === ReviewStatus.INACTIVE && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      changeStatus(review.id, ReviewStatus.ACTIVE);
                    }}
                    disabled={formState.saving}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprobar
                  </Button>
                )}
                {review.status === ReviewStatus.ACTIVE && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      changeStatus(review.id, ReviewStatus.INACTIVE);
                    }}
                    disabled={formState.saving}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rechazar
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteReview(review.id);
                  }}
                  disabled={formState.saving}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
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

      {/* Review Details Dialog */}
      <Dialog open={formState.open} onOpenChange={closeReviewDetails}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalles de la reseña</DialogTitle>
          </DialogHeader>

          {formState.editing && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Nombre</p>
                <p className="text-sm">{formState.editing.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">País</p>
                <p className="text-sm">{formState.editing.country}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Fecha</p>
                <p className="text-sm">
                  {new Date(formState.editing.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Reseña</p>
                <p className="text-sm leading-relaxed">{formState.editing.content}</p>
              </div>
              {formState.editing.response && (
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm font-medium mb-1">Tu respuesta</p>
                  <p className="text-sm">{formState.editing.response}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeReviewDetails}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={formState.responseDialog !== null} onOpenChange={closeResponseDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {responseFormData.response ? "Editar respuesta" : "Responder reseña"}
            </DialogTitle>
            <DialogDescription>
              Escribe una respuesta a la reseña del huésped.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              value={responseFormData.response}
              onChange={(e) =>
                setResponseFormData({ response: e.target.value })
              }
              placeholder="Escribe tu respuesta aquí..."
              rows={5}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeResponseDialog} disabled={formState.saving}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (formState.responseDialog !== null) {
                  saveResponse(formState.responseDialog);
                }
              }}
              disabled={formState.saving || !responseFormData.response.trim()}
            >
              {formState.saving ? "Guardando..." : "Guardar respuesta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={formState.deleteConfirm !== null}
        onOpenChange={(v) => !v && setResponseFormData({ response: "" })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar reseña?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
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
