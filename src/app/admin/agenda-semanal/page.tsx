import type { ReactNode } from "react";

import { AdminHeader } from "@/components/layout/AdminHeader";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { SubmitButton } from "@/components/ui/SubmitButton";
import {
  listAdminMinistries,
  listAdminScheduleExceptions,
  listAdminWeeklySchedule,
} from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";
import {
  createWeeklyScheduleAction,
  deleteScheduleExceptionAction,
  deleteWeeklyScheduleAction,
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

const inputClass =
  "mt-2 w-full rounded-md border border-border-default px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100";

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR");
}

function formatTime(value: string | null) {
  return value ? value.slice(0, 5) : "";
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label
      className={`block text-sm font-semibold text-text-primary ${className}`}
    >
      {label}
      {children}
    </label>
  );
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

          <div className="mt-3 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-bold text-primary-900 sm:text-4xl">
                Programação semanal
              </h1>
              <p className="mt-3 max-w-2xl text-text-secondary">
                Cadastre a rotina recorrente da igreja e ajuste datas
                específicas sem recriar toda a agenda.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-lg border border-border-default bg-surface px-4 py-3">
                <strong className="block text-xl text-primary-900">
                  {schedules.length}
                </strong>
                <span className="text-text-secondary">recorrências</span>
              </div>
              <div className="rounded-lg border border-border-default bg-surface px-4 py-3">
                <strong className="block text-xl text-primary-900">
                  {exceptions.length}
                </strong>
                <span className="text-text-secondary">exceções</span>
              </div>
              <div className="rounded-lg border border-border-default bg-surface px-4 py-3">
                <strong className="block text-xl text-primary-900">
                  {schedules.filter((schedule) => schedule.ativo).length}
                </strong>
                <span className="text-text-secondary">ativas</span>
              </div>
            </div>
          </div>

          <section className="mt-8 rounded-xl border border-border-default bg-surface p-6 shadow-sm">
            <h2 className="text-xl font-bold text-primary-900">
              Cadastrar programação
            </h2>

            <form action={createWeeklyScheduleAction} className="mt-5">
              <div className="grid gap-5 md:grid-cols-4">
                <Field label="Título" className="md:col-span-2">
                  <input
                    name="titulo"
                    required
                    placeholder="Culto, reunião, ensaio..."
                    className={inputClass}
                  />
                </Field>

                <Field label="Categoria">
                  <select
                    name="categoria"
                    defaultValue="Culto"
                    className={inputClass}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Dia">
                  <select name="diaSemana" required className={inputClass}>
                    {weekDays.map((day, index) => (
                      <option key={day} value={index}>
                        {day}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-4">
                <Field label="Horário">
                  <input
                    name="horario"
                    type="time"
                    required
                    className={inputClass}
                  />
                </Field>

                <Field label="Horário final">
                  <input
                    name="horarioFim"
                    type="time"
                    className={inputClass}
                  />
                </Field>

                <Field label="Início da recorrência">
                  <input
                    name="dataInicio"
                    type="date"
                    required
                    defaultValue={today}
                    className={inputClass}
                  />
                </Field>

                <Field label="Fim da recorrência">
                  <input
                    name="dataFim"
                    type="date"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-4">
                <Field label="Local">
                  <input name="local" className={inputClass} />
                </Field>

                <Field label="Ministério responsável">
                  <select name="ministerioId" className={inputClass}>
                    <option value="">Nenhum</option>
                    {ministries.map((ministry) => (
                      <option key={ministry.id} value={ministry.id}>
                        {ministry.nome}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Ordem">
                  <input
                    name="ordem"
                    type="number"
                    defaultValue="0"
                    className={inputClass}
                  />
                </Field>

                <div className="flex items-end gap-5">
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
              </div>

              <Field label="Descrição" className="mt-5">
                <textarea
                  name="descricao"
                  className={`${inputClass} min-h-24`}
                />
              </Field>

              <div className="mt-6">
                <SubmitButton pendingLabel="Cadastrando...">
                  Cadastrar programação
                </SubmitButton>
              </div>
            </form>
          </section>

          <section className="mt-8 rounded-xl border border-border-default bg-surface p-6 shadow-sm">
            <h2 className="text-xl font-bold text-primary-900">
              Programações cadastradas
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Clique em um item para editar todos os campos ou excluir.
            </p>

            {schedules.length > 0 ? (
              <div className="mt-5 divide-y divide-border-default">
                {schedules.map((schedule) => (
                  <details key={schedule.id} className="group py-4">
                    <summary className="flex cursor-pointer list-none flex-col gap-3 rounded-lg p-3 transition hover:bg-background sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <strong className="text-primary-900">
                            {schedule.titulo}
                          </strong>
                          <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-700">
                            {schedule.categoria}
                          </span>
                          <span className="rounded-full border border-border-default px-3 py-1 text-xs font-bold uppercase tracking-wider text-text-secondary">
                            {schedule.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-text-secondary">
                          {weekDays[schedule.dia_semana]} às{" "}
                          {formatTime(schedule.horario)}
                          {schedule.horario_fim
                            ? ` - ${formatTime(schedule.horario_fim)}`
                            : ""}
                          {schedule.local ? ` • ${schedule.local}` : ""}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-primary-600">
                        Editar
                      </span>
                    </summary>

                    <div className="mt-4 rounded-lg border border-border-default bg-background p-5">
                      <form action={updateWeeklyScheduleAction}>
                        <input
                          type="hidden"
                          name="id"
                          value={schedule.id}
                        />

                        <div className="grid gap-5 md:grid-cols-4">
                          <Field label="Título" className="md:col-span-2">
                            <input
                              name="titulo"
                              required
                              defaultValue={schedule.titulo}
                              className={inputClass}
                            />
                          </Field>

                          <Field label="Categoria">
                            <select
                              name="categoria"
                              defaultValue={schedule.categoria}
                              className={inputClass}
                            >
                              {categories.map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </Field>

                          <Field label="Dia">
                            <select
                              name="diaSemana"
                              defaultValue={schedule.dia_semana}
                              className={inputClass}
                            >
                              {weekDays.map((day, index) => (
                                <option key={day} value={index}>
                                  {day}
                                </option>
                              ))}
                            </select>
                          </Field>
                        </div>

                        <div className="mt-5 grid gap-5 md:grid-cols-4">
                          <Field label="Horário">
                            <input
                              name="horario"
                              type="time"
                              required
                              defaultValue={formatTime(schedule.horario)}
                              className={inputClass}
                            />
                          </Field>

                          <Field label="Horário final">
                            <input
                              name="horarioFim"
                              type="time"
                              defaultValue={formatTime(
                                schedule.horario_fim
                              )}
                              className={inputClass}
                            />
                          </Field>

                          <Field label="Início">
                            <input
                              name="dataInicio"
                              type="date"
                              required
                              defaultValue={schedule.data_inicio}
                              className={inputClass}
                            />
                          </Field>

                          <Field label="Fim">
                            <input
                              name="dataFim"
                              type="date"
                              defaultValue={schedule.data_fim ?? ""}
                              className={inputClass}
                            />
                          </Field>
                        </div>

                        <div className="mt-5 grid gap-5 md:grid-cols-3">
                          <Field label="Local">
                            <input
                              name="local"
                              defaultValue={schedule.local ?? ""}
                              className={inputClass}
                            />
                          </Field>

                          <Field label="Ministério responsável">
                            <select
                              name="ministerioId"
                              defaultValue={schedule.ministerio_id ?? ""}
                              className={inputClass}
                            >
                              <option value="">Nenhum</option>
                              {ministries.map((ministry) => (
                                <option
                                  key={ministry.id}
                                  value={ministry.id}
                                >
                                  {ministry.nome}
                                </option>
                              ))}
                            </select>
                          </Field>

                          <Field label="Ordem">
                            <input
                              name="ordem"
                              type="number"
                              defaultValue={schedule.ordem}
                              className={inputClass}
                            />
                          </Field>
                        </div>

                        <Field label="Descrição" className="mt-5">
                          <textarea
                            name="descricao"
                            defaultValue={schedule.descricao ?? ""}
                            className={`${inputClass} min-h-24`}
                          />
                        </Field>

                        <div className="mt-5 flex flex-wrap gap-5">
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

                        <div className="mt-6">
                          <SubmitButton>Salvar alterações</SubmitButton>
                        </div>
                      </form>

                      <form
                        action={deleteWeeklyScheduleAction}
                        className="mt-4 border-t border-border-default pt-4"
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={schedule.id}
                        />
                        <input
                          type="hidden"
                          name="titulo"
                          value={schedule.titulo}
                        />
                        <ConfirmSubmitButton
                          confirmMessage={`Excluir "${schedule.titulo}" e suas exceções?`}
                        >
                          Excluir programação
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              <EmptyState
                className="mt-5"
                title="Nenhuma programação cadastrada"
                description="Crie o primeiro culto, ensaio ou reunião recorrente no formulário acima."
              />
            )}
          </section>

          <section className="mt-8 rounded-xl border border-border-default bg-surface p-6 shadow-sm">
            <h2 className="text-xl font-bold text-primary-900">
              Exceções de datas
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Use para cancelar ou alterar apenas uma ocorrência.
            </p>

            <form action={upsertScheduleExceptionAction} className="mt-5">
              <div className="grid gap-5 md:grid-cols-4">
                <Field label="Programação" className="md:col-span-2">
                  <select
                    name="programacaoId"
                    required
                    className={inputClass}
                  >
                    <option value="">Selecione</option>
                    {schedules.map((schedule) => (
                      <option key={schedule.id} value={schedule.id}>
                        {schedule.titulo} - {weekDays[schedule.dia_semana]}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Data">
                  <input
                    name="data"
                    type="date"
                    required
                    defaultValue={today}
                    className={inputClass}
                  />
                </Field>

                <Field label="Status">
                  <select
                    name="status"
                    defaultValue="ALTERADA"
                    className={inputClass}
                  >
                    <option value="ALTERADA">Alterada</option>
                    <option value="CANCELADA">Cancelada</option>
                    <option value="NORMAL">Normal</option>
                  </select>
                </Field>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-4">
                <Field label="Novo título">
                  <input
                    name="titulo"
                    placeholder="Opcional"
                    className={inputClass}
                  />
                </Field>

                <Field label="Novo horário">
                  <input
                    name="horario"
                    type="time"
                    className={inputClass}
                  />
                </Field>

                <Field label="Novo horário final">
                  <input
                    name="horarioFim"
                    type="time"
                    className={inputClass}
                  />
                </Field>

                <Field label="Novo local">
                  <input
                    name="local"
                    placeholder="Opcional"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Observação" className="mt-5">
                <input
                  name="descricao"
                  placeholder="Opcional"
                  className={inputClass}
                />
              </Field>

              <div className="mt-6">
                <SubmitButton pendingLabel="Salvando...">
                  Salvar exceção
                </SubmitButton>
              </div>
            </form>

            {exceptions.length > 0 ? (
              <div className="mt-8 divide-y divide-border-default">
                {exceptions.map((exception) => {
                  const schedule = schedules.find(
                    (item) => item.id === exception.programacao_id
                  );

                  return (
                    <details key={exception.id} className="group py-4">
                      <summary className="flex cursor-pointer list-none flex-col gap-3 rounded-lg p-3 transition hover:bg-background sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <strong className="text-primary-900">
                              {exception.titulo ||
                                schedule?.titulo ||
                                "Programação"}
                            </strong>
                            <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-700">
                              {statusLabels[exception.status]}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-text-secondary">
                            {formatDate(exception.data)}
                            {exception.horario
                              ? ` às ${formatTime(exception.horario)}`
                              : ""}
                            {exception.local ? ` • ${exception.local}` : ""}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-primary-600">
                          Editar
                        </span>
                      </summary>

                      <div className="mt-4 rounded-lg border border-border-default bg-background p-5">
                        <form action={upsertScheduleExceptionAction}>
                          <input
                            type="hidden"
                            name="programacaoId"
                            value={exception.programacao_id}
                          />
                          <input
                            type="hidden"
                            name="data"
                            value={exception.data}
                          />

                          <div className="grid gap-5 md:grid-cols-4">
                            <Field label="Status">
                              <select
                                name="status"
                                defaultValue={exception.status}
                                className={inputClass}
                              >
                                <option value="ALTERADA">Alterada</option>
                                <option value="CANCELADA">Cancelada</option>
                                <option value="NORMAL">Normal</option>
                              </select>
                            </Field>

                            <Field label="Título">
                              <input
                                name="titulo"
                                defaultValue={exception.titulo ?? ""}
                                className={inputClass}
                              />
                            </Field>

                            <Field label="Horário">
                              <input
                                name="horario"
                                type="time"
                                defaultValue={formatTime(exception.horario)}
                                className={inputClass}
                              />
                            </Field>

                            <Field label="Horário final">
                              <input
                                name="horarioFim"
                                type="time"
                                defaultValue={formatTime(
                                  exception.horario_fim
                                )}
                                className={inputClass}
                              />
                            </Field>
                          </div>

                          <div className="mt-5 grid gap-5 md:grid-cols-2">
                            <Field label="Local">
                              <input
                                name="local"
                                defaultValue={exception.local ?? ""}
                                className={inputClass}
                              />
                            </Field>

                            <Field label="Observação">
                              <input
                                name="descricao"
                                defaultValue={exception.descricao ?? ""}
                                className={inputClass}
                              />
                            </Field>
                          </div>

                          <div className="mt-6">
                            <SubmitButton>Salvar exceção</SubmitButton>
                          </div>
                        </form>

                        <form
                          action={deleteScheduleExceptionAction}
                          className="mt-4 border-t border-border-default pt-4"
                        >
                          <input
                            type="hidden"
                            name="id"
                            value={exception.id}
                          />
                          <input
                            type="hidden"
                            name="data"
                            value={exception.data}
                          />
                          <ConfirmSubmitButton
                            confirmMessage={`Excluir a exceção de ${formatDate(exception.data)}?`}
                          >
                            Excluir exceção
                          </ConfirmSubmitButton>
                        </form>
                      </div>
                    </details>
                  );
                })}
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </>
  );
}
