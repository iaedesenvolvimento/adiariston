import { AdminHeader } from "@/components/layout/AdminHeader";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { listAdminSettings } from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";
import { clearDemoDatabaseAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const admin = await requireAdminProfile([
    "Admin",
    "Leadership",
    "Editor",
  ]);
  const settings = await listAdminSettings();
  const canClearDatabase = admin.profiles.includes("Admin");

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <h1 className="text-3xl font-bold text-primary-900">
            Configurações
          </h1>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {settings.map((setting) => (
              <article
                key={setting.chave}
                className="rounded-lg border border-border-default bg-surface p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-bold text-primary-900">
                    {setting.chave}
                  </h2>

                  <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                    {setting.publica ? "Pública" : "Interna"}
                  </span>
                </div>

                <p className="mt-3 font-semibold text-text-primary">
                  {setting.valor}
                </p>

                {setting.descricao && (
                  <p className="mt-2 leading-7 text-text-secondary">
                    {setting.descricao}
                  </p>
                )}
              </article>
            ))}
          </div>

          {canClearDatabase ? (
            <section className="mt-10 rounded-xl border border-error bg-surface p-6 shadow-sm">
              <span className="text-sm font-semibold uppercase tracking-wider text-error">
                Zona perigosa
              </span>

              <h2 className="mt-3 text-2xl font-bold text-primary-900">
                Limpar dados da base
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-text-secondary">
                Use esta ação para remover dados de demonstração e
                cadastros de teste. Ela preserva usuários, perfis e
                permissões administrativas, para você continuar acessando
                o painel.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border-default bg-background p-4">
                  <h3 className="font-bold text-primary-900">
                    Será removido
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Visitantes, pedidos de oração, histórico, mural,
                    eventos, agenda semanal, exceções, transmissões,
                    avisos, conteúdo, ministérios, departamentos,
                    contribuições, dados da igreja, configurações,
                    notificações e auditoria antiga.
                  </p>
                </div>

                <div className="rounded-lg border border-border-default bg-background p-4">
                  <h3 className="font-bold text-primary-900">
                    Será preservado
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Contas do Supabase Auth, usuários internos, perfis e
                    vínculos de permissão do Admin.
                  </p>
                </div>
              </div>

              <form
                action={clearDemoDatabaseAction}
                className="mt-6 rounded-lg border border-border-default bg-background p-5"
              >
                <label className="block text-sm font-semibold text-text-primary">
                  Digite LIMPAR BASE para confirmar
                  <input
                    name="confirmacao"
                    required
                    autoComplete="off"
                    className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-error focus:ring-2 focus:ring-error/20"
                  />
                </label>

                <div className="mt-5">
                  <ConfirmSubmitButton
                    confirmMessage="Esta ação vai limpar os dados cadastrados e seedados. Deseja continuar?"
                    pendingLabel="Limpando..."
                  >
                    Limpar base
                  </ConfirmSubmitButton>
                </div>
              </form>
            </section>
          ) : null}
        </div>
      </main>
    </>
  );
}
