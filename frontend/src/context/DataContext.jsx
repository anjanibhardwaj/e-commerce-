import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProducts, mockCategories } from '../data/mockData';
import demoUsers from '../data/demoUsers.json';
import { generateOrderId } from '../utils/formatters';

const DataContext = createContext(null);

// Local Storage Keys
const LS_PRODUCTS_KEY = 'med_ecommerce_products';
const LS_SELLERS_KEY = 'med_ecommerce_sellers';
const LS_ORDERS_KEY = 'med_ecommerce_orders';
const LS_PRESCRIPTIONS_KEY = 'med_ecommerce_prescriptions';
const LS_CART_KEY = 'med_ecommerce_cart';
const LS_WISHLIST_KEY = 'med_ecommerce_wishlist';
const LS_AUDIT_KEY = 'med_ecommerce_audit';

// Initial flat catalog seeded from existing mockProducts
const flattenInitialProducts = () => {
  const combined = [
    ...mockProducts.newLaunches,
    ...mockProducts.trending,
    ...mockProducts.dealsOfDay,
    ...mockProducts.inTheSpotlight,
    ...mockProducts.wellnessEssentials
  ];

  // Deduplicate by ID
  const map = new Map();
  combined.forEach((item, index) => {
    if (!map.has(item.id)) {
      map.set(item.id, {
        ...item,
        sellerId: index % 2 === 0 ? 'seller-001' : 'seller-002',
        sellerName: index % 2 === 0 ? 'Apollo Care Pharmacy' : 'MediLife Wellness Store',
        batchNumber: `BAT-${1000 + index}`,
        expiryDate: '2027-10-31',
        stock: 50 + (index * 7) % 80,
        approvalStatus: 'approved', // Seed products are approved by default
        featured: index < 8
      });
    }
  });

  return Array.from(map.values());
};

const initialOrdersSeed = [
  {
    id: 'MED-782194',
    userId: 'user-001',
    userName: 'Rohan Sharma',
    userEmail: 'user@example.com',
    userPhone: '+91 9876543210',
    sellerId: 'seller-001',
    sellerName: 'Apollo Care Pharmacy',
    items: [
      {
        id: 'nl-1',
        name: 'Pharmeasy Chelated Magnesium Glycinate 500mg',
        price: 648,
        quantity: 2,
        prescriptionRequired: false
      }
    ],
    totalAmount: 1296,
    deliveryFee: 0,
    shippingAddress: {
      name: 'Rohan Sharma',
      tag: 'Home',
      street: 'Apt 402, Green Meadows, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400058'
    },
    paymentMethod: 'UPI / NetBanking',
    paymentStatus: 'Paid',
    status: 'dispatched', // placed, verified, packed, dispatched, delivered, cancelled
    trackingNumber: 'DEL-9938102',
    courierPartner: 'BlueDart Pharma Express',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    prescriptionId: null
  },
  {
    id: 'MED-910432',
    userId: 'user-001',
    userName: 'Rohan Sharma',
    userEmail: 'user@example.com',
    userPhone: '+91 9876543210',
    sellerId: 'seller-001',
    sellerName: 'Apollo Care Pharmacy',
    items: [
      {
        id: 'nl-3',
        name: 'Ageasy Automatic Digital Blood Pressure Monitor',
        price: 1068,
        quantity: 1,
        prescriptionRequired: true
      }
    ],
    totalAmount: 1068,
    deliveryFee: 0,
    shippingAddress: {
      name: 'Rohan Sharma',
      tag: 'Home',
      street: 'Apt 402, Green Meadows, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400058'
    },
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    status: 'placed',
    trackingNumber: null,
    courierPartner: null,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    prescriptionId: 'rx-seed-101'
  }
];

const initialPrescriptionsSeed = [
  {
    id: 'rx-seed-101',
    orderId: 'MED-910432',
    userId: 'user-001',
    userName: 'Rohan Sharma',
    patientName: 'Rohan Sharma (32 Yrs / Male)',
    doctorName: 'Dr. A. K. Sen, MD Cardiology',
    hospitalClinic: 'Lilavati Medical Center, Mumbai',
    rxImageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80',
    fileName: 'prescription_dr_sen_oct2026.pdf',
    uploadedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    status: 'pending_review', // pending_review, approved, rejected
    reviewedBy: null,
    pharmacistNotes: 'Awaiting certified pharmacist check for Blood Pressure Monitor Rx verification.'
  },
  {
    id: 'rx-seed-102',
    orderId: 'MED-654120',
    userId: 'user-002',
    userName: 'Priya Patel',
    patientName: 'Priya Patel (28 Yrs / Female)',
    doctorName: 'Dr. Meera Joshi, MBBS',
    hospitalClinic: 'Apollo Clinic, Pune',
    rxImageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    fileName: 'rx_priya_antibiotics.jpg',
    uploadedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    status: 'approved',
    reviewedBy: 'Admin Pharmacist',
    pharmacistNotes: 'Prescription valid. Dosage matches order request.'
  }
];

