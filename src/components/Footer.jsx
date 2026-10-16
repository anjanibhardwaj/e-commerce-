import React from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MessageCircle,
  Pill
} from 'lucide-react';

export default function Footer({ onOpenChat }) {
  const companyLinks = [
    "About Us", "Careers", "Blog", "Partner with PharmEasy"
  ];

  const serviceLinks = [
    "Order Medicine", "Healthcare Products", "Lab Tests", "Doctor Consultations", "PharmEasy Plus"
  ];

  const categoryLinks = [
    "Health Must Haves", "Personal Care", "Healthcare Devices", "Vitamins & Supplements",
    "Sexual Wellness", "Sports Nutrition", "Diabetes Essentials", "Pet Care",
    "Health Food and Drinks", "Homeopathy Care", "Ayurvedic Care", "Mother and Baby Care",
    "Mobility & Elderly Care", "Health Concern", "Skin Care", "Explore More"
  ];

  const helpLinks = [
    "Browse All Medicines", "Browse All Molecules", "Browse All Cities", "Browse All Stores", "FAQs"
  ];

  const policyLinks = [
    "Editorial Policy", "Privacy Policy", "Vulnerability Disclosure Policy",
    "Terms and conditions", "Declaration on Dark Pattern", "Customer Support Policy",
    "Return Policy", "Smartbuy Policy"
  ];

  const paymentBadges = [
    "GPay", "Paytm", "PhonePe", "Bhim UPI", "Mobikwik", "Mastercard", "Visa", "RuPay", "Net Banking", "Cash on Delivery"
  ];

  return (
    <footer className="bg-slate-100 text-gray-700 border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10 text-xs">
          
          {/* Col 1: Company & Our Services */}
          <div className="space-y-6">
            <div>
              <h4 className="font-extrabold text-gray-900 mb-3 text-sm">
                Company
              </h4>
              <ul className="space-y-2">
                {companyLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="hover:text-teal-700 transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-gray-900 mb-3 text-sm">
                Our Services
              </h4>
              <ul className="space-y-2">
                {serviceLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="hover:text-teal-700 transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 2: Featured Categories */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <h4 className="font-extrabold text-gray-900 mb-3 text-sm">
              Featured Categories
            </h4>
            <ul className="space-y-2">
              {categoryLinks.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-teal-700 transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Need Help */}
          <div>
            <h4 className="font-extrabold text-gray-900 mb-3 text-sm">
              Need Help
            </h4>
            <ul className="space-y-2">
              {helpLinks.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-teal-700 transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Policy Info */}
          <div>
            <h4 className="font-extrabold text-gray-900 mb-3 text-sm">
              Policy Info
            </h4>
            <ul className="space-y-2">
              {policyLinks.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-teal-700 transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Follow Us On */}
          <div>
            <h4 className="font-extrabold text-gray-900 mb-3 text-sm">
              Follow Us On
            </h4>
            <div className="flex space-x-3 mb-6">
              {/* Instagram */}
              <a href="#" className="w-8 h-8 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center hover:bg-teal-50 hover:text-teal-700 transition text-gray-600">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" className="w-8 h-8 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center hover:bg-teal-50 hover:text-teal-700 transition text-gray-600">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" className="w-8 h-8 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center hover:bg-teal-50 hover:text-teal-700 transition text-gray-600">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
              </a>
              {/* Twitter / X */}
              <a href="#" className="w-8 h-8 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center hover:bg-teal-50 hover:text-teal-700 transition text-gray-600">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
                </svg>
              </a>
            </div>

            <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-2 shadow-2xs">
              <div className="text-xs font-bold text-gray-900">
                Need Help with Order?
              </div>
              <p className="text-[11px] text-gray-500">
                Our support desk is active 24/7. Connect on WhatsApp or Call.
              </p>
              <button 
                onClick={onOpenChat}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>

        </div>

        {/* Payment Partners Badges */}
        <div className="border-t border-gray-200 pt-6 pb-4">
          <div className="text-xs font-bold text-gray-700 mb-3">
            Our Payment Partners:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {paymentBadges.map((badge, idx) => (
              <span 
                key={idx}
                className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-gray-700 shadow-2xs hover:border-teal-400 transition"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright and Legal */}
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-teal-700">PharmEasy</span>
            <span>•</span>
            <span>© 2026 PharmEasy. All Rights Reserved.</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1" />
              100% Genuine Medicines
            </span>
            <span className="flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1" />
              Safe &amp; Secure Payments
            </span>
          </div>
        </div>

      </div>

      {/* Floating WhatsApp Action Button */}
      <button 
        onClick={onOpenChat}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer group"
        aria-label="Chat with AskEasy on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold pl-0 group-hover:pl-2">
          Chat with AskEasy
        </span>
      </button>
    </footer>
  );
}
