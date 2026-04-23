"use client";

import React, { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, Users, BookOpen, Coffee, Languages, Filter, X, University, Briefcase } from 'lucide-react';

const RegularEvents = () => {
  const allEvents = [
    {
      title: "English Service",
      day: "Sundays",
      time: "9:00 AM",
      location: "Main Hall and Online",
      language: "English",
      description: "Worship, prayer and teaching.",
      icon: <Users className="w-5 h-5" />,
      tag: "Service"
    },
    {
      title: "Mandarin Service",
      day: "Sundays",
      time: "9:00 AM",
      location: "Side Hall and Online",
      language: "Mandarin",
      description: "Worship and teaching.",
      icon: <Users className="w-5 h-5" />,
      tag: "Service"
    },
    {
      title: "Saturday Cantonese Service",
      day: "Saturday",
      time: "10:00 AM",
      location: "Main Hall",
      language: "Cantonese",
      description: "Worship, teaching and group discussion.",
      icon: <Users className="w-5 h-5" />,
      tag: "Service"
    },
    {
      title: "Sunday Cantonese Service",
      day: "Sundays",
      time: "11:00 AM",
      location: "Main Hall",
      language: "Cantonese",
      description: "Worship, teaching and Q&A.",
      icon: <Users className="w-5 h-5" />,
      tag: "Service"
    },
    {
      title: "Prayer Meeting",
      day: "Wednesdays",
      time: "8:00 PM",
      location: "Online",
      language: "Cantonese",
      description: "A focused time of intercession and community prayer.",
      icon: <Clock className="w-5 h-5" />,
      tag: "Prayer"
    },
    {
      title: "TYF",
      day: "Fridays",
      time: "7:30 PM",
      location: "Side Hall",
      language: "English",
      description: "High energy small groups for grades 6-12.",
      icon: <Coffee className="w-5 h-5" />,
      tag: "Youth"
    },
    {
      title: "PLUS",
      day: "Wednesday",
      time: "8:00 PM",
      location: "Rooms 5-7",
      language: "English",
      description: "",
      icon: <University className="w-5 h-5" />,
      tag: "University/TAFE"
    },
    {
      title: "CYF",
      day: "Fridays",
      time: "8:00 PM",
      location: "Main Hall",
      language: "Cantonese",
      description: "",
      icon: <Briefcase className="w-5 h-5" />,
      tag: "Young worker"
    },
    {
      title: "Adult Cells",
      day: "Various",
      time: "Various Times",
      location: "Various",
      language: "English, Cantonese, Mandarin",
      description: "Deep dive into a small group setting.",
      icon: <BookOpen className="w-5 h-5" />,
      tag: "Adults"
    },
    {
      title: "Cells",
      day: "Various",
      time: "",
      location: "Various",
      language: "English",
      description: "Deep dive into a small group setting.",
      icon: <BookOpen className="w-5 h-5" />,
      tag: "Cells"
    },
    {
      title: "Adult Cells",
      day: "Various",
      time: "",
      location: "Various",
      language: "Cantonese",
      description: "Deep dive into a small group setting.",
      icon: <BookOpen className="w-5 h-5" />,
      tag: "Cells"
    },
    {
      title: "Young Family Cells",
      day: "Various",
      time: "",
      location: "Various",
      language: "Cantonese",
      description: "Small group for young Young Family family",
      icon: <BookOpen className="w-5 h-5" />,
      tag: "Cells"
    },
    {
      title: "Adult Cells",
      day: "Various",
      time: "",
      location: "Various",
      language: "Mandarin",
      description: "Deep dive into a small group setting.",
      icon: <BookOpen className="w-5 h-5" />,
      tag: "Cells"
    },
  ];

  // State for Filters
  const [selectedDay, setSelectedDay] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  
  // Derived Data (Unique Days/Tags for the UI)
  const days = ["All", ...Array.from(new Set(allEvents.map(e => e.day)))];
  const tags = ["All", ...Array.from(new Set(allEvents.map(e => e.tag)))];
  const languages = ["All", ...Array.from(new Set(allEvents.map(e => e.language)))];
  
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      const dayMatch = selectedDay === "All" || event.day === selectedDay;
      const tagMatch = selectedTag === "All" || event.tag === selectedTag;
      const languageMatch = selectedLanguage === "All" || event.language === selectedLanguage;
      return dayMatch && tagMatch && languageMatch;
    });
  }, [selectedDay, selectedTag, selectedLanguage]);
  
  return (
    <section className="py-16 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">All regular gatherings in a glance</h2>
          <p className="text-slate-500 mt-2">Whether you're looking for a place to worship, bible study, or connect, 
            there is a place for you here every week.</p>
        </div>

        {/* Filter Controls */}
        <div className="bg-slate-50 p-6 rounded-2xl mb-10 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            
            {/* Day Filter */}
            <div className="w-full">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">Filter by Day</label>
              <div className="flex flex-wrap gap-2">
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
              </div>
            </div>

            {/* Tag Filter */}
            <div className="w-full md:w-auto md:min-w-[200px]">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">Category</label>
              <select 
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {tags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div className="w-full md:w-auto md:min-w-[200px]">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">Language</label>
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {languages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Clear */}
          {(selectedDay !== "All" || selectedTag !== "All") && (
            <button 
              onClick={() => { setSelectedDay("All"); setSelectedTag("All"); }}
              className="mt-4 flex items-center text-xs text-blue-600 font-semibold hover:text-blue-800"
            >
              <X className="w-3 h-3 mr-1" /> Reset Filters
            </button>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <div key={index} className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {event.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase py-1 px-2 bg-slate-100 text-slate-500 rounded">
                    {event.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    {event.day} {event.time}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Languages className="w-4 h-4 mr-2 text-slate-400" />
                    {event.language}
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
    </section>
  );
};

export default RegularEvents;
