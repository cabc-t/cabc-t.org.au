import { getTranslations } from "@/lib/translations";

export function ServiceSection({ locale }) {
  const t = getTranslations(locale);

  return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8 text-center">
            {t.services.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                {t.services.cantonese}
              </span>
              <p className="text-2xl font-bold text-gray-900 mt-3">{t.services.cantoneseTime}</p>
              <p className="text-gray-600 mt-1">{t.services.mainHall}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded">
                {t.services.mandarin}
              </span>
              <p className="text-2xl font-bold text-gray-900 mt-3">{t.services.mandarinTime}</p>
              <p className="text-gray-600 mt-1">{t.services.sideHall}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-700 rounded">
                {t.services.english}
              </span>
              <p className="text-2xl font-bold text-gray-900 mt-3">{t.services.englishTime}</p>
              <p className="text-gray-600 mt-1">{t.services.mainHall}</p>
            </div>
          </div>
        </div>
  );
};

export default ServiceSection;
