import { LoadingState } from "@/components/ui/LoadingState";

export default function Loading() {
  return (
    <main
      id="conteudo"
      className="flex min-h-120 items-center justify-center bg-background px-5"
    >
      <LoadingState />
    </main>
  );
}
