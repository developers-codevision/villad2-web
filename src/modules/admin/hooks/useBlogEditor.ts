import { useState, useCallback, useEffect, useReducer } from 'react';
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

export interface BlogEditorFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  image: File | null;
  imagePreview: string;
  status: BlogPostStatus;
  publishedAt: string;
}

export function useBlogEditor(postId?: number) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [importingWord, setImportingWord] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];

  const [resetKey, setResetKey] = useState(0);

  const [formData, setFormData] = useState<BlogEditorFormData>({
    title: '',
    slug: '',
    description: '',
    content: '',
    image: null,
    imagePreview: '',
    status: BlogPostStatus.VISIBLE,
    publishedAt: today,
  });

  useEffect(() => {
    if (postId) {
      loadPost(postId);
    }
  }, [postId]);

  const loadPost = async (id: number) => {
    setLoading(true);
    try {
      const post = await blogService.getByIdOrSlug(id.toString());
      setFormData({
        title: post.title,
        slug: post.slug,
        description: post.description || '',
        content: post.content || '',
        image: null,
        imagePreview: post.image ? getMediaUrl(post.image) : '',
        status: post.status,
        publishedAt: post.publishedAt ? post.publishedAt.split('T')[0] : '',
      });
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Error al cargar el artículo');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = useCallback(
    (field: keyof BlogEditorFormData, value: string) => {
      if (field === 'title') {
        setFormData((prev) => ({
          ...prev,
          title: value,
          slug: generateSlug(value),
        }));
      } else {
        setFormData((prev) => ({ ...prev, [field]: value }));
      }
    },
    []
  );

  const handleSlugChange = useCallback((slug: string) => {
    setFormData((prev) => ({ ...prev, slug }));
  }, []);

  const handleImageChange = useCallback((file: File | null) => {
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
  }, []);

  const importWord = useCallback(async (file: File) => {
    setImportingWord(true);
    try {
      const rawHtml = await convertWordToHtml(file);
      
      const temp = document.createElement('div');
      temp.innerHTML = rawHtml;
      const ps = temp.querySelectorAll('p');
      
      const contentArray: string[] = [];
      ps.forEach((p) => {
        contentArray.push(p.outerHTML);
      });
      
      const cleanContent = contentArray.join('');
      
      const fileName = file.name.replace(/\.docx$/i, '');
      const newTitle = fileName;
      const newSlug = generateSlug(newTitle);
      const newContent = cleanContent;
      
      setFormData({
        title: newTitle,
        slug: newSlug,
        description: '',
        content: newContent,
        image: null,
        imagePreview: '',
        status: BlogPostStatus.VISIBLE,
        publishedAt: new Date().toISOString().split('T')[0],
      });
      setResetKey(k => k + 1);
      toast.success('Contenido importado desde Word');
    } catch (error) {
      console.error('Error importing Word:', error);
      toast.error('Error al importar el archivo Word');
    } finally {
      setImportingWord(false);
    }
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!formData.title.trim()) {
      toast.error('El título es obligatorio');
      return false;
    }
    if (!formData.slug.trim()) {
      toast.error('El slug es obligatorio');
      return false;
    }
    return true;
  }, [formData.title, formData.slug]);

  const savePost = useCallback(async () => {
    if (!validateForm()) return;

    setSaving(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('slug', formData.slug);
      formDataObj.append('description', formData.description);
      formDataObj.append('content', formData.content);
      formDataObj.append('status', formData.status);
      formDataObj.append('publishedAt', formData.publishedAt);
      if (formData.image) {
        formDataObj.append('image', formData.image);
      }

      if (postId) {
        await blogService.update(postId, formDataObj);
        toast.success('Artículo actualizado correctamente');
      } else {
        await blogService.create(formDataObj);
        toast.success('Artículo publicado correctamente');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error(
        postId
          ? 'Error al actualizar el artículo'
          : 'Error al publicar el artículo'
      );
    } finally {
      setSaving(false);
    }
  }, [formData, postId, validateForm]);

  const resetForm = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      title: '',
      slug: '',
      content: '',
      image: null,
      imagePreview: '',
      status: BlogPostStatus.VISIBLE,
      publishedAt: today,
    });
    setResetKey((k) => k + 1);
    toast.success('Formulario limpiado');
  }, []);

  return {
    loading,
    saving,
    importingWord,
    formData,
    handleFormChange,
    handleSlugChange,
    handleImageChange,
    importWord,
    resetForm,
    savePost,
    resetKey,
  };
}