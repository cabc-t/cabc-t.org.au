import { languages, type LanguageCode } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { PastorSection } from "@/components/PastorSection";
import Link from "next/link";

export default async function AllPastorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale         = resolvedParams.locale as LanguageCode;
  const t              = getTranslations(locale);

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            {t.pastors.title} {/* E.g., "Our Pastoral Team" */}
          </h1>
        </div>

        {/* Render ALL pastors with isSummary={false} to show the bios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {t.pastors.detail.map((detail, index) => (
            <PastorSection
              key={index}
              pastor={detail}
              locale={locale}
              isSummary={false} 
            />
          ))}
        </div>
        
      </div>
    </div>
  );
}
