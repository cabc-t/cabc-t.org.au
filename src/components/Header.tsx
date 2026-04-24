"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { languages, type LanguageCode } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { useClientLocale } from "./ClientLocale";
import { is } from "date-fns/locale";

export function Header() {
  const locale = useClientLocale();
  const t = getTranslations(locale);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSermonsPage = pathname === `/${locale}/sermons`;
  const isAnnouncementsPage = pathname === `/${locale}/announcements`;

  const navItems = [
    { href: `/${locale}`, label: t.nav.home },
    ...(isAnnouncementsPage ? [] : [{ href: `/${locale}#news`, label: t.nav.announcements }]),
    { href: `/${locale}#services`, label: t.nav.services },
    { href: `/${locale}#children`, label: t.nav.children },
    { href: `/${locale}#cells`, label: t.nav.cells },
    { href: `/${locale}#regularEvents`, label: t.nav.regularEvents },
    ...(isSermonsPage ? [] : [{ href: `/${locale}#sermons`, label: t.nav.sermons }]),
    { href: `/${locale}#about`, label: t.nav.about },
  ];

  const currentPath = pathname.replace(/^\/[a-z]{2}/, "") || "/";

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <img 
              src="/images/cabct-logo-raw.png.webp" 
              alt="CABC Thornleigh" 
              className="h-10 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  (item.href === `/${locale}` && currentPath === "/") ||
                  (item.href !== `/${locale}` && pathname.startsWith(item.href))
                    ? "text-[#263880] bg-gray-100"
                    : "text-gray-600 hover:text-[#263880] hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex gap-1">
              {(Object.keys(languages) as LanguageCode[]).map((lang) => (
                <Link
                  key={lang}
                  href={pathname.replace(/^\/[a-z]{2}/, `/${lang}`) || `/${lang}`}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    lang === locale
                      ? "text-[#263880] bg-gray-200"
                      : "text-gray-500 hover:text-[#263880] hover:bg-gray-100"
                  }`}
                >
                  {languages[lang].nativeLabel}
                </Link>
              ))}
            </div>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} className="text-gray-800" /> : <Menu size={24} className="text-gray-800" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  pathname.startsWith(item.href)
                    ? "text-[#263880] bg-gray-100"
                    : "text-gray-600 hover:text-[#263880] hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-4 mt-2 border-t border-gray-200">
              <div className="flex gap-2">
                {(Object.keys(languages) as LanguageCode[]).map((lang) => (
                  <Link
                    key={lang}
                    href={pathname.replace(/^\/[a-z]{2}/, `/${lang}`) || `/${lang}`}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      lang === locale
                        ? "text-[#263880] bg-gray-200 font-medium"
                        : "text-gray-500 hover:text-[#263880] hover:bg-gray-100"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {languages[lang].nativeLabel}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}