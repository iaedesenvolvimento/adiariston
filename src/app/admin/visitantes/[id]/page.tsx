import Link from "next/link";

import { AdminHeader } from "@/components/layout/AdminHeader";
import { getAdminVisitor } from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";

interface AdminVisitorDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function AdminVisitorDetailPage({
  params,
}: AdminVisitorDetailPageProps) {
  const admin = await requireAdminProfile([
    "Admin",
    "Leadership",
    "Reception",
  ]);
  const { id } = await params;
  const visitor = await getAdminVisitor(id);

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <Link
            href="/admin/visitantes"
            className="font-semibold text-primary-600 transition hover:text-primary-700"
          >
            ← Voltar para visitantes
          </Link>

          <section className="mt-8 rounded-xl border border-border-default bg-surface p-6 shadow-sm">
            <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
              {visitor.status}
            </span>

            <h1 className="mt-5 text-3xl font-bold text-primary-900">
              {visitor.nome_completo}
            </h1>

            <dl className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold text-text-secondary">
                  E-mail
                </dt>
                <dd className="mt-1 font-semibold text-text-primary">
                  {visitor.email}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-text-secondary">
                  WhatsApp
                </dt>
                <dd className="mt-1 font-semibold text-text-primary">
                  {visitor.whatsapp}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-text-secondary">
                  Origem
                </dt>
                <dd className="mt-1 font-semibold text-text-primary">
                  {visitor.origem}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-text-secondary">
                  Autoriza contato
                </dt>
                <dd className="mt-1 font-semibold text-text-primary">
                  {visitor.permite_contato ? "Sim" : "Não"}
                </dd>
              </div>
            </dl>

            {visitor.mensagem && (
              <p className="mt-6 whitespace-pre-wrap leading-7 text-text-primary">
                {visitor.mensagem}
              </p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
