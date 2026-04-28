export const languages = {
  en: { label: "English", nativeLabel: "EN", dir: "ltr" as const },
  tc: { label: "Cantonese", nativeLabel: "繁", dir: "ltr" as const },
  sc: { label: "Mandarin", nativeLabel: "简", dir: "ltr" as const },
} as const;

export type LanguageCode = keyof typeof languages;

export const defaultLanguage: LanguageCode = "en";

export const routing = {
  locales: ["en", "tc", "sc"] as const,
  defaultLocale: "en",
};

export interface LocaleProps {
  locale: LanguageCode;
}