export function DataProvider({ children }) {
  // Products
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_PRODUCTS_KEY);
      return stored ? JSON.parse(stored) : flattenInitialProducts();
    } catch {
      return flattenInitialProducts();
    }
  });

  // Sellers
  const [sellers, setSellers] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_SELLERS_KEY);
      return stored ? JSON.parse(stored) : demoUsers.sellers;
    } catch {
      return demoUsers.sellers;
    }
  });

  // Orders
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_ORDERS_KEY);
      return stored ? JSON.parse(stored) : initialOrdersSeed;
    } catch {
      return initialOrdersSeed;
    }
  });

  // Prescriptions
  const [prescriptions, setPrescriptions] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_PRESCRIPTIONS_KEY);
      return stored ? JSON.parse(stored) : initialPrescriptionsSeed;
    } catch {
      return initialPrescriptionsSeed;
    }
  });

  // Cart
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_CART_KEY);
      return stored ? JSON.parse(stored) : [
        {
          id: 'nl-1',
          name: 'Pharmeasy Chelated Magnesium Glycinate 500mg - 60 Capsules',
          mrp: 1079,
          price: 648,
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
          quantity: 1,
          prescriptionRequired: false
        }
      ];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_WISHLIST_KEY);
      return stored ? JSON.parse(stored) : ['nl-3', 'nl-5'];
    } catch {
      return [];
    }
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_AUDIT_KEY);
      return stored ? JSON.parse(stored) : [
        {
          id: 'log-1',
          timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          action: 'SELLER_APPROVED',
          actor: 'admin@example.com',
          details: 'Approved seller Apollo Care Pharmacy (License DL-MH-2024-88491)'
        },
        {
          id: 'log-2',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          action: 'PRESCRIPTION_VERIFIED',
          actor: 'admin@example.com',
          details: 'Prescription rx-seed-102 approved for Order MED-654120'
        }
      ];
    } catch {
      return [];
    }
  });

  // Categories list
  const [categories, setCategories] = useState(mockCategories);

  // Global Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Sync to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LS_SELLERS_KEY, JSON.stringify(sellers));
  }, [sellers]);

  useEffect(() => {
    localStorage.setItem(LS_ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LS_PRESCRIPTIONS_KEY, JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem(LS_CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LS_WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(LS_AUDIT_KEY, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Log compliance action
  const logAction = (action, details, actor = 'System') => {
    const newEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      details
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // --- Cart Actions ---
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
    showToast(`Added "${product.name.slice(0, 26)}..." to cart!`);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // --- Wishlist Actions ---
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to wishlist!', 'success');
        return [...prev, productId];
      }
    });
  };

  // --- Product Management (Seller & Admin) ---
  const addProduct = (productData, seller) => {
    const newProduct = {
      id: `med-${Date.now()}`,
      name: productData.name,
      category: productData.category || 'Prescription Medicines',
      brand: productData.brand || seller.name,
      mrp: Number(productData.mrp),
      price: Number(productData.price),
      discount: Math.round(((Number(productData.mrp) - Number(productData.price)) / Number(productData.mrp)) * 100) || 0,
      rating: 4.8,
      reviewsCount: 1,
      image: productData.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
      description: productData.description,
      dosage: productData.dosage || 'As directed by physician',
      prescriptionRequired: !!productData.prescriptionRequired,
      batchNumber: productData.batchNumber || `BAT-${Date.now().toString().slice(-5)}`,
      expiryDate: productData.expiryDate || '2027-12-31',
      stock: Number(productData.stock) || 50,
      sellerId: seller.id,
      sellerName: seller.name,
      approvalStatus: 'pending', // Awaiting Admin Review
      createdAt: new Date().toISOString()
    };

    setProducts((prev) => [newProduct, ...prev]);
    logAction('PRODUCT_SUBMITTED', `Seller ${seller.name} submitted "${newProduct.name}" for approval`, seller.email);
    showToast(`Product "${newProduct.name}" submitted! Awaiting Admin approval.`);
    return newProduct;
  };

  const approveProduct = (productId, adminEmail) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, approvalStatus: 'approved' } : p))
    );
    const prod = products.find((p) => p.id === productId);
    logAction('PRODUCT_APPROVED', `Admin approved product listing: ${prod?.name || productId}`, adminEmail);
    showToast('Product listing approved and now live on storefront!');
  };

  const rejectProduct = (productId, adminEmail, reason = 'Did not meet catalog standards') => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, approvalStatus: 'rejected', rejectReason: reason } : p))
    );
    const prod = products.find((p) => p.id === productId);
    logAction('PRODUCT_REJECTED', `Admin rejected product "${prod?.name}": ${reason}`, adminEmail);
    showToast('Product listing rejected.', 'error');
  };

  const updateStock = (productId, newStock) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Number(newStock) } : p))
    );
    showToast('Stock quantity updated!');
  };

  // --- Seller Actions (Admin) ---
  const approveSeller = (sellerId, adminEmail) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, status: 'approved' } : s))
    );
    const s = sellers.find((item) => item.id === sellerId);
    logAction('SELLER_APPROVED', `Approved seller pharmacy license: ${s?.name || sellerId}`, adminEmail);
    showToast(`Seller "${s?.name || sellerId}" approved!`);
  };

  const rejectSeller = (sellerId, adminEmail) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, status: 'rejected' } : s))
    );
    const s = sellers.find((item) => item.id === sellerId);
    logAction('SELLER_REJECTED', `Rejected seller application: ${s?.name || sellerId}`, adminEmail);
    showToast(`Seller "${s?.name || sellerId}" application rejected.`, 'info');
  };

  const suspendSeller = (sellerId, adminEmail) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, status: 'suspended' } : s))
    );
    const s = sellers.find((item) => item.id === sellerId);
    logAction('SELLER_SUSPENDED', `Suspended seller account: ${s?.name || sellerId}`, adminEmail);
    showToast(`Seller "${s?.name || sellerId}" account suspended.`, 'error');
  };

  // --- Order Actions (User & Seller) ---
  const createOrder = (orderData) => {
    const orderId = generateOrderId();
    const newOrder = {
      id: orderId,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'placed',
      trackingNumber: null,
      courierPartner: null
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    logAction('ORDER_PLACED', `New order ${orderId} placed for amount ₹${newOrder.totalAmount}`, newOrder.userEmail);
    showToast(`Order #${orderId} placed successfully!`);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus, courierData = {}) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            trackingNumber: courierData.trackingNumber || o.trackingNumber,
            courierPartner: courierData.courierPartner || o.courierPartner
          };
        }
        return o;
      })
    );
    logAction('ORDER_STATUS_CHANGED', `Order ${orderId} status changed to ${newStatus.toUpperCase()}`, courierData.actor || 'Seller');
    showToast(`Order #${orderId} status updated to "${newStatus.toUpperCase()}"!`);
  };

  // --- Prescription Actions (User & Admin) ---
  const uploadPrescription = (rxData) => {
    const newRx = {
      id: `rx-${Date.now()}`,
      orderId: rxData.orderId || null,
      userId: rxData.userId,
      userName: rxData.userName,
      patientName: rxData.patientName || rxData.userName,
      doctorName: rxData.doctorName || 'Prescribing Physician',
      hospitalClinic: rxData.hospitalClinic || 'General Health Clinic',
      rxImageUrl: rxData.rxImageUrl || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80',
      fileName: rxData.fileName || 'prescription_upload.pdf',
      uploadedAt: new Date().toISOString(),
      status: 'pending_review',
      pharmacistNotes: 'Under compliance verification.'
    };

    setPrescriptions((prev) => [newRx, ...prev]);
    showToast('Prescription uploaded successfully! Pharmacist review in progress.');
    return newRx;
  };

  const approvePrescription = (rxId, adminEmail, notes = 'Verified by licensed pharmacist') => {
    setPrescriptions((prev) =>
      prev.map((rx) =>
        rx.id === rxId
          ? { ...rx, status: 'approved', reviewedBy: adminEmail, pharmacistNotes: notes }
          : rx
      )
    );

    // If prescription has linked order, update order status to 'verified'
    const targetRx = prescriptions.find((rx) => rx.id === rxId);
    if (targetRx && targetRx.orderId) {
      setOrders((prev) =>
        prev.map((o) => (o.id === targetRx.orderId ? { ...o, status: 'verified' } : o))
      );
    }

    logAction('PRESCRIPTION_APPROVED', `Prescription ${rxId} approved by ${adminEmail}`, adminEmail);
    showToast('Prescription verified and approved!');
  };

  const rejectPrescription = (rxId, adminEmail, notes = 'Illegible or expired prescription') => {
    setPrescriptions((prev) =>
      prev.map((rx) =>
        rx.id === rxId
          ? { ...rx, status: 'rejected', reviewedBy: adminEmail, pharmacistNotes: notes }
          : rx
      )
    );
    logAction('PRESCRIPTION_REJECTED', `Prescription ${rxId} rejected: ${notes}`, adminEmail);
    showToast('Prescription rejected. User notified to re-upload.', 'error');
  };

  const value = {
    products,
    sellers,
    orders,
    prescriptions,
    cart,
    wishlist,
    auditLogs,
    categories,
    toast,
    showToast,
    closeToast: () => setToast(null),
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    addProduct,
    approveProduct,
    rejectProduct,
    updateStock,
    approveSeller,
    rejectSeller,
    suspendSeller,
    createOrder,
    updateOrderStatus,
    uploadPrescription,
    approvePrescription,
    rejectPrescription,
    setCategories
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
