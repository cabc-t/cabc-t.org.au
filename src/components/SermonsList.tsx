"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { format, parseISO } from "date-fns";
import { type LanguageCode } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { useSermons, type Sermon, extractVideoId } from "@/lib/hooks/useSermons";
import { useRef, useEffect, useState } from "react";

interface SermonsListProps {
  locale: LanguageCode;
  limit?: number;
  showTitle?: boolean;
  horizontalScroll?: boolean;
}

export function SermonsList({ locale, limit = 6, showTitle = false, horizontalScroll = false }: SermonsListProps) {
  const t = getTranslations(locale);
  const { sermons, loading, error } = useSermons({ locale, limit });
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sermons.length > 0) {
      setActiveIndex(0);
    }
  }, [sermons]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const cardWidth = 384;
    const gap = 24;
    const index = Math.round(scrollRef.current.scrollLeft / (cardWidth + gap));
    setActiveIndex(index);
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const cardWidth = 384;
    const gap = 24;
    scrollRef.current.scrollTo({ left: index * (cardWidth + gap), behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-5">
      {showTitle && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-gray-900">
            {t.sermons.title}
          </h2>
          <Link
            href={`/${locale}/sermons`}
            className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
          >
            {t.sermons.viewAll} →
          </Link>
        </div>
      )}

      {loading ? (
        <div className={horizontalScroll ? "flex gap-6 overflow-hidden" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={horizontalScroll ? "w-96 flex-shrink-0" : ""}>
              <div className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-xl" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">Error loading sermons: {error}</p>
      ) : sermons.length === 0 ? (
        <p className="text-gray-500">{t.sermons.noSermons}</p>
      ) : horizontalScroll ? (
        <>
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide"
            onScroll={handleScroll}
          >
            {sermons.map((sermon) => {
              const videoId = extractVideoId(sermon.youtube_url);
              return (
                <article
                  key={sermon.id}
                  className="w-96 flex-shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                  {videoId && (
                    <div className="aspect-video bg-gray-100 relative">
                      <iframe
                        className="w-full h-full absolute inset-0"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={sermon.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-sm text-gray-500 mb-1">
                      {format(parseISO(sermon.date), "MMMM d, yyyy")}
                    </p>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {sermon.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{sermon.preacher}</p>
                    <a
                      href={sermon.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Play size={16} />
                      {t.sermons.watchOnYouTube}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {sermons.length > 1 && (
            <div className="flex justify-center gap-2 mt-2">
              {sermons.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeIndex 
                      ? "bg-[#263880] scale-110" 
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.map((sermon) => {
            const videoId = extractVideoId(sermon.youtube_url);
            
            return (
              <article
                key={sermon.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                {videoId && (
                  <div className="aspect-video bg-gray-100 relative">
                    <iframe
                      className="w-full h-full absolute inset-0"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={sermon.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                <div className="p-5">
                  <p className="text-sm text-gray-500 mb-1">
                    {format(parseISO(sermon.date), "MMMM d, yyyy")}
                  </p>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {sermon.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{sermon.preacher}</p>
                  <a
                    href={sermon.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Play size={16} />
                    {t.sermons.watchOnYouTube}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}