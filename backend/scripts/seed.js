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
    console.log('[Seed] Connecting to MongoDB at', config.mongoUri);
    await mongoose.connect(config.mongoUri);
    console.log('[Seed] Connected successfully.');

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

    // 1. Seed Categories
    console.log('[Seed] Seeding Categories...');
    const categoryDefs = [
      { name: 'Prescription Medicines', slug: 'prescription-medicines', icon: 'Pill', displayOrder: 1 },
      { name: 'OTC Medicines', slug: 'otc-medicines', icon: 'ShieldCheck', displayOrder: 2 },
      { name: 'Vitamins & Supplements', slug: 'vitamins-supplements', icon: 'Sparkles', displayOrder: 3 },
      { name: 'Healthcare Devices', slug: 'healthcare-devices', icon: 'Activity', displayOrder: 4 },
      { name: 'Personal Care', slug: 'personal-care', icon: 'Heart', displayOrder: 5 },
      { name: 'Ayurvedic Care', slug: 'ayurvedic-care', icon: 'Leaf', displayOrder: 6 }
    ];
    const createdCategories = await Category.insertMany(categoryDefs);
    const catMap = new Map(createdCategories.map((c) => [c.name, c._id]));

    // 2. Seed Sellers
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
        rating: 4.8
      },
      {
        businessName: 'MediLife Wellness Store',
        contactPerson: 'Sunita Verma',
        email: 'seller2@example.com',
        phone: '+91 9112233445',
        passwordHash: sellerPasswordHash,
        status: 'pending',
        licenseNumber: 'DL-DL-2026-11928',
        gstin: '07AABCM5678B1Z2',
        city: 'Delhi',
        address: 'Plot 18, Central Market, Connaught Place, New Delhi 110001',
        rating: 4.5
      }
    ]);
    const primarySeller = sellers[0];

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

    // 5. Seed Coupons
    console.log('[Seed] Seeding Coupons...');
    await Coupon.insertMany([
      {
        code: 'PHARMEASY50',
        type: 'PERCENT',
        value: 20,
        maxDiscount: 20000, // ₹200
        minOrderValue: 49900, // ₹499
        isActive: true,
        validUntil: new Date('2027-12-31')
      },
      {
        code: 'FIRST25',
        type: 'PERCENT',
        value: 25,
        maxDiscount: 30000, // ₹300
        minOrderValue: 59900,
        isActive: true,
        validUntil: new Date('2027-12-31')
      },
      {
        code: 'PLUSEXTRA',
        type: 'PERCENT',
        value: 15,
        maxDiscount: 15000,
        minOrderValue: 29900,
        isActive: true,
        validUntil: new Date('2027-12-31')
      }
    ]);

    // 6. Seed Realistic Medicines & Healthcare Products
    console.log('[Seed] Seeding Products & Inventory...');
    const catalog = [
      {
        name: 'Pharmeasy Chelated Magnesium Glycinate 500mg - 60 Capsules',
        categoryName: 'Vitamins & Supplements',
        brand: 'PharmEasy',
        mrp: 1079,
        price: 648,
        discountPercent: 40,
        rating: 4.6,
        reviewCount: 324,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
        description: 'Supports muscle relaxation, bone health, nerve function, and sound sleep. Chelated form ensures maximum absorption without stomach discomfort.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '1 capsule twice daily with meals or as directed by physician'
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
        image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&auto=format&fit=crop&q=60',
        description: 'Accurate clinical readings with large dual-color backlit display, irregular heartbeat indicator, and 2-user memory tracking.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: 'Medical Device - Follow user manual instructions'
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
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
        description: 'Clinically proven calcium carbonate with active Vitamin D3 to strengthen bone density, joint mobility, and tooth enamel.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '1 tablet daily after main meal'
      },
      {
        name: 'Augmentin 625 Duo Tablet Strip Of 10 (Amoxycillin & Potassium Clavulanate)',
        categoryName: 'Prescription Medicines',
        brand: 'GSK',
        mrp: 224,
        price: 190,
        discountPercent: 15,
        rating: 4.8,
        reviewCount: 1650,
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=60',
        description: 'Broad-spectrum antibiotic prescription medicine for bacterial infections of the lungs, ear, nasal sinus, skin, and urinary tract.',
        prescriptionRequired: true,
        scheduleType: 'SCHEDULE_H',
        dosage: 'As prescribed by certified medical practitioner'
      },
      {
        name: 'Pan 40mg Tablet Strip Of 15 (Pantoprazole Gastro-Resistant)',
        categoryName: 'Prescription Medicines',
        brand: 'Alkem Laboratories',
        mrp: 175,
        price: 145,
        discountPercent: 17,
        rating: 4.6,
        reviewCount: 2980,
        image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500&auto=format&fit=crop&q=60',
        description: 'Proton pump inhibitor (PPI) reducing stomach acid production for GERD, peptic ulcers, and acid reflux management.',
        prescriptionRequired: true,
        scheduleType: 'SCHEDULE_H',
        dosage: '1 tablet 30 minutes before breakfast with water'
      },
      {
        name: 'Dolo 650mg Strip Of 15 Tablets (Paracetamol Analgesic & Antipyretic)',
        categoryName: 'OTC Medicines',
        brand: 'Micro Labs',
        mrp: 34,
        price: 28,
        discountPercent: 18,
        rating: 4.9,
        reviewCount: 8430,
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60',
        description: 'Fast-acting relief from fever, headache, body ache, toothache, and mild musculoskeletal pain.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '1 tablet every 6 to 8 hours as needed. Do not exceed 4000mg daily.'
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
        image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=60',
        description: 'Instant topical gel that penetrates deep to target joint inflammation, sprains, neck pain, and lower back soreness.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: 'Gently massage a thin layer over affected area 3 to 4 times a day.'
      },
      {
        name: 'Accu-Chek Active Blood Glucose Monitor with 10 Test Strips & Lancet',
        categoryName: 'Healthcare Devices',
        brand: 'Roche Diabetes Care',
        mrp: 1599,
        price: 1199,
        discountPercent: 25,
        rating: 4.8,
        reviewCount: 6540,
        image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&auto=format&fit=crop&q=60',
        description: 'World-renowned blood glucose glucometer providing accurate results in just 5 seconds from a tiny 1-2 μL blood droplet.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: 'Diagnostic Device - Follow enclosed user manual'
      },
      {
        name: 'Baidyanath Chyawanprash Special 1kg with 52 Ayurvedic Herbs',
        categoryName: 'Ayurvedic Care',
        brand: 'Baidyanath',
        mrp: 450,
        price: 380,
        discountPercent: 15,
        rating: 4.9,
        reviewCount: 2310,
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=60',
        description: 'Rich source of natural Vitamin C and amla, strengthens respiratory tract, boosts resistance against infections.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: '1-2 teaspoons daily with warm milk'
      },
      {
        name: 'Cetaphil Gentle Skin Cleanser For Dry to Normal Sensitive Skin 250ml',
        categoryName: 'Personal Care',
        brand: 'Galderma',
        mrp: 635,
        price: 540,
        discountPercent: 15,
        rating: 4.8,
        reviewCount: 5200,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60',
        description: 'Hydrating non-foaming daily wash with Niacinamide, Panthenol and Glycerin to preserve natural moisture barrier.',
        prescriptionRequired: false,
        scheduleType: 'OTC',
        dosage: 'Apply liberally to skin and massage gently before rinsing or wiping with cloth.'
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
        mrp: item.mrp * 100, // In Paise
        sellingPrice: item.price * 100, // In Paise
        discountPercent: item.discountPercent,
        prescriptionRequired: item.prescriptionRequired,
        scheduleType: item.scheduleType,
        sellerId: primarySeller._id,
        sellerName: primarySeller.businessName,
        rating: item.rating,
        reviewCount: item.reviewCount,
        status: 'ACTIVE',
        approvalStatus: 'approved'
      });

      // Create Inventory with batches
      await Inventory.create({
        productId: product._id,
        sellerId: primarySeller._id,
        sku: `SKU-${product._id.toString().slice(-6).toUpperCase()}`,
        batchNumber: `BAT-${Math.floor(10000 + Math.random() * 90000)}`,
        expiryDate: new Date('2027-12-31'),
        availableQty: 100,
        reservedQty: 0
      });
    }

    console.log(`[Seed] Successfully seeded ${catalog.length} products with live inventory.`);
    console.log('[Seed] Database initialization complete!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
