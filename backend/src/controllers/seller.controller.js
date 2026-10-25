import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import Order from '../models/Order.js';
import Seller from '../models/Seller.js';
import DeliveryTracking from '../models/DeliveryTracking.js';
import { InventoryService } from '../services/inventory.service.js';

export const getSellerDashboard = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    const [products, orders, seller] = await Promise.all([
      Product.find({ sellerId }),
      Order.find({ sellerId }),
      Seller.findById(sellerId)
    ]);

    const completed = orders.filter((o) => o.status !== 'CANCELLED');
    const grossSales = completed.reduce((sum, o) => sum + (o.pricing.grandTotal / 100), 0);
    const pendingFulfillment = orders.filter((o) => ['ORDER_CONFIRMED', 'PRESCRIPTION_APPROVED', 'PROCESSING_PHARMACY'].includes(o.status)).length;

    return res.status(200).json({
      success: true,
      data: {
        sellerName: seller?.businessName || req.user.name,
        licenseNumber: seller?.licenseNumber,
        status: seller?.status,
        totalProducts: products.length,
        activeListings: products.filter((p) => p.approvalStatus === 'approved').length,
        pendingApprovals: products.filter((p) => p.approvalStatus === 'pending').length,
        ordersCount: orders.length,
        pendingFulfillment,
        grossSales
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ sellerId: req.user.id }).sort({ createdAt: -1 });
    const productIds = products.map((p) => p._id);
    const inventories = await Inventory.find({ productId: { $in: productIds }, sellerId: req.user.id });
    const invMap = new Map(inventories.map((i) => [i.productId.toString(), i]));

    const formatted = products.map((p) => {
      const inv = invMap.get(p._id.toString());
      return {
        id: p._id,
        name: p.name,
        brand: p.brand,
        category: p.categoryName,
        mrp: p.mrp / 100,
        price: p.sellingPrice / 100,
        prescriptionRequired: p.prescriptionRequired,
        approvalStatus: p.approvalStatus,
        stock: inv ? inv.availableQty : 0,
        batchNumber: inv ? inv.batchNumber : 'N/A',
        expiryDate: inv ? inv.expiryDate : null,
        image: p.images[0] || ''
      };
    });

    return res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

export const addSellerProduct = async (req, res, next) => {
  try {
    const {
      name,
      brand,
      categoryName,
      categoryId,
      mrp,
      price,
      stock = 50,
      batchNumber,
      expiryDate,
      prescriptionRequired = false,
      dosage,
      description,
      image
    } = req.body;

    const seller = await Seller.findById(req.user.id);
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    const product = await Product.create({
      name,
      slug,
      brand: brand || seller?.businessName || 'Certified Brand',
      categoryId: categoryId || '66f1a2000000000000000001',
      categoryName: categoryName || 'Prescription Medicines',
      images: [image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60'],
      description: description || `${name} supplied by ${seller?.businessName}.`,
      dosage: dosage || 'As directed by physician',
      mrp: Number(mrp) * 100, // into Paise
      sellingPrice: Number(price) * 100, // into Paise
      discountPercent: Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100) || 0,
      prescriptionRequired: !!prescriptionRequired,
      sellerId: req.user.id,
      sellerName: seller?.businessName || req.user.name,
      approvalStatus: 'pending' // Requires admin review
    });

    // Create inventory record
    await Inventory.create({
      productId: product._id,
      sellerId: req.user.id,
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      batchNumber: batchNumber || `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: expiryDate ? new Date(expiryDate) : new Date('2027-12-31'),
      availableQty: Number(stock),
      reservedQty: 0
    });

    return res.status(201).json({
      success: true,
      message: 'Product listing submitted for Admin compliance approval.',
      data: { productId: product._id, approvalStatus: product.approvalStatus }
    });
  } catch (error) {
    next(error);
  }
};

export const updateInventoryStock = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { stock } = req.body;

    const updated = await Inventory.findOneAndUpdate(
      { productId, sellerId: req.user.id },
      { $set: { availableQty: Number(stock), updatedAt: new Date() } },
      { new: true }
    );

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const getSellerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ sellerId: req.user.id }).sort({ createdAt: -1 });
    const formatted = orders.map((o) => ({
      id: o._id,
      orderNumber: o.orderNumber,
      customerName: o.userName,
      status: o.status,
      items: o.items.map((it) => ({
        name: it.name,
        quantity: it.quantity,
        price: it.unitPrice / 100
      })),
      totalAmount: o.pricing.grandTotal / 100,
      paymentMethod: o.paymentMethod,
      createdAt: o.createdAt,
      shippingAddress: o.addressSnapshot,
      courierPartner: o.courierPartner,
      trackingNumber: o.trackingNumber
    }));

    return res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

export const packOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOneAndUpdate(
      { _id: id, sellerId: req.user.id },
      { $set: { status: 'PACKED' } },
      { new: true }
    );

    await DeliveryTracking.findOneAndUpdate(
      { orderId: id },
      {
        $set: { currentStatus: 'PACKED' },
        $push: { events: { status: 'PACKED', note: 'Packed by pharmacy with batch & safety seals', actor: req.user.email } }
      }
    );

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const dispatchOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { carrier, awbNumber } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: id, sellerId: req.user.id },
      {
        $set: {
          status: 'DISPATCHED',
          courierPartner: carrier || 'BlueDart Express',
          trackingNumber: awbNumber || `AWB-${Date.now()}`
        }
      },
      { new: true }
    );

    // Commit reserved inventory to permanent deduction
    const reservations = order.items.map((it) => ({
      inventoryId: it.inventoryId,
      quantity: it.quantity
    })).filter((r) => r.inventoryId);

    if (reservations.length > 0) {
      await InventoryService.commitReservedStock(reservations);
    }

    await DeliveryTracking.findOneAndUpdate(
      { orderId: id },
      {
        $set: {
          currentStatus: 'DISPATCHED',
          carrier: order.courierPartner,
          awbNumber: order.trackingNumber
        },
        $push: {
          events: {
            status: 'DISPATCHED',
            note: `Handed over to ${order.courierPartner} (AWB: ${order.trackingNumber})`,
            actor: req.user.email
          }
        }
      }
    );

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
