import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { type LanguageCode } from "@/lib/i18n";

export function extractVideoId(url: string): string | null {
  const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export interface Sermon {
  id: string;
  title: string;
  date: string;
  youtube_url: string;
  language: string;
  preacher: string;
}

interface UseSermonsOptions {
  locale: LanguageCode;
  limit?: number;
}

export function useSermons({ locale, limit = 10 }: UseSermonsOptions) {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSermons() {
      const supabase = createClient();
      
      try {
        const { data, error: fetchError } = await supabase
          .from("sermons")
          .select("id, title, date, youtube_url, language, preacher")
          .or(`language.eq.${locale},language.eq.all`)
          .order("date", { ascending: false })
          .limit(limit);

        if (fetchError) {
          setError(fetchError.message);
          return;
        }

        if (data) {
          const validSermons = data.filter((sermon: Sermon) => extractVideoId(sermon.youtube_url) !== null);
          setSermons(validSermons);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchSermons();
  }, [locale, limit]);

  return { sermons, loading, error };
}