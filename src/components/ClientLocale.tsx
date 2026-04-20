"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { languages, defaultLanguage, type LanguageCode } from "@/lib/i18n";

export function useClientLocale(): LanguageCode {
  const pathname = usePathname();

  return useMemo(() => {
    const segment = pathname.split("/")[1];
    if (segment && segment in languages && languages[segment as LanguageCode]) {
      return segment as LanguageCode;
    }
    return defaultLanguage;
  }, [pathname]);
}