import Link from "next/link";

interface EmptyStateProps {
  eyebrow?: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}

export function EmptyState({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  className = "",
}: EmptyStateProps) {
  return (
    <section
      className={`rounded-lg border border-border-default bg-surface p-8 text-center shadow-sm ${className}`}
    >
      {eyebrow && (
        <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
          {eyebrow}
        </span>
      )}

      <h2 className="mt-2 text-2xl font-bold text-primary-900">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-2xl leading-7 text-text-secondary">
        {description}
      </p>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
        >
          {actionLabel}
        </Link>
      )}
    </section>
  );
}
