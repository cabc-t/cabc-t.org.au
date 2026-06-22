export const languages = {
  en: { label: "English", nativeLabel: "EN", dir: "ltr" as const },
  tc: { label: "Cantonese", nativeLabel: "粵語堂", dir: "ltr" as const },
  sc: { label: "Mandarin", nativeLabel: "国语堂", dir: "ltr" as const },
} as const;

export type LanguageCode = keyof typeof languages;

export const defaultLanguage: LanguageCode = "en";
