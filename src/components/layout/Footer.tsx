import Link from "next/link";
import { getPublicChurchInfo } from "@/services/publicData";

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const churchInfo = await getPublicChurchInfo();

  return (
    <footer className="bg-primary-900 text-white">
      <div className="mx-auto max-w-300 px-5 py-12">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Igreja */}
          <div>
            <Link
              href="/"
              className="text-xl font-bold"
            >
              {churchInfo.name}
            </Link>

            <p className="mt-4 max-w-xs leading-7 text-primary-100">
              Uma comunidade de fé, acolhimento e propósito.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="font-bold">
              Navegação
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-primary-100">
              <Link href="/sobre" className="hover:text-white">
                Sobre
              </Link>

              <Link href="/agenda" className="hover:text-white">
                Programação
              </Link>

              <Link href="/ministerios" className="hover:text-white">
                Ministérios
              </Link>

              <Link href="/contribua" className="hover:text-white">
                Contribua
              </Link>

              <Link href="/contato" className="hover:text-white">
                Contato
              </Link>
            </div>
          </div>

          {/* Acolhimento */}
          <div>
            <h3 className="font-bold">
              Acolhimento
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-primary-100">
              <Link href="/visitante" className="hover:text-white">
                Sou Visitante
              </Link>

              <Link href="/oracao" className="hover:text-white">
                Pedido de Oração
              </Link>

              <Link href="/oracao/mural" className="hover:text-white">
                Mural de Oração
              </Link>
            </div>
          </div>

          {/* Informações */}
          <div>
            <h3 className="font-bold">
              Informações
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-primary-100">
              <p>{churchInfo.mainService}</p>
              <p>{churchInfo.address}</p>

              <Link href="/privacidade" className="hover:text-white">
                Política de Privacidade
              </Link>
            </div>
          </div>

        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-primary-100">
          © {currentYear} {churchInfo.name}. Todos os direitos reservados.
        </div>

      </div>
    </footer>
  );
}
