import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server'; // Use the wrapper you created
import BulkPostAnnouncementsClient from './BulkPostAnnouncementsClient';
import { type LanguageCode } from '@/lib/i18n';

export default async function BulkPostAnnouncements({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  // 1. Unwrap the params
  const resolvedParams = await params;
  const locale         = resolvedParams.locale as LanguageCode;

  // 2. Initialize the Supabase server client securely
  const supabase = await createClient();

  // 3. Fetch the user (getUser is more secure than getSession for auth checks)
  const { data: { user } } = await supabase.auth.getUser();

  // 4. (Optional but recommended) Server-side fallback protection
  // Your middleware handles this, but a fallback redirect here ensures 
  // 100% security if the middleware is ever bypassed or misconfigured.
  if (!user) {
    redirect(`/${locale}/login`);
  }

  // 5. Render the client component and pass down necessary data
  return (
    <BulkPostAnnouncementsClient 
      locale={locale} 
      userId={user.id} 
    />
  );
}
