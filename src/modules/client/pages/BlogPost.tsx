import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Calendar } from "lucide-react";
import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { blogService } from "@/modules/shared/services";
import { BlogPost } from "@/modules/shared/types/blog.types";
import { getMediaUrl } from "@/modules/shared/services";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      
      try {
        const data = await blogService.getByIdOrSlug(slug);
        setPost(data);
      } catch (err) {
        console.error("Error loading blog post:", err);
        setError("Artículo no encontrado");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

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
              <h1 className="text-2xl font-bold mb-4">Artículo no encontrado</h1>
              <p className="text-muted-foreground mb-8">El artículo que buscas no existe o ha sido eliminado.</p>
              <Link
                to="/blog"
                className="inline-flex items-center text-primary hover:underline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al blog
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
            Volver al blog
          </Link>

          <header className="mb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
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
                alt={post.title}
                className="w-full aspect-[2/1] object-cover rounded-2xl"
              />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}