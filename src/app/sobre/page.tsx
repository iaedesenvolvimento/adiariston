import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHero } from "@/components/ui/PageHero";

export default function SobrePage() {
  return (
    <>
      <Header />

      <main className="bg-background">
        <PageHero
          eyebrow="Nossa comunidade"
          title="Uma igreja para acolher, caminhar junto e servir"
          description="Somos uma comunidade cristã que valoriza pessoas, cuidado, comunhão e crescimento espiritual com responsabilidade."
          imageUrl="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80"
        />

        <section className="bg-surface py-14 lg:py-20">
          <div className="mx-auto grid max-w-300 gap-12 px-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h2 className="max-w-3xl text-3xl font-black uppercase leading-tight tracking-wide text-primary-900 sm:text-4xl">
                Pessoas cuidando de pessoas.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
                Somos uma comunidade cristã que valoriza pessoas, cuidado,
                comunhão e crescimento espiritual com responsabilidade.
                Queremos que cada pessoa encontre um lugar seguro para
                conhecer a fé e construir relacionamentos.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/visitante"
                  className="inline-flex items-center justify-center bg-primary-600 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-primary-700"
                >
                  Sou Visitante
                </Link>

                <Link
                  href="/agenda"
                  className="inline-flex items-center justify-center border border-primary-900 bg-surface px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-primary-900 transition hover:bg-primary-900 hover:text-white"
                >
                  Ver programação
                </Link>
              </div>
            </div>

            <div className="rounded-xl bg-primary-100 p-8">
              <div className="rounded-lg bg-surface p-7 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">
                  Pessoas cuidando de pessoas
                </p>

                <p className="mt-4 text-2xl font-bold leading-tight text-primary-900">
                  Acolhimento não é uma etapa do processo. É a forma como
                  queremos caminhar.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-300 px-5">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Fé",
                  text: "Buscamos viver uma fé bíblica, simples e presente no cotidiano.",
                },
                {
                  title: "Comunidade",
                  text: "Valorizamos relações saudáveis, serviço mútuo e escuta atenta.",
                },
                {
                  title: "Cuidado",
                  text: "Tratamos cada história com respeito, discrição e responsabilidade.",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="rounded-lg border border-border-default bg-surface p-6 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-primary-900">
                    {item.title}
                  </h2>

                  <p className="mt-3 leading-7 text-text-secondary">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
