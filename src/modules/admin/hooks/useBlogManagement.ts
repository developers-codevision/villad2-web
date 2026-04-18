// Admin Blog Hook - Business logic for blog post management

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { blogService, getMediaUrl } from '@/modules/shared/services';
import { convertWordToHtml } from '@/modules/shared/utils/wordToHtml';
import {
  BlogPost,
  BlogPostStatus,
} from '@/modules/shared/types/blog.types';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  image: File | null;
  imagePreview: string;
  status: BlogPostStatus;
  publishedAt: string;
}

export interface BlogFormState {
  open: boolean;
  editing: BlogPost | null;
  saving: boolean;
  deleteConfirm: number | null;
  importingWord: boolean;
}

export function useBlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<BlogPostStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [formState, setFormState] = useState<BlogFormState>({
    open: false,
    editing: null,
    saving: false,
    deleteConfirm: null,
    importingWord: false,
  });

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    content: '',
    image: null,
    imagePreview: '',
    status: BlogPostStatus.VISIBLE,
    publishedAt: today,
  });

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const status = statusFilter === 'all' ? undefined : (statusFilter as BlogPostStatus);
      const allPosts = await blogService.getAll(status);
      setPosts(allPosts);
      setTotalPages(Math.ceil(allPosts.length / limit));
    } catch (error) {
      console.error('Error loading blog posts:', error);
      toast.error('Error al cargar los artículos');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const openCreate = useCallback(() => {
    const todayDate = new Date().toISOString().split('T')[0];
    setFormState((prev) => ({ ...prev, open: true, editing: null }));
    setFormData({
      title: '',
      slug: '',
      content: '',
      image: null,
      imagePreview: '',
      status: BlogPostStatus.VISIBLE,
      publishedAt: todayDate,
    });
  }, []);

  const openEdit = useCallback((post: BlogPost) => {
    setFormState((prev) => ({ ...prev, open: true, editing: post }));
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content || '',
      image: null,
      imagePreview: post.image ? getMediaUrl(post.image) : '',
      status: post.status,
      publishedAt: post.publishedAt ? post.publishedAt.split('T')[0] : '',
    });
  }, []);

  const closeForm = useCallback(() => {
    setFormState((prev) => ({ ...prev, open: false }));
    const todayDate = new Date().toISOString().split('T')[0];
    setFormData({
      title: '',
      slug: '',
      content: '',
      image: null,
      imagePreview: '',
      status: BlogPostStatus.VISIBLE,
      publishedAt: todayDate,
    });
  }, []);

  const handleFormChange = useCallback(
    (field: keyof BlogFormData, value: string | File | null | BlogPostStatus) => {
      if (field === 'title' && typeof value === 'string' && !formState.editing) {
        setFormData((prev) => ({
          ...prev,
          title: value,
          slug: generateSlug(value),
        }));
      } else {
        setFormData((prev) => ({ ...prev, [field]: value }));
      }
    },
    [formState.editing]
  );

  const handleSlugChange = useCallback((slug: string) => {
    setFormData((prev) => ({ ...prev, slug }));
  }, []);

  const importWord = useCallback(async (file: File) => {
    setFormState((prev) => ({ ...prev, importingWord: true }));
    try {
      const html = await convertWordToHtml(file);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      const titleMatch = plainText.match(/^.{1,100}/m);
      const title = titleMatch ? titleMatch[0].trim() : '';
      
      setFormData((prev) => ({
        ...prev,
        title: title || prev.title,
        content: html,
      }));
      toast.success('Contenido importado desde Word');
    } catch (error) {
      console.error('Error importing Word:', error);
      toast.error('Error al importar el archivo Word');
    } finally {
      setFormState((prev) => ({ ...prev, importingWord: false }));
    }
  }, []);

  const handleImageChange = useCallback(
    (file: File | null) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData((prev) => ({
            ...prev,
            image: file,
            imagePreview: e.target?.result as string,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setFormData((prev) => ({
          ...prev,
          image: null,
          imagePreview: '',
        }));
      }
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    if (!formData.title.trim()) {
      toast.error('El título es obligatorio');
      return false;
    }
    if (!formData.slug.trim()) {
      toast.error('El slug es obligatorio');
      return false;
    }
    if (!formData.publishedAt) {
      toast.error('La fecha de publicación es obligatoria');
      return false;
    }
    return true;
  }, [formData.title, formData.slug, formData.publishedAt]);

  const savePost = useCallback(async () => {
    if (!validateForm()) return;

    setFormState((prev) => ({ ...prev, saving: true }));

    try {
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('slug', formData.slug);
      formDataObj.append('content', formData.content);
      formDataObj.append('status', formData.status);
      formDataObj.append('publishedAt', formData.publishedAt);
      if (formData.image) {
        formDataObj.append('image', formData.image);
      }

      if (formState.editing) {
        await blogService.update(formState.editing.id, formDataObj);
        toast.success('Artículo actualizado correctamente');
      } else {
        await blogService.create(formDataObj);
        toast.success('Artículo creado correctamente');
      }

      closeForm();
      await loadPosts();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error(
        formState.editing
          ? 'Error al actualizar el artículo'
          : 'Error al crear el artículo'
      );
    } finally {
      setFormState((prev) => ({ ...prev, saving: false }));
    }
  }, [formData, formState.editing, validateForm, closeForm, loadPosts]);

  const deletePostHandler = useCallback(async (id: number) => {
    setFormState((prev) => ({ ...prev, deleteConfirm: null, saving: true }));

    try {
      await blogService.delete(id);
      toast.success('Artículo eliminado correctamente');
      await loadPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast.error('Error al eliminar el artículo');
    } finally {
      setFormState((prev) => ({ ...prev, saving: false }));
    }
  }, [loadPosts]);

  const toggleStatus = useCallback(
    async (post: BlogPost) => {
      try {
        const newStatus =
          post.status === BlogPostStatus.VISIBLE
            ? BlogPostStatus.HIDDEN
            : BlogPostStatus.VISIBLE;

        await blogService.changeStatus(post.id, newStatus);
        toast.success('Estado actualizado');
        await loadPosts();
      } catch (error) {
        console.error('Error toggling status:', error);
        toast.error('Error al cambiar el estado');
      }
    },
    [loadPosts]
  );

  return {
    posts,
    loading,
    statusFilter,
    currentPage,
    totalPages,
    formState,
    formData,
    setStatusFilter,
    setCurrentPage,
    setFormData,
    openCreate,
    openEdit,
    closeForm,
    handleFormChange,
    handleSlugChange,
    handleImageChange,
    importWord,
    savePost,
    deletePost: (id: number) =>
      setFormState((prev) => ({ ...prev, deleteConfirm: id })),
    closeDeleteDialog: () =>
      setFormState((prev) => ({ ...prev, deleteConfirm: null })),
    confirmDelete: () => {
      if (formState.deleteConfirm !== null) {
        deletePostHandler(formState.deleteConfirm);
      }
    },
    toggleStatus,
  };
}