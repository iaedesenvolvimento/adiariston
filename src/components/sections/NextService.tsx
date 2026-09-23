import Link from "next/link";
import type { PublicChurchInfo } from "@/services/publicData";

interface NextServiceProps {
  churchInfo: PublicChurchInfo;
}

export function NextService({ churchInfo }: NextServiceProps) {
  const [dayLabel, timeLabel = ""] =
    churchInfo.mainService.split(" às ");

  return (
    <section className="bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-300 px-5">
        <div className="overflow-hidden rounded-xl bg-primary-900 shadow-card">
          <div className="grid items-center gap-8 p-8 lg:grid-cols-[1fr_auto] lg:p-10">

            {/* Informações */}
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary-100">
                Próximo culto
              </span>

              <h2 className="mt-3 text-3xl font-bold text-white">
                Celebração de Domingo
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-primary-100">
                Um momento de fé, comunhão e adoração. Venha participar
                conosco e traga sua família.
              </p>

              {/* Data e horário */}
              <div className="mt-7 flex flex-wrap gap-6">
                <div>
                  <p className="text-sm text-primary-100">
                    Data
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {dayLabel || "Domingo"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-primary-100">
                    Horário
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {timeLabel || "19:00"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-primary-100">
                    Local
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {churchInfo.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Ação */}
            <div>
              <Link
                href="/agenda"
                className="inline-flex w-full items-center justify-center rounded-md bg-surface px-6 py-3.5 font-semibold text-primary-900 transition hover:bg-primary-100 lg:w-auto"
              >
                Ver programação
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
