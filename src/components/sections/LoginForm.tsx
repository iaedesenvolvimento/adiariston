import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginAction } from "@/app/login/actions";

interface LoginFormProps {
  errorMessage?: string;
}

export function LoginForm({ errorMessage }: LoginFormProps) {
  return (
    <form
      action={loginAction}
      className="mx-auto max-w-md rounded-xl border border-border-default bg-surface p-6 shadow-card sm:p-8"
    >
      <div>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          label="E-mail"
          placeholder="seuemail@exemplo.com"
          required
        />
      </div>

      <div className="mt-5">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          label="Senha"
          placeholder="Digite sua senha"
          required
        />
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mt-6 rounded-md border border-error/20 bg-red-50 p-4"
        >
          <p className="text-sm font-semibold text-error">
            {errorMessage}
          </p>
        </div>
      )}

      <div className="mt-8">
        <Button
          type="submit"
          className="w-full"
        >
          Entrar
        </Button>
      </div>
    </form>
  );
}
