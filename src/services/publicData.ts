import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AdminChurchData,
  AdminContributionMethod,
  AdminEvent,
  AdminScheduleException,
  AdminTransmission,
  AdminWeeklySchedule,
} from "@/types/admin";

export interface PublicChurchInfo {
  name: string;
  address: string;
  whatsapp: string;
  email: string;
  mainService: string;
}

export interface PublicEventListItem {
  id: string;
  day: string;
  month: string;
  title: string;
  time: string;
  location: string;
  href?: string;
  startsAt: string;
  source: "evento" | "programacao";
}

export interface PublicEventDetail extends PublicEventListItem {
  category: string;
  summary: string;
  description: string;
}

export interface PublicTransmission {
  id: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  startsAt: string;
  endsAt: string | null;
  status: AdminTransmission["status"];
  showRecording: boolean;
}

const defaultChurchInfo = {
  name: "IGREJA",
  address: "Rua Exemplo, 123 - Centro",
  whatsapp: "(11) 99999-9999",
  email: "contato@igreja.exemplo",
  mainService: "Domingos às 19:00",
} satisfies PublicChurchInfo;

const weekDays = [
  "Domingos",
  "Segundas-feiras",
  "Terças-feiras",
  "Quartas-feiras",
  "Quintas-feiras",
  "Sextas-feiras",
  "Sábados",
];

function formatSchedule(schedule: AdminWeeklySchedule | null) {
  if (!schedule) {
    return defaultChurchInfo.mainService;
  }

  const day = weekDays[schedule.dia_semana] ?? "Programação";
  return `${day} às ${schedule.horario.slice(0, 5)}`;
}

function mapChurchData(items: AdminChurchData[]) {
  return items.reduce<Record<string, string>>((acc, item) => {
    acc[item.chave] = item.valor;
    return acc;
  }, {});
}

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
});

const publicEventsRangeDays = 45;

function firstRelation<T>(value: T | T[] | null) {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseLocalDate(date: string) {
  return new Date(`${date}T12:00:00`);
}

function mapPublicEvent(event: AdminEvent): PublicEventDetail {
  const startsAt = new Date(event.inicio_em);
  const category = firstRelation(event.categorias_evento);

  return {
    id: event.id,
    day: String(startsAt.getDate()).padStart(2, "0"),
    month: monthFormatter
      .format(startsAt)
      .replace(".", "")
      .toUpperCase(),
    title: event.titulo,
    time: startsAt.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    location: event.local || "Local a definir",
    href: `/agenda/${event.id}`,
    startsAt: event.inicio_em,
    source: "evento",
    category: category?.nome || "Evento",
    summary:
      event.descricao ||
      "Uma programação pública da comunidade.",
    description:
      event.descricao ||
      "Mais detalhes serão informados pela equipe da igreja.",
  };
}

function mapScheduleOccurrence(
  schedule: AdminWeeklySchedule,
  date: Date,
  exception: AdminScheduleException | undefined
): PublicEventDetail | null {
  if (exception?.status === "CANCELADA") {
    return null;
  }

  const dateKey = toDateInputValue(date);
  const time = exception?.horario || schedule.horario;
  const title = exception?.titulo || schedule.titulo;
  const location =
    exception?.local || schedule.local || "Local a definir";
  const description =
    exception?.descricao ||
    schedule.descricao ||
    "Uma programação pública da comunidade.";

  return {
    id: `programacao-${schedule.id}-${dateKey}`,
    day: String(date.getDate()).padStart(2, "0"),
    month: monthFormatter
      .format(date)
      .replace(".", "")
      .toUpperCase(),
    title,
    time: time.slice(0, 5),
    location,
    href: "/agenda",
    startsAt: `${dateKey}T${time}`,
    source: "programacao",
    category: schedule.categoria || "Programação",
    summary: description,
    description,
  };
}

function buildScheduleOccurrences(
  schedules: AdminWeeklySchedule[],
  exceptions: AdminScheduleException[]
) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const exceptionMap = new Map<string, AdminScheduleException>();
  exceptions.forEach((exception) => {
    exceptionMap.set(
      `${exception.programacao_id}:${exception.data}`,
      exception
    );
  });

  const occurrences: PublicEventDetail[] = [];

  for (let offset = 0; offset < publicEventsRangeDays; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const dateKey = toDateInputValue(date);

    schedules.forEach((schedule) => {
      if (schedule.dia_semana !== date.getDay()) {
        return;
      }

      if (schedule.data_inicio && dateKey < schedule.data_inicio) {
        return;
      }

      if (schedule.data_fim && dateKey > schedule.data_fim) {
        return;
      }

      const exception = exceptionMap.get(`${schedule.id}:${dateKey}`);
      const occurrence = mapScheduleOccurrence(
        schedule,
        date,
        exception
      );

      if (occurrence) {
        occurrences.push(occurrence);
      }
    });
  }

  return occurrences;
}

