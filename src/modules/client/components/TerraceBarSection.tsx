const TerraceBarSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
          La <span className="text-primary">Terraza-Bar</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          La Terraza-Bar, está decorada haciendo alusión a los "Cayos de Cuba", donde se reflejan los archipiélagos de Jardines del Rey, Jardines de la Reina, el archipiélago de los Canarreos y de los Colorados, como parte integrante del territorio de Cuba y su historia.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <img key={i} src={`/terraza${i}.jpg`} alt={`Terraza ${i}`} className="w-full h-64 object-cover rounded-lg shadow-sm hover:shadow-lg transition-shadow" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TerraceBarSection;
