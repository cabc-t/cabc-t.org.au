import { languages, type LanguageCode, type LocaleProps } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

export default async function PastorsPage({
  params,
}: {
  params: LocaleProps;
}) {
  const locale = (params.locale && params.locale in languages ? params.locale : "en") as LanguageCode;
  const t = getTranslations(locale);

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4 text-center">
          {t.pastors.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {t.pastors.detail.map((detail, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-[4/5] bg-gray-200 relative">
                <img
                  src={detail.photo}
                  alt={detail.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-display font-bold text-gray-900 mb-1">
                  {detail.name}
                </h2>
                <p className="text-[#263880] font-medium mb-4">
                  {detail.title}
                </p>
                <div className="text-gray-600 text-sm whitespace-pre-line">
                  {detail.bio}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}