function mapPublicTransmission(
  transmission: AdminTransmission
): PublicTransmission {
  return {
    id: transmission.id,
    title: transmission.titulo,
    description:
      transmission.descricao ||
      "Acompanhe a transmissão oficial da igreja.",
    youtubeVideoId: transmission.youtube_video_id,
    startsAt: transmission.inicio_previsto,
    endsAt: transmission.fim_previsto,
    status: transmission.status,
    showRecording: transmission.exibir_gravacao,
  };
}

function isVisiblePublicTransmission(
  transmission: AdminTransmission
) {
  if (!transmission.ativo || transmission.status === "CANCELADA") {
    return false;
  }

  if (transmission.status === "ENCERRADA") {
    return transmission.exibir_gravacao;
  }

  return true;
}

export async function listPublicEvents() {
  try {
    const supabase = createSupabaseServerClient();
    const today = new Date();
    const rangeEnd = new Date(today);
    rangeEnd.setDate(today.getDate() + publicEventsRangeDays);
    const todayKey = toDateInputValue(today);
    const rangeEndKey = toDateInputValue(rangeEnd);

    const [eventsResult, schedulesResult, exceptionsResult] =
      await Promise.all([
        supabase
          .from("eventos")
          .select(
            "id,categoria_id,titulo,descricao,inicio_em,fim_em,local,status,publicado_em,categorias_evento(nome)"
          )
          .eq("status", "PUBLICADO")
          .gte("inicio_em", today.toISOString())
          .order("inicio_em", { ascending: true }),
        supabase
          .from("programacao_semanal")
          .select(
            "id,titulo,categoria,dia_semana,horario,horario_fim,local,descricao,ministerio_id,data_inicio,data_fim,publico,ativo,ordem"
          )
          .eq("publico", true)
          .eq("ativo", true)
          .order("ordem")
          .order("dia_semana")
          .order("horario"),
        supabase
          .from("excecoes_programacao")
          .select(
            "id,programacao_id,data,status,titulo,horario,horario_fim,local,descricao"
          )
          .gte("data", todayKey)
          .lte("data", rangeEndKey),
      ]);

    if (eventsResult.error) {
      console.warn("[public-data] Eventos públicos indisponíveis.", {
        errorCode: eventsResult.error.code,
      });
    }

    if (schedulesResult.error) {
      console.warn("[public-data] Programação pública indisponível.", {
        errorCode: schedulesResult.error.code,
      });
    }

    if (exceptionsResult.error) {
      console.warn("[public-data] Exceções da programação indisponíveis.", {
        errorCode: exceptionsResult.error.code,
      });
    }

    const events = eventsResult.error
      ? []
      : ((eventsResult.data ?? []) as AdminEvent[]).map(mapPublicEvent);

    const scheduleOccurrences = schedulesResult.error
      ? []
      : buildScheduleOccurrences(
          (schedulesResult.data ?? []) as AdminWeeklySchedule[],
          exceptionsResult.error
            ? []
            : ((exceptionsResult.data ?? []) as AdminScheduleException[])
        );

    return [...events, ...scheduleOccurrences].sort(
      (first, second) =>
        parseLocalDate(first.startsAt.slice(0, 10)).getTime() -
          parseLocalDate(second.startsAt.slice(0, 10)).getTime() ||
        first.time.localeCompare(second.time)
    );
  } catch (error) {
    console.warn("[public-data] Eventos públicos indisponíveis.", {
      errorName:
        error instanceof Error ? error.name : "UnknownError",
    });
    return [];
  }
}

