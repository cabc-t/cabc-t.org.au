import { languages, type LanguageCode, type LocaleProps } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

export default async function StatementsOfFaithPage({
  params,
}: {
  params: LocaleProps;
}) {
  const locale = (params.locale && params.locale in languages ? params.locale : "en") as LanguageCode;
  const t = getTranslations(locale);

  const content = {
    en: {
      title: "Statements of Faith",
      items: [
        "We believe the Bible to be the inspired and infallible Word of God.",
        "We believe in the Trinity - Father, Son, and Holy Spirit.",
        "We believe that Jesus Christ is the Son of God, born of the Virgin Mary, crucified, buried, resurrected, and ascended to heaven.",
        "We believe that all people are born with a sinful nature and need salvation through Jesus Christ.",
        "We believe in the baptism of the Holy Spirit and the gifts of the Spirit.",
        "We believe in the Church as the body of Christ, and in the Great Commission to make disciples of all nations.",
        "We believe in the Second Coming of Christ and the final judgement.",
        "We believe in the resurrection of the dead and eternal life.",
      ],
    },
    tc: {
      title: "信條",
      items: [
        "我們相信聖經是神所默示的，是无误的神的話語。",
        "我們相信三位一體 - 聖父、聖子、聖靈。",
        "我們相信耶穌基督是神的兒子，由童貞女馬利亞所生，被釘十字架、埋葬、復活、升天。",
        "我們相信所有人都是生來有罪性的，需要通過耶穌基督得救。",
        "我們相信聖靈的洗和聖靈的恩賜。",
        "我們相信教會是基督的身體，並負有大使命，使萬民作主的門徒。",
        "我們相信基督的再來和最終的審判。",
        "我們相信死人的復活和永生。",
      ],
    },
    sc: {
      title: "信条",
      items: [
        "我们相信圣经是神所默示的，是无误的神的话语。",
        "我们相信三位一体 - 圣父、圣子、圣灵。",
        "我们相信耶稣基督是神的儿子，由童贞女马利亚所生，被钉十字架、埋葬、复活、升天。",
        "我们相信所有人都是生来有罪性的，需要通过耶稣基督得救。",
        "我们相信圣灵的洗和圣灵的恩赐。",
        "我们相信教会是基督的身体，并负有大使命，使万民作主的门徒。",
        "我们相信基督的再来和最终的审判。",
        "我们相信死人的复活和永生。",
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
        <div className="bg-white p-8 rounded-xl shadow-md">
          <ul className="space-y-4">
            {contentForLocale.items.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-600">
                <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}