import { useLanguage } from '../contexts';

const DescriptionSection = () => {
  const { t } = useLanguage();

  return (
    <section className="p-20  px-4 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
          {t("description.title")}
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto">
          {t("description.content")}
        </p>
      </div>
    </section>
  );
};

export default DescriptionSection;

