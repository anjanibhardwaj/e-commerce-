import React from 'react';
import { Crown, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function PlusBanner({ onExplorePlus }) {
  return (
    <section id="plus-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg border border-purple-800">
        
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>PHARMEASY PLUS VIP MEMBERSHIP</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Become a <span className="text-amber-400">Plus</span> member
            </h2>

            <p className="text-sm sm:text-base text-purple-200 max-w-xl">
              And enjoy extra bachat on every order! Get 5% cashback, ZERO delivery fees on ₹199+, and free home diagnostic sample collections.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-purple-100 font-medium">
              <span className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mr-1" />
                Extra 5% Plus Cashback
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mr-1" />
                Free Delivery Above ₹199
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mr-1" />
                Complimentary Health Checkup
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <button 
              onClick={onExplorePlus}
              className="bg-amber-400 hover:bg-amber-300 text-purple-950 font-black px-7 py-3.5 rounded-2xl text-sm sm:text-base shadow-xl transition-all duration-200 hover:scale-105 flex items-center space-x-2 cursor-pointer"
            >
              <span>Explore Now</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
