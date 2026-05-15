import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { blogCommentsService } from '@/modules/shared/services';
import { BlogComment, BlogCommentStatus, BlogPost } from '@/modules/shared/types/blog.types';

export interface CommentFormState {
  open: boolean;
  editing: BlogComment | null;
  saving: boolean;
  deleteConfirm: number | null;
  responseDialog: number | null;
  deleteResponseConfirm: number | null;
}

export interface CommentFormData {
  response: string;
}

export interface CreateCommentFormData {
  name: string;
  content: string;
}

export function useCommentManagement() {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<BlogCommentStatus | 'all'>('all');
  const [postFilter, setPostFilter] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [formState, setFormState] = useState<CommentFormState>({
    open: false,
    editing: null,
    saving: false,
    deleteConfirm: null,
    responseDialog: null,
    deleteResponseConfirm: null,
  });

  const [responseFormData, setResponseFormData] = useState<CommentFormData>({
    response: '',
  });

  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const status = statusFilter === 'all' ? undefined : (statusFilter as BlogCommentStatus);
      const postId = postFilter === 'all' ? undefined : postFilter;
      const response = await blogCommentsService.getAll(status, postId, currentPage, limit);
      setComments(response.comments);
      setTotalPages(Math.ceil(response.total / limit));
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Error al cargar los comentarios');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, postFilter, currentPage]);

  const loadPosts = useCallback(async () => {
    try {
      const { blogService } = await import('@/modules/shared/services');
      const allPosts = await blogService.getAll();
      setPosts(allPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  }, []);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const openCommentDetails = useCallback((comment: BlogComment) => {
    setFormState((prev) => ({ ...prev, open: true, editing: comment }));
    setResponseFormData({ response: comment.response || '' });
  }, []);

  const closeCommentDetails = useCallback(() => {
    setFormState((prev) => ({ ...prev, open: false, editing: null }));
    setResponseFormData({ response: '' });
  }, []);

  const openResponseDialog = useCallback((commentId: number, currentResponse?: string) => {
    setFormState((prev) => ({ ...prev, responseDialog: commentId }));
    setResponseFormData({ response: currentResponse || '' });
  }, []);

  const closeResponseDialog = useCallback(() => {
    setFormState((prev) => ({ ...prev, responseDialog: null }));
    setResponseFormData({ response: '' });
  }, []);

  const saveResponse = useCallback(async (commentId: number) => {
    if (!responseFormData.response.trim()) {
      toast.error('La respuesta no puede estar vacía');
      return;
    }

    setFormState((prev) => ({ ...prev, saving: true }));

    try {
      await blogCommentsService.addResponse(commentId, responseFormData.response);
      toast.success('Respuesta guardada correctamente');
      closeResponseDialog();
      await loadComments();
    } catch (error) {
      console.error('Error saving response:', error);
      toast.error('Error al guardar la respuesta');
    } finally {
      setFormState((prev) => ({ ...prev, saving: false }));
    }
  }, [responseFormData, closeResponseDialog, loadComments]);

  const changeStatus = useCallback(
    async (commentId: number, status: BlogCommentStatus) => {
      setFormState((prev) => ({ ...prev, saving: true }));

      try {
        await blogCommentsService.changeStatus(commentId, status);
        toast.success(
          status === BlogCommentStatus.ACTIVE
            ? 'Comentario aprobado'
            : 'Comentario oculto'
        );
        await loadComments();
        closeCommentDetails();
      } catch (error) {
        console.error('Error changing status:', error);
        toast.error('Error al cambiar el estado');
      } finally {
        setFormState((prev) => ({ ...prev, saving: false }));
      }
    },
    [loadComments, closeCommentDetails]
  );

  const deleteComment = useCallback(async (id: number) => {
    setFormState((prev) => ({ ...prev, deleteConfirm: null, saving: true }));

    try {
      await blogCommentsService.delete(id);
      toast.success('Comentario eliminado correctamente');
      await loadComments();
      closeCommentDetails();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Error al eliminar el comentario');
    } finally {
      setFormState((prev) => ({ ...prev, saving: false }));
    }
  }, [loadComments, closeCommentDetails]);

  const deleteResponse = useCallback(async (commentId: number) => {
    setFormState((prev) => ({ ...prev, deleteResponseConfirm: null, saving: true }));

    try {
      await blogCommentsService.deleteResponse(commentId);
      toast.success('Respuesta eliminada correctamente');
      await loadComments();
    } catch (error) {
      console.error('Error deleting response:', error);
      toast.error('Error al eliminar la respuesta');
    } finally {
      setFormState((prev) => ({ ...prev, saving: false }));
    }
  }, [loadComments]);

  return {
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
    deleteComment: (id: number) =>
      setFormState((prev) => ({ ...prev, deleteConfirm: id })),
    confirmDelete: () => {
      if (formState.deleteConfirm !== null) {
        deleteComment(formState.deleteConfirm);
      }
    },
    deleteResponse: (id: number) =>
      setFormState((prev) => ({ ...prev, deleteResponseConfirm: id })),
    confirmDeleteResponse: () => {
      if (formState.deleteResponseConfirm !== null) {
        deleteResponse(formState.deleteResponseConfirm);
      }
    },
  };
}