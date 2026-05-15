import { MessageCircle, CheckCircle, XCircle, Trash2, ChevronLeft, ChevronRight, FileText } from "lucide-react";
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
import { useCommentManagement } from "../hooks/useCommentManagement";
import { BlogCommentStatus } from "@/modules/shared/types/blog.types";

export default function AdminComentarios() {
  const {
    comments,
    posts,
    loading,
    statusFilter,
    postFilter,
    currentPage,
    totalPages,
    formState,
    responseFormData,
    setStatusFilter,
    setPostFilter,
    setCurrentPage,
    setResponseFormData,
    openCommentDetails,
    closeCommentDetails,
    openResponseDialog,
    closeResponseDialog,
    saveResponse,
    changeStatus,
    deleteComment,
    confirmDelete,
    deleteResponse,
    confirmDeleteResponse,
  } = useCommentManagement();

  const getPostTitle = (postId: number) => {
    const post = posts.find((p) => p.id === postId);
    return post?.title_es || post?.title_en || `Artículo #${postId}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Comentarios</h1>
          <p className="text-muted-foreground">Gestiona los comentarios de los artículos del blog.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Select value={postFilter.toString()} onValueChange={(v) => setPostFilter(v === 'all' ? 'all' : Number(v))}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filtrar por artículo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los artículos</SelectItem>
            {posts.map((post) => (
              <SelectItem key={post.id} value={post.id.toString()}>
                {post.title_es || post.title_en || `Artículo #${post.id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value={BlogCommentStatus.ACTIVE}>Aprobados</SelectItem>
            <SelectItem value={BlogCommentStatus.INACTIVE}>Pendientes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando comentarios...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-muted-foreground">
          <FileText size={48} className="mb-4 opacity-30" />
          <p className="font-medium">Sin comentarios</p>
          <p className="text-sm mt-1">Los comentarios de los artículos aparecerán aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader onClick={() => openCommentDetails(comment)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{comment.name}</CardTitle>
                    </div>
                    <CardDescription>
                      {new Date(comment.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {comment.status === BlogCommentStatus.ACTIVE ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    {getPostTitle(comment.postId)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-foreground leading-relaxed" onClick={() => openCommentDetails(comment)}>{comment.content}</p>
                {comment.response && (
                  <div className="bg-muted p-3 rounded-md border-l-2 border-primary">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Tu respuesta:</p>
                        <p className="text-sm">{comment.response}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            openResponseDialog(comment.id, comment.response);
                          }}
                          disabled={formState.saving}
                          title="Editar respuesta"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteResponse(comment.id);
                          }}
                          disabled={formState.saving}
                          title="Eliminar respuesta"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <div className="flex gap-2 px-6 pb-4">
                {!comment.response && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      openResponseDialog(comment.id);
                    }}
                    disabled={formState.saving}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Responder
                  </Button>
                )}
                {comment.status === BlogCommentStatus.INACTIVE && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      changeStatus(comment.id, BlogCommentStatus.ACTIVE);
                    }}
                    disabled={formState.saving}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprobar
                  </Button>
                )}
                {comment.status === BlogCommentStatus.ACTIVE && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      changeStatus(comment.id, BlogCommentStatus.INACTIVE);
                    }}
                    disabled={formState.saving}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Ocultar
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteComment(comment.id);
                  }}
                  disabled={formState.saving}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}

          {totalPages > 1 && (
            <div className="col-span-2 flex items-center justify-between mt-6">
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

      <Dialog open={formState.open} onOpenChange={closeCommentDetails}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalles del comentario</DialogTitle>
          </DialogHeader>

          {formState.editing && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Nombre</p>
                <p className="text-sm">{formState.editing.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Artículo</p>
                <p className="text-sm">{getPostTitle(formState.editing.postId)}</p>
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
                <p className="text-sm font-medium mb-1">Comentario</p>
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
            <Button variant="outline" onClick={closeCommentDetails}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={formState.responseDialog !== null} onOpenChange={closeResponseDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {responseFormData.response ? "Editar respuesta" : "Responder comentario"}
            </DialogTitle>
            <DialogDescription>
              Escribe una respuesta al comentario del cliente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Textarea
                value={responseFormData.response}
                onChange={(e) =>
                  setResponseFormData({ response: e.target.value })
                }
                placeholder="Escribe tu respuesta aquí..."
                rows={5}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {responseFormData.response.length}/500
              </p>
            </div>
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

      <AlertDialog
        open={formState.deleteConfirm !== null}
        onOpenChange={(v) => !v && setResponseFormData({ response: "" })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar comentario?</AlertDialogTitle>
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

      <AlertDialog
        open={formState.deleteResponseConfirm !== null}
        onOpenChange={(v) => {
          if (!v) setResponseFormData({ response: "" });
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar respuesta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará tu respuesta a este comentario. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={formState.saving}
              onClick={() =>
                setResponseFormData({ response: "" })
              }
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteResponse} disabled={formState.saving}>
              {formState.saving ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}