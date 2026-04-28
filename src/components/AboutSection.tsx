import { getTranslations } from "@/lib/translations";

export function ServiceSection({ locale }) {
  const t = getTranslations(locale);

  return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-6 text-center">
            {t.about.title}
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 leading-relaxed">
              {t.about.history}
            </p>
          </div>
        </div>
  );
};

export default ServiceSection;
