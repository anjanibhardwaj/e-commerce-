import React from 'react';
import { Users, PackageCheck, Layers, MapPin } from 'lucide-react';

export default function WhyChooseUs() {
  const stats = [
    {
      id: 1,
      count: "51 Million+",
      label: "Registered users as of Aug 18, 2025",
      icon: Users,
      bg: "bg-teal-50 text-teal-700 border-teal-200"
    },
    {
      id: 2,
      count: "71 Million+",
      label: "Orders on PharmEasy till date",
      icon: PackageCheck,
      bg: "bg-sky-50 text-sky-700 border-sky-200"
    },
    {
      id: 3,
      count: "60000+",
      label: "Unique items sold last 6 months",
      icon: Layers,
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      id: 4,
      count: "19000+",
      label: "Pin codes serviced last 3 months",
      icon: MapPin,
      bg: "bg-rose-50 text-rose-700 border-rose-200"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Why Choose Us?
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          India's most trusted online healthcare network delivering healthcare at the speed of life
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 flex items-start space-x-4 hover:shadow-md transition group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${stat.bg}`}>
                <Icon className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-gray-900 group-hover:text-teal-700 transition">
                  {stat.count}
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-1 leading-snug">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
