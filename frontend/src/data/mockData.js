export const mockQuickServices = [
  { id: "med", title: "Medicine", badge: "SAVE 27%", color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: "Pill" },
  { id: "lab", title: "Lab Tests", badge: "UPTO 70% OFF", color: "text-blue-700 bg-blue-50 border-blue-200", icon: "FlaskConical" },
  { id: "doc", title: "Doctor Consult", badge: "FROM â‚¹199", color: "text-rose-700 bg-rose-50 border-rose-200", icon: "Stethoscope" },
  { id: "sub", title: "Branded Substitute", badge: "UPTO 50% OFF", color: "text-purple-700 bg-purple-50 border-purple-200", icon: "Sparkles" },
  { id: "hc", title: "Healthcare", badge: "UPTO 60% OFF", color: "text-teal-700 bg-teal-50 border-teal-200", icon: "HeartPulse" },
  { id: "blog", title: "Health Blogs", badge: "INSIGHTS", color: "text-amber-700 bg-amber-50 border-amber-200", icon: "BookOpen" },
  { id: "plus", title: "PLUS", badge: "Save 5% Extra", color: "text-yellow-700 bg-yellow-50 border-yellow-200", icon: "Crown" },
  { id: "off", title: "Offers", badge: "TOP DEALS", color: "text-red-700 bg-red-50 border-red-200", icon: "Gift" }
];

export const mockHeroBanners = [
  {
    id: 1,
    title: "The Rains Are Here, So Are Seasonal Fevers.",
    subtitle: "At-Home Tests For Dengue, Malaria, Typhoid & More.",
    highlight: "Starting from â‚¹1199",
    btnText: "BOOK NOW",
    btnAction: "lab",
    gradient: "from-teal-800 via-teal-900 to-cyan-950",
    badge: "MONSOON HEALTHCARE",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    title: "Your weight is one part of your overall health.",
    subtitle: "For the right support alongside personalized diet & exercise plan.",
    highlight: "Certified Clinical Dietitians",
    btnText: "TALK TO A COUNSELLOR",
    btnAction: "consult",
    gradient: "from-blue-800 via-cyan-900 to-teal-900",
    badge: "WEIGHT MANAGEMENT",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    title: "What's your gut trying to tell you?",
    subtitle: "Identify food sensitivities, acidity triggers, and microbiome health.",
    highlight: "Find out in 60s >",
    btnText: "TAKE A SELF-ASSESSMENT",
    btnAction: "assessment",
    gradient: "from-slate-900 via-teal-950 to-emerald-950",
    badge: "GUT HEALTH AI CHECK",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80"
  }
];

