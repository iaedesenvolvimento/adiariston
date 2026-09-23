import Link from "next/link";
import { publicMinistries } from "@/data/publicContent";

export function Ministries() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-300 px-5">

        {/* Cabeçalho */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
            Faça parte
          </span>

          <h2 className="mt-3 text-3xl font-bold text-primary-900 sm:text-4xl">
            Encontre seu lugar em nossa comunidade
          </h2>

          <p className="mt-4 leading-7 text-text-secondary">
            Conheça alguns dos nossos ministérios e descubra novas
            oportunidades para participar, servir e construir
            relacionamentos.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {publicMinistries.map((ministry) => (
            <article
              key={ministry.id}
              className="rounded-lg border border-border-default bg-surface p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-md bg-primary-100 text-2xl text-primary-700">
                {ministry.icon}
              </div>

              <h3 className="text-xl font-bold text-primary-900">
                {ministry.title}
              </h3>

              <p className="mt-3 leading-7 text-text-secondary">
                {ministry.description}
              </p>

              <Link
                href="/ministerios"
                className="mt-6 inline-flex font-semibold text-primary-600 transition hover:text-primary-700"
              >
                Saiba mais →
              </Link>
            </article>
          ))}
        </div>

        {/* Botão final */}
        <div className="mt-10 text-center">
          <Link
            href="/ministerios"
            className="inline-flex items-center justify-center rounded-md border border-primary-600 px-6 py-3 font-semibold text-primary-600 transition hover:bg-primary-100"
          >
            Ver todos os ministérios
          </Link>
        </div>

      </div>
    </section>
  );
}
