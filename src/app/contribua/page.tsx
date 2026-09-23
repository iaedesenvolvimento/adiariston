import Image from "next/image";

import { CopyButton } from "@/components/ui/CopyButton";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHero } from "@/components/ui/PageHero";
import { listPublicContributionMethods } from "@/services/publicData";
import type { AdminContributionMethod } from "@/types/admin";

export const dynamic = "force-dynamic";

const categoryLabels: Record<
  AdminContributionMethod["categoria"],
  string
> = {
  dizimo: "Dízimo",
  oferta: "Oferta",
  outro: "Outro",
};

const pixKeyTypeLabels: Record<string, string> = {
  cpf_cnpj: "CPF/CNPJ",
  email: "E-mail",
  telefone: "Telefone",
  aleatoria: "Chave aleatória",
};

function getQrCodeUrl(payload: string) {
  const encodedPayload = encodeURIComponent(payload);
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodedPayload}`;
}

function getPixPayload(method: AdminContributionMethod) {
  return (
    method.pix_copia_cola ||
    method.chave_pix ||
    method.chave ||
    ""
  );
}

function ContributionMethodCard({
  method,
}: {
  method: AdminContributionMethod;
}) {
  const pixPayload = getPixPayload(method);
  const pixKey = method.chave_pix || method.chave;

  return (
    <article className="rounded-lg border border-border-default bg-surface p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold uppercase text-primary-700">
            {categoryLabels[method.categoria] ?? "Contribuição"}
          </span>

          <h2 className="mt-4 text-2xl font-bold text-primary-900">
            {method.titulo}
          </h2>
        </div>

        <span className="w-fit rounded-full border border-border-default px-3 py-1 text-sm font-semibold uppercase text-text-secondary">
          {method.tipo}
        </span>
      </div>

      {method.descricao && (
        <p className="mt-4 leading-7 text-text-secondary">
          {method.descricao}
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        {pixPayload ? (
          <div className="rounded-lg border border-border-default bg-background p-4 text-center">
            <Image
              src={getQrCodeUrl(pixPayload)}
              alt={`QR Code para ${method.titulo}`}
              width={220}
              height={220}
              className="mx-auto aspect-square w-full max-w-55"
            />
            <p className="mt-3 text-sm text-text-secondary">
              QR Code gerado a partir da configuração publicada.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border-default bg-background p-5 text-sm text-text-secondary">
            QR Code indisponível enquanto a chave ou o PIX Copia e Cola
            não estiverem configurados.
          </div>
        )}

        <div className="space-y-4">
          {pixKey && (
            <div className="rounded-lg border border-border-default bg-background p-4">
              <p className="text-sm font-semibold text-text-secondary">
                Chave PIX
                {method.tipo_chave_pix
                  ? ` · ${pixKeyTypeLabels[method.tipo_chave_pix] ?? method.tipo_chave_pix}`
                  : ""}
              </p>
              <p className="mt-2 break-words font-bold text-primary-900">
                {pixKey}
              </p>
              <div className="mt-4">
                <CopyButton value={pixKey} label="Copiar chave" />
              </div>
            </div>
          )}

          {method.pix_copia_cola && (
            <div className="rounded-lg border border-border-default bg-background p-4">
              <p className="text-sm font-semibold text-text-secondary">
                PIX Copia e Cola
              </p>
              <p className="mt-2 max-h-32 overflow-auto break-words text-sm font-semibold text-primary-900">
                {method.pix_copia_cola}
              </p>
              <div className="mt-4">
                <CopyButton
                  value={method.pix_copia_cola}
                  label="Copiar código"
                />
              </div>
            </div>
          )}

          {(method.favorecido || method.instituicao) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {method.favorecido && (
                <div>
                  <p className="text-sm font-semibold text-text-secondary">
                    Favorecido
                  </p>
                  <p className="mt-1 font-bold text-primary-900">
                    {method.favorecido}
                  </p>
                </div>
              )}

              {method.instituicao && (
                <div>
                  <p className="text-sm font-semibold text-text-secondary">
                    Instituição
                  </p>
                  <p className="mt-1 font-bold text-primary-900">
                    {method.instituicao}
                  </p>
                </div>
              )}
            </div>
          )}

          {method.instrucoes && (
            <p className="rounded-lg bg-primary-100 p-4 leading-7 text-primary-900">
              {method.instrucoes}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function ContribuaPage() {
  const contributionMethods = await listPublicContributionMethods();
  const visibleCategories = Array.from(
    new Set(contributionMethods.map((method) => method.categoria))
  );

  return (
    <>
      <Header />

      <main className="bg-background">
        <PageHero
          eyebrow="Contribua"
          title="Dízimos e ofertas"
          description="Contribuições voluntárias ajudam a sustentar o cuidado pastoral, os ministérios e as ações de serviço à comunidade."
          imageUrl="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1600&q=80"
        />

        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-300 px-5">
            {contributionMethods.length > 0 ? (
              <>
                <div className="mb-8 flex flex-wrap gap-3">
                  {visibleCategories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full border border-border-default bg-surface px-4 py-2 text-sm font-semibold text-primary-900"
                    >
                      {categoryLabels[category] ?? "Contribuição"}
                    </span>
                  ))}
                </div>

                <div className="grid gap-6">
                  {contributionMethods.map((method) => (
                    <ContributionMethodCard
                      key={method.id}
                      method={method}
                    />
                  ))}
                </div>

                <div className="mt-8 rounded-lg border border-border-default bg-surface p-5 text-sm leading-6 text-text-secondary shadow-sm">
                  A contribuição é voluntária e realizada fora da
                  aplicação, no aplicativo do seu banco. A exibição de
                  chave, código ou QR Code não significa pagamento
                  confirmado.
                </div>
              </>
            ) : (
              <div className="mx-auto max-w-2xl rounded-lg border border-border-default bg-surface p-7 text-center shadow-sm">
                <h2 className="text-2xl font-bold text-primary-900">
                  Métodos de contribuição em configuração
                </h2>

                <p className="mt-3 leading-7 text-text-secondary">
                  As informações de contribuição serão publicadas aqui
                  pela equipe administrativa. Enquanto isso, fale com a
                  liderança da igreja para receber orientação segura.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
