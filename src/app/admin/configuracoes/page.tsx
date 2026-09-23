import { AdminHeader } from "@/components/layout/AdminHeader";
import { listAdminSettings } from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const admin = await requireAdminProfile([
    "Admin",
    "Leadership",
    "Editor",
  ]);
  const settings = await listAdminSettings();

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
        </div>
      </main>
    </>
  );
}
