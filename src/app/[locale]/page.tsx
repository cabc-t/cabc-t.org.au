import { languages, type LanguageCode } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { Announcements } from "@/components/Announcements";
import { SermonsList } from "@/components/SermonsList";
import RegularEvents from "@/components/RegularEvents";
import HeroSection from "@/components/HeroSection";
import CommunitySection from "@/components/CommunitySection";
import ServiceSection from "@/components/ServiceSection";
import ChildrenSection from "@/components/ChildrenSection";
import YouthSection from "@/components/YouthSection";
import SeniorSection from "@/components/SeniorSection";
import CellSection from "@/components/CellSection";
import AboutSection from "@/components/AboutSection";

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = (params.locale && params.locale in languages ? params.locale : "en") as LanguageCode;
  const t = getTranslations(locale);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e293b] py-16 md:py-24">
        <HeroSection locale={locale} />
      </section>

      {/* Announcements */}
      <section id="news" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Announcements locale={locale} limit={10} showTitle={true} />
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-purple-50/30">
        <CommunitySection locale={locale} />
      </section>

      {/* Sunday Services */}
      <section id="services" className="py-16 bg-white">
        <ServiceSection locale={locale} />
      </section>

      {/* Children's Ministry */}
      <section id="children" className="py-24" style={{ backgroundColor: "rgba(247, 239, 250, 1)" }}>
        <ChildrenSection locale={locale} />
      </section>

      {/* Youth Programs - English only */}
      {locale === "en" && (
      <section className="py-16 bg-gradient-to-br from-violet-50 via-white to-violet-50/30">
        <YouthSection locale={locale} />
      </section>
      )}

      {/* Seniors - TC only */}
      {locale === "tc" && (
      <section className="py-16 bg-gradient-to-br from-amber-50 via-white to-amber-50/30">
        <SeniorSection locale={locale} />
      </section>
      )}

      {/* Small Groups */}
      <section id="cells" className="py-24 bg-gray-50">
        <CellSection locale={locale} />
      </section>

      {/* Regular Events */}
      <section id="regularEvents" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RegularEvents locale={locale} />
        </div>
      </section>
      
      {/* Recent Sermons */}
      <section id="sermons" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SermonsList locale={locale} limit={6} showTitle={true} horizontalScroll={true} />
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 bg-white">
        <AboutSection locale={locale} />
      </section>
    </div>
  );
}