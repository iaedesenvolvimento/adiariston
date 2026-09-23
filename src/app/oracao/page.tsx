import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PrayerForm } from "@/components/sections/PrayerForm";
import { PageHero } from "@/components/ui/PageHero";

export default function OracaoPage() {
  return (
    <>
      <Header />

      <main className="bg-background">
        <PageHero
          eyebrow="Pedido de oração"
          title="Queremos orar com você"
          description="Compartilhe seu pedido com liberdade. Você escolhe se ele permanece privado ou se pode ir ao mural após moderação."
          imageUrl="https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=80"
        />

        <section className="py-12 lg:py-20">
          <div className="mx-auto max-w-300 px-5">
            <PrayerForm />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
