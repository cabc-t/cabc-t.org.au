import { languages, type LanguageCode, type LocaleProps } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { YOUTUBE_CHANNEL_URL } from "@/lib/constants";
import { SermonsList } from "@/components/SermonsList";

export default async function SermonsPage({
  params,
}: {
  params: LocaleProps;
}) {
  const locale = (params.locale && params.locale in languages ? params.locale : "en") as LanguageCode;
  const t = getTranslations(locale);

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-8 text-center">
          {t.sermons.title}
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          {locale === "en" 
            ? "Watch our latest sermons on YouTube"
            : locale === "tc"
            ? "在YouTube觀看我們最新的講道"
            : "在YouTube观看我们最新的讲道"}
        </p>
        <a
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 mb-12 text-red-600 hover:text-red-700 font-medium"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          {locale === "en" ? "Visit Our YouTube Channel" : locale === "tc" ? "訪問我們的YouTube頻道" : "访问我们的YouTube频道"}
        </a>
        <SermonsList locale={locale} limit={60} showTitle={false} />
      </div>
    </div>
  );
}