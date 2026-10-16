import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function SeoAccordion({ onKeywordClick }) {
  const [expanded, setExpanded] = useState(false);

  const topTests = [
    "CBC Test", "Troponin Test", "SGPT Test", "PSA Test", "RFT Test", "Creatinine Test",
    "D Dimer Test", "HbA1c Test", "Widal Test", "Prolactin Test", "RBS Test", "ESR Test",
    "Thyroid Profile Test", "HBsAg Test", "Lipid Profile Test", "VDRL Test", "CRP Test"
  ];

  const topHealthcare = [
    "Zincovit", "Digene Acidity & Gas Relief Tablet", "Himalaya Himcolin Gel", "I Pill Contraceptive Pill",
    "Cystone Tablet", "Buscogast 10mg", "Shelcal 500mg", "Cremaffin Syrup", "Depura Vitamin D3",
    "Himalaya Confido Tablets", "Himalaya Liv.52 Ds", "Bold Care Extend Delay Spray", "Evion 400 mg",
    "Gaviscon Liquid Instant Relief", "Unwanted 72", "Dulcoflex 5mg", "Prohance Nutrition Drink"
  ];

  const topMedicines = [
    "Dolo 650", "Nexpro Rd 40mg", "Duphaston 10mg", "Karvol Plus", "Primolut N", "Becosules",
    "Ondem Syrup", "Pan 40mg", "Meftal Spas", "Ecosprin 75mg", "Allegra 120mg", "Fourderm Cream",
    "Udiliv 300mg", "Zerodol Sp", "Omee 20mg", "Budecort 0.5mg"
  ];

  const topVaccines = [
    "Pneumosil Vaccine", "Pneumovax 23 Vaccine", "Hexaxim Injection", "Gardasil Injection",
    "Rotasil Vaccine", "Biovac A Vaccine", "Tetanus Vaccine", "Fluarix Tetra Vaccine",
    "Vaxiflu 2025-2026 Vaccine", "Typbar TCV Injection", "Nukovax 13 Vaccine", "Influvac Tetra Vaccine",
    "Boostrix Vaccine", "Menactra Injection", "Vaxigrip NH 2025/2026 Vaccine"
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-gray-200">
      <div className="space-y-4 text-xs">
        
        {/* Top Tests */}
        <div>
          <h4 className="font-bold text-gray-800 mb-1">
            Top-Tests we cover:
          </h4>
          <p className="text-gray-500 leading-relaxed">
            {topTests.map((item, idx) => (
              <span key={idx}>
                <button 
                  onClick={() => onKeywordClick && onKeywordClick(item)}
                  className="hover:text-teal-700 hover:underline cursor-pointer"
                >
                  {item}
                </button>
                {idx < topTests.length - 1 && " | "}
              </span>
            ))}
          </p>
        </div>

        {/* Top Healthcare Products */}
        <div>
          <h4 className="font-bold text-gray-800 mb-1">
            Top-Selling Healthcare Products:
          </h4>
          <p className="text-gray-500 leading-relaxed">
            {topHealthcare.map((item, idx) => (
              <span key={idx}>
                <button 
                  onClick={() => onKeywordClick && onKeywordClick(item)}
                  className="hover:text-teal-700 hover:underline cursor-pointer"
                >
                  {item}
                </button>
                {idx < topHealthcare.length - 1 && " | "}
              </span>
            ))}
          </p>
        </div>

        {/* Top Searched Medicines */}
        <div>
          <h4 className="font-bold text-gray-800 mb-1">
            Top-Searched Medicines:
          </h4>
          <p className="text-gray-500 leading-relaxed">
            {topMedicines.map((item, idx) => (
              <span key={idx}>
                <button 
                  onClick={() => onKeywordClick && onKeywordClick(item)}
                  className="hover:text-teal-700 hover:underline cursor-pointer"
                >
                  {item}
                </button>
                {idx < topMedicines.length - 1 && " | "}
              </span>
            ))}
          </p>
        </div>

        {/* Top Searched Vaccines */}
        <div>
          <h4 className="font-bold text-gray-800 mb-1">
            Top Searched Vaccines:
          </h4>
          <p className="text-gray-500 leading-relaxed">
            {topVaccines.map((item, idx) => (
              <span key={idx}>
                <button 
                  onClick={() => onKeywordClick && onKeywordClick(item)}
                  className="hover:text-teal-700 hover:underline cursor-pointer"
                >
                  {item}
                </button>
                {idx < topVaccines.length - 1 && " | "}
              </span>
            ))}
          </p>
        </div>

      </div>
    </section>
  );
}
