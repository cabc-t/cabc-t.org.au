"use client";

import Link from "next/link";
import { getTranslations } from "@/lib/translations";
import { useClientLocale } from "./ClientLocale";

export function Footer() {
  const locale = useClientLocale();
  const t = getTranslations(locale);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display font-bold text-lg text-white mb-4">
              {t.siteName}
            </h3>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              {locale === "en" 
                ? "To nurture disciples in God's word. Be sowers of God's love."
                : locale === "tc"
                ? "以神的話語培育門徒，成為散播神愛的播種者"
                : "以神的话语培育门徒，成为散播神爱的播种者"}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">{t.footer.statementsOfFaith}</h4>
            <nav className="flex flex-col gap-2.5">
              <Link
                href={`/${locale}/statements-of-faith`}
                className="text-sm hover:text-amber-400 transition-colors"
              >
                {t.nav.statementsOfFaith}
              </Link>
              <Link
                href={`/${locale}/safe-church`}
                className="text-sm hover:text-amber-400 transition-colors"
              >
                {t.nav.safeChurch}
              </Link>
              <Link
                href={`/${locale}/privacy-policy`}
                className="text-sm hover:text-amber-400 transition-colors"
              >
                {t.nav.privacyPolicy}
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">{t.contact.title}</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <p>{t.contact.address}</p>
              <p>{t.contact.phone}</p>
              <p>
                Email:{" "}
                <a href="mailto:office@cabc-t.org.au" className="text-amber-400 hover:text-amber-300 transition-colors">
                  {t.contact.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          {t.footer.copyright.replace("{year}", String(currentYear))}
        </div>
      </div>
    </footer>
  );
}