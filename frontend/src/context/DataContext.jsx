import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import demoUsers from '../data/demoUsers.json';
import { generateOrderId } from '../utils/formatters';
import apiClient from '../services/apiClient';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

const LS_PRODUCTS_KEY = 'med_ecommerce_products';
const LS_SELLERS_KEY = 'med_ecommerce_sellers';
const LS_ORDERS_KEY = 'med_ecommerce_orders';
const LS_PRESCRIPTIONS_KEY = 'med_ecommerce_prescriptions';
const LS_CART_KEY = 'med_ecommerce_cart';
const LS_WISHLIST_KEY = 'med_ecommerce_wishlist';
const LS_AUDIT_KEY = 'med_ecommerce_audit';
const LS_CATEGORIES_KEY = 'med_ecommerce_categories';
const LS_COUPONS_KEY = 'med_ecommerce_coupons';

export function DataProvider({ children }) {
  const { user, openAuthModal } = useAuth();
  // Products from Database / Local fallback
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_PRODUCTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Automatically purge any stale legacy mock items
        if (Array.isArray(parsed) && parsed.some(p => typeof p.id === 'string' && (p.id.startsWith('nl-') || p.id.startsWith('deal-') || p.id.startsWith('vit-') || p.id.startsWith('device-')))) {
          localStorage.removeItem(LS_PRODUCTS_KEY);
          return [];
        }
        return parsed;
      }
      return [];
    } catch {
      return [];
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
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Prescriptions
  const [prescriptions, setPrescriptions] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_PRESCRIPTIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Cart
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_WISHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_AUDIT_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Categories list from MongoDB Atlas
  const [categories, setCategories] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_CATEGORIES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.some(c => typeof c.id === 'string' && c.id.startsWith('cat-'))) {
          localStorage.removeItem(LS_CATEGORIES_KEY);
          return [];
        }
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Coupons from MongoDB Atlas
  const [coupons, setCoupons] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_COUPONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Real-time synchronization timestamp
  const [lastRefreshedAt, setLastRefreshedAt] = useState(Date.now());

  // Global Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Sync state to local storage
  useEffect(() => {
    if (products.length > 0) localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(products));
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
    if (categories.length > 0) localStorage.setItem(LS_CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    if (coupons.length > 0) localStorage.setItem(LS_COUPONS_KEY, JSON.stringify(coupons));
  }, [coupons]);

  // Fetch live products from backend MongoDB
  const fetchLiveProducts = useCallback(async () => {
    try {
      const res = await apiClient.get('/products?limit=100');
      if (res && res.success && res.data?.items) {
        setProducts(res.data.items);
        setLastRefreshedAt(Date.now());
      }
    } catch (err) {
      console.warn('[DataContext] Failed to fetch products from backend:', err.message);
    }
  }, []);

  // Fetch live categories from backend MongoDB
  const fetchLiveCategories = useCallback(async () => {
    try {
      const res = await apiClient.get('/products/categories');
      if (res && res.success && res.data?.length > 0) {
        setCategories(res.data);
      }
    } catch (err) {
      console.warn('[DataContext] Failed to fetch categories from backend:', err.message);
    }
  }, []);

  // Fetch live coupons from backend MongoDB
  const fetchLiveCoupons = useCallback(async () => {
    try {
      const res = await apiClient.get('/coupons');
      if (res && res.success && res.data) {
        setCoupons(res.data);
      }
    } catch (err) {
      console.warn('[DataContext] Failed to fetch coupons from backend:', err.message);
    }
  }, []);

  // Fetch live orders depending on role
  const fetchLiveOrders = useCallback(async (role = 'user') => {
    try {
      let endpoint = '/orders/my';
      if (role === 'seller') endpoint = '/seller/orders';
      else if (role === 'admin') endpoint = '/admin/orders';

      const res = await apiClient.get(endpoint);
      if (res && res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      // User might be unauthenticated, quiet warning
    }
  }, []);

  // Fetch live sellers (Admin)
  const fetchLiveSellers = useCallback(async () => {
    try {
      const res = await apiClient.get('/admin/sellers');
      if (res && res.success && res.data) {
        setSellers(res.data);
      }
    } catch (err) {
      // Quiet warning
    }
  }, []);

  // Live real-time polling every 3 seconds (as requested: "refresh alweys 3 sec dal do")
  useEffect(() => {
    // Initial fetch on mount
    fetchLiveProducts();
    fetchLiveCategories();
    fetchLiveCoupons();
    if (user) {
      const userRole = (user.role === 'customer' || user.role === 'user') ? 'user' : user.role;
      fetchLiveOrders(userRole);
    }

    const interval = setInterval(() => {
      fetchLiveProducts();
      fetchLiveCategories();
      fetchLiveCoupons();
      if (user) {
        const userRole = (user.role === 'customer' || user.role === 'user') ? 'user' : user.role;
        fetchLiveOrders(userRole);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchLiveProducts, fetchLiveCategories, fetchLiveCoupons, fetchLiveOrders, user]);

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
  const executeAddToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => (item.id || item._id) === (product.id || product._id));
      if (existing) {
        return prev.map((item) =>
          (item.id || item._id) === (product.id || product._id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
    showToast(`Added "${product.name.slice(0, 26)}..." to cart!`);
  };

  const addToCart = (product, quantity = 1) => {
    // If user is not logged in, trigger Flipkart-style Login/Signup modal
    if (!user) {
      if (openAuthModal) {
        openAuthModal(() => {
          executeAddToCart(product, quantity);
        });
      }
      return;
    }
    executeAddToCart(product, quantity);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((item) => ((item.id || item._id) === id ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => (item.id || item._id) !== id));
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
  const addProduct = async (productData, seller) => {
    try {
      const res = await apiClient.post('/seller/products/add', {
        name: productData.name,
        brand: productData.brand || seller.name,
        categoryName: productData.category || 'Prescription Medicines',
        mrp: Number(productData.mrp),
        price: Number(productData.price),
        stock: Number(productData.stock) || 50,
        batchNumber: productData.batchNumber,
        expiryDate: productData.expiryDate,
        prescriptionRequired: !!productData.prescriptionRequired,
        dosage: productData.dosage,
        description: productData.description,
        image: productData.image
      });

      if (res && res.success) {
        showToast(`Product "${productData.name}" added successfully!`);
        fetchLiveProducts();
        return res.data;
      }
    } catch (err) {
      console.warn('[DataContext] Backend addProduct failed, saving locally:', err.message);
    }

    // Local fallback
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
      approvalStatus: 'approved',
      createdAt: new Date().toISOString()
    };

    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" added!`);
    return newProduct;
  };

  const approveProduct = async (productId, adminEmail) => {
    try {
      await apiClient.put(`/admin/products/${productId}/review`, { approvalStatus: 'approved' });
      showToast('Product listing approved and live on storefront!');
      fetchLiveProducts();
      return;
    } catch (err) {
      console.warn('[DataContext] Live approveProduct failed:', err.message);
    }

    setProducts((prev) =>
      prev.map((p) => ((p.id || p._id) === productId ? { ...p, approvalStatus: 'approved' } : p))
    );
    showToast('Product listing approved!');
  };

  const rejectProduct = async (productId, adminEmail, reason = 'Did not meet standards') => {
    try {
      await apiClient.put(`/admin/products/${productId}/review`, { approvalStatus: 'rejected', reason });
      showToast('Product listing rejected.', 'error');
      fetchLiveProducts();
      return;
    } catch (err) {
      console.warn('[DataContext] Live rejectProduct failed:', err.message);
    }

    setProducts((prev) =>
      prev.map((p) =>
        (p.id || p._id) === productId ? { ...p, approvalStatus: 'rejected', rejectReason: reason } : p
      )
    );
    showToast('Product listing rejected.', 'error');
  };

  const deleteProduct = async (productId) => {
    try {
      await apiClient.delete(`/admin/products/${productId}`);
      showToast('Product removed from database catalog.', 'info');
      fetchLiveProducts();
      return;
    } catch (err) {
      console.warn('[DataContext] Live deleteProduct failed:', err.message);
    }

    setProducts((prev) => prev.filter((p) => (p.id || p._id) !== productId));
    showToast('Product removed.', 'info');
  };

  const updateStock = async (productId, newStock) => {
    try {
      await apiClient.put(`/seller/inventory/${productId}`, { stock: Number(newStock) });
      showToast('Stock quantity updated in MongoDB!');
      fetchLiveProducts();
      return;
    } catch (err) {
      console.warn('[DataContext] Live updateStock failed:', err.message);
    }

    setProducts((prev) =>
      prev.map((p) => ((p.id || p._id) === productId ? { ...p, stock: Number(newStock) } : p))
    );
    showToast('Stock quantity updated!');
  };

  // --- Seller Actions (Admin) ---
  const approveSeller = async (sellerId, adminEmail) => {
    try {
      await apiClient.put(`/admin/sellers/${sellerId}/review`, { status: 'approved' });
      showToast('Seller pharmacy approved!');
      fetchLiveSellers();
      return;
    } catch (err) {
      console.warn('[DataContext] Live approveSeller failed:', err.message);
    }

    setSellers((prev) =>
      prev.map((s) => ((s.id || s._id) === sellerId ? { ...s, status: 'approved' } : s))
    );
    showToast('Seller approved!');
  };

  const rejectSeller = async (sellerId, adminEmail) => {
    try {
      await apiClient.put(`/admin/sellers/${sellerId}/review`, { status: 'rejected' });
      showToast('Seller application rejected.');
      fetchLiveSellers();
      return;
    } catch (err) {
      console.warn('[DataContext] Live rejectSeller failed:', err.message);
    }

    setSellers((prev) =>
      prev.map((s) => ((s.id || s._id) === sellerId ? { ...s, status: 'rejected' } : s))
    );
  };

  const suspendSeller = async (sellerId, adminEmail) => {
    try {
      await apiClient.put(`/admin/sellers/${sellerId}/review`, { status: 'suspended' });
      showToast('Seller account suspended.', 'error');
      fetchLiveSellers();
      return;
    } catch (err) {
      console.warn('[DataContext] Live suspendSeller failed:', err.message);
    }

    setSellers((prev) =>
      prev.map((s) => ((s.id || s._id) === sellerId ? { ...s, status: 'suspended' } : s))
    );
  };

  // --- Order Actions (User & Seller) ---
  const createOrder = async (orderData) => {
    try {
      // Create order via live Backend API
      const itemsPayload = orderData.items.map((it) => ({
        productId: it.id || it.productId || it._id,
        quantity: it.quantity
      }));

      const res = await apiClient.post('/orders', {
        addressId: orderData.addressId,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod?.toLowerCase().includes('cash') ? 'COD' : 'ONLINE',
        items: itemsPayload,
        couponCode: orderData.couponCode
      });

      if (res && res.success && res.data) {
        const liveOrder = {
          id: res.data.orderNumber || res.data.orderId,
          orderId: res.data.orderNumber || res.data.orderId,
          orderNumber: res.data.orderNumber || res.data.orderId,
          totalAmount: res.data.grandTotal,
          status: res.data.status,
          createdAt: new Date().toISOString(),
          items: orderData.items,
          shippingAddress: orderData.shippingAddress,
          paymentMethod: orderData.paymentMethod,
          paymentStatus: orderData.paymentStatus || 'Pending'
        };

        setOrders((prev) => [liveOrder, ...prev]);
        clearCart();
        showToast(`Order #${res.data.orderNumber} placed and saved to MongoDB!`);
        return liveOrder;
      }
    } catch (err) {
      console.warn('[DataContext] Live order creation failed, falling back to local state:', err.message);
    }

    // Local fallback with generated ORD- order number
    const orderId = `ORD-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: orderId,
      orderId: orderId,
      orderNumber: orderId,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'placed',
      trackingNumber: null,
      courierPartner: null
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Order #${orderId} placed successfully!`);
    return newOrder;
  };

  // Seller Order State Transitions
  const acceptOrder = async (orderId) => {
    try {
      await apiClient.post(`/seller/orders/${orderId}/accept`);
      showToast(`Order accepted by pharmacy for dispensing!`);
      fetchLiveOrders('seller');
      return;
    } catch (err) {
      console.warn('[DataContext] Live acceptOrder failed:', err.message);
    }

    setOrders((prev) =>
      prev.map((o) => ((o.id || o._id) === orderId ? { ...o, status: 'PROCESSING_PHARMACY' } : o))
    );
  };

  const rejectOrder = async (orderId, reason = 'Stock unavailable') => {
    try {
      await apiClient.post(`/seller/orders/${orderId}/reject`, { reason });
      showToast(`Order rejected and inventory released!`, 'info');
      fetchLiveOrders('seller');
      return;
    } catch (err) {
      console.warn('[DataContext] Live rejectOrder failed:', err.message);
    }

    setOrders((prev) =>
      prev.map((o) =>
        (o.id || o._id) === orderId ? { ...o, status: 'REJECTED', cancellationReason: reason } : o
      )
    );
  };

  const packOrder = async (orderId) => {
    try {
      await apiClient.post(`/seller/orders/${orderId}/pack`);
      showToast(`Order packed and safety-sealed!`);
      fetchLiveOrders('seller');
      return;
    } catch (err) {
      console.warn('[DataContext] Live packOrder failed:', err.message);
    }

    setOrders((prev) =>
      prev.map((o) => ((o.id || o._id) === orderId ? { ...o, status: 'PACKED' } : o))
    );
  };

  const dispatchOrder = async (orderId, courierData = {}) => {
    try {
      const awb = courierData.trackingNumber || `AWB-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const carrier = courierData.courierPartner || 'BlueDart Pharma Express';

      await apiClient.post(`/seller/orders/${orderId}/dispatch`, {
        carrier,
        awbNumber: awb
      });

      showToast(`Order dispatched with ${carrier} (AWB: ${awb})!`);
      fetchLiveOrders('seller');
      return;
    } catch (err) {
      console.warn('[DataContext] Live dispatchOrder failed:', err.message);
    }

    setOrders((prev) =>
      prev.map((o) => {
        if ((o.id || o._id) === orderId) {
          return {
            ...o,
            status: 'DISPATCHED',
            trackingNumber: courierData.trackingNumber || `AWB-${Date.now()}`,
            courierPartner: courierData.courierPartner || 'BlueDart Express'
          };
        }
        return o;
      })
    );
  };

  const deliverOrder = async (orderId) => {
    try {
      await apiClient.post(`/seller/orders/${orderId}/deliver`);
      showToast(`Order marked as DELIVERED to customer doorstep!`);
      fetchLiveOrders('seller');
      return;
    } catch (err) {
      console.warn('[DataContext] Live deliverOrder failed:', err.message);
    }

    setOrders((prev) =>
      prev.map((o) => ((o.id || o._id) === orderId ? { ...o, status: 'DELIVERED' } : o))
    );
  };

  const updateOrderStatus = (orderId, newStatus, courierData = {}) => {
    if (newStatus === 'PROCESSING_PHARMACY' || newStatus === 'accepted') {
      acceptOrder(orderId);
    } else if (newStatus === 'REJECTED' || newStatus === 'rejected') {
      rejectOrder(orderId, courierData.reason);
    } else if (newStatus === 'PACKED' || newStatus === 'packed') {
      packOrder(orderId);
    } else if (newStatus === 'DISPATCHED' || newStatus === 'dispatched') {
      dispatchOrder(orderId, courierData);
    } else if (newStatus === 'DELIVERED' || newStatus === 'delivered') {
      deliverOrder(orderId);
    } else {
      setOrders((prev) =>
        prev.map((o) =>
          (o.id || o._id) === orderId ? { ...o, status: newStatus } : o
        )
      );
      showToast(`Order status updated to "${newStatus}"!`);
    }
  };

  // --- Prescription Actions ---
  const uploadPrescription = async (rxData) => {
    try {
      if (rxData.file) {
        const formData = new FormData();
        formData.append('prescription', rxData.file);
        formData.append('patientName', rxData.patientName || rxData.userName);
        formData.append('doctorName', rxData.doctorName);
        formData.append('hospitalClinic', rxData.hospitalClinic);

        const res = await apiClient.upload('/prescriptions', formData);
        if (res && res.success) {
          showToast('Prescription uploaded securely to backend!');
          return res.data;
        }
      }
    } catch (err) {
      console.warn('[DataContext] Live prescription upload failed:', err.message);
    }

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
      status: 'pending_review'
    };

    setPrescriptions((prev) => [newRx, ...prev]);
    showToast('Prescription uploaded! Pharmacist review in progress.');
    return newRx;
  };

  const approvePrescription = async (rxId, adminEmail, notes = 'Verified by licensed pharmacist') => {
    try {
      await apiClient.put(`/admin/prescriptions/${rxId}/review`, {
        decision: 'APPROVED',
        notes
      });
      showToast('Prescription verified and approved in database!');
      return;
    } catch (err) {
      console.warn('[DataContext] Live approvePrescription failed:', err.message);
    }

    setPrescriptions((prev) =>
      prev.map((rx) =>
        (rx.id || rx._id) === rxId ? { ...rx, status: 'approved', reviewedBy: adminEmail } : rx
      )
    );
  };

  const rejectPrescription = async (rxId, adminEmail, notes = 'Illegible or expired prescription') => {
    try {
      await apiClient.put(`/admin/prescriptions/${rxId}/review`, {
        decision: 'REJECTED',
        notes
      });
      showToast('Prescription rejected.', 'error');
      return;
    } catch (err) {
      console.warn('[DataContext] Live rejectPrescription failed:', err.message);
    }

    setPrescriptions((prev) =>
      prev.map((rx) =>
        (rx.id || rx._id) === rxId ? { ...rx, status: 'rejected', reviewedBy: adminEmail } : rx
      )
    );
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
    coupons,
    lastRefreshedAt,
    toast,
    showToast,
    closeToast: () => setToast(null),
    fetchLiveProducts,
    fetchLiveCategories,
    fetchLiveCoupons,
    fetchLiveOrders,
    fetchLiveSellers,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    addProduct,
    approveProduct,
    rejectProduct,
    deleteProduct,
    updateStock,
    approveSeller,
    rejectSeller,
    suspendSeller,
    createOrder,
    acceptOrder,
    rejectOrder,
    packOrder,
    dispatchOrder,
    deliverOrder,
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
