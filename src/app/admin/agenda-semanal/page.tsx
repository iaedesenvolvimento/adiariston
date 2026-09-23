import { AdminHeader } from "@/components/layout/AdminHeader";
import { SubmitButton } from "@/components/ui/SubmitButton";
import {
  listAdminMinistries,
  listAdminScheduleExceptions,
  listAdminWeeklySchedule,
} from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";
import {
  createWeeklyScheduleAction,
  updateWeeklyScheduleAction,
  upsertScheduleExceptionAction,
} from "./actions";

export const dynamic = "force-dynamic";

const weekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const categories = [
  "Culto",
  "Oração",
  "Ensaio",
  "Jovens",
  "Crianças",
  "Reunião",
  "Curso",
  "Comunidade",
];

const statusLabels = {
  NORMAL: "Normal",
  ALTERADA: "Alterada",
  CANCELADA: "Cancelada",
};

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export default async function AdminWeeklySchedulePage() {
  const admin = await requireAdminProfile([
    "Admin",
    "Leadership",
    "Editor",
  ]);
  const [schedules, exceptions, ministries] = await Promise.all([
    listAdminWeeklySchedule(),
    listAdminScheduleExceptions(),
    listAdminMinistries(),
  ]);
  const today = todayInputValue();

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
            Agenda
          </span>

          <h1 className="mt-3 text-3xl font-bold text-primary-900 sm:text-4xl">
            Programação semanal
          </h1>

          <form
            action={createWeeklyScheduleAction}
            className="mt-8 rounded-xl border border-border-default bg-surface p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-primary-900">
              Nova programação
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <label className="block text-sm font-semibold text-text-primary">
                Título
                <input
                  name="titulo"
                  required
                  placeholder="Culto, reunião, ensaio..."
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>

              <label className="block text-sm font-semibold text-text-primary">
                Categoria
                <select
                  name="categoria"
                  defaultValue="Culto"
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-text-primary">
                Dia
                <select
                  name="diaSemana"
                  required
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                >
                  {weekDays.map((day, index) => (
                    <option key={day} value={index}>
                      {day}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-text-primary">
                Horário
                <input
                  name="horario"
                  type="time"
                  required
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-4">
              <label className="block text-sm font-semibold text-text-primary">
                Horário final
                <input
                  name="horarioFim"
                  type="time"
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>

              <label className="block text-sm font-semibold text-text-primary">
                Início da recorrência
                <input
                  name="dataInicio"
                  type="date"
                  required
                  defaultValue={today}
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>

              <label className="block text-sm font-semibold text-text-primary">
                Fim da recorrência
                <input
                  name="dataFim"
                  type="date"
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>

              <label className="block text-sm font-semibold text-text-primary">
                Ordem
                <input
                  name="ordem"
                  type="number"
                  defaultValue="0"
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <label className="block text-sm font-semibold text-text-primary">
                Local
                <input
                  name="local"
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>

              <label className="block text-sm font-semibold text-text-primary">
                Ministério responsável
                <select
                  name="ministerioId"
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                >
                  <option value="">Nenhum</option>
                  {ministries.map((ministry) => (
                    <option key={ministry.id} value={ministry.id}>
                      {ministry.nome}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-text-primary">
                Descrição
                <input
                  name="descricao"
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-5">
              <label className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                <input
                  type="checkbox"
                  name="publico"
                  defaultChecked
                  className="h-4 w-4"
                />
                Público
              </label>

              <label className="flex items-center gap-3 text-sm font-semibold text-text-primary">
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
              <SubmitButton pendingLabel="Cadastrando...">
                Cadastrar programação
              </SubmitButton>
            </div>
          </form>

          <form
            action={upsertScheduleExceptionAction}
            className="mt-8 rounded-xl border border-border-default bg-surface p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-primary-900">
              Alterar uma data específica
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-4">
              <label className="block text-sm font-semibold text-text-primary md:col-span-2">
                Programação
                <select
                  name="programacaoId"
                  required
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                >
                  <option value="">Selecione</option>
                  {schedules.map((schedule) => (
                    <option key={schedule.id} value={schedule.id}>
                      {schedule.titulo} - {weekDays[schedule.dia_semana]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-text-primary">
                Data
                <input
                  name="data"
                  type="date"
                  required
                  defaultValue={today}
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>

              <label className="block text-sm font-semibold text-text-primary">
                Status
                <select
                  name="status"
                  defaultValue="ALTERADA"
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                >
                  <option value="ALTERADA">Alterada</option>
                  <option value="CANCELADA">Cancelada</option>
                  <option value="NORMAL">Normal</option>
                </select>
              </label>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <label className="block text-sm font-semibold text-text-primary">
                Novo título
                <input
                  name="titulo"
                  placeholder="Opcional"
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>

              <label className="block text-sm font-semibold text-text-primary">
                Novo horário
                <input
                  name="horario"
                  type="time"
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>

              <label className="block text-sm font-semibold text-text-primary">
                Novo horário final
                <input
                  name="horarioFim"
                  type="time"
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-semibold text-text-primary">
                Novo local
                <input
                  name="local"
                  placeholder="Opcional"
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>

              <label className="block text-sm font-semibold text-text-primary">
                Observação
                <input
                  name="descricao"
                  placeholder="Opcional"
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </label>
            </div>

            <div className="mt-6">
              <SubmitButton pendingLabel="Salvando...">
                Salvar alteração pontual
              </SubmitButton>
            </div>
          </form>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {schedules.map((schedule) => (
              <form
                key={schedule.id}
                action={updateWeeklyScheduleAction}
                className="rounded-lg border border-border-default bg-surface p-6 shadow-sm"
              >
                <input type="hidden" name="id" value={schedule.id} />

                <div className="flex items-start justify-between gap-4">
                  <label className="block flex-1 text-sm font-semibold text-text-primary">
                    Título
                    <input
                      name="titulo"
                      required
                      defaultValue={schedule.titulo}
                      className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                    />
                  </label>

                  <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                    {schedule.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-semibold text-text-primary">
                    Dia
                    <select
                      name="diaSemana"
                      defaultValue={schedule.dia_semana}
                      className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                    >
                      {weekDays.map((day, index) => (
                        <option key={day} value={index}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm font-semibold text-text-primary">
                    Categoria
                    <select
                      name="categoria"
                      defaultValue={schedule.categoria}
                      className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm font-semibold text-text-primary">
                    Horário
                    <input
                      name="horario"
                      type="time"
                      required
                      defaultValue={schedule.horario.slice(0, 5)}
                      className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                    />
                  </label>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-4">
                  <label className="block text-sm font-semibold text-text-primary">
                    Horário final
                    <input
                      name="horarioFim"
                      type="time"
                      defaultValue={schedule.horario_fim?.slice(0, 5) ?? ""}
                      className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                    />
                  </label>

                  <label className="block text-sm font-semibold text-text-primary">
                    Início
                    <input
                      name="dataInicio"
                      type="date"
                      required
                      defaultValue={schedule.data_inicio}
                      className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                    />
                  </label>

                  <label className="block text-sm font-semibold text-text-primary">
                    Fim
                    <input
                      name="dataFim"
                      type="date"
                      defaultValue={schedule.data_fim ?? ""}
                      className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                    />
                  </label>

                  <label className="block text-sm font-semibold text-text-primary">
                    Ordem
                    <input
                      name="ordem"
                      type="number"
                      defaultValue={schedule.ordem}
                      className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                    />
                  </label>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-semibold text-text-primary">
                    Local
                    <input
                      name="local"
                      defaultValue={schedule.local ?? ""}
                      className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                    />
                  </label>

                  <label className="block text-sm font-semibold text-text-primary">
                    Ministério responsável
                    <select
                      name="ministerioId"
                      defaultValue={schedule.ministerio_id ?? ""}
                      className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                    >
                      <option value="">Nenhum</option>
                      {ministries.map((ministry) => (
                        <option key={ministry.id} value={ministry.id}>
                          {ministry.nome}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="mt-4 block text-sm font-semibold text-text-primary">
                  Descrição
                  <textarea
                    name="descricao"
                    defaultValue={schedule.descricao ?? ""}
                    className="mt-2 min-h-24 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                  />
                </label>

                <div className="mt-4 flex flex-wrap gap-5">
                  <label className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                    <input
                      type="checkbox"
                      name="publico"
                      defaultChecked={schedule.publico}
                      className="h-4 w-4"
                    />
                    Público
                  </label>

                  <label className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                    <input
                      type="checkbox"
                      name="ativo"
                      defaultChecked={schedule.ativo}
                      className="h-4 w-4"
                    />
                    Ativo
                  </label>
                </div>

                <div className="mt-5">
                  <SubmitButton className="w-full">
                    Salvar programação
                  </SubmitButton>
                </div>
              </form>
            ))}
          </div>

          {exceptions.length > 0 ? (
            <section className="mt-10 rounded-xl border border-border-default bg-surface p-6 shadow-sm">
              <h2 className="text-xl font-bold text-primary-900">
                Exceções cadastradas
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {exceptions.map((exception) => {
                  const schedule = schedules.find(
                    (item) => item.id === exception.programacao_id
                  );

                  return (
                    <div
                      key={exception.id}
                      className="rounded-lg border border-border-default p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-primary-900">
                            {exception.titulo ||
                              schedule?.titulo ||
                              "Programação"}
                          </p>
                          <p className="mt-1 text-sm text-text-secondary">
                            {new Date(
                              `${exception.data}T00:00:00`
                            ).toLocaleDateString("pt-BR")}
                            {exception.horario
                              ? ` às ${exception.horario.slice(0, 5)}`
                              : ""}
                          </p>
                        </div>

                        <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-700">
                          {statusLabels[exception.status]}
                        </span>
                      </div>

                      {exception.local ? (
                        <p className="mt-3 text-sm text-text-secondary">
                          {exception.local}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </>
  );
}
