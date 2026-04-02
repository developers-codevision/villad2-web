import { useLanguage } from '../contexts';

const ReceptionSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4 bg-accent/30">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
          {t("reception.title")}
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          {t("reception.description")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <img
              key={i}
              src={`/recepcion${i}.jpg`}
              alt={`Recepción ${i}`}
              width={1280}
              height={853}
              loading="lazy"
              decoding="async"
              className="w-full h-64 object-cover rounded-lg shadow-sm hover:shadow-lg transition-shadow"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReceptionSection;
