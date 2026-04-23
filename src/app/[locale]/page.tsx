import { languages, type LanguageCode } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { YOUTUBE_CHANNEL_URL } from "@/lib/constants";
import { Announcements } from "@/components/Announcements";
import { SermonsList } from "@/components/SermonsList";
import RegularEvents from "@/components/RegularEvents";

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = (params.locale && params.locale in languages ? params.locale : "en") as LanguageCode;
  const t = getTranslations(locale);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e293b] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
            {t.hero.welcome}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            {t.hero.youtubeLink}
          </a>
        </div>
      </section>

      {/* Announcements */}
      <section id="news" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Announcements locale={locale} limit={10} showTitle={true} />
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8 text-center">
            {t.community.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                {t.community.multicultural}
              </h3>
              <p className="text-gray-600">{t.community.multiculturalDesc}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                {t.community.inclusive}
              </h3>
              <p className="text-gray-600">{t.community.inclusiveDesc}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                {t.community.welcoming}
              </h3>
              <p className="text-gray-600">{t.community.welcomingDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sunday Services */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8 text-center">
            {t.services.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                {t.services.cantonese}
              </span>
              <p className="text-2xl font-bold text-gray-900 mt-3">{t.services.cantoneseTime}</p>
              <p className="text-gray-600 mt-1">{t.services.mainHall}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded">
                {t.services.mandarin}
              </span>
              <p className="text-2xl font-bold text-gray-900 mt-3">{t.services.mandarinTime}</p>
              <p className="text-gray-600 mt-1">{t.services.sideHall}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-700 rounded">
                {t.services.english}
              </span>
              <p className="text-2xl font-bold text-gray-900 mt-3">{t.services.englishTime}</p>
              <p className="text-gray-600 mt-1">{t.services.mainHall}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Children's Ministry */}
      <section id="children" className="py-24" style={{ backgroundColor: "rgba(247, 239, 250, 1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-8">
            {locale === "en" ? "Nurturing Children's Ministry" : locale === "tc" ? "培育兒童事工" : "培育儿童事工"}
          </h3>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h4 className="text-xl font-display font-semibold text-gray-900 mb-4">
                  {t.children.program}
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• {t.children.learn}</li>
                  <li>• {t.children.love}</li>
                  <li>• {t.children.live}</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h4 className="text-xl font-display font-semibold text-gray-900 mb-4">
                  {t.children.material}
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• {t.children.heartTransforming}</li>
                  <li>• {t.children.ageAligned}</li>
                  <li>• {t.children.chronological}</li>
                  <li>• {t.children.theologicallyRich}</li>
                  <li>• {t.children.missionallyMinded}</li>
                  <li>• {t.children.christCentred}</li>
                </ul>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="/images/creatvise-dMVYJDwrBrU-unsplash.jpg.webp"
                alt="Children's Ministry" 
                className="w-full h-80 lg:h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Youth Programs - English only */}
      {locale === "en" && (
      <section className="py-16 bg-gradient-to-br from-violet-50 via-white to-violet-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4 text-center">
            {t.youth.title}
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-xl mx-auto">
            {t.youth.subtitle}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-violet-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.youth.community}
              </h3>
              <p className="text-gray-600 text-sm">
                {t.youth.communityDesc}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-violet-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.youth.teaching}
              </h3>
              <p className="text-gray-600 text-sm">
                {t.youth.teachingDesc}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-violet-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.youth.leadership}
              </h3>
              <p className="text-gray-600 text-sm">
                {t.youth.leadershipDesc}
              </p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Seniors - TC only */}
      {locale === "tc" && (
      <section className="py-16 bg-gradient-to-br from-amber-50 via-white to-amber-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8 text-center">
            {t.seniors.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.seniors.serve}
              </h3>
              <p className="text-gray-600 text-sm">{t.seniors.serveDesc}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.seniors.build}
              </h3>
              <p className="text-gray-600 text-sm">{t.seniors.buildDesc}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.seniors.grow}
              </h3>
              <p className="text-gray-600 text-sm">{t.seniors.growDesc}</p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Seniors - SC only */}
      {locale === "sc" && (
      <section className="py-16 bg-gradient-to-br from-rose-50 via-white to-rose-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8 text-center">
            {t.seniors.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-rose-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.seniors.serve}
              </h3>
              <p className="text-gray-600 text-sm">{t.seniors.serveDesc}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-rose-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.seniors.build}
              </h3>
              <p className="text-gray-600 text-sm">{t.seniors.buildDesc}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-rose-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.seniors.grow}
              </h3>
              <p className="text-gray-600 text-sm">{t.seniors.growDesc}</p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Small Groups */}
      <section id="cells" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">
                {t.smallGroups.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                {locale === "en" ? "Dive deeper in faith together" : locale === "tc" ? "在信仰中更深入" : "在信仰中更深入"}
              </p>
              <div className="mt-6 w-16 h-1 bg-[#263880] rounded-full"></div>
              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#263880]/10 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#263880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M12 7v14"></path>
                      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">{t.smallGroups.diveDeeperDesc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">{t.smallGroups.encourageDesc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#263880]/10 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#263880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"></path>
                      <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"></path>
                      <path d="m2 15 6 6"></path>
                      <path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">{locale === "en" ? "Build lasting connections, extend a helping hand in times of need" : locale === "tc" ? "建立持久的聯繫，在需要的時候伸出援手" : "建立持久的联系，在需要的时候伸出援手"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://www.cabc-t.org.au/sites/default/files/styles/pb_original_size/public/2024-11/nemo-L_tUFRgsTm4-unsplash.jpg.webp?itok=MmD9qmgq" 
                alt="Small Groups" 
                className="w-full h-80 lg:h-[420px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Regular Events */}
      <section id="regularEvents" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RegularEvents locale={locale} />
        </div>
      </section>
      
      {/* Recent Sermons */}
      <section id="sermons" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SermonsList locale={locale} limit={6} showTitle={true} horizontalScroll={true} />
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-6 text-center">
            {t.about.title}
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 leading-relaxed">
              {t.about.history}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}