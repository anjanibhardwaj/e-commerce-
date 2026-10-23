import React from 'react';
import { ArrowRight, Shield, Zap, Sparkles, Heart } from 'lucide-react';

export default function PromoStrip({ onBannerClick }) {
  const promos = [
    {
      id: "p1",
      title: "Sunscreen Protection",
      desc: "Upto 35% off on SPF 50+ mineral sunblocks",
      code: "SUNCARE",
      bg: "from-amber-500 to-orange-600",
      icon: Shield
    },
    {
      id: "p2",
      title: "Men's Multivitamin",
      desc: "Energy & daily stamina essentials for every age",
      code: "MENHEALTH",
      bg: "from-blue-600 to-indigo-700",
      icon: Zap
    },
    {
      id: "p3",
      title: "Feel 50% More Energetic",
      desc: "Get extra 5% Plus cashback on immunity range",
      code: "PLUSVITAL",
      bg: "from-teal-600 to-emerald-700",
      icon: Sparkles
    },
    {
      id: "p4",
      title: "GRD Superior Protein",
      desc: "Whey protein enriched with 27 vital nutrients",
      code: "GRDPRO",
      bg: "from-rose-600 to-red-700",
      icon: Heart
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {promos.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id}
              onClick={() => onBannerClick(item.title)}
              className={`bg-gradient-to-br ${item.bg} rounded-2xl p-4 text-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group hover:scale-[1.02]`}
            >
              <div className="space-y-1 pr-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block">
                  {item.code}
                </span>
                <h4 className="text-sm font-bold leading-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] text-white/80 leading-snug">
                  {item.desc}
                </p>
              </div>

              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-gray-900 transition text-white">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
