import Link from "next/link";

import { AdminHeader } from "@/components/layout/AdminHeader";
import { listPendingPrayerModerations } from "@/services/adminPrayers";
import { requireAdminProfile } from "@/services/auth";
import {
  approvePrayerModerationAction,
  rejectPrayerModerationAction,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPrayerModerationPage() {
  const admin = await requireAdminProfile([
    "Admin",
    "Intercessor",
  ]);
  const pendingItems = await listPendingPrayerModerations();

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <div className="mb-8">
            <Link
              href="/admin/oracao"
              className="font-semibold text-primary-600 transition hover:text-primary-700"
            >
              ← Voltar para pedidos
            </Link>

            <span className="mt-8 block text-sm font-semibold uppercase tracking-wider text-primary-600">
              Moderação
            </span>

            <h1 className="mt-3 text-3xl font-bold text-primary-900 sm:text-4xl">
              Pedidos aguardando revisão
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-text-secondary">
              Somente pedidos compartilháveis aparecem aqui. A aprovação
              publica no mural apenas o texto revisado pela equipe.
            </p>
          </div>

          {pendingItems.length > 0 ? (
            <div className="space-y-6">
              {pendingItems.map((item) => {
                const prayer = item.pedidos_oracao;

                return (
                  <article
                    key={item.id}
                    className="rounded-xl border border-border-default bg-surface p-6 shadow-sm"
                  >
                    <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
                      <div>
                        <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                          PENDENTE
                        </span>

                        <h2 className="mt-4 text-xl font-bold text-primary-900">
                          {prayer?.nome ||
                            "Pedido sem identificação"}
                        </h2>

                        <dl className="mt-3 grid gap-2 text-sm text-text-secondary sm:grid-cols-2">
                          <div>
                            <dt className="font-semibold">
                              E-mail
                            </dt>
                            <dd className="mt-1">
                              {prayer?.email ||
                                "Não informado"}
                            </dd>
                          </div>

                          <div>
                            <dt className="font-semibold">
                              WhatsApp
                            </dt>
                            <dd className="mt-1">
                              {prayer?.whatsapp ||
                                "Não informado"}
                            </dd>
                          </div>
                        </dl>

                        <p className="mt-4 whitespace-pre-wrap leading-7 text-text-primary">
                          {prayer?.pedido}
                        </p>
                      </div>

                      <div className="space-y-5">
                        <form
                          action={approvePrayerModerationAction}
                          className="rounded-lg border border-border-default p-4"
                        >
                          <input
                            type="hidden"
                            name="moderationId"
                            value={item.id}
                          />
                          <input
                            type="hidden"
                            name="prayerId"
                            value={item.pedido_id}
                          />

                          <label
                            htmlFor={`texto-publico-${item.id}`}
                            className="text-sm font-semibold text-text-primary"
                          >
                            Texto público aprovado
                          </label>

                          <textarea
                            id={`texto-publico-${item.id}`}
                            name="textoPublico"
                            required
                            minLength={10}
                            maxLength={1000}
                            defaultValue={prayer?.pedido ?? ""}
                            className="mt-2 min-h-36 w-full resize-y rounded-md border border-border-default bg-surface px-4 py-3 text-text-primary outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                          />

                          <button
                            type="submit"
                            className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700"
                          >
                            Aprovar para mural
                          </button>
                        </form>

                        <form
                          action={rejectPrayerModerationAction}
                          className="rounded-lg border border-border-default p-4"
                        >
                          <input
                            type="hidden"
                            name="moderationId"
                            value={item.id}
                          />
                          <input
                            type="hidden"
                            name="prayerId"
                            value={item.pedido_id}
                          />

                          <label
                            htmlFor={`observacao-${item.id}`}
                            className="text-sm font-semibold text-text-primary"
                          >
                            Motivo interno
                          </label>

                          <textarea
                            id={`observacao-${item.id}`}
                            name="observacaoInterna"
                            required
                            maxLength={500}
                            placeholder="Explique por que este pedido não deve ir ao mural."
                            className="mt-2 min-h-24 w-full resize-y rounded-md border border-border-default bg-surface px-4 py-3 text-text-primary outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                          />

                          <button
                            type="submit"
                            className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-error px-5 py-3 font-semibold text-error transition hover:bg-red-50"
                          >
                            Rejeitar publicação
                          </button>
                        </form>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-border-default bg-surface p-8 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-primary-900">
                Nada aguardando moderação
              </h2>

              <p className="mt-3 text-text-secondary">
                Novos pedidos compartilháveis aparecerão aqui antes de
                qualquer publicação no mural.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
