import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, ArrowLeft, FileUp, RotateCcw } from 'lucide-react';
import { Button } from '@/modules/shared/components/ui/button';
import { Input } from '@/modules/shared/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/modules/shared/components/ui/select';
import ImageUploader from '@/modules/client/components/ImageUploader';
import TipTapEditor from '@/modules/shared/components/TipTapEditor';
import { useBlogEditor, BlogEditorFormData } from '../hooks/useBlogEditor';
import { BlogPostStatus } from '@/modules/shared/types/blog.types';

type Language = 'es' | 'en';
type LangField = 'title_es' | 'title_en' | 'slug_es' | 'slug_en' | 'description_es' | 'description_en' | 'content_es' | 'content_en' | 'status' | 'publishedAt' | 'imagePreview';

export default function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [activeLang, setActiveLang] = useState<Language>('es');

  const {
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
  } = useBlogEditor(Number(id) || undefined);

  const currentTitle = activeLang === 'es' ? formData.title_es : formData.title_en;
  const currentSlug = activeLang === 'es' ? formData.slug_es : formData.slug_en;
  const currentDescription = activeLang === 'es' ? formData.description_es : formData.description_en;
  const currentContent = activeLang === 'es' ? formData.content_es : formData.content_en;

  const handleReset = () => {
    resetForm();
    setActiveLang('es');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-[1600px] mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/blog')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al blog
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} title="Limpiar formulario">
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
            <Button variant="outline" asChild>
              <Label
                htmlFor="word-import"
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileUp className="h-4 w-4" />
                Importar Word
              </Label>
            </Button>
            <input
              id="word-import"
              type="file"
              accept=".docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) importWord(file);
                e.target.value = '';
              }}
              disabled={importingWord}
            />
            <Button onClick={savePost} disabled={saving}>
              {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Publicar'}
            </Button>
          </div>
        </div>

        <div className="border rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-8 border-b">
            <div className="max-w-[1400px] mx-auto">
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveLang('es')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeLang === 'es'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-black text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Español
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLang('en')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeLang === 'en'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-black text-muted-foreground hover:text-foreground'
                  }`}
                >
                  English
                </button>
              </div>
              <input
                key={`${resetKey}-title-${activeLang}`}
                type="text"
                value={currentTitle}
                onChange={(e) => handleFormChange((`title_${activeLang}`) as LangField, e.target.value)}
                placeholder={activeLang === 'es' ? 'Título del artículo' : 'Article title'}
                className="text-4xl font-bold bg-transparent border-none outline-none w-full placeholder:text-muted-foreground/50"
              />
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span>/blog/</span>
                <input
                  key={`${resetKey}-slug-${activeLang}`}
                  type="text"
                  value={currentSlug}
                  onChange={(e) => handleSlugChange((`slug_${activeLang}`) as 'slug_es' | 'slug_en', e.target.value)}
                  placeholder="slug-del-articulo"
                  className="bg-transparent border-none outline-none w-64 placeholder:text-muted-foreground/50"
                />
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="max-w-[1400px] mx-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Fecha de publicación</label>
                  <Input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => handleFormChange('publishedAt', e.target.value)}
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Estado</label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => handleFormChange('status', v as BlogPostStatus)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={BlogPostStatus.VISIBLE}>Visible</SelectItem>
                      <SelectItem value={BlogPostStatus.HIDDEN}>Oculto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  {activeLang === 'es' ? 'Descripción breve' : 'Short description'}
                </label>
                <textarea
                  key={`${resetKey}-desc-${activeLang}`}
                  value={currentDescription}
                  onChange={(e) => handleFormChange((`description_${activeLang}`) as LangField, e.target.value)}
                  placeholder={activeLang === 'es' ? 'Descripción corta para meta tags y tarjetas sociales...' : 'Short description for meta tags and social cards...'}
                  className="w-full h-24 p-3 border rounded-lg resize-none bg-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Imagen destacada</label>
                <ImageUploader
                  label=""
                  images={formData.imagePreview ? [formData.imagePreview] : []}
                  onChange={(urls) => {
                    if (urls.length > 0) {
                      handleFormChange('imagePreview', urls[0]);
                    } else {
                      handleFormChange('imagePreview', '');
                      handleImageChange(null);
                    }
                  }}
                  onFilesChange={(files) => {
                    if (files.length > 0) {
                      handleImageChange(files[0]);
                    } else {
                      handleImageChange(null);
                    }
                  }}
                  maxImages={1}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  {activeLang === 'es' ? 'Contenido' : 'Content'}
                </label>
                <TipTapEditor
                  key={`${resetKey}-content-${activeLang}`}
                  content={currentContent}
                  onChange={(html) => handleFormChange((`content_${activeLang}`) as LangField, html)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>{activeLang === 'es' ? 'Vista previa del artículo - Los cambios se guardarán al hacer clic en Publicar' : 'Article preview - Changes will be saved when clicking Publish'}</p>
        </div>
      </div>
    </div>
  );
}

function Label({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
}