import Link from "next/link";

import { AdminHeader } from "@/components/layout/AdminHeader";
import { getAdminPrayerRequest } from "@/services/adminPrayers";
import { requireAdminProfile } from "@/services/auth";
import { retryPrayerAiAction } from "./actions";

interface AdminPrayerDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function AdminPrayerDetailPage({
  params,
}: AdminPrayerDetailPageProps) {
  const admin = await requireAdminProfile([
    "Admin",
    "Leadership",
    "Intercessor",
  ]);
  const { id } = await params;
  const prayer = await getAdminPrayerRequest(id);

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <Link
            href="/admin/oracao"
            className="font-semibold text-primary-600 transition hover:text-primary-700"
          >
            ← Voltar para pedidos
          </Link>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
            <article className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                  {prayer.status}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-text-secondary">
                  {prayer.visibilidade}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold text-primary-900">
                Pedido de oração
              </h1>

              <p className="mt-5 whitespace-pre-wrap leading-7 text-text-primary">
                {prayer.pedido}
              </p>
            </article>

            <aside className="space-y-6">
              <section className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
                <h2 className="text-xl font-bold text-primary-900">
                  Apoio de IA
                </h2>

                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="font-semibold text-text-secondary">
                      Categoria sugerida
                    </dt>
                    <dd className="mt-1 text-text-primary">
                      {prayer.categoria_sugerida ||
                        "Ainda não sugerida"}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-semibold text-text-secondary">
                      Atenção humana
                    </dt>
                    <dd className="mt-1 text-text-primary">
                      {prayer.requer_atencao_humana
                        ? "Sinalizada"
                        : "Não sinalizada"}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-semibold text-text-secondary">
                      Processamento
                    </dt>
                    <dd className="mt-1 text-text-primary">
                      {prayer.ia_processada_em
                        ? "Processado"
                        : prayer.ia_erro
                          ? "Falhou"
                          : "Pendente"}
                    </dd>
                  </div>
                </dl>

                {prayer.mensagem_acolhimento && (
                  <p className="mt-5 rounded-md border border-border-default bg-background p-4 leading-7 text-text-secondary">
                    {prayer.mensagem_acolhimento}
                  </p>
                )}

                {prayer.ia_erro && (
                  <p className="mt-4 text-sm font-semibold text-red-700">
                    {prayer.ia_erro}
                  </p>
                )}

                <form action={retryPrayerAiAction} className="mt-5">
                  <input
                    type="hidden"
                    name="prayerId"
                    value={prayer.id}
                  />

                  <button
                    type="submit"
                    className="rounded-md border border-primary-600 px-4 py-2.5 text-sm font-semibold text-primary-600 transition hover:bg-primary-100"
                  >
                    Reprocessar IA
                  </button>
                </form>
              </section>

              <section className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
                <h2 className="text-xl font-bold text-primary-900">
                  Dados de contato
                </h2>

                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="font-semibold text-text-secondary">
                      Nome
                    </dt>
                    <dd className="mt-1 text-text-primary">
                      {prayer.nome || "Não informado"}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-semibold text-text-secondary">
                      E-mail
                    </dt>
                    <dd className="mt-1 text-text-primary">
                      {prayer.email || "Não informado"}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-semibold text-text-secondary">
                      WhatsApp
                    </dt>
                    <dd className="mt-1 text-text-primary">
                      {prayer.whatsapp || "Não informado"}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
                <h2 className="text-xl font-bold text-primary-900">
                  Moderação
                </h2>

                {prayer.moderacao ? (
                  <div className="mt-4">
                    <p className="font-semibold text-text-primary">
                      {prayer.moderacao.status}
                    </p>

                    {prayer.moderacao.texto_publico && (
                      <p className="mt-3 leading-7 text-text-secondary">
                        {prayer.moderacao.texto_publico}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mt-4 text-text-secondary">
                    Pedido privado, sem fluxo de mural.
                  </p>
                )}
              </section>
            </aside>
          </div>

          <section className="mt-6 rounded-xl border border-border-default bg-surface p-6 shadow-sm">
            <h2 className="text-xl font-bold text-primary-900">
              Histórico
            </h2>

            {prayer.historico.length > 0 ? (
              <div className="mt-5 divide-y divide-border-default">
                {prayer.historico.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 first:pt-0 last:pb-0"
                  >
                    <p className="font-semibold text-text-primary">
                      {item.acao}
                    </p>

                    <p className="mt-1 text-sm text-text-secondary">
                      {item.ator_tipo}
                      {item.observacao
                        ? ` · ${item.observacao}`
                        : ""}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-text-secondary">
                Nenhum histórico registrado.
              </p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
