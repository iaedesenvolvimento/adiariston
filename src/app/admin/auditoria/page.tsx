import { AdminHeader } from "@/components/layout/AdminHeader";
import { listAdminAuditLogs } from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const admin = await requireAdminProfile(["Admin"]);
  const logs = await listAdminAuditLogs();

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <h1 className="text-3xl font-bold text-primary-900">
            Auditoria
          </h1>

          <div className="mt-8 overflow-hidden rounded-xl border border-border-default bg-surface shadow-sm">
            {logs.length > 0 ? (
              <div className="divide-y divide-border-default">
                {logs.map((log) => {
                  const user = Array.isArray(log.usuarios)
                    ? log.usuarios[0]
                    : log.usuarios;

                  return (
                    <article key={log.id} className="p-5">
                      <p className="font-bold text-primary-900">
                        {log.acao}
                      </p>

                      <p className="mt-1 text-sm text-text-secondary">
                        {log.entidade_tipo}
                        {user?.email ? ` · ${user.email}` : ""}
                      </p>

                      {log.resumo && (
                        <p className="mt-3 leading-7 text-text-primary">
                          {log.resumo}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-text-secondary">
                Nenhum log registrado.
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
