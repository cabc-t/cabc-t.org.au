import Link from "next/link";
import { type LanguageCode } from "@/lib/i18n";

// Adjust these types to match your actual translation data structure
export interface PastorData {
  name: string;
  title: string;
  photo: string;
  bio?: string;
}

interface PastorCardProps {
  pastor: PastorData;
  locale: LanguageCode;
  isSummary?: boolean;
}

export function PastorSection({ pastor, locale, isSummary = false }: PastorCardProps) {
  const anchorId = "pastors";
  return (
    <div 
      id={anchorId} 
      className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full scroll-mt-24"
    >
      <div className="aspect-[4/5] bg-gray-200 relative">
        <img
          src={pastor.photo}
          alt={pastor.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-display font-bold text-gray-900 mb-1">
          {pastor.name}
        </h2>
        <p className="text-[#263880] font-medium mb-4">
          {pastor.title}
        </p>
        
        {isSummary ? (
          // Summary Mode: Link points to the collective page + anchor
          <div className="mt-auto pt-2">
            <Link 
              href={`/${locale}/pastors`}
              className="text-[#263880] font-bold text-sm hover:underline flex items-center"
            >
              Read full bio &rarr;
            </Link>
          </div>
        ) : (
          // Detail Mode: Show Bio
          <div className="text-gray-600 text-sm whitespace-pre-line mt-auto">
            {pastor.bio}
          </div>
        )}
      </div>
    </div>
  );
}

export default PastorSection;
