import { AdminHeader } from "@/components/layout/AdminHeader";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { listAdminChurchData } from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";
import { updateChurchDataAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminChurchDataPage() {
  const admin = await requireAdminProfile([
    "Admin",
    "Leadership",
    "Editor",
  ]);
  const churchData = await listAdminChurchData();

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
            Institucional
          </span>

          <h1 className="mt-3 text-3xl font-bold text-primary-900 sm:text-4xl">
            Dados da igreja
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-text-secondary">
            Atualize dados institucionais usados no site, como nome,
            endereço, WhatsApp, e-mail e demais informações públicas.
          </p>

          <form action={updateChurchDataAction} className="mt-8">
            <div className="grid gap-5 md:grid-cols-2">
              {churchData.map((item) => (
                <section
                  key={item.chave}
                  className="rounded-lg border border-border-default bg-surface p-6 shadow-sm"
                >
                  <input
                    type="hidden"
                    name="chaves"
                    value={item.chave}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <label
                      htmlFor={`valor-${item.chave}`}
                      className="font-bold text-primary-900"
                    >
                      {item.chave}
                    </label>

                    <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                      {item.publico ? "Público" : "Interno"}
                    </span>
                  </div>

                  <textarea
                    id={`valor-${item.chave}`}
                    name={`valor:${item.chave}`}
                    required
                    defaultValue={item.valor}
                    className="mt-4 min-h-24 w-full rounded-md border border-border-default bg-surface px-4 py-3 text-text-primary outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                  />

                  <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-text-primary">
                    <input
                      type="checkbox"
                      name={`publico:${item.chave}`}
                      defaultChecked={item.publico}
                      className="h-4 w-4"
                    />
                    Publicar no site
                  </label>
                </section>
              ))}
            </div>

            <div className="sticky bottom-0 mt-8 border-t border-border-default bg-background py-5">
              <SubmitButton className="w-full md:w-auto">
                Salvar dados da igreja
              </SubmitButton>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
