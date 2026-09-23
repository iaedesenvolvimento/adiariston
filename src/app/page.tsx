import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import { Hero } from "@/components/sections/Hero";
import { LiveHighlight } from "@/components/sections/LiveHighlight";
import { NextService } from "@/components/sections/NextService";
import { UpcomingEvents } from "@/components/sections/UpcomingEvents";
import { AboutCommunity } from "@/components/sections/AboutCommunity";
import { Ministries } from "@/components/sections/Ministries";
import { PrayerCTA } from "@/components/sections/PrayerCTA";
import { Location } from "@/components/sections/Location";
import {
  getFeaturedPublicTransmission,
  getPublicChurchInfo,
} from "@/services/publicData";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [churchInfo, featuredTransmission] = await Promise.all([
    getPublicChurchInfo(),
    getFeaturedPublicTransmission(),
  ]);

  return (
    <>
      <Header />

      <main>
        <Hero churchInfo={churchInfo} />
        <LiveHighlight transmission={featuredTransmission} />
        <NextService churchInfo={churchInfo} />
        <UpcomingEvents />
        <AboutCommunity />
        <Ministries />
        <PrayerCTA />
        <Location churchInfo={churchInfo} />
      </main>

      <Footer />
    </>
  );
}
