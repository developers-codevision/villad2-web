const ReceptionSection = () => {
  return (
    <section className="py-20 px-4 bg-accent/30">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
          La <span className="text-primary">Recepción</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          En la recepción se informa además a los huéspedes sobre los programas de visitas a todos los sitios de interés turístico, cultural y recreativo, y se establecen coordinaciones para el traslado hacia museos y centros recreativos.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <img key={i} src={`/recepcion${i}.jpg`} alt={`Recepción ${i}`} className="w-full h-64 object-cover rounded-lg shadow-sm hover:shadow-lg transition-shadow" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReceptionSection;
