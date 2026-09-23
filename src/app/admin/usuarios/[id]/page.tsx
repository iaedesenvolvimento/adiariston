import Link from "next/link";

import { AdminHeader } from "@/components/layout/AdminHeader";
import { getAdminUser } from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";

interface AdminUserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function AdminUserDetailPage({
  params,
}: AdminUserDetailPageProps) {
  const admin = await requireAdminProfile(["Admin"]);
  const { id } = await params;
  const user = await getAdminUser(id);

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <Link
            href="/admin/usuarios"
            className="font-semibold text-primary-600 transition hover:text-primary-700"
          >
            ← Voltar para usuários
          </Link>

          <section className="mt-8 rounded-xl border border-border-default bg-surface p-6 shadow-sm">
            <h1 className="text-3xl font-bold text-primary-900">
              {user.nome || user.email}
            </h1>

            <dl className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold text-text-secondary">
                  E-mail
                </dt>
                <dd className="mt-1 font-semibold text-text-primary">
                  {user.email}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-text-secondary">
                  Status
                </dt>
                <dd className="mt-1 font-semibold text-text-primary">
                  {user.ativo ? "Ativo" : "Inativo"}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </main>
    </>
  );
}
