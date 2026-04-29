import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Calendar } from "lucide-react";
import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { blogService } from "@/modules/shared/services";
import { BlogPost, BlogPostStatus } from "@/modules/shared/types/blog.types";
import { getMediaUrl } from "@/modules/shared/services";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useLanguage } from "@/modules/client/contexts";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language, t } = useLanguage();

  const title = post ? (language === 'en' && post.title_en ? post.title_en : post.title_es) : '';
  const content = post ? (language === 'en' && post.content_en ? post.content_en : post.content_es) : '';

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;

      try {
        const data = await blogService.getByIdOrSlug(slug);
        // Only show post if it's visible (safety check)
        if (data.status !== BlogPostStatus.VISIBLE) {
          setError(t('blog.articleNotFound'));
        } else {
          setPost(data);
        }
      } catch (err) {
        console.error("Error loading blog post:", err);
        setError(t('blog.articleNotFound'));
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  useEffect(() => {
    if (post && !loading) {
      const pageTitle = title + ' | Villa D2';
      document.title = pageTitle;
      let desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', post.description_es || title);
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', pageTitle);
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', post.description_es || title);
      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', `https://villad2.com/blog/${slug}`);
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', `https://villad2.com/blog/${slug}`);

      // Schema BlogPosting
      const postSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": post.description_es || title,
        "url": `https://villad2.com/blog/${slug}`,
        "image": post.image,
        "datePublished": post.createdAt,
        "dateModified": post.updatedAt,
        "author": {
          "@type": "Organization",
          "name": "Hostal Boutique Villa D2"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Hostal Boutique Villa D2",
          "logo": {
            "@type": "ImageObject",
            "url": "https://villad2.com/logo.png"
          }
        }
      };

      let script = document.getElementById('blogpost-schema') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = 'blogpost-schema';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(postSchema);
    }
  }, [post, loading, slug, title]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-32 bg-muted rounded" />
              <div className="h-12 w-3/4 bg-muted rounded" />
              <div className="h-6 w-48 bg-muted rounded" />
              <div className="aspect-[2/1] bg-muted rounded-2xl" />
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center py-20">
              <FileText size={64} className="mx-auto mb-6 text-muted-foreground/30" />
              <h1 className="text-2xl font-bold mb-4">{t('blog.articleNotFound')}</h1>
              <p className="text-muted-foreground mb-8">{t('blog.articleNotFoundDesc')}</p>
              <Link
                to="/blog"
                className="inline-flex items-center text-primary hover:underline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('blog.backToBlog')}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20 px-4">
        <article className="container mx-auto max-w-4xl">
          <Link
            to="/blog"
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('blog.backToBlog')}
          </Link>

          <header className="mb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {title}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {post.publishedAt
                    ? format(new Date(post.publishedAt), "dd MMMM yyyy", { locale: es })
                    : ""}
                </span>
              </div>
            </div>
          </header>

          {post.image && (
            <div className="mb-10">
              <img
                src={getMediaUrl(post.image)}
                alt={title}
                className="w-full aspect-[2/1] object-cover rounded-2xl"
              />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}
