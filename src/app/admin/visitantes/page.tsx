import Link from "next/link";

import { AdminHeader } from "@/components/layout/AdminHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { listAdminVisitors } from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";

export const dynamic = "force-dynamic";

export default async function AdminVisitantesPage() {
  const admin = await requireAdminProfile([
    "Admin",
    "Leadership",
    "Reception",
  ]);
  const visitors = await listAdminVisitors();

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <div className="mb-8">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
              Acolhimento
            </span>

            <h1 className="mt-3 text-3xl font-bold text-primary-900 sm:text-4xl">
              Visitantes
            </h1>
          </div>

          <div className="overflow-hidden rounded-xl border border-border-default bg-surface shadow-sm">
            {visitors.length > 0 ? (
              <div className="divide-y divide-border-default">
                {visitors.map((visitor) => (
                  <article
                    key={visitor.id}
                    className="grid gap-4 p-5 md:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                        {visitor.status}
                      </span>

                      <h2 className="mt-3 font-bold text-primary-900">
                        {visitor.nome_completo}
                      </h2>

                      <p className="mt-1 text-sm text-text-secondary">
                        {visitor.email} · {visitor.whatsapp}
                      </p>
                    </div>

                    <Link
                      href={`/admin/visitantes/${visitor.id}`}
                      className="self-center font-semibold text-primary-600 transition hover:text-primary-700"
                    >
                      Ver detalhes →
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                className="rounded-none border-0 shadow-none"
                title="Nenhum visitante cadastrado"
                description="Quando alguém preencher o formulário público de visitante, o registro aparecerá nesta área."
                actionHref="/visitante"
                actionLabel="Abrir formulário público"
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
