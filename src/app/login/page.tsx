import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LoginForm } from "@/components/sections/LoginForm";

interface LoginPageProps {
  searchParams?: Promise<{
    erro?: string;
  }>;
}

const loginErrors: Record<string, string> = {
  dados: "Não foi possível ler os dados de login.",
  campos: "Informe e-mail e senha.",
  credenciais:
    "Não foi possível entrar. Verifique e-mail e senha.",
  perfil:
    "Usuário autenticado, mas sem perfil administrativo ativo.",
  config:
    "Supabase não está configurado para autenticação.",
  servidor:
    "Não foi possível concluir o login agora. Tente novamente.",
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;
  const errorMessage =
    params?.erro && loginErrors[params.erro]
      ? loginErrors[params.erro]
      : undefined;

  return (
    <>
      <Header />

      <main className="bg-background">
        <section className="py-12 lg:py-20">
          <div className="mx-auto max-w-300 px-5">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
                Área administrativa
              </span>

              <h1 className="mt-3 text-3xl font-bold text-primary-900 sm:text-4xl">
                Entrar no painel
              </h1>

              <p className="mt-4 leading-7 text-text-secondary">
                Acesso restrito a pessoas autorizadas para cuidado,
                acompanhamento e gestão da comunidade.
              </p>
            </div>

            <LoginForm errorMessage={errorMessage} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
