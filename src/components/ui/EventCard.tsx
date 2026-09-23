import Link from "next/link";

interface EventCardProps {
  day: string;
  month: string;
  title: string;
  time: string;
  location: string;
  href?: string;
}

export function EventCard({
  day,
  month,
  title,
  time,
  location,
  href = "/agenda",
}: EventCardProps) {
  return (
    <article className="flex h-full flex-col border border-border-default bg-surface p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card">
      <div className="mb-6 flex items-start gap-5">

        {/* Data */}
        <div className="flex min-w-16 flex-col items-center bg-primary-100 px-3 py-3">
          <span className="text-2xl font-black text-primary-900">
            {day}
          </span>

          <span className="text-xs font-semibold uppercase text-primary-700">
            {month}
          </span>
        </div>

        {/* Informações */}
        <div>
          <h3 className="text-lg font-black text-text-primary">
            {title}
          </h3>

          <p className="mt-2 text-sm text-text-secondary">
            {time}
          </p>

          <p className="mt-1 text-sm text-text-secondary">
            {location}
          </p>
        </div>
      </div>

      <Link
        href={href}
        className="mt-auto text-sm font-black uppercase tracking-[0.14em] text-primary-600 transition hover:text-primary-700"
      >
        Ver detalhes →
      </Link>
    </article>
  );
}
