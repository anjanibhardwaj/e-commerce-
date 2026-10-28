import Order from '../models/Order.js';
import Address from '../models/Address.js';
import Prescription from '../models/Prescription.js';
import { PriceEngine } from './priceEngine.service.js';
import { InventoryService } from './inventory.service.js';

export class OrderService {
  static async createOrder({
    userId,
    userName,
    userEmail,
    userPhone,
    items,
    addressId,
    shippingAddress,
    couponCode,
    prescriptionIds = [],
    paymentMethod = 'COD',
    idempotencyKey
  }) {
    // 1. Idempotency Check
    const existing = await Order.findOne({ idempotencyKey });
    if (existing) {
      return { order: existing, isDuplicate: true };
    }

    // 2. Fetch & Snapshot Delivery Address
    let addressSnapshot = null;
    if (addressId && typeof addressId === 'string' && addressId.match(/^[0-9a-fA-F]{24}$/)) {
      const address = await Address.findOne({ _id: addressId, userId });
      if (address) {
        addressSnapshot = {
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2 || '',
          landmark: address.landmark || '',
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          country: address.country || 'India'
        };
      }
    }

    if (!addressSnapshot && shippingAddress) {
      addressSnapshot = {
        fullName: shippingAddress.fullName || shippingAddress.name || userName || 'Customer',
        phone: shippingAddress.phone || userPhone || '+91 9876543210',
        line1: shippingAddress.street || shippingAddress.line1 || 'Main Road',
        line2: shippingAddress.line2 || '',
        landmark: shippingAddress.landmark || '',
        city: shippingAddress.city || 'Mumbai',
        state: shippingAddress.state || 'Maharashtra',
        pincode: shippingAddress.pincode || '400001',
        country: shippingAddress.country || 'India'
      };

      try {
        await Address.create({
          userId,
          label: shippingAddress.tag || 'Home',
          ...addressSnapshot,
          isDefault: false
        });
      } catch (err) {
        // Non-blocking
      }
    }

    if (!addressSnapshot) {
      // Fallback default snapshot
      addressSnapshot = {
        fullName: userName || 'Customer',
        phone: userPhone || '+91 9876543210',
        line1: 'Apt 402, Green Meadows',
        line2: 'Andheri West',
        landmark: 'Near Metro Station',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400058',
        country: 'India'
      };
    }

    // 3. Authoritative Re-pricing
    const bill = await PriceEngine.calculateOrderBill(items, couponCode);

    // 4. Check if any line requires prescription
    const hasRxItem = bill.items.some((it) => it.prescriptionRequired);
    if (hasRxItem && (!prescriptionIds || prescriptionIds.length === 0)) {
      throw new Error('MANDATORY_PRESCRIPTION: Your order contains prescription medications (Schedule H/X). A valid doctor prescription is required.');
    }

    // 5. Atomic Inventory Reservation
    const reservedAudit = await InventoryService.reserveStock(bill.items);

    // Attach inventory snapshot to items
    const snapshotItems = bill.items.map((it, idx) => ({
      ...it,
      inventoryId: reservedAudit[idx]?.inventoryId || null,
      batchNumber: reservedAudit[idx]?.batchNumber || 'BAT-DEF',
      expiryDate: reservedAudit[idx]?.expiryDate || new Date('2027-12-31')
    }));

    // Find primary seller
    const primarySellerId = bill.items[0]?.sellerId || null;

    // Determine initial status
    let initialStatus = 'PAYMENT_PENDING';
    if (paymentMethod === 'COD') {
      initialStatus = hasRxItem ? 'AWAITING_PRESCRIPTION_REVIEW' : 'ORDER_CONFIRMED';
    }

    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await Order.create({
      orderNumber,
      userId,
      userName,
      userEmail,
      userPhone,
      sellerId: primarySellerId,
      idempotencyKey,
      status: initialStatus,
      items: snapshotItems,
      pricing: bill.pricing,
      addressSnapshot,
      prescriptionIds,
      couponId: bill.couponId,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING'
    });

    // Link order to uploaded prescriptions
    if (prescriptionIds && prescriptionIds.length > 0) {
      await Prescription.updateMany(
        { _id: { $in: prescriptionIds } },
        { $set: { orderId: order._id } }
      );
    }

    return { order, isDuplicate: false };
  }
}
