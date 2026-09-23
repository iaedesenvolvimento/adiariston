import Link from "next/link";

export function PrayerCTA() {
  return (
    <section className="bg-surface py-16 lg:py-24">
      <div className="mx-auto max-w-300 px-5">
        <div
          className="overflow-hidden bg-primary-900 bg-cover bg-center px-6 py-12 text-center text-white shadow-card sm:px-10 lg:px-16 lg:py-16"
          style={{
            backgroundImage:
              "linear-gradient(rgb(0 0 0 / 0.72), rgb(0 0 0 / 0.68)), url(https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=80)",
          }}
        >

          {/* Ícone */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl text-white">
            ♡
          </div>

          {/* Conteúdo */}
          <div className="mx-auto mt-6 max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-100">
              Estamos com você
            </span>

            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Podemos orar por você?
            </h2>

            <p className="mt-5 leading-7 text-primary-100">
              Compartilhe seu pedido de oração conosco. Nossa equipe
              receberá sua mensagem com cuidado, respeito e
              confidencialidade.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/oracao"
                className="inline-flex items-center justify-center bg-surface px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-primary-900 transition hover:bg-primary-100"
              >
                Enviar pedido de oração
              </Link>

              <Link
                href="/oracao/mural"
                className="inline-flex items-center justify-center border border-white/40 px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
              >
                Mural de oração
              </Link>
            </div>
          </div>

          {/* Privacidade */}
          <p className="mx-auto mt-7 max-w-xl text-sm leading-6 text-primary-100">
            Você poderá escolher se deseja manter seu pedido privado
            ou permitir seu compartilhamento no mural após moderação.
          </p>

        </div>
      </div>
    </section>
  );
}
