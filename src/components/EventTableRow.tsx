"use client";

import React, { useState, useCallback } from "react";
import { ChevronDown, ChevronUp, MapPin, Info, Clock, Globe, Tag, Calendar, Loader2, Users, BookOpen, Coffee, Languages, Filter, X, University, Briefcase, School, TreePalm, BookHeart, Piano, CookingPot, BookMarked, LifeBuoy, FlaskRound, House } from 'lucide-react';
import { EventProps } from "@/lib/event";

const IconMap: Record<string, React.ReactNode> = {
  Users: <Users className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Languages: <Languages className="w-5 h-5" />,
  School: <School className="w-5 h-5" />,
  TreePalm: <TreePalm className="w-5 h-5" />,
  BookHeart: <BookHeart className="w-5 h-5" />,
  LifeBuoy: <LifeBuoy className="w-5 h-5" />,
  CookingPot: <CookingPot className="w-5 h-5" />,
  Coffee: <Coffee className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Piano: <Piano className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  University: <University className="w-5 h-5" />,
  FlaskRound: <FlaskRound className="w-5 h-5" />,
  House: <House className="w-5 h-5" />,
};

interface EventTableRowProps {
  event: EventProps;
}

export function EventTableRow({ event } : EventTableRowProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleRow = useCallback((id: string) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  }, []); // Empty array means it never needs to be recreated
  
  return (
    <>
      <React.Fragment key={event.id}>
              {/* Main Row */}
              <tr 
                onClick={() => toggleRow(event.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleRow(event.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-expanded={expandedId === event.id}
                className="cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 hover:bg-slate-50 transition-all group"
              >
                {/* 1. Event Name */}
                <td className="py-2 px-2">
                  <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </div>
                </td>

                {/* 2. Day and Time */}
                <td className="py-2 px-2 text-slate-600 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm">
                      <span className="font-semibold">{event.day_text}</span>
                      {event.time_text && (
                        <>
                          <span className="mx-1.5 text-slate-300">|</span>
                          {event.time_text}
                        </>
                      )}
                    </span>
                  </div>
                </td>

                {/* 3. Language */}
                <td className="py-2 px-2 hidden sm:table-cell">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    {event.language_label}
                  </div>
                </td>

                {/* 4. Category (Tag) */}
                <td className="py-2 px-2 text-right">
                   <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                    {event.tag_label}
                  </span>
                </td>

                {/* 5. Toggle Icon */}
                <td className="py-2 pl-2 pr-4 text-right w-10">
                  {expandedId === event.id ? (
                    <ChevronUp className="w-4 h-4 text-blue-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-slate-600" />
                  )}
                </td>
              </tr>

              {/* Expandable Detail Row */}
              {expandedId === event.id && (
                <tr className="bg-slate-50/50">
                  <td colSpan={5} className="px-4 py-4 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex flex-col gap-3">
                      
                      {/* Venue / Location - Vertically aligned with MapPin */}
                      {event.location && (
                        <div className="flex items-start gap-3 text-slate-700">
                          <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <span className="text-sm font-medium leading-tight">
                            {event.location}
                          </span>
                        </div>
                      )}

                      {/* Description - Conditional Rendering */}
                      {event.description && event.description.trim() !== "" && (
                        <div className="flex items-start gap-3 text-slate-600">
                          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <p className="text-sm leading-relaxed max-w-2xl">
                            {event.description}
                          </p>
                        </div>
                      )}
                      
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
    </>
  );
}
