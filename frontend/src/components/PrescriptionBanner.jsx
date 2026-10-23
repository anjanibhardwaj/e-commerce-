import React from 'react';
import { UploadCloud, FileText, CheckCircle2, ShieldCheck, PhoneCall, Truck } from 'lucide-react';

export default function PrescriptionBanner({ onOpenPrescription }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-gradient-to-r from-teal-50/70 via-sky-50/60 to-white border border-teal-100 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Block: Order with Prescription CTA */}
          <div className="lg:col-span-5 flex items-start space-x-4 border-b lg:border-b-0 lg:border-r border-teal-100 pb-6 lg:pb-0 lg:pr-8">
            <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center shrink-0 shadow-md text-white">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <span className="inline-block text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800 mb-1">
                E-Prescription Express
              </span>
              <h2 className="text-xl font-extrabold text-gray-800 leading-tight">
                Order with Prescription
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Upload prescription and our registered pharmacists will verify and deliver your medicines safely.
              </p>
              <div className="mt-4">
                <button 
                  onClick={onOpenPrescription}
                  className="inline-flex items-center space-x-2 bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-all hover:shadow hover:scale-105 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4 mr-1" />
                  <span>Upload Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Block: How does this work? (4 Steps) */}
          <div className="lg:col-span-7">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center">
              <ShieldCheck className="w-4 h-4 text-teal-600 mr-1.5" />
              How does this work?
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Step 1 */}
              <div className="flex items-start space-x-3 bg-white/80 p-3 rounded-xl border border-gray-100 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <p className="text-xs font-semibold text-gray-700 leading-snug">
                  Upload a photo of your doctor's valid prescription
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-3 bg-white/80 p-3 rounded-xl border border-gray-100 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <p className="text-xs font-semibold text-gray-700 leading-snug">
                  Add delivery address and place the quick order
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-3 bg-white/80 p-3 rounded-xl border border-gray-100 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <p className="text-xs font-semibold text-gray-700 leading-snug">
                  Our pharmacist will call you to confirm exact dosage &amp; strips
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex items-start space-x-3 bg-white/80 p-3 rounded-xl border border-gray-100 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                  4
                </div>
                <p className="text-xs font-semibold text-gray-700 leading-snug">
                  Now, sit back! your medicines will be delivered at your doorstep
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
