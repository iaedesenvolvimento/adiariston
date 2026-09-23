interface LoadingStateProps {
  title?: string;
  description?: string;
}

export function LoadingState({
  title = "Carregando...",
  description = "Aguarde enquanto preparamos as informações.",
}: LoadingStateProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      className="w-full max-w-md rounded-lg border border-border-default bg-surface p-6 text-center shadow-sm"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>

      <h1 className="mt-4 text-xl font-bold text-primary-900">
        {title}
      </h1>

      <p className="mt-2 text-sm leading-6 text-text-secondary">
        {description}
      </p>
    </section>
  );
}
