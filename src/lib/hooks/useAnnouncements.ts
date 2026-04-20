import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { type LanguageCode } from "@/lib/i18n";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  language: string;
  created_at: string;
  priority: number;
  visibility_language: string[];
  start_date: string;
  end_date: string | null;
  image_url: string | null;
  pdf_url: string | null;
}

interface UseAnnouncementsOptions {
  locale: LanguageCode;
  limit?: number;
}

export function useAnnouncements({ locale, limit = 10 }: UseAnnouncementsOptions) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnnouncements() {
      const supabase = createClient();
      const today = new Date().toISOString().split('T')[0];
      
      try {
        let query = supabase
          .from("announcements")
          .select("id, title, content, language, created_at, priority, visibility_language, start_date, end_date, image_url, pdf_url")
          .contains("visibility_language", [locale])
          .lte("start_date", today)
          .order("priority", { ascending: true })
          .order("created_at", { ascending: false })
          .limit(limit);

        const { data, error: fetchError } = await query;

        if (fetchError) {
          setError(fetchError.message);
          return;
        }

        if (data) {
          const validAnnouncements = data.filter(
            (a: Announcement) => !a.end_date || a.end_date >= today
          );
          setAnnouncements(validAnnouncements);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchAnnouncements();
  }, [locale, limit]);

  return { announcements, loading, error };
}