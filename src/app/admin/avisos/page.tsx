import { AdminHeader } from "@/components/layout/AdminHeader";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { listAdminAnnouncements } from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";
import {
  createAnnouncementAction,
  updateAnnouncementAction,
} from "./actions";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function toDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 16);
}

export default async function AdminAnnouncementsPage() {
  const admin = await requireAdminProfile([
    "Admin",
    "Leadership",
    "Editor",
  ]);
  const announcements = await listAdminAnnouncements();

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
            Comunicação
          </span>

          <h1 className="mt-3 text-3xl font-bold text-primary-900 sm:text-4xl">
            Avisos
          </h1>

          <form
            action={createAnnouncementAction}
            className="mt-8 rounded-xl border border-border-default bg-surface p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-primary-900">
              Novo aviso
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-semibold text-text-primary">
                Título
                <input
                  name="titulo"
                  required
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>

              <label className="block text-sm font-semibold text-text-primary">
                Publicar em
                <input
                  name="publicadoEm"
                  type="datetime-local"
                  defaultValue={new Date().toISOString().slice(0, 16)}
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>
            </div>

            <label className="mt-5 block text-sm font-semibold text-text-primary">
              Mensagem
              <textarea
                name="mensagem"
                required
                className="mt-2 min-h-28 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
            </label>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <label className="block text-sm font-semibold text-text-primary">
                Expira em
                <input
                  name="expiraEm"
                  type="datetime-local"
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>

              <label className="flex items-center gap-3 pt-8 text-sm font-semibold text-text-primary">
                <input
                  type="checkbox"
                  name="publico"
                  defaultChecked
                  className="h-4 w-4"
                />
                Público
              </label>

              <label className="flex items-center gap-3 pt-8 text-sm font-semibold text-text-primary">
                <input
                  type="checkbox"
                  name="ativo"
                  defaultChecked
                  className="h-4 w-4"
                />
                Ativo
              </label>
            </div>

            <div className="mt-6">
              <SubmitButton pendingLabel="Publicando...">
                Publicar aviso
              </SubmitButton>
            </div>
          </form>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {announcements.map((announcement) => (
              <form
                key={announcement.id}
                action={updateAnnouncementAction}
                className="rounded-lg border border-border-default bg-surface p-6 shadow-sm"
              >
                <input type="hidden" name="id" value={announcement.id} />

                <div className="flex items-start justify-between gap-4">
                  <label className="block flex-1 text-sm font-semibold text-text-primary">
                    Título
                    <input
                      name="titulo"
                      required
                      defaultValue={announcement.titulo}
                      className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                    />
                  </label>

                  <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                    {announcement.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>

                <label className="mt-4 block text-sm font-semibold text-text-primary">
                  Mensagem
                  <textarea
                    name="mensagem"
                    required
                    defaultValue={announcement.mensagem}
                    className="mt-2 min-h-28 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                  />
                </label>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-semibold text-text-primary">
                    Publicar em
                    <input
                      name="publicadoEm"
                      type="datetime-local"
                      defaultValue={toDateTimeLocal(
                        announcement.publicado_em
                      )}
                      className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                    />
                  </label>

                  <label className="block text-sm font-semibold text-text-primary">
                    Expira em
                    <input
                      name="expiraEm"
                      type="datetime-local"
                      defaultValue={toDateTimeLocal(
                        announcement.expira_em
                      )}
                      className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                    />
                  </label>
                </div>

                <p className="mt-4 text-sm font-semibold text-text-secondary">
                  Publicação atual:{" "}
                  {announcement.publicado_em
                    ? dateFormatter.format(
                        new Date(announcement.publicado_em)
                      )
                    : "não publicada"}
                </p>

                <div className="mt-4 flex flex-wrap gap-5">
                  <label className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                    <input
                      type="checkbox"
                      name="publico"
                      defaultChecked={announcement.publico}
                      className="h-4 w-4"
                    />
                    Público
                  </label>

                  <label className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                    <input
                      type="checkbox"
                      name="ativo"
                      defaultChecked={announcement.ativo}
                      className="h-4 w-4"
                    />
                    Ativo
                  </label>
                </div>

                <div className="mt-5">
                  <SubmitButton className="w-full">
                    Salvar aviso
                  </SubmitButton>
                </div>
              </form>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
