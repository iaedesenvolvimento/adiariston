import { AdminHeader } from "@/components/layout/AdminHeader";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/Textarea";
import { listAdminContributionMethods } from "@/services/adminData";
import { requireAdminProfile } from "@/services/auth";

import { saveMainContributionMethodAction } from "./actions";

export const dynamic = "force-dynamic";

const pixKeyTypeOptions = [
  { value: "email", label: "E-mail" },
  { value: "cpf_cnpj", label: "CPF/CNPJ" },
  { value: "telefone", label: "Telefone" },
  { value: "aleatoria", label: "Chave aleatória" },
];

export default async function AdminContributionsPage() {
  const admin = await requireAdminProfile(["Admin"]);
  const methods = await listAdminContributionMethods();
  const mainMethod =
    methods.find((method) => method.tipo === "pix") ??
    methods[0] ??
    null;

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-240 px-5">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
            Contribuições
          </span>

          <h1 className="mt-3 text-3xl font-bold text-primary-900 sm:text-4xl">
            PIX para dízimos e ofertas
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-text-secondary">
            Configure aqui o único método principal exibido em
            /contribua. A aplicação apenas mostra os dados oficiais e
            não confirma pagamentos.
          </p>

          <form
            action={saveMainContributionMethodAction}
            className="mt-8 rounded-lg border border-border-default bg-surface p-6 shadow-sm"
          >
            <input
              type="hidden"
              name="id"
              value={mainMethod?.id ?? ""}
            />
            <input type="hidden" name="tipo" value="pix" />
            <input type="hidden" name="categoria" value="oferta" />
            <input type="hidden" name="ordem" value="10" />

            <div className="flex flex-col gap-3 border-b border-border-default pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-primary-900">
                  Configuração principal
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  Use este formulário para publicar ou pausar as
                  informações de contribuição.
                </p>
              </div>

              <label className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                <input
                  name="ativo"
                  type="checkbox"
                  defaultChecked={mainMethod?.ativo ?? false}
                  className="size-4 accent-primary-600"
                />
                Publicar em /contribua
              </label>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <Input
                id="titulo"
                name="titulo"
                label="Título público"
                defaultValue={
                  mainMethod?.titulo ?? "PIX para dízimos e ofertas"
                }
                required
              />

              <Select
                id="tipo-chave-pix"
                name="tipoChavePix"
                label="Tipo da chave PIX"
                options={pixKeyTypeOptions}
                defaultValue={mainMethod?.tipo_chave_pix ?? "email"}
              />

              <Input
                id="chave-pix"
                name="chavePix"
                label="Chave PIX"
                defaultValue={
                  mainMethod?.chave_pix ?? mainMethod?.chave ?? ""
                }
                placeholder="financeiro@igreja.com"
              />

              <Input
                id="favorecido"
                name="favorecido"
                label="Favorecido"
                defaultValue={mainMethod?.favorecido ?? ""}
                placeholder="Nome oficial da igreja"
              />

              <Input
                id="instituicao"
                name="instituicao"
                label="Instituição financeira"
                defaultValue={mainMethod?.instituicao ?? ""}
                placeholder="Banco ou instituição, se aplicável"
              />

              <Input
                id="descricao"
                name="descricao"
                label="Texto curto"
                defaultValue={mainMethod?.descricao ?? ""}
                placeholder="Canal oficial para contribuições voluntárias."
              />

              <Textarea
                id="pix-copia-cola"
                name="pixCopiaCola"
                label="PIX Copia e Cola"
                className="lg:col-span-2"
                defaultValue={mainMethod?.pix_copia_cola ?? ""}
                placeholder="Cole aqui o payload PIX quando disponível."
              />

              <Textarea
                id="instrucoes"
                name="instrucoes"
                label="Instruções públicas"
                className="lg:col-span-2"
                defaultValue={mainMethod?.instrucoes ?? ""}
                placeholder="Ex.: confira o favorecido no aplicativo do banco antes de concluir."
              />
            </div>

            <div className="mt-6 flex justify-end">
              <SubmitButton>Salvar configuração</SubmitButton>
            </div>
          </form>

          {methods.length > 1 && (
            <p className="mt-4 rounded-lg border border-border-default bg-surface p-4 text-sm leading-6 text-text-secondary">
              Existem outros métodos antigos cadastrados no banco. Ao
              salvar esta configuração, eles serão desativados para que
              apenas o PIX principal apareça no site.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
