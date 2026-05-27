import { type LanguageCode } from "@/lib/i18n";
import AnnouncementsClient from "./AnnouncementsClient";

export default async function AnnouncementsPage({
  params 
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale         = resolvedParams.locale as LanguageCode;

  // Pass the resolved string down to the client component
  return <AnnouncementsClient locale={locale} />;
}
