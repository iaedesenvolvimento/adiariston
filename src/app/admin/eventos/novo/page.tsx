import { AdminHeader } from "@/components/layout/AdminHeader";
import { listAdminEventCategories } from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";
import { createAdminEventAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewAdminEventPage() {
  const admin = await requireAdminProfile(["Admin", "Editor"]);
  const categories = await listAdminEventCategories();

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-3xl px-5">
          <h1 className="text-3xl font-bold text-primary-900">
            Novo evento
          </h1>

          <form
            action={createAdminEventAction}
            className="mt-8 rounded-xl border border-border-default bg-surface p-6 shadow-sm"
          >
            <label className="block text-sm font-semibold text-text-primary">
              Título
              <input
                name="titulo"
                required
                className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
            </label>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-semibold text-text-primary">
                Início
                <input
                  name="inicioEm"
                  type="datetime-local"
                  required
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>

              <label className="block text-sm font-semibold text-text-primary">
                Fim
                <input
                  name="fimEm"
                  type="datetime-local"
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-semibold text-text-primary">
                Categoria
                <select
                  name="categoriaId"
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                >
                  <option value="">Sem categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nome}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-text-primary">
                Local
                <input
                  name="local"
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>
            </div>

            <label className="mt-5 block text-sm font-semibold text-text-primary">
              Descrição
              <textarea
                name="descricao"
                className="mt-2 min-h-32 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
            </label>

            <label className="mt-5 block text-sm font-semibold text-text-primary">
              Status
              <select
                name="status"
                className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              >
                <option value="RASCUNHO">Rascunho</option>
                <option value="PUBLICADO">Publicado</option>
              </select>
            </label>

            <button
              type="submit"
              className="mt-8 inline-flex w-full justify-center rounded-md bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700"
            >
              Salvar evento
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
