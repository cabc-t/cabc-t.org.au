import { languages, type LanguageCode } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

export default async function SafeChurchPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = (params.locale && params.locale in languages ? params.locale : "en") as LanguageCode;
  const t = getTranslations(locale);

  const content = {
    en: {
      title: "Safe Church",
      intro: "CABC Thornleigh is committed to providing a safe and nurturing environment for all people, especially children and vulnerable adults.",
      commitments: [
        "We follow strict screening processes for all staff and volunteers working with children.",
        "We provide regular training on child protection and safe practices.",
        "We have clear policies and procedures for reporting concerns.",
        "We maintain appropriate ratios of adults to children in all programs.",
        "We comply with all relevant child protection laws and regulations.",
      ],
      contact: "If you have any concerns about safety, please contact our Safe Church Coordinator.",
    },
    tc: {
      title: "安全教會",
      intro: "華澳浸信會展信堂致力為所有人提供安全及培育的環境，特別是兒童和弱勢人士。",
      commitments: [
        "我們對所有工作人員和志願者進行嚴格的篩選程序。",
        "我們提供有關兒童保護和安全實踐的定期培訓。",
        "我們有明確的政策和程序來報告疑慮。",
        "我們在所有項目中保持適當的成人與兒童比例。",
        "我們遵守所有相關的兒童保護法律和法規。",
      ],
      contact: "如果您對安全有任何疑慮，請聯繫我們的安全教會協調員。",
    },
    sc: {
      title: "安全教会",
      intro: "华澳浸信会展信堂致力为所有人提供安全及培育的环境，特别是儿童和弱势人士。",
      commitments: [
        "我们对所有工作人员和志愿者进行严格的筛选程序。",
        "我们提供有关儿童保护和安全实践的定期培训。",
        "我们有明确的政策和程序来报告疑虑。",
        "我们在所有项目中保持适当的成人与儿童比例。",
        "我们遵守所有相关的儿童保护法律法规。",
      ],
      contact: "如果您对安全有任何疑虑，请联系我们的安全教会协调员。",
    },
  };

  const contentForLocale = content[locale];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-8 text-center">
          {contentForLocale.title}
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">{contentForLocale.intro}</p>
        <div className="bg-gray-50 p-8 rounded-xl">
          <ul className="space-y-4">
            {contentForLocale.commitments.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-600">
                <svg className="w-6 h-6 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-8 text-center text-gray-600 font-medium">{contentForLocale.contact}</p>
      </div>
    </div>
  );
}