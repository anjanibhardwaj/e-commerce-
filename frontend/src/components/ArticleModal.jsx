import React from 'react';
import { X, Clock, UserCheck, ShieldCheck, Share2, Bookmark } from 'lucide-react';

export default function ArticleModal({ article, isOpen, onClose }) {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Image */}
        <div className="h-56 w-full relative">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover" 
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full cursor-pointer transition backdrop-blur-xs"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="absolute bottom-3 left-4 bg-teal-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {article.category}
          </span>
        </div>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Metadata */}
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 border-b border-gray-100 pb-3 gap-2">
            <div className="flex items-center space-x-1.5 font-semibold text-emerald-800">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
            {article.title}
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <p className="font-semibold text-gray-900 bg-teal-50/50 p-3 rounded-xl border border-teal-100">
              {article.summary}
            </p>

            <h4 className="text-sm font-bold text-gray-900 pt-2">Clinical Overview &amp; Diagnostics</h4>
            <p>
              Diagnostic evaluation is critical when assessing abnormal hematological ranges or chronic physiological symptoms. Modern clinical practice leverages automated analyzers and calibrated biomarkers to differentiate benign inflammations from underlying cellular disruptions.
            </p>

            <h4 className="text-sm font-bold text-gray-900 pt-2">Recommended Precautions &amp; Refined Protocols</h4>
            <p>
              Patients are encouraged to review these diagnostic metrics alongside a licensed physician or consulting oncologist. Never adjust prescribed medical regimens without verified clinical consultations.
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs font-bold text-teal-800">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Medically Reviewed by PharmEasy Editorial Board</span>
            </div>
            <button 
              onClick={onClose}
              className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Close Article
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
