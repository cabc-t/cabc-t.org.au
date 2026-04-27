"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { type LanguageCode } from "@/lib/i18n";
import { Calendar, Loader2, Clock, MapPin, Users, BookOpen, Coffee, Languages, Filter, X, University, Briefcase, School, TreePalm, BookHeart, Piano, CookingPot, BookMarked, LifeBuoy, FlaskRound, House } from 'lucide-react';
import { getTranslations } from "@/lib/translations";

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

interface Event {
  id: string;
  title: string;
  day_text: string;
  time_text: string;
  location: string;
  language_label: string;
  description: string;
  tag_key: string;
  tag_label: string;
  icon_name: string;
}

interface RegularEventsProps {
  locale: LanguageCode;
}

export function RegularEvents({ locale }: RegularEventsProps) {
  const t = getTranslations(locale);

  const supabase = createClient();
  
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for Filters
  const [selectedDay, setSelectedDay] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");

  const allLabel = t.filters.all;
  
  // Derived Data (Unique Days/Tags for the UI)
  const days = useMemo(() => {
    // 1. Get unique day_text values, handling null/undefined
    const uniqueDays = Array.from(new Set(allEvents.map(e => e.day_text || "")));
  
    // Get the order list for the current locale
    const currentOrder = t.filters.day;
  
    // 3. Sort the unique days
    const sortedDays = uniqueDays.sort((a, b) => {
      // Treat empty/null as the absolute last item
      if (!a || a === "") return 1;
      if (!b || b === "") return -1;
  
      const indexA = currentOrder.indexOf(a);
      const indexB = currentOrder.indexOf(b);
  
      // If a day isn't in our list (like "No set day"), put it at the end
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
  
      return indexA - indexB;
    });
  
    // 4. Return with "All" at the top
    return [allLabel, ...sortedDays];
  }, [allEvents, locale]);
  
  const tags = useMemo(() => {
    // Create an array of { key, label }
    const uniqueTags = allEvents.reduce((acc, event) => {
      if (!acc.find(t => t.key === event.tag_key)) {
        acc.push({ key: event.tag_key, label: event.tag_label });
      }
      return acc;
    }, [] as { key: string; label: string }[]);
  
    return [{ key: "All", label: allLabel }, ...uniqueTags];
  }, [allEvents]);

  const languages = useMemo(() => {
    // Get unique language labels from your events
    const uniqueLanguages = Array.from(new Set(allEvents.map(e => e.language_label)));
    
    // Create an array of objects to keep track of what is "All" vs a specific language
    return [
      { key: "All", label: allLabel }, 
      ...uniqueLanguages.map(lang => ({ key: lang, label: lang }))
    ];
  }, [allEvents, allLabel]);
 
  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      try {
        // 1. Fetch from base table and 'inner join' the translations
        // We use !inner to ensure we ONLY get events that have a translation for the current locale
        const { data, error } = await supabase
          .from('regular_events')
          .select(`
            id, icon_name, tag_key,
            event_translations!inner (
              title, day_text, time_text, location, description, language_label, tag_label
            )
          `)
          .eq('event_translations.locale', locale);

        if (error) {
          console.error('Supabase Error:', error.message);
          return;
        }
        
        // 2. Flatten the data
        // Supabase returns translations as an array: event_translations: [{...}]
        // We map it so the component sees a single flat object.
        const formattedEvents = data.map((event) => {
          // Grab the first (and only) translation object for this locale
          const translation = event.event_translations[0];

          return {
            id: event.id,
            icon_name: event.icon_name,
            tag_key: event.tag_key,
            // Spread the translated fields into the top level
            ...translation 
          };
        });

        setAllEvents(formattedEvents);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [supabase, locale]); // Refetch if locale changes!
  
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      const dayMatch = selectedDay === "All" || event.day_text === selectedDay;
      const tagMatch = selectedTag === "All" || event.tag_key === selectedTag;
      const languageMatch = selectedLanguage === "All" || event.language_label === selectedLanguage;
      return dayMatch && tagMatch && languageMatch;
    });
  }, [allEvents, selectedDay, selectedTag, selectedLanguage]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Loading events...</p>
      </div>
    );
  }
  
  return (
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">{t.regularEvents.title}</h2>
          <p className="text-slate-500 mt-2">{t.regularEvents.desc}</p>
        </div>

        {/* Filter Controls */}
        <div className="bg-slate-50 p-6 rounded-2xl mb-10 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            
            {/* Day Filter */}
            <div className="w-full md:w-auto md:min-w-[200px]">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">Filter by Day</label>
              <div className="flex flex-wrap gap-2">
{/*
                {days.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedDay === day 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {day}
                  </button>
                ))}
*/}
              <select 
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>

              </div>
            </div>

            {/* Tag Filter */}
            <div className="w-full">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">Category</label>
{/*
              <select 
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {tags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
*/}
                {tags.map(tag => (
                  <button
                    key={tag.key}
                    onClick={() => setSelectedTag(tag.key)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedTag === tag.key
                      ? "bg-blue-600 text-white shadow-md" 
                      : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
            </div>

            {/* Language Filter */}
            <div className="w-full md:w-auto md:min-w-[200px]">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">Language</label>
{/*
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {languages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
*/}
                {languages.map(lang => (
                  <button
                    key={lang.key}
                    onClick={() => setSelectedLanguage(lang.key)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedLanguage === lang.key 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
            </div>
          </div>

          {/* Active Filter Clear */}
          {(selectedDay !== "All" || selectedTag !== "All" || selectedLanguage !== "All") && (
            <button 
              onClick={() => { setSelectedDay("All"); setSelectedTag("All"); setSelectedLanguage("All"); }}
              className="mt-4 flex items-center text-xs text-blue-600 font-semibold hover:text-blue-800"
            >
              <X className="w-3 h-3 mr-1" /> Reset Filters
            </button>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {IconMap[event.icon_name] || <Users className="w-5 h-5" />}
                  </div>
                  <span className="text-[10px] font-bold uppercase py-1 px-2 bg-slate-100 text-slate-500 rounded">
                    {event.tag_label} {/* Translated Tag */}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    {event.day_text} {event.time_text}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Languages className="w-4 h-4 mr-2 text-slate-400" />
                    {event.language_label} {/* Translated Language Name */}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                    {event.location}
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-500 leading-relaxed italic">
                  {event.description}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <Filter className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">No events found matching these filters.</p>
              <button 
                onClick={() => { setSelectedDay("All"); setSelectedTag("All"); }}
                className="text-blue-600 text-sm underline mt-2"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
  );
};

export default RegularEvents;
