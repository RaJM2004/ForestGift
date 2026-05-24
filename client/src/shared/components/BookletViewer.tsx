import React, { useState, useEffect } from 'react';

interface BookletViewerProps {
  title: string;
  imageFolder: string;
  pageCount: number;
}

export const BookletViewer: React.FC<BookletViewerProps> = ({ title, imageFolder, pageCount }) => {
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-100 pt-28 md:pt-40 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-['League_Spartan']">{title}</h1>
          <div className="w-24 h-1 bg-[#247114] mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="flex flex-col items-center gap-6 md:gap-10">
          {pages.map((pageNumber) => (
            <div 
              key={pageNumber} 
              className="w-full bg-white shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700"
              style={{ animationDelay: `${Math.min(pageNumber * 50, 500)}ms` }}
            >
              <img 
                src={`/booklets/${imageFolder}/page_${pageNumber}.jpg`} 
                alt={`${title} - Page ${pageNumber}`}
                className="w-full h-auto object-contain"
                onLoad={() => setImagesLoaded(prev => prev + 1)}
              />
            </div>
          ))}
        </div>
        
        {imagesLoaded < pageCount && (
          <div className="fixed bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium z-50">
            Loading pages: {imagesLoaded} / {pageCount}
          </div>
        )}
      </div>
    </div>
  );
};
