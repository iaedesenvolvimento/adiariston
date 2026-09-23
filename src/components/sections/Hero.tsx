import Link from "next/link";
import type { PublicChurchInfo } from "@/services/publicData";

interface HeroProps {
  churchInfo: PublicChurchInfo;
}

const heroImageUrl =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=80";

export function Hero({ churchInfo }: HeroProps) {
  return (
    <section
      className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-primary-900 bg-cover bg-center text-white"
      style={{
        backgroundImage: `linear-gradient(90deg, rgb(0 0 0 / 0.72), rgb(0 0 0 / 0.28), rgb(0 0 0 / 0.18)), url(${heroImageUrl})`,
      }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-300 flex-col justify-center px-5 py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-100">
            {churchInfo.mainService}
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-wide sm:text-6xl lg:text-7xl">
            Encontre sua comunidade em {churchInfo.name}
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-white/85">
            Um lugar para pertencer, crescer em fé e viver em comunhão
            com pessoas que caminham juntas.
          </p>

          <div className="mt-10 flex flex-col gap-0 sm:flex-row">
            <Link
              href="/visitante"
              className="inline-flex min-w-48 items-center justify-center bg-primary-600 px-8 py-5 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-primary-700"
            >
              Sou novo
            </Link>

            <Link
              href="/agenda"
              className="inline-flex min-w-48 items-center justify-center bg-slate-700/95 px-8 py-5 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-primary-900"
            >
              Programação
            </Link>
          </div>
        </div>

        <p className="absolute bottom-10 right-5 hidden max-w-xs text-right text-sm font-bold text-white/90 lg:block">
          {churchInfo.address}
        </p>
      </div>
    </section>
  );
}
