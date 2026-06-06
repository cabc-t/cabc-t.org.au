"use client";

import { type LanguageCode } from "@/lib/i18n";
import Image from "next/image";
import { useState } from 'react';
import { getTranslations } from "@/lib/translations";

// Adjust these types to match your actual translation data structure
export interface PastorData {
  name: string;
  title: string;
  photo: string;
  bio?: string;
}

interface PastorCardProps {
  id: number;
  pastor: PastorData;
  locale: LanguageCode;
}

export function PastorSection({ id, pastor, locale }: PastorCardProps) {
  const t = getTranslations(locale);

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleRow = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div 
      className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full scroll-mt-24"
    >
      <div className="aspect-[4/5] bg-gray-200 relative overflow-hidden rounded-t-xl">
        {pastor.photo && <Image
          src={pastor.photo}
          alt={pastor.name}
          fill // Fills the aspect-ratio container
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />}
      </div>
      
      <div 
        onClick={() => pastor.bio && toggleRow(id)}
        onKeyDown={(e) => {
          // Allow keyboard users to trigger the expansion with Enter or Space
          if (pastor.bio && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            toggleRow(id);
          }
        }}
        role={pastor.bio ? "button" : undefined}
        tabIndex={pastor.bio ? 0 : undefined}
        aria-expanded={pastor.bio ? (expandedId === id) : undefined}
        className={`p-6 flex flex-col flex-grow group outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg ${
          pastor.bio ? "cursor-pointer" : ""
        }`}>
        <h2 className="text-xl font-display font-bold text-gray-900 mb-1">
          {pastor.name}
        </h2>
        <p className="text-[#263880] font-medium mb-4">
          {pastor.title}
        </p>

        {pastor.bio && (
          <div className="mt-4 text-sm text-gray-600">
            {/* 1. Moved overflow-hidden out of the ternary so it's always active. 
                2. Increased max-h to 2000px to safely fit long translations.
                3. (Optional) Slowed duration to 500ms for a smoother long expansion. */}
            <div className={`relative transition-all duration-500 overflow-hidden ${
              expandedId === id ? "max-h-[2000px]" : "max-h-10"
            }`}>
              <p className="whitespace-pre-line">{pastor.bio}</p>
              
              {/* Gradient Overlay when collapsed */}
              {expandedId !== id && (
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent" />
              )}
            </div>
            
            <span className="text-xs font-bold text-blue-600 mt-2 block hover:underline">
              {expandedId === id ? t.pastors.show_less : t.pastors.show_more }
            </span>
          </div>
        )}
        
      </div>
    </div>
  );
}
