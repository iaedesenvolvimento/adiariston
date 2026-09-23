import { AdminHeader } from "@/components/layout/AdminHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/Textarea";
import { listAdminTransmissions } from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";

import {
  createTransmissionAction,
  updateTransmissionAction,
} from "./actions";

export const dynamic = "force-dynamic";

const statusOptions = [
  { value: "AGENDADA", label: "Agendada" },
  { value: "AO_VIVO", label: "Ao vivo" },
  { value: "ENCERRADA", label: "Encerrada" },
  { value: "CANCELADA", label: "Cancelada" },
];

const statusLabels: Record<string, string> = {
  AGENDADA: "Agendada",
  AO_VIVO: "Ao vivo",
  ENCERRADA: "Encerrada",
  CANCELADA: "Cancelada",
};

function toDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 16);
}

export default async function AdminTransmissionsPage() {
  const admin = await requireAdminProfile([
    "Admin",
    "Leadership",
    "Editor",
  ]);
  const transmissions = await listAdminTransmissions();

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
            Programação
          </span>

          <h1 className="mt-3 text-3xl font-bold text-primary-900 sm:text-4xl">
            Transmissões e lives
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-text-secondary">
            Cadastre cultos ao vivo, conferências e gravações usando
            apenas URLs ou IDs válidos do YouTube. O sistema monta o
            player de forma controlada.
          </p>

          <form
            action={createTransmissionAction}
            className="mt-8 rounded-lg border border-border-default bg-surface p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-primary-900">
              Nova transmissão
            </h2>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <Input
                id="nova-transmissao-titulo"
                name="titulo"
                label="Título"
                placeholder="Culto ao vivo"
                required
              />

              <Input
                id="nova-transmissao-youtube"
                name="youtube"
                label="URL ou ID do YouTube"
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />

              <Input
                id="nova-transmissao-inicio"
                name="inicioPrevisto"
                label="Início previsto"
                type="datetime-local"
                required
              />

              <Input
                id="nova-transmissao-fim"
                name="fimPrevisto"
                label="Fim previsto"
                type="datetime-local"
              />

              <Select
                id="nova-transmissao-status"
                name="status"
                label="Status"
                options={statusOptions}
                defaultValue="AGENDADA"
              />

              <Textarea
                id="nova-transmissao-descricao"
                name="descricao"
                label="Descrição"
                className="lg:col-span-2"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-5">
              <label className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                <input
                  name="destacarHome"
                  type="checkbox"
                  className="size-4 accent-primary-600"
                />
                Destacar na Home
              </label>

              <label className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                <input
                  name="exibirGravacao"
                  type="checkbox"
                  className="size-4 accent-primary-600"
                />
                Exibir gravação após encerrar
              </label>

              <label className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                <input
                  name="ativo"
                  type="checkbox"
                  defaultChecked
                  className="size-4 accent-primary-600"
                />
                Ativo
              </label>
            </div>

            <div className="mt-6">
              <SubmitButton pendingLabel="Cadastrando...">
                Cadastrar transmissão
              </SubmitButton>
            </div>
          </form>

          <section className="mt-8 grid gap-5">
            {transmissions.length > 0 ? (
              transmissions.map((transmission) => (
                <form
                  key={transmission.id}
                  action={updateTransmissionAction}
                  className="rounded-lg border border-border-default bg-surface p-6 shadow-sm"
                >
                  <input
                    type="hidden"
                    name="id"
                    value={transmission.id}
                  />

                  <div className="flex flex-col gap-3 border-b border-border-default pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                        {statusLabels[transmission.status] ??
                          transmission.status}
                      </span>

                      <h2 className="mt-3 text-xl font-bold text-primary-900">
                        {transmission.titulo}
                      </h2>
                    </div>

                    <span className="w-fit rounded-full border border-border-default px-3 py-1 text-sm font-semibold text-text-secondary">
                      {transmission.ativo ? "Ativa" : "Inativa"}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    <Input
                      id={`titulo-${transmission.id}`}
                      name="titulo"
                      label="Título"
                      defaultValue={transmission.titulo}
                      required
                    />

                    <Input
                      id={`youtube-${transmission.id}`}
                      name="youtube"
                      label="URL ou ID do YouTube"
                      defaultValue={transmission.youtube_video_id}
                      required
                    />

                    <Input
                      id={`inicio-${transmission.id}`}
                      name="inicioPrevisto"
                      label="Início previsto"
                      type="datetime-local"
                      defaultValue={toDateTimeLocal(
                        transmission.inicio_previsto
                      )}
                      required
                    />

                    <Input
                      id={`fim-${transmission.id}`}
                      name="fimPrevisto"
                      label="Fim previsto"
                      type="datetime-local"
                      defaultValue={toDateTimeLocal(
                        transmission.fim_previsto
                      )}
                    />

                    <Select
                      id={`status-${transmission.id}`}
                      name="status"
                      label="Status"
                      options={statusOptions}
                      defaultValue={transmission.status}
                    />

                    <Textarea
                      id={`descricao-${transmission.id}`}
                      name="descricao"
                      label="Descrição"
                      className="lg:col-span-2"
                      defaultValue={transmission.descricao ?? ""}
                    />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-5">
                    <label className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                      <input
                        name="destacarHome"
                        type="checkbox"
                        defaultChecked={transmission.destacar_home}
                        className="size-4 accent-primary-600"
                      />
                      Destacar na Home
                    </label>

                    <label className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                      <input
                        name="exibirGravacao"
                        type="checkbox"
                        defaultChecked={transmission.exibir_gravacao}
                        className="size-4 accent-primary-600"
                      />
                      Exibir gravação
                    </label>

                    <label className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                      <input
                        name="ativo"
                        type="checkbox"
                        defaultChecked={transmission.ativo}
                        className="size-4 accent-primary-600"
                      />
                      Ativo
                    </label>
                  </div>

                  <div className="mt-6">
                    <SubmitButton>Salvar transmissão</SubmitButton>
                  </div>
                </form>
              ))
            ) : (
              <EmptyState
                title="Nenhuma transmissão cadastrada"
                description="Cadastre a primeira live para exibir em /ao-vivo e, quando destacado, na Home."
              />
            )}
          </section>
        </div>
      </main>
    </>
  );
}
