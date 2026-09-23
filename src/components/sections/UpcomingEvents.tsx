import Link from "next/link";
import { EventCard } from "@/components/ui/EventCard";
import { publicEvents } from "@/data/publicContent";

export function UpcomingEvents() {
  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-300 px-5">

        {/* Cabeçalho */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
              Nossa agenda
            </span>

            <h2 className="mt-2 text-3xl font-bold text-primary-900">
              Próximos eventos
            </h2>

            <p className="mt-3 max-w-xl text-text-secondary">
              Confira o que está acontecendo em nossa comunidade
              e participe conosco.
            </p>
          </div>

          <Link
            href="/agenda"
            className="font-semibold text-primary-600 transition hover:text-primary-700"
          >
            Ver agenda completa →
          </Link>
        </div>

        {/* Eventos */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {publicEvents.map((event) => (
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

      </div>
    </section>
  );
}
