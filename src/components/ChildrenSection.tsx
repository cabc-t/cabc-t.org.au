import { type LanguageCode, type LocaleProps } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

export function ServiceSection({ locale }: LocaleProps ) {
  const t = getTranslations(locale);

  return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-8">
            {t.children.desc}
          </h3>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h4 className="text-xl font-display font-semibold text-gray-900 mb-4">
                  {t.children.program}
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• {t.children.learn}</li>
                  <li>• {t.children.love}</li>
                  <li>• {t.children.live}</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h4 className="text-xl font-display font-semibold text-gray-900 mb-4">
                  {t.children.material}
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• {t.children.heartTransforming}</li>
                  <li>• {t.children.ageAligned}</li>
                  <li>• {t.children.chronological}</li>
                  <li>• {t.children.theologicallyRich}</li>
                  <li>• {t.children.missionallyMinded}</li>
                  <li>• {t.children.christCentred}</li>
                </ul>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="/images/creatvise-dMVYJDwrBrU-unsplash.jpg.webp"
                alt="Children's Ministry" 
                className="w-full h-80 lg:h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
  );
};

export default ServiceSection;
