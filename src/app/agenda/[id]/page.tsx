import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getPublicEvent } from "@/services/publicData";

interface EventoDetalhePageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function EventoDetalhePage({
  params,
}: EventoDetalhePageProps) {
  const { id } = await params;
  const event = await getPublicEvent(id);

  if (!event) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="bg-background">
        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-300 px-5">
            <Link
              href="/agenda"
              className="font-semibold text-primary-600 transition hover:text-primary-700"
            >
              ← Voltar para agenda
            </Link>

            <article className="mt-8 overflow-hidden rounded-xl border border-border-default bg-surface shadow-card">
              <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[auto_1fr] lg:p-10">
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-lg bg-primary-100">
                  <span className="text-4xl font-bold text-primary-900">
                    {event.day}
                  </span>

                  <span className="text-sm font-semibold uppercase text-primary-700">
                    {event.month}
                  </span>
                </div>

                <div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
                    {event.category}
                  </span>

                  <h1 className="mt-3 text-4xl font-bold leading-tight text-primary-900 sm:text-5xl">
                    {event.title}
                  </h1>

                  <p className="mt-5 max-w-3xl text-lg leading-8 text-text-secondary">
                    {event.summary}
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-border-default p-4">
                      <p className="text-sm font-semibold text-text-secondary">
                        Horário
                      </p>

                      <p className="mt-1 font-bold text-text-primary">
                        {event.time}
                      </p>
                    </div>

                    <div className="rounded-lg border border-border-default p-4">
                      <p className="text-sm font-semibold text-text-secondary">
                        Local
                      </p>

                      <p className="mt-1 font-bold text-text-primary">
                        {event.location}
                      </p>
                    </div>
                  </div>

                  <p className="mt-8 max-w-3xl leading-7 text-text-secondary">
                    {event.description}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
