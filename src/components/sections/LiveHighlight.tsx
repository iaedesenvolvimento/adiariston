import Link from "next/link";

import { YouTubePlayer } from "@/components/ui/YouTubePlayer";
import type { PublicTransmission } from "@/services/publicData";

interface LiveHighlightProps {
  transmission: PublicTransmission | null;
}

const statusLabels: Record<PublicTransmission["status"], string> = {
  AGENDADA: "Próxima transmissão",
  AO_VIVO: "Culto ao vivo",
  ENCERRADA: "Gravação disponível",
  CANCELADA: "Cancelada",
};

export function LiveHighlight({ transmission }: LiveHighlightProps) {
  if (!transmission) {
    return null;
  }

  return (
    <section className="bg-zinc-950 py-14 text-white lg:py-20">
      <div className="mx-auto grid max-w-300 gap-8 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <span className="text-sm font-black uppercase tracking-[0.18em] text-primary-100">
            {transmission.status === "AO_VIVO"
              ? "Ao vivo agora"
              : statusLabels[transmission.status]}
          </span>

          <h2 className="mt-4 text-3xl font-black uppercase tracking-wide sm:text-5xl">
            {transmission.title}
          </h2>

          <p className="mt-5 max-w-xl leading-7 text-white/75">
            {transmission.description}
          </p>

          <Link
            href="/ao-vivo"
            className="mt-7 inline-flex items-center justify-center bg-primary-600 px-6 py-3 font-black uppercase tracking-[0.14em] text-white transition hover:bg-primary-700"
          >
            Assistir transmissão
          </Link>
        </div>

        <YouTubePlayer
          videoId={transmission.youtubeVideoId}
          title={transmission.title}
        />
      </div>
    </section>
  );
}
