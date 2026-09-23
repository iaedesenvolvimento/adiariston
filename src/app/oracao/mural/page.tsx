import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { EmptyState } from "@/components/ui/EmptyState";
import { SupabaseConfigError } from "@/lib/supabase/server";
import { listPublicPrayerMural } from "@/services/prayers";

export const dynamic = "force-dynamic";

async function getMuralItems() {
  try {
    return await listPublicPrayerMural();
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      return [];
    }

    throw error;
  }
}

export default async function MuralOracaoPage() {
  const items = await getMuralItems();

  return (
    <>
      <Header />

      <main className="bg-background">
        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-300 px-5">
            <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
                  Mural de oração
                </span>

                <h1 className="mt-3 text-4xl font-bold text-primary-900 sm:text-5xl">
                  Pedidos compartilhados pela comunidade
                </h1>

                <p className="mt-5 leading-7 text-text-secondary">
                  Apenas pedidos autorizados e aprovados em moderação
                  aparecem aqui. Pedidos privados nunca são publicados.
                </p>
              </div>

              <Link
                href="/oracao"
                className="inline-flex items-center justify-center rounded-md bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700"
              >
                Enviar pedido
              </Link>
            </div>

            {items.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-lg border border-border-default bg-surface p-6 shadow-sm"
                  >
                    {item.categoria && (
                      <span className="inline-flex rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                        {item.categoria}
                      </span>
                    )}

                    <p className="mt-4 leading-7 text-text-primary">
                      {item.texto_publico}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nenhum pedido publicado ainda"
                description="O mural exibirá somente pedidos compartilháveis que forem revisados e aprovados pela equipe responsável."
                actionHref="/oracao"
                actionLabel="Enviar pedido"
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
