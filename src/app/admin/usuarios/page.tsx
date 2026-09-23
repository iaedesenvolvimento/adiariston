import Link from "next/link";

import { AdminHeader } from "@/components/layout/AdminHeader";
import { listAdminUsers } from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";

export const dynamic = "force-dynamic";

function extractProfiles(user: Awaited<ReturnType<typeof listAdminUsers>>[number]) {
  return (
    user.usuarios_perfis
      ?.map((item) => {
        const profile = Array.isArray(item.perfis)
          ? item.perfis[0]
          : item.perfis;

        return profile?.nome;
      })
      .filter(Boolean) ?? []
  );
}

export default async function AdminUsuariosPage() {
  const admin = await requireAdminProfile(["Admin"]);
  const users = await listAdminUsers();

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <h1 className="text-3xl font-bold text-primary-900">
            Usuários
          </h1>

          <div className="mt-8 overflow-hidden rounded-xl border border-border-default bg-surface shadow-sm">
            <div className="divide-y divide-border-default">
              {users.map((user) => (
                <article
                  key={user.id}
                  className="grid gap-4 p-5 md:grid-cols-[1fr_auto]"
                >
                  <div>
                    <h2 className="font-bold text-primary-900">
                      {user.nome || user.email}
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                      {user.email} ·{" "}
                      {user.ativo ? "Ativo" : "Inativo"}
                    </p>

                    <p className="mt-2 text-sm text-text-secondary">
                      {extractProfiles(user).join(", ") ||
                        "Sem perfil"}
                    </p>
                  </div>

                  <Link
                    href={`/admin/usuarios/${user.id}`}
                    className="self-center font-semibold text-primary-600 transition hover:text-primary-700"
                  >
                    Ver detalhes →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
