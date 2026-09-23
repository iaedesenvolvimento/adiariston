import Link from "next/link";

import { AdminHeader } from "@/components/layout/AdminHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { listAdminPrayerRequests } from "@/services/adminPrayers";
import { requireAdminProfile } from "@/services/auth";

export const dynamic = "force-dynamic";

export default async function AdminOracaoPage() {
  const admin = await requireAdminProfile([
    "Admin",
    "Leadership",
    "Intercessor",
  ]);
  const prayers = await listAdminPrayerRequests();

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
                Intercessão
              </span>

              <h1 className="mt-3 text-3xl font-bold text-primary-900 sm:text-4xl">
                Pedidos de oração
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-text-secondary">
                Área protegida para acompanhamento interno. Pedidos
                privados não são publicados no mural.
              </p>
            </div>

            <Link
              href="/admin/oracao/moderacao"
              className="inline-flex items-center justify-center rounded-md bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700"
            >
              Moderação
            </Link>
          </div>

          {prayers.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-border-default bg-surface shadow-sm">
              <div className="divide-y divide-border-default">
                {prayers.map((prayer) => (
                  <article
                    key={prayer.id}
                    className="grid gap-4 p-5 md:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                          {prayer.status}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-text-secondary">
                          {prayer.visibilidade}
                        </span>

                        {prayer.categoria_sugerida && (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                            {prayer.categoria_sugerida}
                          </span>
                        )}

                        {prayer.requer_atencao_humana && (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                            Atenção humana
                          </span>
                        )}

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-text-secondary">
                          IA{" "}
                          {prayer.ia_processada_em
                            ? "processada"
                            : prayer.ia_erro
                              ? "com falha"
                              : "pendente"}
                        </span>
                      </div>

                      <h2 className="mt-3 font-bold text-primary-900">
                        {prayer.nome || "Pedido sem identificação"}
                      </h2>

                      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary">
                        <div>
                          <dt className="sr-only">E-mail</dt>
                          <dd>
                            {prayer.email ||
                              "E-mail não informado"}
                          </dd>
                        </div>

                        <div>
                          <dt className="sr-only">WhatsApp</dt>
                          <dd>
                            {prayer.whatsapp ||
                              "WhatsApp não informado"}
                          </dd>
                        </div>
                      </dl>

                      <p className="mt-2 line-clamp-2 leading-7 text-text-secondary">
                        {prayer.pedido}
                      </p>
                    </div>

                    <div className="flex items-center md:justify-end">
                      <Link
                        href={`/admin/oracao/${prayer.id}`}
                        className="font-semibold text-primary-600 transition hover:text-primary-700"
                      >
                        Ver detalhes e IA →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="Nenhum pedido recebido ainda"
              description="Os pedidos enviados pela página pública aparecerão aqui para acompanhamento da equipe autorizada."
              actionHref="/oracao"
              actionLabel="Abrir página pública"
            />
          )}
        </div>
      </main>
    </>
  );
}
