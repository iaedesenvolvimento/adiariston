import { AdminHeader } from "@/components/layout/AdminHeader";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { listAdminWeeklySchedule } from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";
import {
  createWeeklyScheduleAction,
  updateWeeklyScheduleAction,
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

export default async function AdminWeeklySchedulePage() {
  const admin = await requireAdminProfile([
    "Admin",
    "Leadership",
    "Editor",
  ]);
  const schedules = await listAdminWeeklySchedule();

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

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-semibold text-text-primary">
                Local
                <input
                  name="local"
                  className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
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

                <label className="mt-4 block text-sm font-semibold text-text-primary">
                  Local
                  <input
                    name="local"
                    defaultValue={schedule.local ?? ""}
                    className="mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                  />
                </label>

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
        </div>
      </main>
    </>
  );
}
