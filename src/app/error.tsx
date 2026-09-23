"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      id="conteudo"
      className="flex min-h-120 items-center justify-center bg-background px-5"
    >
      <section
        role="alert"
        className="w-full max-w-xl rounded-xl border border-border-default bg-surface p-8 text-center shadow-card"
      >
        <span className="text-sm font-semibold uppercase tracking-wider text-error">
          Erro
        </span>

        <h1 className="mt-3 text-3xl font-bold text-primary-900">
          Não foi possível carregar esta página
        </h1>

        <p className="mt-4 leading-7 text-text-secondary">
          Tente novamente. Se o problema continuar, a equipe técnica
          deve revisar os logs do servidor.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700"
          >
            Tentar novamente
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border-default px-5 py-3 font-semibold text-text-primary transition hover:bg-primary-100"
          >
            Voltar ao início
          </Link>
        </div>
      </section>
    </main>
  );
}
