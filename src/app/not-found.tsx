import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="conteudo"
      className="flex min-h-120 items-center justify-center bg-background px-5"
    >
      <section className="w-full max-w-xl rounded-xl border border-border-default bg-surface p-8 text-center shadow-card">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
          Página não encontrada
        </span>

        <h1 className="mt-3 text-3xl font-bold text-primary-900">
          Este endereço não existe
        </h1>

        <p className="mt-4 leading-7 text-text-secondary">
          Confira o link acessado ou volte para uma área conhecida do
          site.
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex items-center justify-center rounded-md bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700"
        >
          Voltar ao início
        </Link>
      </section>
    </main>
  );
}
