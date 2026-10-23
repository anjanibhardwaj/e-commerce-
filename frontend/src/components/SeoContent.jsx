import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function SeoContent() {
  const [showFull, setShowFull] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200">
      <div className="space-y-5 text-xs text-gray-600 leading-relaxed">
        
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-1">
            Your One-Stop Online Pharmacy - PharmEasy
          </h3>
          <h4 className="font-semibold text-gray-700 mb-1">
            We've got India Covered!
          </h4>
          <p>
            We now deliver in 1200+ cities and towns across 19000+ pin codes. We thereby cover every nook and corner of the country! The major cities in which we deliver include Mumbai, Kolkata, Delhi, Bengaluru, Ahmedabad, Hyderabad, Chennai, Thane, Howrah, Pune, Gurgaon, Navi Mumbai, Jaipur, Noida, Lucknow, Ghaziabad &amp; Vadodara.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-1">
            Say Goodbye to All Your Healthcare Worries With PharmEasy!
          </h4>
          <p>
            PharmEasy is here to help you take it easy! We are amongst one of India's top online pharmacy and medical care platforms. It enables you to order pharmaceutical and healthcare products online by connecting you to registered retail pharmacies and get them delivered to your home. We are an online medical store, making your purchase easy, simple, and affordable!
          </p>
        </div>

        {showFull && (
          <div className="space-y-5 pt-1">
            <div>
              <h4 className="font-semibold text-gray-700 mb-1">
                How Are We Making Lives Simpler With Our Online Medical Store?
              </h4>
              <p>
                Our doorstep delivery service is available in PAN-India across top cities like Bangalore, Delhi, Mumbai, Kolkata, Hyderabad, Gurgaon, Noida, Pune, etc. Our online medical store also allows you to choose from 1 lakh+ products including OTC products and medical equipment. PharmEasy is a one-stop online medical platform where you can also book diagnostic tests including blood tests, full-body checkups, and other preventive health check-ups at an affordable cost, right from the comfort of your home. We have partnered with trusted &amp; certified labs that arrange for a sample pick-up from the convenience of your home. They also provide you with timely reports.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-1">
                Why Are We The Most Preferred Online Pharmacy?
              </h4>
              <p>
                Lucrative offers on our platform allow you to make payment online and via various payment wallets at a discounted price. Alternatively, you can also choose to pay cash on delivery as we deliver the products at your doorstep. We cater to all your pharmaceutical needs and also make ordering medicines online a hassle-free experience for you. We connect you only with registered retail pharmacies &amp; certified diagnostic labs. We ensure that healthcare is affordable to all and make the process of ordering online simple.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-1">
                Sit Back &amp; Relax While You Get Your Essentials Delivered Every Month!
              </h4>
              <p>
                It's tough to remember to refill every month, especially in the case of chronic diseases. PharmEasy's subscription service not only ensures that you are reminded of your refills but also makes sure that you are never out on your medical essentials. You will get a reminder every month and your order will be delivered at your convenience!
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-1">
                Access medical and health information:
              </h4>
              <p>
                PharmEasy delivers reliable and accurate medical information that has been carefully written, vetted and validated by our health experts. Our specialists curate high-quality and most reliable literature about medicines, illnesses, lab tests, Ayurvedic and over the counter health products.
              </p>
            </div>

            <div className="font-semibold text-teal-800">
              We Believe in "Simplifying Healthcare, Impacting Lives!"
            </div>
          </div>
        )}

        <button 
          onClick={() => setShowFull(!showFull)}
          className="text-teal-700 hover:text-teal-800 font-bold flex items-center pt-1 cursor-pointer"
        >
          <span>{showFull ? "Read Less" : "Read More"}</span>
          {showFull ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
        </button>

      </div>
    </section>
  );
}
