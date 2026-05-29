"use client";

import { useState, useMemo, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { type LanguageCode } from "@/lib/i18n";
import { getTranslations, type Translations, LocaleProps } from "@/lib/translations";
import { ChevronDown, ChevronUp, Loader2, X } from 'lucide-react';
import { EventProps } from "@/lib/event";
import { EventTableRow } from "./EventTableRow";

export function RegularEvents({ locale }: LocaleProps) {
  const t: Translations = getTranslations(locale);

  const supabase = useMemo(() => createClient(), []);
  
  const [allEvents, setAllEvents] = useState<EventProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for Filters
  const [selectedDay, setSelectedDay] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");

  const allLabel = t.filters.all;

  const DAY_ORDER: Record<string, number> = {
    "Sunday": 0, "Saturday": 1, "Friday": 2, "Thursday": 3, "Wednesday": 4, "Tuesday": 5, "Monday": 6,
    "星期日": 0, "星期六": 1, "星期五": 2, "星期四": 3, "星期三": 4, "星期二": 5, "星期一": 6,
    "周日": 0, "周六": 1, "周五": 2, "周四": 3, "周三": 4, "周二": 5, "周一": 6,
  };

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

  const LOCALE_TO_LABEL: Record<string, string> = {
    en: "English",
    tc: "粵語",
    sc: "国语",
  };

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

// console.log('Current Locale:', locale);
// console.log('Fetched Data:', data);

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

        // Auto-set the language filter to match the fetched locale
        if (formattedEvents.length > 0) {
// console.log('Current Locale:', locale);
// console.log('formattedEvents:', formattedEvents);
          // Map locale code to language label ---
          const targetLabel = LOCALE_TO_LABEL[locale];

          if (targetLabel) {
            setSelectedLanguage(targetLabel);
          } else {
            setSelectedLanguage("All");
          }
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [supabase, locale]); // Refetch if locale changes!
  
  const sortedEvents = useMemo(() => {
    // 1. Start with your filtered array
    const filtered = allEvents.filter(event => {
      const dayMatch = selectedDay === "All" || event.day_text === selectedDay;
      const tagMatch = selectedTag === "All" || event.tag_key === selectedTag;
      const languageMatch = selectedLanguage === "All" || event.language_label === selectedLanguage;
      return dayMatch && tagMatch && languageMatch;
    });
  
    // 2. Apply the Sort
    return [...filtered].sort((a, b) => {
      // LEVEL 1: Day of the Week
      const dayA = DAY_ORDER[a.day_text || ""] ?? 7; // Use 7 for "No set day" to put at end
      const dayB = DAY_ORDER[b.day_text || ""] ?? 7;
      
      if (dayA !== dayB) return dayA - dayB;
  
      // LEVEL 2: Category (Tag Label)
      // localeCompare is great for alphabetical sorting of strings
      const tagSort = (a.tag_label || "").localeCompare(b.tag_label || "");
      if (tagSort !== 0) return tagSort;
  
      // LEVEL 3: Name (Title)
      return (a.title || "").localeCompare(b.title || "");
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
              <label htmlFor="day-filter" className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">{t.filters.by_day}</label>
              <div id="day-filter" className="flex flex-wrap gap-2">
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
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">{t.filters.category}</label>
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
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">{t.filters.language}</label>
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
              <X className="w-3 h-3 mr-1" />{t.filters.reset}
            </button>
          )}
        </div>

        {/* Results Grid */}
    <div className="w-full overflow-hidden border border-slate-200 rounded-xl bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <tbody className="divide-y divide-slate-100">
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event) => (
              <EventTableRow key={event.id} event={event} />
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <p>{t.filters.no_events}</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      </div>
  );
};
