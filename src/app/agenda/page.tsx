import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { EmptyState } from "@/components/ui/EmptyState";
import { EventCard } from "@/components/ui/EventCard";
import { PageHero } from "@/components/ui/PageHero";
import { listPublicEvents } from "@/services/publicData";

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const events = await listPublicEvents();

  return (
    <>
      <Header />

      <main className="bg-background">
        <PageHero
          eyebrow="Programação"
          title="Agenda da comunidade"
          description="Confira os próximos encontros públicos, cultos, reuniões e oportunidades para caminhar conosco."
          imageUrl="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1600&q=80"
        />

        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-300 px-5">
            {events.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    day={event.day}
                    month={event.month}
                    title={event.title}
                    time={event.time}
                    location={event.location}
                    href={`/agenda/${event.id}`}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                className="mx-auto max-w-2xl"
                title="Nenhum evento publicado"
                description="Assim que a equipe publicar eventos no painel administrativo, eles aparecerão aqui."
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
