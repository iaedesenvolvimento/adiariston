import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VisitorForm } from "@/components/sections/VisitorForm";
import { PageHero } from "@/components/ui/PageHero";

export default function VisitantePage() {
  return (
    <>
      <Header />

      <main className="bg-background">
        <PageHero
          eyebrow="Seja bem-vindo"
          title="Queremos conhecer você"
          description="Ficamos felizes com sua visita. Compartilhe seus dados para que nossa equipe possa receber você com cuidado."
          imageUrl="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80"
        />

        <section className="py-12 lg:py-20">
          <div className="mx-auto max-w-300 px-5">
            <VisitorForm />

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
