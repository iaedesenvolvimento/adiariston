interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  imageUrl?: string;
}

const defaultImageUrl =
  "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1600&q=80";

export function PageHero({
  eyebrow,
  title,
  description,
  imageUrl = defaultImageUrl,
}: PageHeroProps) {
  return (
    <section
      className="bg-primary-900 bg-cover bg-center px-5 py-20 text-white lg:py-28"
      style={{
        backgroundImage: `linear-gradient(90deg, rgb(0 0 0 / 0.72), rgb(0 0 0 / 0.42)), url(${imageUrl})`,
      }}
    >
      <div className="mx-auto max-w-300">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-100">
          {eyebrow}
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-tight tracking-wide sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-white/85">
          {description}
        </p>
      </div>
    </section>
  );
}
