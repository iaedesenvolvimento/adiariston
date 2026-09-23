import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHero } from "@/components/ui/PageHero";
import { getPublicChurchInfo } from "@/services/publicData";

export const dynamic = "force-dynamic";

export default async function ContatoPage() {
  const churchInfo = await getPublicChurchInfo();

  return (
    <>
      <Header />

      <main className="bg-background">
        <PageHero
          eyebrow="Contato"
          title="Fale com a igreja"
          description="Para dúvidas, visitas ou informações sobre a programação, entre em contato pelos canais oficiais."
          imageUrl="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1600&q=80"
        />

        <section className="py-14 lg:py-20">
          <div className="mx-auto grid max-w-300 gap-10 px-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-wide text-primary-900">
                Canais oficiais
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  title: "Endereço",
                  text: churchInfo.address,
                },
                {
                  title: "Cultos",
                  text: churchInfo.mainService,
                },
                {
                  title: "WhatsApp",
                  text: churchInfo.whatsapp,
                },
                {
                  title: "E-mail",
                  text: churchInfo.email,
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="rounded-lg border border-border-default bg-surface p-6 shadow-sm"
                >
                  <h2 className="font-bold text-primary-900">
                    {item.title}
                  </h2>

                  <p className="mt-2 leading-7 text-text-secondary">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface py-14 lg:py-20">
          <div className="mx-auto max-w-300 px-5">
            <div className="rounded-xl bg-primary-900 p-8 text-white shadow-card lg:p-10">
              <h2 className="text-2xl font-bold">
                É sua primeira visita?
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-primary-100">
                Você pode preencher o formulário de visitante para que a
                equipe de acolhimento saiba como receber você.
              </p>

              <Link
                href="/visitante"
                className="mt-7 inline-flex items-center justify-center rounded-md bg-surface px-6 py-3 font-semibold text-primary-900 transition hover:bg-primary-100"
              >
                Sou Visitante
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
