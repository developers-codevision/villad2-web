import { useState, useEffect } from 'react';
import { MessageCircle, Send, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/modules/shared/components/ui/button';
import { Textarea } from '@/modules/shared/components/ui/textarea';
import { Input } from '@/modules/shared/components/ui/input';
import { blogCommentsService } from '@/modules/shared/services';
import { BlogComment, BlogCommentStatus } from '@/modules/shared/types/blog.types';
import { useLanguage } from '@/modules/client/contexts';

interface BlogCommentsProps {
  postId: number;
}

export function BlogComments({ postId }: BlogCommentsProps) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', content: '' });
  const { t } = useLanguage();

  const loadComments = async () => {
    try {
      const response = await blogCommentsService.getByPostId(
        postId,
        BlogCommentStatus.ACTIVE,
        1,
        50
      );
      setComments(response.comments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) {
      toast.error(t('blog.comments.errorEmpty'));
      return;
    }

    setSubmitting(true);
    try {
      await blogCommentsService.create({
        postId,
        name: formData.name.trim(),
        content: formData.content.trim(),
      });
      toast.success(t('blog.comments.success'));
      setFormData({ name: '', content: '' });
      setShowForm(false);
      await loadComments();
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error(t('blog.comments.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">
            {t('blog.comments.title')} ({comments.length})
          </h2>
        </div>
        {!showForm && (
          <Button variant="outline" onClick={() => setShowForm(true)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            {t('blog.comments.add')}
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-muted/30 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">{t('blog.comments.formTitle')}</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">{t('blog.comments.name')}</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('blog.comments.namePlaceholder')}
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {formData.name.length}/100
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t('blog.comments.message')}</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder={t('blog.comments.messagePlaceholder')}
                rows={4}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {formData.content.length}/1000
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  t('blog.comments.sending')
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {t('blog.comments.submit')}
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                {t('blog.comments.cancel')}
              </Button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t('blog.comments.loading')}</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground">{t('blog.comments.empty')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-card border border-border rounded-lg p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold">{comment.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-foreground leading-relaxed">{comment.content}</p>
                  {comment.response && (
                    <div className="mt-4 pl-4 border-l-2 border-primary">
                      <p className="text-xs font-medium text-primary mb-1">
                        {t('blog.comments.response')}
                      </p>
                      <p className="text-sm text-muted-foreground">{comment.response}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}