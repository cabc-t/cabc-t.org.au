import { languages, type LanguageCode, type LocaleProps } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

export default async function AboutPage({
  params,
}: {
  params: LocaleProps;
}) {
  const locale = (params.locale && params.locale in languages ? params.locale : "en") as LanguageCode;
  const t = getTranslations(locale);

  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-8 text-center">
          {t.about.title}
        </h1>
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="whitespace-pre-line">{t.about.history}</p>
        </div>
        
        <div className="mt-12 bg-gray-50 p-8 rounded-xl">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
            {t.contact.title}
          </h2>
          <div className="space-y-3 text-gray-600">
            <p><strong>{t.contact.address}</strong></p>
            <p><strong>Phone:</strong> {t.contact.phone}</p>
            <p><strong>Email:</strong> {t.contact.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}