import Link from "next/link";

import { AdminHeader } from "@/components/layout/AdminHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { listAdminEvents } from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";

export const dynamic = "force-dynamic";

export default async function AdminEventosPage() {
  const admin = await requireAdminProfile([
    "Admin",
    "Leadership",
    "Editor",
  ]);
  const events = await listAdminEvents();

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
                Agenda
              </span>

              <h1 className="mt-3 text-3xl font-bold text-primary-900 sm:text-4xl">
                Eventos
              </h1>
            </div>

            <Link
              href="/admin/eventos/novo"
              className="inline-flex rounded-md bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700"
            >
              Novo evento
            </Link>
          </div>

          {events.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="rounded-lg border border-border-default bg-surface p-6 shadow-sm"
                >
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                    {event.status}
                  </span>

                  <h2 className="mt-4 text-xl font-bold text-primary-900">
                    {event.titulo}
                  </h2>

                  <p className="mt-2 text-text-secondary">
                    {event.local || "Local não informado"}
                  </p>

                  <Link
                    href={`/admin/eventos/${event.id}`}
                    className="mt-5 inline-flex font-semibold text-primary-600 transition hover:text-primary-700"
                  >
                    Ver detalhes →
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum evento cadastrado"
              description="Crie o primeiro evento para publicar a agenda da igreja no site."
              actionHref="/admin/eventos/novo"
              actionLabel="Criar evento"
            />
          )}
        </div>
      </main>
    </>
  );
}
