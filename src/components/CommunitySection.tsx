import { type LanguageCode, type LocaleProps } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

export function CommunitySection({ locale }: LocaleProps ) {
  const t = getTranslations(locale);

  return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8 text-center">
            {t.community.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                {t.community.multicultural}
              </h3>
              <p className="text-gray-600">{t.community.multiculturalDesc}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                {t.community.inclusive}
              </h3>
              <p className="text-gray-600">{t.community.inclusiveDesc}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                {t.community.welcoming}
              </h3>
              <p className="text-gray-600">{t.community.welcomingDesc}</p>
            </div>
          </div>
        </div>
  );
};

export default CommunitySection;
