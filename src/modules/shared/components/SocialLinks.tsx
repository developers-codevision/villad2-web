interface SocialLinksProps {
  facebookUrl: string;
  youtubeUrl: string;
  whatsappUrl: string;
}

export default function SocialLinks({ facebookUrl, youtubeUrl, whatsappUrl }: SocialLinksProps) {
  return (
    <div className="flex items-center gap-3">
      <a href={facebookUrl} target="_blank" rel="me noopener noreferrer" aria-label="Facebook">
        <img
          src="/facebook.png"
          alt="Facebook"
          width={32}
          height={32}
          loading="lazy"
          decoding="async"
          className="w-8 h-8 hover:opacity-80 transition-opacity"
        />
        {/* Facebook iconos creados por Freepik - Flaticon */}
      </a>
      {/* 
      <a href={twitterUrl} target="_blank" rel="me noopener noreferrer" aria-label="X (Twitter)">
        <img
          src="/x.png"
          alt="X (Twitter)"
          width={32}
          height={32}
          loading="lazy"
          decoding="async"
          className="w-8 h-8 hover:opacity-80 transition-opacity"
        />
      </a>
      */}
      <a href={youtubeUrl} target="_blank" rel="me noopener noreferrer" aria-label="Youtube">
        <img
          src="/youtube.png"
          alt="Youtube"
          width={32}
          height={32}
          loading="lazy"
          decoding="async"
          className="w-8 h-8 hover:opacity-80 transition-opacity"
        />
        {/* Red social iconos creados por riajulislam - Flaticon */}
      </a>
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Whatsapp">
        <img
          src="/whatsapp.png"
          alt="Whatsapp"
          width={32}
          height={32}
          loading="lazy"
          decoding="async"
          className="w-8 h-8 hover:opacity-80 transition-opacity"
        />
        {/* Whatsapp iconos creados por Fathema Khanom - Flaticon */}
      </a>
    </div>
  );
}
