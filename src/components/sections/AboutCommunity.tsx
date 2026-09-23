import Link from "next/link";

export function AboutCommunity() {
  return (
    <section className="bg-surface py-16 lg:py-24">
      <div className="mx-auto grid max-w-300 items-center gap-12 px-5 lg:grid-cols-2">

        {/* Área visual */}
        <div className="order-2 lg:order-1">
          <div
            className="min-h-115 bg-cover bg-center shadow-card"
            style={{
              backgroundImage:
                "linear-gradient(rgb(0 0 0 / 0.18), rgb(0 0 0 / 0.18)), url(https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80)",
            }}
            aria-label="Pessoas reunidas em comunidade"
          />
        </div>

        {/* Conteúdo */}
        <div className="order-1 lg:order-2">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
            Nossa comunidade
          </span>

          <h2 className="mt-3 text-3xl font-bold leading-tight text-primary-900 sm:text-4xl">
            Um lugar para caminhar e crescer juntos.
          </h2>

          <p className="mt-6 leading-7 text-text-secondary">
            Acreditamos que a igreja é uma comunidade de pessoas que
            compartilham fé, cuidado e propósito. Queremos que cada pessoa
            encontre espaço para desenvolver relacionamentos e fazer parte
            dessa caminhada.
          </p>

          <p className="mt-4 leading-7 text-text-secondary">
            Seja você alguém que já participa de uma igreja ou esteja
            chegando pela primeira vez, queremos receber você com carinho
            e respeito.
          </p>

          <Link
            href="/sobre"
            className="mt-8 inline-flex items-center justify-center border border-primary-900 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-primary-900 transition hover:bg-primary-900 hover:text-white"
          >
            Conheça nossa história
          </Link>
        </div>

      </div>
    </section>
  );
}
