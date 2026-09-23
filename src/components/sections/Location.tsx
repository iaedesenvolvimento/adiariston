import Link from "next/link";
import type { PublicChurchInfo } from "@/services/publicData";

interface LocationProps {
  churchInfo: PublicChurchInfo;
}

export function Location({ churchInfo }: LocationProps) {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto grid max-w-300 items-center gap-10 px-5 lg:grid-cols-2">

        {/* Informações */}
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
            Venha nos visitar
          </span>

          <h2 className="mt-3 text-3xl font-bold text-primary-900 sm:text-4xl">
            Será uma alegria receber você.
          </h2>

          <p className="mt-5 max-w-xl leading-7 text-text-secondary">
            Se esta for sua primeira visita, fique à vontade. Nossa
            equipe estará preparada para receber você e sua família.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <p className="text-sm font-semibold text-text-secondary">
                Endereço
              </p>

              <p className="mt-1 font-semibold text-text-primary">
                {churchInfo.address}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-text-secondary">
                Cultos
              </p>

              <p className="mt-1 font-semibold text-text-primary">
                {churchInfo.mainService}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-text-secondary">
                Contato
              </p>

              <p className="mt-1 font-semibold text-text-primary">
                {churchInfo.whatsapp}
              </p>
            </div>
          </div>

          <Link
            href="/contato"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700"
          >
            Entre em contato
          </Link>
        </div>

        {/* Futuro mapa */}
        <div className="flex min-h-95 items-center justify-center rounded-xl border border-border-default bg-surface p-8 shadow-sm">
          <div className="max-w-sm text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-2xl">
              ⌖
            </div>

            <h3 className="mt-5 text-xl font-bold text-primary-900">
              Localização
            </h3>

            <p className="mt-3 leading-7 text-text-secondary">
              Aqui será exibido o mapa com a localização da igreja.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
