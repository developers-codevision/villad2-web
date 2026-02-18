import { useState } from "react";
import { ImageIcon } from "lucide-react";

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  onLoadChange?: (loading: boolean) => void;
}

/**
 * Componente de imagen con placeholder y manejo de estados de carga/error
 * Muestra un ícono animado mientras carga y un fallback si hay error
 */
export default function ImageWithPlaceholder({
  src,
  alt,
  className = "",
  loading = "lazy",
  onLoadChange
}: ImageWithPlaceholderProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoadChange?.(false);
  };

  const handleError = () => {
    setImageError(true);
    setImageLoaded(true);
    onLoadChange?.(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Placeholder mientras carga */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <ImageIcon className="w-12 h-12 text-muted-foreground/40 animate-pulse" />
        </div>
      )}

      {/* Estado de error */}
      {imageError ? (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <div className="text-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Imagen no disponible</p>
          </div>
        </div>
      ) : (
        /* Imagen */
        <img
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}

