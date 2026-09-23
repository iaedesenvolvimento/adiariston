import Link from "next/link";

import { AdminHeader } from "@/components/layout/AdminHeader";
import { requireAdmin } from "@/services/auth";

const adminAreas = [
  {
    title: "Visitantes",
    description:
      "Acompanhe pessoas cadastradas e organize o acolhimento.",
    href: "/admin/visitantes",
    status: "Ativo",
  },
  {
    title: "Pedidos de oração",
    description:
      "Visualize pedidos e apoie o fluxo de intercessão.",
    href: "/admin/oracao",
    status: "Ativo",
  },
  {
    title: "Moderação",
    description:
      "Revise pedidos compartilháveis antes de qualquer publicação.",
    href: "/admin/oracao/moderacao",
    status: "Ativo",
  },
  {
    title: "Eventos",
    description:
      "Gerencie a agenda pública e detalhes dos eventos.",
    href: "/admin/eventos",
    status: "Ativo",
  },
  {
    title: "Agenda semanal",
    description:
      "Consulte cultos, reuniões e programações recorrentes.",
    href: "/admin/agenda-semanal",
    status: "Ativo",
  },
  {
    title: "Transmissões",
    description:
      "Gerencie lives do YouTube, gravações e destaques da Home.",
    href: "/admin/transmissoes",
    status: "Ativo",
  },
  {
    title: "Avisos",
    description:
      "Acompanhe comunicados institucionais para o site e a comunidade.",
    href: "/admin/avisos",
    status: "Ativo",
  },
  {
    title: "Conteúdo",
    description:
      "Consulte blocos de conteúdo institucional usados no site.",
    href: "/admin/conteudo",
    status: "Ativo",
  },
  {
    title: "Ministérios",
    description:
      "Organize departamentos e ministérios da comunidade.",
    href: "/admin/ministerios",
    status: "Ativo",
  },
  {
    title: "Contribuições",
    description:
      "Consulte métodos de contribuição publicados no site.",
    href: "/admin/contribuicoes",
    status: "Ativo",
  },
  {
    title: "Dados da igreja",
    description:
      "Revise informações institucionais reutilizáveis no projeto.",
    href: "/admin/dados-igreja",
    status: "Ativo",
  },
  {
    title: "Usuários",
    description:
      "Consulte usuários internos e seus perfis administrativos.",
    href: "/admin/usuarios",
    status: "Ativo",
  },
  {
    title: "Notificações",
    description:
      "Acompanhe avisos internos e eventos relevantes do sistema.",
    href: "/admin/notificacoes",
    status: "Ativo",
  },
  {
    title: "Auditoria",
    description:
      "Revise registros administrativos relevantes.",
    href: "/admin/auditoria",
    status: "Ativo",
  },
  {
    title: "Configurações",
    description:
      "Consulte parâmetros institucionais preparados para gestão.",
    href: "/admin/configuracoes",
    status: "Ativo",
  },
];

export default async function AdminPage() {
  const admin = await requireAdmin();

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <div className="mb-8">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
              Dashboard
            </span>

            <h1 className="mt-3 text-3xl font-bold text-primary-900 sm:text-4xl">
              Painel administrativo
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-text-secondary">
              Base protegida por Supabase Auth e perfis internos. As
              áreas abaixo serão ativadas conforme os módulos
              administrativos forem implementados.
            </p>
          </div>

          <section className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
            <h2 className="text-xl font-bold text-primary-900">
              Sessão autenticada
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-semibold text-text-secondary">
                  Usuário
                </p>

                <p className="mt-1 font-semibold text-text-primary">
                  {admin.name || admin.email}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-text-secondary">
                  E-mail
                </p>

                <p className="mt-1 font-semibold text-text-primary">
                  {admin.email}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-text-secondary">
                  Perfis
                </p>

                <p className="mt-1 font-semibold text-text-primary">
                  {admin.profiles.join(", ")}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-2">
            {adminAreas.map((area) => (
              <article
                key={area.title}
                className="rounded-lg border border-border-default bg-surface p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl font-bold text-primary-900">
                    {area.title}
                  </h2>

                  <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                    {area.status}
                  </span>
                </div>

                <p className="mt-3 leading-7 text-text-secondary">
                  {area.description}
                </p>

                <Link
                  href={area.href}
                  className="mt-5 inline-flex font-semibold text-primary-600 transition hover:text-primary-700"
                >
                  Abrir área →
                </Link>
              </article>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
