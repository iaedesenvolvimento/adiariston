import { AdminHeader } from "@/components/layout/AdminHeader";
import {
  listAdminDepartments,
  listAdminMinistries,
} from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";

export const dynamic = "force-dynamic";

function firstRelation<T>(value: T | T[] | null) {
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default async function AdminMinistriesPage() {
  const admin = await requireAdminProfile([
    "Admin",
    "Leadership",
    "Editor",
  ]);
  const [departments, ministries] = await Promise.all([
    listAdminDepartments(),
    listAdminMinistries(),
  ]);

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
            Ministérios
          </span>

          <h1 className="mt-3 text-3xl font-bold text-primary-900 sm:text-4xl">
            Departamentos e ministérios
          </h1>

          <section className="mt-8 rounded-lg border border-border-default bg-surface p-6 shadow-sm">
            <h2 className="text-xl font-bold text-primary-900">
              Departamentos
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {departments.map((department) => (
                <article
                  key={department.id}
                  className="rounded-md border border-border-default bg-background p-4"
                >
                  <h3 className="font-bold text-primary-900">
                    {department.nome}
                  </h3>

                  <p className="mt-2 text-sm text-text-secondary">
                    {department.descricao || "Sem descrição"}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-5 md:grid-cols-2">
            {ministries.map((ministry) => {
              const department = firstRelation(
                ministry.departamentos
              );

              return (
                <article
                  key={ministry.id}
                  className="rounded-lg border border-border-default bg-surface p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-bold text-primary-900">
                      {ministry.nome}
                    </h2>

                    <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                      {ministry.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-text-secondary">
                    {department?.nome || "Sem departamento"}
                  </p>

                  {ministry.descricao && (
                    <p className="mt-3 leading-7 text-text-secondary">
                      {ministry.descricao}
                    </p>
                  )}
                </article>
              );
            })}
          </section>
        </div>
      </main>
    </>
  );
}
