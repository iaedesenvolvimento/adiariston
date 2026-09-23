import Link from "next/link";

import { AdminHeader } from "@/components/layout/AdminHeader";
import {
  getAdminEvent,
  listAdminEventCategories,
} from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";
import { updateAdminEventAction } from "../actions";

interface AdminEventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

function toDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 16);
}

export default async function AdminEventDetailPage({
  params,
}: AdminEventDetailPageProps) {
  const admin = await requireAdminProfile([
    "Admin",
    "Leadership",
    "Editor",
  ]);
  const { id } = await params;
  const [event, categories] = await Promise.all([
    getAdminEvent(id),
    listAdminEventCategories(),
  ]);

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <Link
            href="/admin/eventos"
            className="font-semibold text-primary-600 transition hover:text-primary-700"
          >
            ← Voltar para eventos
          </Link>

          <form
            action={updateAdminEventAction}
            className="mt-8 rounded-xl border border-border-default bg-surface p-6 shadow-sm"
          >
            <input type="hidden" name="id" value={event.id} />

            <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
              {event.status}
            </span>

            <label className="mt-5 block text-sm font-semibold text-text-primary">
              Título
              <input
                name="titulo"
                required
                defaultValue={event.titulo}
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
                  defaultValue={toDateTimeLocal(event.inicio_em)}
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>

              <label className="block text-sm font-semibold text-text-primary">
                Fim
                <input
                  name="fimEm"
                  type="datetime-local"
                  defaultValue={toDateTimeLocal(event.fim_em)}
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-semibold text-text-primary">
                Categoria
                <select
                  name="categoriaId"
                  defaultValue={event.categoria_id ?? ""}
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
                Status
                <select
                  name="status"
                  defaultValue={event.status}
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                >
                  <option value="RASCUNHO">Rascunho</option>
                  <option value="PUBLICADO">Publicado</option>
                  <option value="ARQUIVADO">Arquivado</option>
                </select>
              </label>
            </div>

            <label className="mt-5 block text-sm font-semibold text-text-primary">
              Local
              <input
                name="local"
                defaultValue={event.local ?? ""}
                className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
            </label>

            <label className="mt-5 block text-sm font-semibold text-text-primary">
              Descrição
              <textarea
                name="descricao"
                defaultValue={event.descricao ?? ""}
                className="mt-2 min-h-36 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
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
