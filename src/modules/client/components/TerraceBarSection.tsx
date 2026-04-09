import { useLanguage } from '../contexts';

const TerraceBarSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
          {t("terrace.title")}
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          {t("terrace.description")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <img
              key={i}
              src={`/terraza${i}.jpg`}
              alt={`Terraza-Bar del Hostal Villa D2 en Vedado, La Habana - Vista ${i}`}
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

export default TerraceBarSection;
