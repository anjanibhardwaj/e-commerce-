import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import DeliveryTracking from '../models/DeliveryTracking.js';
import { OrderService } from '../services/order.service.js';
import { InventoryService } from '../services/inventory.service.js';

export const createOrder = async (req, res, next) => {
  try {
    const { addressId, couponCode, prescriptionIds, paymentMethod = 'COD', items } = req.body;
    const idempotencyKey = req.headers['idempotency-key'] || `idemp_${Date.now()}_${Math.random()}`;

    // If client didn't supply items array, pull from customer's active Cart
    let lineItems = items;
    if (!lineItems || lineItems.length === 0) {
      const cart = await Cart.findOne({ userId: req.user.id });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          error: { code: 'CART_EMPTY', message: 'Your cart is empty. Add medicines before checkout.' }
        });
      }
      lineItems = cart.items;
    }

    const { order, isDuplicate } = await OrderService.createOrder({
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      items: lineItems,
      addressId,
      couponCode,
      prescriptionIds,
      paymentMethod,
      idempotencyKey
    });

    // Clear cart upon non-duplicate order placement
    if (!isDuplicate) {
      await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [] });
      await DeliveryTracking.create({
        orderId: order._id,
        currentStatus: order.status,
        events: [
          {
            status: order.status,
            note: 'Order placed by patient and registered in system',
            actor: req.user.email
          }
        ]
      });
    }

    return res.status(isDuplicate ? 200 : 201).json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        grandTotal: order.pricing.grandTotal / 100, // in Rupees
        deliveryFee: order.pricing.deliveryFee / 100,
        currency: order.pricing.currency,
        paymentMethod: order.paymentMethod,
        isDuplicate
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const formatted = orders.map((o) => ({
      id: o._id,
      orderNumber: o.orderNumber,
      status: o.status,
      itemsCount: o.items.length,
      items: o.items.map((it) => ({
        id: it.productId,
        name: it.name,
        price: it.unitPrice / 100,
        quantity: it.quantity,
        totalPrice: it.totalPrice / 100
      })),
      grandTotal: o.pricing.grandTotal / 100,
      createdAt: o.createdAt,
      courierPartner: o.courierPartner,
      trackingNumber: o.trackingNumber
    }));

    return res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found.' } });
    }

    // Role check: customer can only view own order
    if (req.user.role === 'customer' && order.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied.' } });
    }

    const tracking = await DeliveryTracking.findOne({ orderId: order._id });

    return res.status(200).json({
      success: true,
      data: {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          pricing: {
            itemsTotal: order.pricing.itemsTotal / 100,
            discount: order.pricing.discount / 100,
            deliveryFee: order.pricing.deliveryFee / 100,
            grandTotal: order.pricing.grandTotal / 100
          },
          items: order.items.map((it) => ({
            name: it.name,
            quantity: it.quantity,
            price: it.unitPrice / 100,
            totalPrice: it.totalPrice / 100,
            batchNumber: it.batchNumber
          })),
          address: order.addressSnapshot,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt
        },
        tracking: tracking || null
      }
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found.' } });
    }

    if (req.user.role === 'customer' && order.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied.' } });
    }

    if (['DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: { code: 'CANNOT_CANCEL', message: 'Order cannot be cancelled after pharmacy dispatch.' }
      });
    }

    order.status = 'CANCELLED';
    order.cancellationReason = reason || 'Cancelled by customer request';
    order.cancelledBy = req.user.email;
    await order.save();

    // Release reserved inventory
    const reservations = order.items.map((it) => ({
      inventoryId: it.inventoryId,
      quantity: it.quantity
    })).filter((r) => r.inventoryId);

    if (reservations.length > 0) {
      await InventoryService.releaseReservedStock(reservations);
    }

    return res.status(200).json({
      success: true,
      message: 'Order cancelled and reserved medicine stock returned to inventory.'
    });
  } catch (error) {
    next(error);
  }
};
