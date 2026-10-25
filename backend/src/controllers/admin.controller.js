import User from '../models/User.js';
import Seller from '../models/Seller.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Prescription from '../models/Prescription.js';
import AuditLog from '../models/AuditLog.js';
import Category from '../models/Category.js';

export const getAdminDashboard = async (req, res, next) => {
  try {
    const [usersCount, sellersCount, pendingSellers, productsCount, pendingProducts, orders, pendingRx, auditLogs] =
      await Promise.all([
        User.countDocuments({ role: 'customer' }),
        Seller.countDocuments(),
        Seller.countDocuments({ status: 'pending' }),
        Product.countDocuments(),
        Product.countDocuments({ approvalStatus: 'pending' }),
        Order.find().sort({ createdAt: -1 }),
        Prescription.countDocuments({ status: 'PENDING_REVIEW' }),
        AuditLog.find().sort({ createdAt: -1 }).limit(10)
      ]);

    const totalGMV = orders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + (o.pricing.grandTotal / 100), 0);
    const platformCommission = Math.round(totalGMV * 0.08);

    return res.status(200).json({
      success: true,
      data: {
        usersCount,
        sellersCount,
        pendingSellers,
        productsCount,
        pendingProducts,
        ordersCount: orders.length,
        pendingRx,
        totalGMV,
        platformCommission,
        recentOrders: orders.slice(0, 5).map((o) => ({
          id: o._id,
          orderNumber: o.orderNumber,
          customerName: o.userName,
          sellerName: o.sellerName,
          amount: o.pricing.grandTotal / 100,
          status: o.status,
          createdAt: o.createdAt
        })),
        auditLogs
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getSellers = async (req, res, next) => {
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: sellers });
  } catch (error) {
    next(error);
  }
};

export const reviewSeller = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body; // status: 'approved' | 'rejected' | 'suspended'

    const seller = await Seller.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
          approvedBy: req.user.id,
          approvalDate: new Date()
        }
      },
      { new: true }
    );

    await AuditLog.create({
      entityType: 'SELLER',
      entityId: id,
      action: `SELLER_${status.toUpperCase()}`,
      actorId: req.user.id,
      actorRole: req.user.role,
      actorEmail: req.user.email,
      details: { status, notes, licenseNumber: seller?.licenseNumber }
    });

    return res.status(200).json({ success: true, data: seller });
  } catch (error) {
    next(error);
  }
};

export const reviewProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approvalStatus, reason } = req.body; // 'approved' | 'rejected'

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: { approvalStatus } },
      { new: true }
    );

    await AuditLog.create({
      entityType: 'PRODUCT',
      entityId: id,
      action: `PRODUCT_${approvalStatus.toUpperCase()}`,
      actorId: req.user.id,
      actorRole: req.user.role,
      actorEmail: req.user.email,
      details: { approvalStatus, reason, productName: product?.name }
    });

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    const formatted = orders.map((o) => ({
      id: o._id,
      orderNumber: o.orderNumber,
      customerName: o.userName,
      sellerName: o.sellerName,
      itemsCount: o.items.length,
      amount: o.pricing.grandTotal / 100,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      status: o.status,
      courierPartner: o.courierPartner,
      trackingNumber: o.trackingNumber,
      createdAt: o.createdAt
    }));

    return res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};
