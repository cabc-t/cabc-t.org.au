import React from 'react';
import { Calendar, Clock, MapPin, Users, BookOpen, Coffee, Languages } from 'lucide-react';

const RegularEvents = () => {
  const events = [
    {
      title: "English Service",
      day: "Sundays",
      time: "9:00 AM",
      location: "Main Hall and Online",
      language: "English",
      description: "Worship and teaching.",
      icon: <Users className="w-5 h-5" />,
      tag: "Everyone"
    },
    {
      title: "Mandarin Service",
      day: "Sundays",
      time: "9:00 AM",
      location: "Side Hall and Online",
      language: "Mandarin",
      description: "Worship and teaching.",
      icon: <Users className="w-5 h-5" />,
      tag: "Everyone"
    },
    {
      title: "Cantonese Service",
      day: "Saturday, Sundays",
      time: "10:00 AM, 11:00 AM",
      location: "Main Hall",
      language: "Cantonese",
      description: "Worship and teaching.",
      icon: <Users className="w-5 h-5" />,
      tag: "Everyone"
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
      title: "CYF",
      day: "Fridays",
      time: "8:00 PM",
      location: "Main Hall",
      language: "Cantonese",
      description: "",
      icon: <Coffee className="w-5 h-5" />,
      tag: "Young worker"
    },
    {
      title: "Cells",
      day: "Various",
      time: "Various Times",
      location: "Various",
      language: "English, Cantonese, Mandarin",
      description: "Deep dive into a small group setting.",
      icon: <BookOpen className="w-5 h-5" />,
      tag: "Adults"
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            All regular gatherings in a glance
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Whether you're looking for a place to worship, bible study, or connect, 
            there is a place for you here every week.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  {event.icon}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">
                  {event.tag}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {event.title}
              </h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-slate-600 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{event.day}</span>
                </div>
                <div className="flex items-center text-slate-600 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-slate-600 text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-slate-600 text-sm">
                  <Languages className="w-4 h-4 mr-2" />
                  <span>{event.language}</span>
                </div>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {event.description}
              </p>

              {/*
              <button className="w-full py-2 px-4 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors">
                Learn More
              </button>
*/}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default RegularEvents;
