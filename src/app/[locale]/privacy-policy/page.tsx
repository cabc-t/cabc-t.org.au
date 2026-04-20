import { languages, type LanguageCode } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

export default async function PrivacyPolicyPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = (params.locale && params.locale in languages ? params.locale : "en") as LanguageCode;
  const t = getTranslations(locale);

  const content = {
    en: {
      title: "Privacy Policy",
      intro: "CABC Thornleigh is committed to protecting your privacy.",
      sections: [
        {
          heading: "Collection of Information",
          text: "We collect personal information such as name, email address, and phone number when you voluntarily provide it to us.",
        },
        {
          heading: "Use of Information",
          text: "We use the information to communicate with you about church activities, events, and updates.",
        },
        {
          heading: "Disclosure of Information",
          text: "We do not share your personal information with third parties unless required by law.",
        },
        {
          heading: "Security",
          text: "We take reasonable measures to protect your personal information from unauthorized access.",
        },
        {
          heading: "Contact",
          text: "If you have any questions about this privacy policy, please contact us.",
        },
      ],
    },
    tc: {
      title: "私隱政策",
      intro: "華澳浸信會展信堂致力保護您的私隱。",
      sections: [
        {
          heading: "收集資料",
          text: "當您自願向我們提供個人資料時，我們會收集您的姓名、電子郵件地址和電話號碼。",
        },
        {
          heading: "使用資料",
          text: "我們使用這些資料與您溝通有關教會活動、事件和更新的信息。",
        },
        {
          heading: "披露資料",
          text: "除非法律要求，我們不會與第三方共享您的個人資料。",
        },
        {
          heading: "安全性",
          text: "我們採取合理措施保護您的個人資料免受未經授權的訪問。",
        },
        {
          heading: "聯繫",
          text: "如果您對此私隱政策有任何問題，請聯繫我們。",
        },
      ],
    },
    sc: {
      title: "隐私政策",
      intro: "华澳浸信会展信堂致力于保护您的隐私。",
      sections: [
        {
          heading: "收集资料",
          text: "当您自愿向我们提供个人资料时，我们会收集您的姓名、电子邮件地址和电话号码。",
        },
        {
          heading: "使用资料",
          text: "我们使用这些资料与您沟通有关教会活动、事件和更新的信息。",
        },
        {
          heading: "披露资料",
          text: "除非法律要求，我们不会与第三方共享您的个人资料。",
        },
        {
          heading: "安全性",
          text: "我们采取合理措施保护您的个人资料免受未经授权的访问。",
        },
        {
          heading: "联系",
          text: "如果您对此隐私政策有任何问题，请联系我们。",
        },
      ],
    },
  };

  const contentForLocale = content[locale];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-8 text-center">
          {contentForLocale.title}
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">{contentForLocale.intro}</p>
        <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
          {contentForLocale.sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{section.heading}</h2>
              <p className="text-gray-600">{section.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}