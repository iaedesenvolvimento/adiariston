import { AdminHeader } from "@/components/layout/AdminHeader";
import { listAdminSiteContent } from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";

export const dynamic = "force-dynamic";

export default async function AdminSiteContentPage() {
  const admin = await requireAdminProfile([
    "Admin",
    "Leadership",
    "Editor",
  ]);
  const contents = await listAdminSiteContent();

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
            Site
          </span>

          <h1 className="mt-3 text-3xl font-bold text-primary-900 sm:text-4xl">
            Conteúdo institucional
          </h1>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {contents.map((content) => (
              <article
                key={content.chave}
                className="rounded-lg border border-border-default bg-surface p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl font-bold text-primary-900">
                    {content.titulo}
                  </h2>

                  <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                    {content.publico ? "Público" : "Interno"}
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-text-secondary">
                  {content.chave}
                </p>

                <p className="mt-4 line-clamp-4 leading-7 text-text-secondary">
                  {content.conteudo}
                </p>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
