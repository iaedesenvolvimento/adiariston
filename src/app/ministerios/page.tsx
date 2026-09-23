import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHero } from "@/components/ui/PageHero";
import { publicMinistries } from "@/data/publicContent";

export default function MinisteriosPage() {
  return (
    <>
      <Header />

      <main className="bg-background">
        <PageHero
          eyebrow="Ministérios"
          title="Encontre um lugar para participar"
          description="Cada ministério existe para servir pessoas, formar vínculos e apoiar a caminhada da comunidade."
          imageUrl="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80"
        />

        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-300 px-5">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {publicMinistries.map((ministry) => (
                <article
                  key={ministry.id}
                  className="rounded-lg border border-border-default bg-surface p-7 shadow-sm"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-md bg-primary-100 text-2xl text-primary-700">
                    {ministry.icon}
                  </div>

                  <h2 className="text-xl font-bold text-primary-900">
                    {ministry.title}
                  </h2>

                  <p className="mt-3 leading-7 text-text-secondary">
                    {ministry.description}
                  </p>

                  <p className="mt-4 leading-7 text-text-secondary">
                    {ministry.details}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/contato"
                className="inline-flex items-center justify-center bg-primary-600 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-primary-700"
              >
                Quero saber mais
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
