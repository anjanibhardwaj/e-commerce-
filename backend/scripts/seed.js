import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../src/config/env.js';
import User from '../src/models/User.js';
import Seller from '../src/models/Seller.js';
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';
import Inventory from '../src/models/Inventory.js';
import Address from '../src/models/Address.js';
import Coupon from '../src/models/Coupon.js';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB at', config.mongoUri.replace(/:([^@]+)@/, ':****@'));
    
    const isAtlas = config.mongoUri.includes('mongodb+srv') || config.mongoUri.includes('ssl=true');
    const connectOpts = isAtlas
      ? { tls: true, serverSelectionTimeoutMS: 10000, autoIndex: true }
      : { autoIndex: true, serverSelectionTimeoutMS: 5000 };

    let connected = false;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        console.log(`[Seed] Connecting attempt ${attempt}/5...`);
        await mongoose.connect(config.mongoUri, connectOpts);
        connected = true;
        console.log('[Seed] Connected successfully.');
        break;
      } catch (connErr) {
        console.warn(`[Seed] Attempt ${attempt} failed (${connErr.message}). Retrying in 1.5s...`);
        if (attempt === 5) {
          // If Atlas fails, try local MongoDB fallback
          if (isAtlas) {
            console.log('[Seed] Attempting fallback to local MongoDB...');
            await mongoose.connect('mongodb://127.0.0.1:27017/medical-ecommerce', { autoIndex: true });
            console.log('[Seed] Connected successfully to local MongoDB!');
            break;
          }
          throw connErr;
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    // Clear existing data
    console.log('[Seed] Clearing previous collections...');
    await Promise.all([
      User.deleteMany({}),
      Seller.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Inventory.deleteMany({}),
      Address.deleteMany({}),
      Coupon.deleteMany({})
    ]);

    // 1. Seed Categories with real photos & labels
    console.log('[Seed] Seeding Categories...');
    const categoryDefs = [
      {
        name: 'Prescription Medicines',
        slug: 'prescription-medicines',
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&auto=format&fit=crop&q=80',
        discountText: 'Up to 20% OFF',
        displayOrder: 1
      },
      {
        name: 'OTC Medicines',
        slug: 'otc-medicines',
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop&q=80',
        discountText: 'Up to 25% OFF',
        displayOrder: 2
      },
      {
        name: 'Vitamins & Supplements',
        slug: 'vitamins-supplements',
        image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=400&auto=format&fit=crop&q=80',
        discountText: 'Up to 40% OFF',
        displayOrder: 3
      },
      {
        name: 'Healthcare Devices',
        slug: 'healthcare-devices',
        image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&auto=format&fit=crop&q=80',
        discountText: 'Up to 50% OFF',
        displayOrder: 4
      },
      {
        name: 'Personal Care',
        slug: 'personal-care',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=80',
        discountText: 'Up to 35% OFF',
        displayOrder: 5
      },
      {
        name: 'Ayurvedic Care',
        slug: 'ayurvedic-care',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80',
        discountText: 'Up to 30% OFF',
        displayOrder: 6
      },
      {
        name: 'Baby & Mother Care',
        slug: 'baby-mother-care',
        image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&auto=format&fit=crop&q=80',
        discountText: 'Up to 25% OFF',
        displayOrder: 7
      },
      {
        name: 'Diabetes Care',
        slug: 'diabetes-care',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&auto=format&fit=crop&q=80',
        discountText: 'Up to 30% OFF',
        displayOrder: 8
      }
    ];
    const createdCategories = await Category.insertMany(categoryDefs);
    const catMap = new Map(createdCategories.map((c) => [c.name, c._id]));

    // 2. Seed Verified Licensed Sellers
    console.log('[Seed] Seeding Sellers...');
    const salt = await bcrypt.genSalt(10);
    const sellerPasswordHash = await bcrypt.hash('seller123', salt);

    const sellers = await Seller.insertMany([
      {
        businessName: 'Apollo Care Pharmacy',
        contactPerson: 'Dr. Rajesh Gupta',
        email: 'seller@example.com',
        phone: '+91 9820012345',
        passwordHash: sellerPasswordHash,
        status: 'approved',
        licenseNumber: 'DL-MH-2024-88491',
        gstin: '27AAACA1234A1Z5',
        city: 'Mumbai',
        address: 'Shop 4, Lotus Enclave, Link Road, Mumbai 400053',
        rating: 4.9
      },
      {
        businessName: 'MedPlus Express Pharmacy',
        contactPerson: 'Dr. Sunita Verma',
        email: 'seller2@example.com',
        phone: '+91 9112233445',
        passwordHash: sellerPasswordHash,
        status: 'approved',
        licenseNumber: 'DL-DL-2026-11928',
        gstin: '07AABCM5678B1Z2',
        city: 'Delhi',
        address: 'Plot 18, Central Market, Connaught Place, New Delhi 110001',
        rating: 4.8
      }
    ]);
    const primarySeller = sellers[0];
    const secondarySeller = sellers[1];

    // 3. Seed Users (Customer, Admin, Pharmacist)
    console.log('[Seed] Seeding Users...');
    const userPasswordHash = await bcrypt.hash('user123', salt);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);
    const pharmPasswordHash = await bcrypt.hash('pharm123', salt);

    const users = await User.insertMany([
      {
        name: 'Rohan Sharma',
        email: 'user@example.com',
        phone: '+91 9876543210',
        passwordHash: userPasswordHash,
        role: 'customer',
        isPlusMember: true,
        isActive: true
      },
      {
        name: 'Priya Patel',
        email: 'priya@example.com',
        phone: '+91 9123456780',
        passwordHash: userPasswordHash,
        role: 'customer',
        isPlusMember: false,
        isActive: true
      },
      {
        name: 'Platform Administrator',
        email: 'admin@example.com',
        phone: '+91 8888800000',
        passwordHash: adminPasswordHash,
        role: 'admin',
        isActive: true
      },
      {
        name: 'Lead Pharmacist Verification',
        email: 'pharmacist@example.com',
        phone: '+91 9777700000',
        passwordHash: pharmPasswordHash,
        role: 'pharmacist',
        isActive: true
      }
    ]);
    const customerRohan = users[0];

    // 4. Seed Addresses for Rohan
    console.log('[Seed] Seeding Addresses...');
    await Address.insertMany([
      {
        userId: customerRohan._id,
        label: 'Home',
        fullName: 'Rohan Sharma',
        phone: '+91 9876543210',
        line1: 'Apt 402, Green Meadows',
        line2: 'Andheri West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400058',
        isDefault: true
      },
      {
        userId: customerRohan._id,
        label: 'Office',
        fullName: 'Rohan Sharma',
        phone: '+91 9876543210',
        line1: 'Tech Park, Building 3',
        line2: 'Bandra Kurla Complex',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400051',
        isDefault: false
      }
    ]);

    // 5. Seed Real Coupons
    console.log('[Seed] Seeding Coupons...');
    await Coupon.insertMany([
      {
        code: 'PHARMEASY50',
        type: 'PERCENT',
        value: 20,
        maxDiscount: 20000, // ₹200
        minOrderValue: 49900, // ₹499
        isActive: true,
        validUntil: new Date('2028-12-31')
      },
      {
        code: 'FIRST25',
        type: 'PERCENT',
        value: 25,
        maxDiscount: 30000, // ₹300
        minOrderValue: 59900, // ₹599
        isActive: true,
        validUntil: new Date('2028-12-31')
      },
      {
        code: 'PLUSEXTRA',
        type: 'PERCENT',
        value: 15,
        maxDiscount: 15000, // ₹150
        minOrderValue: 29900, // ₹299
        isActive: true,
        validUntil: new Date('2028-12-31')
      },
      {
        code: 'HEALTH100',
        type: 'FLAT',
        value: 10000, // ₹100 Flat
        maxDiscount: 10000,
        minOrderValue: 79900,
        isActive: true,
        validUntil: new Date('2028-12-31')
      }
    ]);

    // 6. Comprehensive Original Catalog with 100% UNIQUE Real Product Images
    console.log('[Seed] Seeding Products & Inventory with Unique Images...');
    const catalog = [
      // --- Vitamins & Supplements (Each with a unique, dedicated image) ---
      {
        name: 'Evion 400mg Strip Of 10 Capsules (Vitamin E for Skin, Hair & Immunity)',
        categoryName: 'Vitamins & Supplements',
        brand: 'Procter & Gamble',
        mrp: 42,
        price: 35,
        discountPercent: 17,
        rating: 4.8,
        reviewCount: 8400,
        image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=500&auto=format&fit=crop&q=80',
        description: 'Pure tocopheryl acetate (Vitamin E) antioxidant supporting cellular longevity, healthy skin texture, and hair vitality.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '1 capsule daily with water after meals',
        packSize: 'Strip of 10 Capsules',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      },
      {
        name: 'Revital H Daily Health Supplement Men 60 Capsules (Ginseng + 10 Vitamins + 9 Minerals)',
        categoryName: 'Vitamins & Supplements',
        brand: 'Sun Pharma',
        mrp: 610,
        price: 488,
        discountPercent: 20,
        rating: 4.7,
        reviewCount: 6310,
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80',
        description: 'Natural ginseng infused multivitamin boosting stamina, mental alertness, immunity and fighting daily fatigue.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '1 capsule daily after breakfast',
        packSize: 'Bottle of 60 Capsules',
        sellerId: secondarySeller._id,
        sellerName: secondarySeller.businessName
      },
      {
        name: 'Neurobion Forte Tablet Strip Of 30 (Vitamin B1 + B6 + B12)',
        categoryName: 'Vitamins & Supplements',
        brand: 'Procter & Gamble',
        mrp: 46,
        price: 39,
        discountPercent: 15,
        rating: 4.9,
        reviewCount: 11450,
        image: 'https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=500&auto=format&fit=crop&q=80',
        description: 'Nerve nourishing multivitamin essential for peripheral neuropathy, tingling sensations, and healthy nervous system.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '1 tablet daily after lunch',
        packSize: 'Strip of 30 Tablets',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      },
      {
        name: 'Becosules Z Capsules Strip Of 20 (Vitamin B-Complex + Zinc + Vitamin C)',
        categoryName: 'Vitamins & Supplements',
        brand: 'Pfizer',
        mrp: 65,
        price: 52,
        discountPercent: 20,
        rating: 4.8,
        reviewCount: 9120,
        image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&auto=format&fit=crop&q=80',
        description: 'Therapeutic vitamin formulation for mouth ulcers, fatigue, energy restoration, and tissue repair.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '1 capsule daily with water',
        packSize: 'Strip of 20 Capsules',
        sellerId: secondarySeller._id,
        sellerName: secondarySeller.businessName
      },
      {
        name: 'Shelcal 500mg Strip Of 15 Tablets (Calcium 500mg + Vitamin D3 250 IU)',
        categoryName: 'Vitamins & Supplements',
        brand: 'Torrent Pharma',
        mrp: 144,
        price: 118,
        discountPercent: 18,
        rating: 4.7,
        reviewCount: 4210,
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80',
        description: 'Clinically proven calcium carbonate with active Vitamin D3 to strengthen bone density, joint mobility, and tooth enamel.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '1 tablet daily after main meal',
        packSize: 'Strip of 15 Tablets',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      },
      {
        name: 'Pharmeasy Chelated Magnesium Glycinate 500mg - 60 Capsules',
        categoryName: 'Vitamins & Supplements',
        brand: 'PharmEasy',
        mrp: 1079,
        price: 648,
        discountPercent: 40,
        rating: 4.6,
        reviewCount: 324,
        image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500&auto=format&fit=crop&q=80',
        description: 'Supports muscle relaxation, bone health, nerve function, and sound sleep. Chelated form ensures maximum absorption without stomach discomfort.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '1 capsule twice daily with meals or as directed by physician',
        packSize: 'Bottle of 60 Capsules',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      },
      {
        name: 'Limcee Chewable Vitamin C 500mg Strip Of 15 Tablets (Orange Flavour)',
        categoryName: 'Vitamins & Supplements',
        brand: 'Abbott',
        mrp: 30,
        price: 24,
        discountPercent: 20,
        rating: 4.9,
        reviewCount: 15200,
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&auto=format&fit=crop&q=80',
        description: 'Ascorbic acid Vitamin C chewable tablets providing powerful daily antioxidant defence and cellular immunity.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '1 chewable tablet daily after meal',
        packSize: 'Strip of 15 Tablets',
        sellerId: secondarySeller._id,
        sellerName: secondarySeller.businessName
      },

      // --- Prescription Medicines ---
      {
        name: 'Augmentin 625 Duo Tablet Strip Of 10 (Amoxycillin & Potassium Clavulanate)',
        categoryName: 'Prescription Medicines',
        brand: 'GSK',
        mrp: 224,
        price: 190,
        discountPercent: 15,
        rating: 4.8,
        reviewCount: 1650,
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&auto=format&fit=crop&q=80',
        description: 'Broad-spectrum antibiotic prescription medicine for bacterial infections of the lungs, ear, nasal sinus, skin, and urinary tract.',
        prescriptionRequired: true,
        scheduleType: 'SCHEDULE_H',
        dosage: '1 tablet twice daily with food or as advised by physician',
        packSize: 'Strip of 10 Tablets',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      },
      {
        name: 'Pan 40mg Tablet Strip Of 15 (Pantoprazole Gastro-Resistant)',
        categoryName: 'Prescription Medicines',
        brand: 'Alkem Laboratories',
        mrp: 175,
        price: 145,
        discountPercent: 17,
        rating: 4.7,
        reviewCount: 2980,
        image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&auto=format&fit=crop&q=80',
        description: 'Proton pump inhibitor (PPI) reducing stomach acid production for GERD, peptic ulcers, and acid reflux management.',
        prescriptionRequired: true,
        scheduleType: 'SCHEDULE_H',
        dosage: '1 tablet 30 minutes before breakfast with water',
        packSize: 'Strip of 15 Tablets',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      },
      {
        name: 'Telma 40mg Tablet Strip Of 15 (Telmisartan)',
        categoryName: 'Prescription Medicines',
        brand: 'Glenmark Pharmaceuticals',
        mrp: 230,
        price: 184,
        discountPercent: 20,
        rating: 4.8,
        reviewCount: 3410,
        image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&auto=format&fit=crop&q=80',
        description: 'Angiotensin receptor blocker used in management of high blood pressure (hypertension) and cardiovascular risk reduction.',
        prescriptionRequired: true,
        scheduleType: 'SCHEDULE_H',
        dosage: '1 tablet daily at the same time each day',
        packSize: 'Strip of 15 Tablets',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      },
      {
        name: 'Glycomet GP 2 Tablet Strip Of 15 (Metformin 500mg + Glimepiride 2mg)',
        categoryName: 'Prescription Medicines',
        brand: 'USV Pvt Ltd',
        mrp: 245,
        price: 196,
        discountPercent: 20,
        rating: 4.9,
        reviewCount: 4200,
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=80',
        description: 'Dual combination anti-diabetic medication to control blood glucose levels in Type 2 Diabetes Mellitus.',
        prescriptionRequired: true,
        scheduleType: 'SCHEDULE_H',
        dosage: '1 tablet with breakfast or the first main meal',
        packSize: 'Strip of 15 Tablets',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      },
      {
        name: 'Montair LC Tablet Strip Of 10 (Levocetirizine 5mg + Montelukast 10mg)',
        categoryName: 'Prescription Medicines',
        brand: 'Cipla',
        mrp: 215,
        price: 172,
        discountPercent: 20,
        rating: 4.8,
        reviewCount: 5120,
        image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500&auto=format&fit=crop&q=80',
        description: 'Relieves allergic symptoms such as runny nose, sneezing, itchy watery eyes, and allergic rhinitis with mild asthma.',
        prescriptionRequired: true,
        scheduleType: 'SCHEDULE_H',
        dosage: '1 tablet once daily at bedtime',
        packSize: 'Strip of 10 Tablets',
        sellerId: secondarySeller._id,
        sellerName: secondarySeller.businessName
      },
      {
        name: 'Thyronorm 50mcg Tablet Bottle Of 120 (Thyroxine Sodium)',
        categoryName: 'Prescription Medicines',
        brand: 'Abbott',
        mrp: 185,
        price: 157,
        discountPercent: 15,
        rating: 4.9,
        reviewCount: 7890,
        image: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=500&auto=format&fit=crop&q=80',
        description: 'Synthetic thyroid hormone for thyroid replacement therapy in treating hypothyroidism.',
        prescriptionRequired: true,
        scheduleType: 'SCHEDULE_H',
        dosage: '1 tablet every morning on an empty stomach at least 30 minutes before tea/coffee',
        packSize: 'Bottle of 120 Tablets',
        sellerId: secondarySeller._id,
        sellerName: secondarySeller.businessName
      },
      {
        name: 'Azithral 500mg Strip of 5 Tablets (Azithromycin 500mg)',
        categoryName: 'Prescription Medicines',
        brand: 'Alembic Pharmaceuticals',
        mrp: 135,
        price: 119,
        discountPercent: 12,
        rating: 4.8,
        reviewCount: 2340,
        image: 'https://images.unsplash.com/photo-1586015555751-63c252277d3f?w=500&auto=format&fit=crop&q=80',
        description: 'Macrolide antibiotic used for respiratory tract infections, tonsillitis, sinusitis, skin infections and throat ailments.',
        prescriptionRequired: true,
        scheduleType: 'SCHEDULE_H',
        dosage: '1 tablet daily 1 hour before or 2 hours after meals for 3 to 5 days',
        packSize: 'Strip of 5 Tablets',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      },

      // --- OTC Medicines ---
      {
        name: 'Dolo 650mg Strip Of 15 Tablets (Paracetamol 650mg)',
        categoryName: 'OTC Medicines',
        brand: 'Micro Labs',
        mrp: 34,
        price: 28,
        discountPercent: 18,
        rating: 4.9,
        reviewCount: 8430,
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80',
        description: 'Fast-acting antipyretic & analgesic for fever, headache, body ache, toothache, and mild musculoskeletal discomfort.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '1 tablet every 6 to 8 hours as needed. Maximum 4000mg per 24 hours.',
        packSize: 'Strip of 15 Tablets',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      },
      {
        name: 'Crocin 650 Advance Fast Action Strip Of 15 Tablets',
        categoryName: 'OTC Medicines',
        brand: 'GSK',
        mrp: 38,
        price: 31,
        discountPercent: 18,
        rating: 4.8,
        reviewCount: 6520,
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=80',
        description: 'Optizorb technology helps paracetamol dissolve up to 5 times faster for quicker fever and headache relief.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '1 tablet with water as needed',
        packSize: 'Strip of 15 Tablets',
        sellerId: secondarySeller._id,
        sellerName: secondarySeller.businessName
      },
      {
        name: 'Volini Pain Relief Gel Tube Of 75g (Diclofenac + Menthol + Linseed Oil)',
        categoryName: 'OTC Medicines',
        brand: 'Sun Pharma',
        mrp: 265,
        price: 212,
        discountPercent: 20,
        rating: 4.6,
        reviewCount: 3120,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
        description: 'Instant topical gel that penetrates deep to target joint inflammation, sprains, neck stiffness, and lower back soreness.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: 'Apply thin layer and gently massage affected area 3 to 4 times daily',
        packSize: 'Tube of 75g',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      },
      {
        name: 'Digene Acidity & Gas Relief Gel Mint Flavour Bottle Of 200ml',
        categoryName: 'OTC Medicines',
        brand: 'Abbott',
        mrp: 165,
        price: 135,
        discountPercent: 18,
        rating: 4.8,
        reviewCount: 4890,
        image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=500&auto=format&fit=crop&q=80',
        description: 'Scientifically proven antacid and antiflatulent formula delivering rapid relief from heartburn, indigestion, and bloating.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '2 teaspoonfuls (10ml) after meals and at bedtime',
        packSize: 'Bottle of 200ml',
        sellerId: secondarySeller._id,
        sellerName: secondarySeller.businessName
      },
      {
        name: 'Otrivin Oxy Fast Relief Adult Nasal Spray 10ml',
        categoryName: 'OTC Medicines',
        brand: 'GSK',
        mrp: 125,
        price: 106,
        discountPercent: 15,
        rating: 4.7,
        reviewCount: 3820,
        image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80',
        description: 'Opens blocked nose in 25 seconds and provides up to 12 hours of breathing ease from colds and allergies.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '1 spray into each nostril 2-3 times daily. Do not exceed 7 continuous days.',
        packSize: '10ml Spray Bottle',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      },

      // --- Healthcare Devices ---
      {
        name: 'Accu-Chek Active Blood Glucose Monitor with 10 Test Strips & Lancet',
        categoryName: 'Healthcare Devices',
        brand: 'Roche Diabetes Care',
        mrp: 1599,
        price: 1199,
        discountPercent: 25,
        rating: 4.8,
        reviewCount: 6540,
        image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&auto=format&fit=crop&q=80',
        description: 'World-renowned blood glucose glucometer providing accurate results in just 5 seconds from a tiny 1-2 μL blood droplet.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: 'Diagnostic Device - Follow enclosed user manual',
        packSize: '1 Complete Starter Kit',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      },
      {
        name: 'Omron HEM 7120 Fully Automatic Digital Blood Pressure Monitor',
        categoryName: 'Healthcare Devices',
        brand: 'Omron',
        mrp: 2390,
        price: 1790,
        discountPercent: 25,
        rating: 4.9,
        reviewCount: 12400,
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=80',
        description: 'Intellisense technology for comfortable, accurate, and rapid systolic & diastolic BP measurements with hypertension indicator.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: 'Medical Diagnostic Device - Upper arm cuff reading',
        packSize: '1 Device with Medium Cuff & 4 AA Batteries',
        sellerId: secondarySeller._id,
        sellerName: secondarySeller.businessName
      },
      {
        name: 'Dr. Morepen PO-09 Finger Pulse Oximeter with OLED Display',
        categoryName: 'Healthcare Devices',
        brand: 'Dr. Morepen',
        mrp: 1499,
        price: 899,
        discountPercent: 40,
        rating: 4.6,
        reviewCount: 4500,
        image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=500&auto=format&fit=crop&q=80',
        description: 'Instant SpO2 oxygen saturation and pulse rate monitoring with multi-directional color OLED display and alarm alert.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: 'Diagnostic Device - Clip on index finger for 8 seconds',
        packSize: '1 Unit + Lanyard + 2 AAA Batteries',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      },
      {
        name: 'Ageasy Automatic Digital Blood Pressure Monitor with USB Port',
        categoryName: 'Healthcare Devices',
        brand: 'Ageasy',
        mrp: 1405,
        price: 1068,
        discountPercent: 24,
        rating: 4.7,
        reviewCount: 890,
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=80',
        description: 'Accurate clinical readings with large dual-color backlit display, irregular heartbeat indicator, and 2-user memory tracking.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: 'Medical Device - Follow user manual instructions',
        packSize: '1 Unit with Type-C Port',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      },

      // --- Personal Care ---
      {
        name: 'Cetaphil Gentle Skin Cleanser For Dry to Normal Sensitive Skin 250ml',
        categoryName: 'Personal Care',
        brand: 'Galderma',
        mrp: 635,
        price: 540,
        discountPercent: 15,
        rating: 4.8,
        reviewCount: 5200,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80',
        description: 'Hydrating non-foaming daily wash with Niacinamide, Panthenol and Glycerin to preserve natural skin moisture barrier.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: 'Apply liberally to skin and massage gently before rinsing or wiping with cloth.',
        packSize: 'Bottle of 250ml',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      },
      {
        name: 'Sebamed Baby Gentle Wash Soap-Free Formula 200ml',
        categoryName: 'Personal Care',
        brand: 'Sebamed',
        mrp: 520,
        price: 442,
        discountPercent: 15,
        rating: 4.9,
        reviewCount: 3100,
        image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&auto=format&fit=crop&q=80',
        description: 'pH 5.5 balanced extra mild formula protecting baby delicate acid mantle against dehydration and irritation.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: 'Apply with wet hands to baby body, lather gently and rinse with warm water',
        packSize: 'Bottle of 200ml',
        sellerId: secondarySeller._id,
        sellerName: secondarySeller.businessName
      },

      // --- Ayurvedic Care ---
      {
        name: 'Baidyanath Chyawanprash Special 1kg with 52 Ayurvedic Herbs',
        categoryName: 'Ayurvedic Care',
        brand: 'Baidyanath',
        mrp: 450,
        price: 380,
        discountPercent: 15,
        rating: 4.9,
        reviewCount: 2310,
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
        description: 'Rich source of natural Vitamin C and amla, strengthens respiratory tract, boosts resistance against seasonal infections.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '1-2 teaspoons daily with warm milk',
        packSize: 'Jar of 1kg',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      },
      {
        name: 'Dabur 100% Pure & Natural Honey Squeezy Pack 500g',
        categoryName: 'Ayurvedic Care',
        brand: 'Dabur',
        mrp: 230,
        price: 195,
        discountPercent: 15,
        rating: 4.8,
        reviewCount: 7800,
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80',
        description: 'NMR tested 100% pure natural honey containing beneficial antioxidants, enzymes, and vitamins for daily health and weight management.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '1 tablespoon daily with lukewarm water and lemon on empty stomach',
        packSize: 'Bottle of 500g',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      },
      {
        name: 'Himalaya Pure Herbs Ashvagandha General Wellness 60 Tablets',
        categoryName: 'Ayurvedic Care',
        brand: 'Himalaya Wellness',
        mrp: 220,
        price: 187,
        discountPercent: 15,
        rating: 4.8,
        reviewCount: 4620,
        image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&auto=format&fit=crop&q=80',
        description: 'Adaptogenic Ayurvedic formulation that combats mental stress, boosts muscle vitality, and revitalizes physical energy.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '1 tablet twice daily before food with warm water',
        packSize: 'Bottle of 60 Tablets',
        sellerId: secondarySeller._id,
        sellerName: secondarySeller.businessName
      },
      {
        name: 'Dabur Pudin Hara Active Ayurvedic Pearls Strip Of 10',
        categoryName: 'Ayurvedic Care',
        brand: 'Dabur',
        mrp: 35,
        price: 30,
        discountPercent: 14,
        rating: 4.8,
        reviewCount: 3950,
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80',
        description: 'Fast acting natural cooling pearls with mint oil (Mentha piperita) for quick relief from gas, stomach ache, and indigestion.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '1 pearl with a glass of water after food',
        packSize: 'Strip of 10 Pearls',
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName
      }
    ];

    for (const item of catalog) {
      const categoryId = catMap.get(item.categoryName) || createdCategories[0]._id;
      const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80);

      const product = await Product.create({
        name: item.name,
        slug,
        brand: item.brand,
        categoryId,
        categoryName: item.categoryName,
        images: [item.image],
        description: item.description,
        dosage: item.dosage,
        packSize: item.packSize || 'Standard Pack',
        mrp: item.mrp * 100, // In Paise
        sellingPrice: item.price * 100, // In Paise
        discountPercent: item.discountPercent,
        prescriptionRequired: item.prescriptionRequired,
        scheduleType: item.scheduleType,
        sellerId: item.sellerId,
        sellerName: item.sellerName,
        rating: item.rating,
        reviewCount: item.reviewCount,
        status: 'ACTIVE',
        approvalStatus: 'approved'
      });

      // Create Inventory with batches
      await Inventory.create({
        productId: product._id,
        sellerId: item.sellerId,
        sku: `SKU-${product._id.toString().slice(-6).toUpperCase()}`,
        batchNumber: `BAT-${Math.floor(10000 + Math.random() * 90000)}`,
        expiryDate: new Date('2028-12-31'),
        availableQty: 100,
        reservedQty: 0
      });
    }

    console.log(`[Seed] Successfully seeded ${catalog.length} unique authentic products in MongoDB Atlas!`);
    console.log('[Seed] Database initialization complete!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