export async function getPublicEvent(id: string) {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("eventos")
      .select(
        "id,categoria_id,titulo,descricao,inicio_em,fim_em,local,status,publicado_em,categorias_evento(nome)"
      )
      .eq("id", id)
      .eq("status", "PUBLICADO")
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapPublicEvent(data as AdminEvent);
  } catch {
    return null;
  }
}

export async function getPublicChurchInfo(): Promise<PublicChurchInfo> {
  try {
    const supabase = createSupabaseServerClient();
    const [dataResult, scheduleResult] = await Promise.all([
      supabase
        .from("dados_igreja")
        .select("chave,valor,publico,updated_at")
        .eq("publico", true),
      supabase
        .from("programacao_semanal")
        .select(
          "id,titulo,categoria,dia_semana,horario,horario_fim,local,descricao,ministerio_id,data_inicio,data_fim,publico,ativo,ordem"
        )
        .eq("publico", true)
        .eq("ativo", true)
        .order("ordem")
        .order("dia_semana")
        .order("horario")
        .limit(1),
    ]);

    if (dataResult.error || scheduleResult.error) {
      console.warn("[public-data] Dados públicos indisponíveis.", {
        dataError: dataResult.error?.code,
        scheduleError: scheduleResult.error?.code,
      });
      return defaultChurchInfo;
    }

    const churchData = mapChurchData(
      (dataResult.data ?? []) as AdminChurchData[]
    );
    const schedule =
      ((scheduleResult.data ?? [])[0] as
        | AdminWeeklySchedule
        | undefined) ?? null;

    return {
      name: churchData["igreja.nome"] || defaultChurchInfo.name,
      address:
        churchData["igreja.endereco"] || defaultChurchInfo.address,
      whatsapp:
        churchData["igreja.whatsapp"] || defaultChurchInfo.whatsapp,
      email: churchData["igreja.email"] || defaultChurchInfo.email,
      mainService: formatSchedule(schedule),
    };
  } catch (error) {
    console.warn("[public-data] Dados públicos indisponíveis.", {
      errorName:
        error instanceof Error ? error.name : "UnknownError",
    });
    return defaultChurchInfo;
  }
}

export async function listPublicContributionMethods() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("metodos_contribuicao")
      .select(
        "id,titulo,descricao,tipo,categoria,tipo_chave_pix,chave,chave_pix,pix_copia_cola,favorecido,instituicao,instrucoes,ativo,ordem"
      )
      .eq("ativo", true)
      .order("ordem")
      .order("titulo");

    if (error) {
      console.warn("[public-data] Métodos de contribuição indisponíveis.", {
        errorCode: error.code,
      });
      return [];
    }

    return (data ?? []) as AdminContributionMethod[];
  } catch (error) {
    console.warn("[public-data] Supabase público indisponível.", {
      errorName:
        error instanceof Error ? error.name : "UnknownError",
    });
    return [];
  }
}

export async function listPublicTransmissions() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("transmissoes")
      .select(
        "id,titulo,descricao,youtube_video_id,inicio_previsto,fim_previsto,status,destacar_home,exibir_gravacao,ativo"
      )
      .eq("ativo", true)
      .neq("status", "CANCELADA")
      .order("inicio_previsto", { ascending: false });

    if (error) {
      console.warn("[public-data] Transmissões indisponíveis.", {
        errorCode: error.code,
      });
      return [];
    }

    return ((data ?? []) as AdminTransmission[])
      .filter(isVisiblePublicTransmission)
      .map(mapPublicTransmission);
  } catch (error) {
    console.warn("[public-data] Transmissões indisponíveis.", {
      errorName:
        error instanceof Error ? error.name : "UnknownError",
    });
    return [];
  }
}

export async function getFeaturedPublicTransmission() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("transmissoes")
      .select(
        "id,titulo,descricao,youtube_video_id,inicio_previsto,fim_previsto,status,destacar_home,exibir_gravacao,ativo"
      )
      .eq("ativo", true)
      .eq("destacar_home", true)
      .neq("status", "CANCELADA")
      .order("inicio_previsto", { ascending: false })
      .limit(3);

    if (error) {
      return null;
    }

    const transmission = ((data ?? []) as AdminTransmission[]).find(
      isVisiblePublicTransmission
    );

    return transmission
      ? mapPublicTransmission(transmission)
      : null;
  } catch {
    return null;
  }
}
