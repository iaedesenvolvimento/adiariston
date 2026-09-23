import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHero } from "@/components/ui/PageHero";

const privacyTopics = [
  {
    title: "Dados coletados",
    text: "Podemos receber nome, WhatsApp, e-mail, origem do contato e mensagens enviadas voluntariamente em formulários públicos.",
  },
  {
    title: "Finalidade",
    text: "Os dados são usados para acolhimento, contato relacionado às atividades da igreja e organização do acompanhamento quando solicitado.",
  },
  {
    title: "Consentimentos",
    text: "O aceite da política de privacidade e a autorização para contato são controles separados. Autorizar contato não é obrigatório para enviar o formulário de visitante.",
  },
  {
    title: "Acesso e cuidado",
    text: "O acesso administrativo deve ser restrito a pessoas autorizadas, com autenticação, permissões e políticas de segurança apropriadas.",
  },
];

export default function PrivacidadePage() {
  return (
    <>
      <Header />

      <main className="bg-background">
        <PageHero
          eyebrow="Privacidade"
          title="Política de Privacidade"
          description="Diretrizes iniciais sobre cuidado, uso responsável e proteção dos dados compartilhados com a igreja."
          imageUrl="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80"
        />

        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-300 px-5">
            <div className="grid gap-6 md:grid-cols-2">
              {privacyTopics.map((topic) => (
                <article
                  key={topic.title}
                  className="rounded-lg border border-border-default bg-surface p-6 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-primary-900">
                    {topic.title}
                  </h2>

                  <p className="mt-3 leading-7 text-text-secondary">
                    {topic.text}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-10 rounded-lg border border-border-default bg-surface p-6 shadow-sm">
              <h2 className="text-xl font-bold text-primary-900">
                Solicitações sobre dados
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-text-secondary">
                Quando o processo administrativo estiver completo, a igreja
                deverá oferecer um caminho claro para correção, consulta ou
                exclusão de dados pessoais conforme aplicável.
              </p>

              <Link
                href="/contato"
                className="mt-6 inline-flex font-semibold text-primary-600 transition hover:text-primary-700"
              >
                Falar com a igreja →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
