import { languages, type LanguageCode } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

const pastorsData = {
  en: [
    {
      name: "Christy Tsai",
      nameTc: "蔡李映霞",
      title: "Mandarin Congregation Pastor",
      titleTc: "國語堂牧師",
      photo: "/images/Christy-Tsai.png",
      bio: "Christy Tsai was born in Taiwan and came to faith in 1989 as a first-generation Christian. Since then, she has served in various roles within the church, including as a devotional team member, small group leader, young adults fellowship leader, Sunday school teacher, and deacon.\n\nIn 2001, she migrated to Sydney, Australia. In 2012, she and her husband, Pastor Trent Tsai, began theological training at the Chinese Theological College Australia. After graduating, they started serving together at CABC-T in 2016. Following Pastor Trent Tsai's retirement at the end of 2020, Christy stepped into the pastoral role in January 2021 and has been faithfully shepherding the congregation since.\n\nThey have three daughters, all grown and now with families of their own. Outside of ministry, they enjoy morning swimming, cooking and exploring good food, travelling, and watching movies. They also value meaningful conversations with others about the Bible and growing together in the understanding of God's truth.",
      hasBio: true,
    },
    {
      name: "Pastor Name",
      nameTc: "待定",
      title: "Pastor Title",
      titleTc: "待定",
      photo: "/images/pastor-placeholder.svg",
      bio: "",
      hasBio: false,
    },
    {
      name: "Pastor Name",
      nameTc: "待定",
      title: "Pastor Title",
      titleTc: "待定",
      photo: "/images/pastor-placeholder.svg",
      bio: "",
      hasBio: false,
    },
    {
      name: "Pastor Name",
      nameTc: "待定",
      title: "Pastor Title",
      titleTc: "待定",
      photo: "/images/pastor-placeholder.svg",
      bio: "",
      hasBio: false,
    },
    {
      name: "Pastor Name",
      nameTc: "待定",
      title: "Pastor Title",
      titleTc: "待定",
      photo: "/images/pastor-placeholder.svg",
      bio: "",
      hasBio: false,
    },
  ],
};

export default async function PastorsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = (params.locale && params.locale in languages ? params.locale : "en") as LanguageCode;
  const t = getTranslations(locale);
  const pastors = pastorsData.en;

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4 text-center">
          {t.pastors.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {pastors.map((pastor, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-[4/5] bg-gray-200 relative">
                <img
                  src={pastor.photo}
                  alt={locale === "en" ? pastor.name : pastor.nameTc}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-display font-bold text-gray-900 mb-1">
                  {locale === "en" ? pastor.name : pastor.nameTc}
                </h2>
                <p className="text-[#263880] font-medium mb-4">
                  {locale === "en" ? pastor.title : pastor.titleTc}
                </p>
                {pastor.hasBio ? (
                  <div className="text-gray-600 text-sm whitespace-pre-line">
                    {pastor.bio}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">{t.pastors.comingSoon}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}