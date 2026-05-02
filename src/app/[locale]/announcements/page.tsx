"use client";

import { format } from "date-fns";
import { type LanguageCode, type LocaleProps } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { useAnnouncements, type Announcement } from "@/lib/hooks/useAnnouncements";
import DOMPurify from "dompurify";

export default function AnnouncementsPage({ params }: { params: LocaleProps }) {
  const localeCode: LanguageCode = (params.locale && (params.locale === "tc" || params.locale === "sc")) 
    ? params.locale 
    : "en";
  const { announcements, loading, error } = useAnnouncements({ locale: localeCode, limit: 20 });

  const t = getTranslations(localeCode);

  const tileColors = [
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-violet-500 to-purple-600",
    "from-sky-500 to-blue-600",
    "from-lime-500 to-green-600",
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-8 text-center">
          {t.announcements.title}
        </h1>

        {loading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-6 bg-gray-100 rounded-xl animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mt-2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500">Error loading announcements: {error}</p>
        ) : announcements.length === 0 ? (
          <p className="text-center text-gray-500">{t.announcements.noNews}</p>
        ) : (
          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <article
                key={announcement.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`
                      w-3 h-3 rounded-full mt-2 flex-shrink-0
                      bg-gradient-to-br ${tileColors[index % tileColors.length]}
                    `} />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {announcement.title}
                      </h2>
                      <p className="text-sm text-gray-500 mb-4">
                        {format(new Date(announcement.created_at), "MMMM d, yyyy")}
                      </p>
                      {announcement.image_url && (
                        <img
                          src={announcement.image_url}
                          alt={announcement.title}
                          className="w-full h-auto rounded-lg mb-4"
                        />
                      )}
                      <div
                        className="text-gray-700 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(announcement.content) }}
                      />
                      {announcement.pdf_url && (
                        <a
                          href={announcement.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-4 text-amber-600 hover:text-amber-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}