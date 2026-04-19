import { useState, useEffect } from "react";
import { FileText, ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { blogService } from "@/modules/shared/services";
import { BlogPost, BlogPostStatus } from "@/modules/shared/types/blog.types";
import { getMediaUrl } from "@/modules/shared/services";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const visiblePosts = await blogService.getVisible();
        // Safety: ensure we only display posts marked VISIBLE in frontend
        const filtered = visiblePosts.filter((p) => p.status === BlogPostStatus.VISIBLE);
        setPosts(filtered);
      } catch (error) {
        console.error("Error loading blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#00c3ff]">
      <Navbar />

      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-white">
              Nuestro Blog
            </h1>
            <p className="text-white/90 max-w-2xl mx-auto text-base md:text-xl font-bolden ">
              Descubre consejos, experiencias y consejos sobre la zona.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-4 mb-10 border shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-muted animate-pulse h-[400px]" />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="border border-dashed border-border rounded-2xl p-16 flex flex-col items-center justify-center text-muted-foreground">
              <FileText size={56} className="mb-5 opacity-20" />
              <p className="font-semibold text-lg">
                {searchTerm ? "No se encontraron resultados" : "Sin artículos"}
              </p>
              <p className="text-sm mt-2">
                {searchTerm ? "Intenta con otros filtros" : "Pronto tendremos nuevo contenido."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group block bg-card rounded-2xl overflow-hidden border hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    {post.image ? (
                      <img
                        src={getMediaUrl(post.image)}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <FileText className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">
                      {post.publishedAt
                        ? format(new Date(post.publishedAt), "dd MMM yyyy", { locale: es })
                        : ""}
                    </p>
                    <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <div className="flex items-center text-primary font-medium text-sm">
                      Leer más <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