export const mockLabConcerns = [
  { id: "full", name: "Full Body Checkups", testsCount: "84+ Tests Included", badge: "POPULAR", icon: "Stethoscope", bg: "bg-emerald-50 text-emerald-600", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300&auto=format&fit=crop&q=60" },
  { id: "vit", name: "Vitamins", testsCount: "Vitamin D, B12 & Iron", badge: "VITAL", icon: "Sparkles", bg: "bg-amber-50 text-amber-600", image: "https://images.unsplash.com/photo-1616671285442-ba157b897931?w=300&auto=format&fit=crop&q=60" },
  { id: "dia", name: "Diabetes", testsCount: "HbA1c & Fasting Glucose", badge: "ESSENTIAL", icon: "Activity", bg: "bg-sky-50 text-sky-600", image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=300&auto=format&fit=crop&q=60" },
  { id: "women", name: "Women Care", testsCount: "Hormone & Thyroid Profile", badge: "SPECIAL", icon: "Heart", bg: "bg-pink-50 text-pink-600", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=60" },
  { id: "fever", name: "Fever & Infection", testsCount: "CBC, Dengue & Widal", badge: "GET TESTED", icon: "Thermometer", bg: "bg-red-50 text-red-600", image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=300&auto=format&fit=crop&q=60" },
  { id: "thy", name: "Thyroid", testsCount: "T3, T4, TSH Ultrasensitive", badge: "THYROCARE", icon: "ShieldAlert", bg: "bg-purple-50 text-purple-600", image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=300&auto=format&fit=crop&q=60" },
  { id: "heart", name: "Heart Care", testsCount: "Lipid Profile & ECG", badge: "CARDIAC", icon: "HeartPulse", bg: "bg-rose-50 text-rose-600", image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=300&auto=format&fit=crop&q=60" }
];

export const mockFrequentlyBookedLabTests = [
  {
    id: "lab-1",
    name: "Comprehensive Full Body Checkup Test with Vitamin D and B12",
    mrp: 4690,
    price: 2199,
    discount: 52,
    testsIncluded: 84,
    fastingRequired: "Fasting required (10-12 hours)",
    reportTime: "Reports within 24 hours",
    certifiedBy: "Thyrocare & NABL Certified",
    tag: "52% OFF",
    sampleType: "Blood & Urine Sample"
  },
  {
    id: "lab-2",
    name: "Comprehensive Plus Full Body Checkup with Vitamin D, B12, Iron Profile",
    mrp: 4890,
    price: 2249,
    discount: 54,
    testsIncluded: 92,
    fastingRequired: "Fasting required (10-12 hours)",
    reportTime: "Reports within 24 hours",
    certifiedBy: "Thyrocare & NABL Certified",
    tag: "54% OFF",
    sampleType: "Blood & Urine Sample"
  },
  {
    id: "lab-3",
    name: "Aarogyam Full Body Checkup with Essential Vitamins & Kidney Profile",
    mrp: 4590,
    price: 2599,
    discount: 43,
    testsIncluded: 78,
    fastingRequired: "Fasting required (8-10 hours)",
    reportTime: "Reports within 18 hours",
    certifiedBy: "Thyrocare & CAP Certified",
    tag: "43% OFF",
    sampleType: "Blood Sample"
  },
  {
    id: "lab-4",
    name: "Comprehensive Bronze Full Body Checkup with Cardiac and Liver Markers",
    mrp: 7190,
    price: 3399,
    discount: 53,
    testsIncluded: 104,
    fastingRequired: "Fasting required (12 hours)",
    reportTime: "Reports within 24 hours",
    certifiedBy: "Thyrocare & NABL Certified",
    tag: "53% OFF",
    sampleType: "Package with Electrolytes, Iron Profile, Cardiac Markers & more"
  }
];





export const mockHealthArticles = [
  {
    id: "art-1",
    title: "ESR Level in Cancer Patients: Normal Range, Causes, Diagnosis & Meaning",
    readTime: "4 mins read",
    author: "Dr. Ramesh Nair, MD Pathology",
    category: "Cancer Care & Blood Tests",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=60",
    summary: "Erythrocyte Sedimentation Rate (ESR) is a crucial blood test measuring inflammation markers. Learn how high ESR correlates with clinical diagnostics."
  },
  {
    id: "art-2",
    title: "Neuroendocrine Tumours (NETs): Symptoms, Causes, Stages & Early Diagnostics",
    readTime: "6 mins read",
    author: "Dr. Priya Deshmukh, Oncologist",
    category: "Specialized Oncology",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=60",
    summary: "A comprehensive guide on rare tumours arising in the neuroendocrine cells, discussing hormone testing, imaging, and modern targeted treatments."
  },
  {
    id: "art-3",
    title: "Can a CT Scan Detect Cancer? Accuracy, Types, and Limitations Explained",
    readTime: "5 mins read",
    author: "Dr. Anirudh Joshi, Radiologist",
    category: "Diagnostics & Imaging",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=60",
    summary: "Computed Tomography (CT) scans use X-rays to generate cross-sectional views. Learn how contrast dye enhances tumor detection and when PET/MRI is preferred."
  },
  {
    id: "art-4",
    title: "Sperm Agglutination: Meaning, Causes, Symptoms, Diagnosis & Treatment",
    readTime: "5 mins read",
    author: "Dr. Sandeep Patel, Andrologist",
    category: "Men's Health & Fertility",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
    summary: "Understanding semen analysis results when sperm cells clump together, identifying autoimmune triggers, infections, and corrective therapies."
  },
  {
    id: "art-5",
    title: "Itching During Pregnancy: Causes, Symptoms, Safe Treatment and When to Alert Your Doctor",
    readTime: "4 mins read",
    author: "Dr. Sneha Roy, Gynecologist",
    category: "Mother & Baby Care",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=500&auto=format&fit=crop&q=60",
    summary: "From mild belly stretching itch to Obstetric Cholestasis (ICP), understand which maternal liver enzymes need immediate monitoring."
  }
];

export const mockTestimonials = [
  {
    id: "test-1",
    name: "Niti Rohan",
    date: "December 11, 2024",
    rating: 5,
    location: "Mumbai",
    comment: "I ordered my dad's heart medication through the app late in the evening and to my surprise, it was delivered the next morning. The process was really smooth, and I even got a good discount. Making repeat orders is even more convenient."
  },
  {
    id: "test-2",
    name: "Yogesh Shukla",
    date: "January 10, 2025",
    rating: 5,
    location: "Delhi NCR",
    comment: "I had mistakenly ordered the wrong strip of tablets and thought I'd have to go through a lot of hassle to return it, but the customer support made it super easy. They arranged a return pickup and my refund was processed in just 2 days."
  },
  {
    id: "test-3",
    name: "Anuj Kumar",
    date: "March 12, 2025",
    rating: 5,
    location: "Bengaluru",
    comment: "PharmEasy is the best application for ordering medicines and lab tests. I have been using it for the last 5 years. Genuine medicine guarantee and the customer support is exceptionally reliable and polite."
  },
  {
    id: "test-4",
    name: "Meha Jain",
    date: "April 3, 2025",
    rating: 5,
    location: "Hyderabad",
    comment: "Excellent app for booking comprehensive full body checkups. The phlebotomist arrived right at 7:00 AM in sterile PPE. The report was emailed within 18 hours. Genuine lab prices and saved me thousands!"
  }
];



export const mockCities = [
  { name: "Mumbai", pincode: "400001", state: "Maharashtra" },
  { name: "Delhi NCR", pincode: "110001", state: "Delhi" },
  { name: "Bengaluru", pincode: "560001", state: "Karnataka" },
  { name: "Hyderabad", pincode: "500001", state: "Telangana" },
  { name: "Kolkata", pincode: "700001", state: "West Bengal" },
  { name: "Pune", pincode: "411001", state: "Maharashtra" },
  { name: "Ahmedabad", pincode: "380001", state: "Gujarat" },
  { name: "Chennai", pincode: "600001", state: "Tamil Nadu" },
  { name: "Jaipur", pincode: "302001", state: "Rajasthan" },
  { name: "Lucknow", pincode: "226001", state: "Uttar Pradesh" }
];
