import type { Metadata } from "next";
import { type LanguageCode } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "../globals.css"; // Double-check this relative path is still correct!

// 1. Export your metadata here
export const metadata: Metadata = {
  title: "CABC Thornleigh",
  description: "Chinese Australian Baptist Church - Thornleigh",
  icons: {
    icon: "/images/favicon.png",
  },
};

// 2. Type your props (params are Promises in recent Next.js versions)
type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// 3. Keep your async layout
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const safeLocale = locale as LanguageCode;
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-gray-50 min-h-screen flex flex-col" suppressHydrationWarning>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer locale={safeLocale} />
      </body>
    </html>
  );
}
