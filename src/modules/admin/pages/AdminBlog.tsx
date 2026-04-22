import { useNavigate } from "react-router-dom";
import { FileText, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/modules/shared/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/shared/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/modules/shared/components/ui/select";
import { useBlogManagement } from "../hooks/useBlogManagement";
import { BlogPostStatus } from "@/modules/shared/types/blog.types";
import { getMediaUrl } from "@/modules/shared/services";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminBlog() {
  const navigate = useNavigate();
  const {
    posts,
    loading,
    statusFilter,
    currentPage,
    totalPages,
    formState,
    setStatusFilter,
    setCurrentPage,
    deletePost,
    closeDeleteDialog,
    confirmDelete,
    toggleStatus,
  } = useBlogManagement();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold mb-1">Blog</h1>
          <p className="text-sm text-muted-foreground">Gestiona los artículos del blog.</p>
        </div>
        <Button onClick={() => navigate('/admin/blog/nuevo')} className="w-full sm:w-auto">
          <Plus className="mr-1 h-4 w-4" />Nuevo artículo
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as BlogPostStatus | 'all')}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value={BlogPostStatus.VISIBLE}>Visibles</SelectItem>
            <SelectItem value={BlogPostStatus.HIDDEN}>Ocultos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando artículos...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-muted-foreground">
          <FileText size={48} className="mb-4 opacity-30" />
          <p className="font-medium">Sin artículos</p>
          <p className="text-sm mt-1">Crea tu primer artículo de blog.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="hidden lg:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Título (ES / EN)</TableHead>
                  <TableHead className="hidden sm:table-cell">Slug</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      {post.image ? (
                        <img src={getMediaUrl(post.image)} alt={post.title_es} className="h-12 w-16 rounded object-cover" />
                      ) : (
                        <div className="h-12 w-16 rounded bg-muted flex items-center justify-center">
                          <FileText className="h-5 w-5 text-muted-foreground/40" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {post.title_es}
                      {post.title_en && <span className="text-muted-foreground"> / {post.title_en}</span>}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                      {post.slug_es}
                      {post.slug_en && <span className="block">{post.slug_en}</span>}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={post.status === BlogPostStatus.VISIBLE ? "default" : "outline"}
                        onClick={() => toggleStatus(post)}
                        disabled={formState.saving}
                      >
                        {post.status === BlogPostStatus.VISIBLE ? (
                          <><Eye className="h-3 w-3 mr-1" /> Visible</>
                        ) : (
                          <><EyeOff className="h-3 w-3 mr-1" /> Oculto</>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {post.publishedAt ? format(new Date(post.publishedAt), "dd MMM yyyy", { locale: es }) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => navigate(`/admin/blog/${post.id}`)} disabled={formState.saving}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deletePost(post.id)} disabled={formState.saving}>
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
            {posts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4 bg-card space-y-3">
                <div className="flex items-start gap-3">
                  {post.image ? (
                    <img src={getMediaUrl(post.image)} alt={post.title_es} className="h-16 w-20 rounded object-cover shrink-0" />
                  ) : (
                    <div className="h-16 w-20 rounded bg-muted flex items-center justify-center shrink-0">
                      <FileText className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1">{post.title_es}{post.title_en && <span className="text-muted-foreground"> / {post.title_en}</span>}</h3>
                    <p className="text-sm text-muted-foreground">{post.slug_es}{post.slug_en && <span className="block">{post.slug_en}</span>}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant={post.status === BlogPostStatus.VISIBLE ? "default" : "outline"}
                    onClick={() => toggleStatus(post)}
                    disabled={formState.saving}
                    className="flex-1"
                  >
                    {post.status === BlogPostStatus.VISIBLE ? "Visible" : "Oculto"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/admin/blog/${post.id}`)} disabled={formState.saving}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deletePost(post.id)} disabled={formState.saving}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

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

      <AlertDialog open={formState.deleteConfirm !== null} onOpenChange={(v) => !v && closeDeleteDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar artículo?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={formState.saving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={formState.saving} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}