import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { YouTubePlayer } from "@/components/ui/YouTubePlayer";
import { listPublicTransmissions } from "@/services/publicData";

export const dynamic = "force-dynamic";

const statusLabels = {
  AGENDADA: "Agendada",
  AO_VIVO: "Ao vivo",
  ENCERRADA: "Gravação",
  CANCELADA: "Cancelada",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "full",
  timeStyle: "short",
});

export default async function LivePage() {
  const transmissions = await listPublicTransmissions();
  const mainTransmission =
    transmissions.find((item) => item.status === "AO_VIVO") ??
    transmissions[0] ??
    null;

  return (
    <>
      <Header />

      <main className="bg-background">
        <PageHero
          eyebrow="Ao vivo"
          title="Transmissões da igreja"
          description="Acompanhe cultos, conferências e gravações oficiais publicadas pela equipe."
          imageUrl="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80"
        />

        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-300 px-5">
            {mainTransmission ? (
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <YouTubePlayer
                    videoId={mainTransmission.youtubeVideoId}
                    title={mainTransmission.title}
                  />
                </div>

                <aside className="rounded-lg border border-border-default bg-surface p-6 shadow-sm">
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                    {statusLabels[mainTransmission.status]}
                  </span>

                  <h2 className="mt-4 text-2xl font-bold text-primary-900">
                    {mainTransmission.title}
                  </h2>

                  <p className="mt-3 leading-7 text-text-secondary">
                    {mainTransmission.description}
                  </p>

                  <p className="mt-5 text-sm font-semibold text-text-secondary">
                    Início previsto
                  </p>
                  <p className="mt-1 font-bold text-primary-900">
                    {dateFormatter.format(
                      new Date(mainTransmission.startsAt)
                    )}
                  </p>
                </aside>
              </div>
            ) : (
              <EmptyState
                title="Nenhuma transmissão disponível"
                description="Quando a equipe publicar uma live ou gravação, ela aparecerá aqui."
              />
            )}

            {transmissions.length > 1 && (
              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {transmissions
                  .filter((item) => item.id !== mainTransmission?.id)
                  .map((transmission) => (
                    <article
                      key={transmission.id}
                      className="rounded-lg border border-border-default bg-surface p-5 shadow-sm"
                    >
                      <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                        {statusLabels[transmission.status]}
                      </span>

                      <h3 className="mt-4 text-xl font-bold text-primary-900">
                        {transmission.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-text-secondary">
                        {dateFormatter.format(
                          new Date(transmission.startsAt)
                        )}
                      </p>
                    </article>
                  ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
