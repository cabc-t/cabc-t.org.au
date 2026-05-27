"use client";

import Link from "next/link";
import { type LanguageCode } from "@/lib/i18n";
import Image from "next/image";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Adjust these types to match your actual translation data structure
export interface PastorData {
  name: string;
  title: string;
  photo: string;
  bio?: string;
}

interface PastorCardProps {
  pastor: PastorData;
  locale: LanguageCode;
  isSummary?: boolean;
}

export function PastorSection({ pastor, locale }: PastorCardProps) {
  const anchorId = "pastors";

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div 
      id={anchorId} 
      className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full scroll-mt-24"
    >
      <div className="aspect-[4/5] bg-gray-200 relative overflow-hidden rounded-t-xl">
        <Image
          src={pastor.photo}
          alt={pastor.name}
          fill // Fills the aspect-ratio container
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      
      <div 
        onClick={() => pastor.bio && toggleRow(pastor.name)}
        onKeyDown={(e) => {
          // Allow keyboard users to trigger the expansion with Enter or Space
          if (pastor.bio && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            toggleRow(pastor.name);
          }
        }}
        role={pastor.bio ? "button" : undefined}
        tabIndex={pastor.bio ? 0 : undefined}
        aria-expanded={pastor.bio ? (expandedId === pastor.id) : undefined}
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
          <div className="mt-auto">
          {expandedId === pastor.name ? (
            <ChevronUp className="w-4 h-4 text-blue-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-slate-600" />
          )}
          </div>
        )}
        
        {expandedId === pastor.name && pastor.bio && (
          <div className="text-gray-600 text-sm whitespace-pre-line mt-4">
            {pastor.bio}
          </div>
        )}
        
      </div>
    </div>
  );
}

export default PastorSection;
