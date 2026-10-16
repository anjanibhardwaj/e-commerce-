import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, Clock, UserCheck } from 'lucide-react';
import { mockHealthArticles } from '../data/mockData';

export default function HealthArticles({ onSelectArticle }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="health-articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Health Articles
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Verified medical insights written and curated by specialist doctors
          </p>
        </div>

        <a 
          href="#health-articles" 
          className="text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 flex items-center hover:underline"
        >
          View All <ChevronRight className="w-4 h-4 ml-0.5" />
        </a>
      </div>

      <div className="relative group">
        <button 
          onClick={() => scroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition hidden md:flex"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div 
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto no-scrollbar py-2 px-1"
        >
          {mockHealthArticles.map((article) => (
            <div 
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="shrink-0 w-64 sm:w-72 bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-200 hover:border-teal-400 cursor-pointer flex flex-col justify-between group/art"
            >
              <div>
                {/* Article Image with PharmEasy Watermark */}
                <div className="h-40 w-full overflow-hidden relative">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover/art:scale-105 transition duration-300"
                  />
                  <span className="absolute bottom-2 left-2 bg-teal-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    PharmEasy Health Hub
                  </span>
                </div>

                {/* Article Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-teal-700 font-semibold">
                    <span>{article.category}</span>
                    <span className="flex items-center text-gray-400 font-normal">
                      <Clock className="w-3 h-3 mr-1" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-gray-800 group-hover/art:text-teal-700 transition leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Author badge */}
              <div className="p-4 pt-0 text-[11px] text-gray-500 flex items-center border-t border-gray-50 mt-2">
                <UserCheck className="w-3.5 h-3.5 text-teal-600 mr-1.5" />
                <span className="truncate">{article.author}</span>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition hidden md:flex"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
