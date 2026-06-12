'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type LanguageCode } from "@/lib/i18n";
import { useRouter } from "next/navigation";

interface Props {
  locale: LanguageCode;
  userId: string;
}

type ParsedAnnouncement = {
  tempId: number;
  priority: number;
  title: string;
  content: string;
  selected: boolean;
}

export default function BulkPostAnnouncementsClient({ locale, userId }: Props) {
  const supabase = createClient()
  
  const router = useRouter();

  const handleLogout = async () => {
    // 1. Sign out of Supabase to clear the session cookie
    await supabase.auth.signOut();
    
    // 2. Redirect to the localized login page
    router.push(`/${locale}/login`);
    
    // 3. Refresh the router to clear any cached authenticated states
    router.refresh();
  };
  
  // State
  const [inputText, setInputText] = useState('')
  const [language, setLanguage] = useState<'' | 'en' | 'tc' | 'sc'>('')
  const [parsedItems, setParsedItems] = useState<ParsedAnnouncement[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  // Date Logic Helpers
  const getAnnouncementDates = () => {
    const today = new Date();
    // We use local methods (getFullYear, getMonth, getDate) 
    // to avoid UTC conversion shifting the day backward.
    
    const dayOfWeek = today.getDay(); // 0 = Sun, 6 = Sat
    let startDate = new Date(today);
  
    // If it's Saturday (6), we start today.
    // Otherwise, find the upcoming Saturday.
    if (dayOfWeek !== 6) {
      const daysToSat = (6 - dayOfWeek + 7) % 7;
      startDate.setDate(today.getDate() + daysToSat);
    }
  
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
  
    // Helper to format as YYYY-MM-DD using local time
    const formatLocalIDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };
  
    return {
      start: formatLocalIDate(startDate),
      end: formatLocalIDate(endDate)
    };
  };

  // Parser Logic
  const handleParse = () => {
    if (!language) {
      setMessage('Error: Please select a language first.')
      return
    }

    // Regex to capture the NUMBER and the CONTENT separately
    // Matches "1. Text...", "2. Text..." etc.
    const regex = /(?:^|\n)(\d+)\.\s+([\s\S]+?)(?=\n\d+\.\s+|$)/g

    // Use Array.from instead of the spread operator [...]
    const matches = Array.from(inputText.matchAll(regex))

    if (matches.length === 0) {
      setMessage('Error: No numbered items found. Ensure format is "1. Content"')
      return
    }

    setParsedItems(matches.map((match, index) => ({
      tempId: index,
      priority: parseInt(match[1], 10),
      title: match[2].trim().substring(0, 10), // Initial slice                                                         
      content: match[2].trim(),
      selected: true
    })))

    setMessage(`Ready! ${matches.length} items parsed. Review and edit below.`)
  }

  // Update specific fields in the table
  const updateItem = (tempId: number, field: keyof ParsedAnnouncement, value: any) => {
    setParsedItems(prev => prev.map(item => 
      item.tempId === tempId ? { ...item, [field]: value } : item
    ))
  }
  
  const handleInsert = async () => {
    if (!userId) {
      setMessage('Error: No active session found. Please re-login.')
      return
    }
    
    setIsSubmitting(true)
    const { start, end } = getAnnouncementDates()

    // Map checked items to the table schema
    const finalData = parsedItems
      .filter(item => item.selected)
      .map(item => ({
        content: item.content,
        title: item.title,
        language: language,
        priority: item.priority,
        author_id: userId,
        start_date: start,
        end_date: end,
        visibility_language: [language], // e.g. ['en']
      }))

    const { error } = await supabase
      .from('announcements')
      .insert(finalData)

    if (error) {
      setMessage(`Database Error: ${error.message}`)
    } else {
      setMessage(`Successfully posted ${finalData.length} items for ${start} to ${end}.`)
      setParsedItems([])
      setInputText('')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans text-slate-900">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tight">Announcement Porter</h1>

        {/* Group the badge and the logout button together */}
        <div className="flex items-center space-x-4">
          <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
            AO ACCESS
          </div>
          
          <button 
            onClick={handleLogout}
            className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Logout
          </button>
        </div>
        
      </div>

      <div className="bg-slate-50 border rounded-xl p-6 mb-8 shadow-sm">
                                 
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Announcement Language</label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full p-3 border-2 rounded-lg bg-white focus:border-blue-500 outline-none transition"
            >
            <option value="">-- Choose --</option>
            <option value="en">English Congregation</option>
            <option value="tc">Cantonese Congregation</option>
            <option value="sc">Mandarin Congregation</option>
          </select>
          </div>
          {/* Info Box */}
          <div className="flex-1 text-xs text-slate-500 pb-2">
            <strong>Auto-calculations:</strong><br />
            Start: Upcoming Sat | End: Next Fri | Title: First 10 chars | Priority: From list number.
          </div>
        </div>
      </div>

      {/* Input Section */}

      <textarea
                            
                 
        className="w-full h-64 p-5 border-2 rounded-xl mb-4 focus:border-blue-500 outline-none transition font-serif text-lg shadow-inner"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder={`1. First announcement content here...\n2. Second one here...`}
      />
      
      <button
        onClick={handleParse}
        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg active:transform active:scale-[0.98]"
      >
        Parse Content for Review
      </button>
            

      {message && (
        <div className={`mt-6 p-4 rounded-lg font-medium ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {message}
        </div>
      )}

                           
      {parsedItems.length > 0 && (
        <div className="mt-10 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-lg font-bold mb-4">Review & Fine-Tune</h2>
          <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-4 w-12 text-center">Post</th>
                  <th className="p-4 w-24 text-center">Priority</th>
                  <th className="p-4 w-48 text-left">Title</th>
                  <th className="p-4 text-left">Content Preview</th>
                </tr>
              </thead>
              <tbody>
                {parsedItems.map((item) => (
                  <tr key={item.tempId} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => updateItem(item.tempId, 'selected', !item.selected)}
                        className="w-5 h-5 accent-blue-600 cursor-pointer"
                      />
                    </td>
                    <td className="p-4">
                      <input 
                        type="number"
                        value={item.priority}
                        onChange={(e) => updateItem(item.tempId, 'priority', parseInt(e.target.value))}
                        className="w-full p-2 border rounded text-center bg-white"
                      />
                    </td>
                    <td className="p-4">
                      <input 
                        type="text"
                        value={item.title}
                        onChange={(e) => updateItem(item.tempId, 'title', e.target.value)}
                        className="w-full p-2 border rounded bg-white text-sm"
                      />
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-600 max-h-20 overflow-y-auto italic">
                        {item.content}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-6 bg-slate-50 border-t flex justify-end">
              <button
                onClick={handleInsert}
                disabled={isSubmitting}
                className="px-12 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-md transition disabled:bg-slate-300"
              >
                {isSubmitting ? 'Uploading...' : 'Confirm Bulk Insert'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
