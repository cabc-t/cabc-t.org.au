"use client";

import Link from "next/link";
import { format } from "date-fns";
import { type LanguageCode } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { useAnnouncements, type Announcement } from "@/lib/hooks/useAnnouncements";
import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import DOMPurify from "dompurify";

interface AnnouncementsProps {
  locale: LanguageCode;
  limit?: number;
  showTitle?: boolean;
}

export function Announcements({ locale, limit = 5, showTitle = false }: AnnouncementsProps) {
  const t = getTranslations(locale);
  const { announcements, loading, error } = useAnnouncements({ locale, limit });
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    if (announcements.length > 0) {
      setActiveIndex(0);
    }
  }, [announcements]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
    scrollRef.current.style.userSelect = "none";
  };

  const handleMouseLeave = () => {
    if (!scrollRef.current) return;
    isDragging.current = false;
    scrollRef.current.style.cursor = "grab";
    scrollRef.current.style.userSelect = "auto";
  };

  const handleMouseUp = () => {
    if (!scrollRef.current) return;
    isDragging.current = false;
    scrollRef.current.style.cursor = "grab";
    scrollRef.current.style.userSelect = "auto";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const cardWidth = 256;
    const gap = 16;
    const index = Math.round(scrollRef.current.scrollLeft / (cardWidth + gap));
    setActiveIndex(index);
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const cardWidth = 256;
    const gap = 16;
    scrollRef.current.scrollTo({ left: index * (cardWidth + gap), behavior: "smooth" });
  };

  const tileColors = [
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-violet-500 to-purple-600",
    "from-sky-500 to-blue-600",
    "from-lime-500 to-green-600",
  ];

  return (
    <div className="flex flex-col gap-5">
      {showTitle && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-gray-900">
            {t.announcements.title}
          </h2>
          <Link
            href={`/${locale}/announcements`}
            className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
          >
            {t.announcements.viewAll} →
          </Link>
        </div>
      )}

      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-64 flex-shrink-0">
              <div className="h-40 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">Error loading announcements: {error}</p>
      ) : announcements.length === 0 ? (
        <p className="text-gray-500">{t.announcements.noNews}</p>
      ) : (
        <>
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide cursor-grab select-none"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onScroll={handleScroll}
          >
            {announcements.map((announcement, index) => (
              <div
                key={announcement.id}
                className="flex-shrink-0 w-64"
              >
                <button
                  onClick={() => setSelectedAnnouncement(announcement)}
                  className={`
                    w-full h-40 rounded-xl overflow-hidden text-left cursor-pointer hover:opacity-90 transition-opacity
                    ${announcement.image_url 
                      ? "" 
                      : `bg-gradient-to-br ${tileColors[index % tileColors.length]} p-4 flex flex-col justify-between`}
                  `}
                >
                  {announcement.image_url ? (
                    <div className="relative w-full h-full flex flex-col justify-between">
                      <img
                        src={announcement.image_url}
                        alt={announcement.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/75" />
                      <div className="relative p-3">
                        <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-white drop-shadow-lg">
                          {announcement.title}
                        </h3>
                      </div>
                      <div className="relative p-3">
                        <span className="text-white/90 text-xs drop-shadow-sm">
                          {format(new Date(announcement.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-white">
                        {announcement.title}
                      </h3>
                      <span className="text-white/80 text-xs">
                        {format(new Date(announcement.created_at), "MMM d, yyyy")}
                      </span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {announcements.length > 1 && (
            <div className="flex justify-center gap-2 mt-2">
              {announcements.map((_, index) => (
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
      )}

      {/* Modal */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`
              p-6 rounded-t-2xl
              bg-gradient-to-br ${tileColors[announcements.findIndex(a => a.id === selectedAnnouncement.id) % tileColors.length]}
            `}>
              <div className="flex items-start justify-between">
                <h3 className="text-white text-2xl font-bold pr-8">
                  {selectedAnnouncement.title}
                </h3>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-white/80 mt-2">
                {format(new Date(selectedAnnouncement.created_at), "MMMM d, yyyy")}
              </p>
            </div>
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {selectedAnnouncement.image_url && (
                <img
                  src={selectedAnnouncement.image_url}
                  alt={selectedAnnouncement.title}
                  className="w-full h-auto rounded-lg mb-4"
                />
              )}
              <div
                className="text-gray-700 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedAnnouncement.content) }}
              />
              {selectedAnnouncement.pdf_url && (
                <a
                  href={selectedAnnouncement.pdf_url}
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
      )}
    </div>
  );
}