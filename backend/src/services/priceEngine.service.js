import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

export class PriceEngine {
  /**
   * Authoritatively computes line item pricing, coupons, and delivery charges in Paise
   */
  static async calculateOrderBill(items, couponCode = null) {
    let itemsTotal = 0;
    const validatedItems = [];

    for (const line of items) {
      const product = await Product.findById(line.productId);
      if (!product || product.status !== 'ACTIVE') {
        throw new Error(`Product ${line.name || line.productId} is inactive or out of circulation.`);
      }

      const unitPrice = product.sellingPrice; // Authoritative price in Paise
      const lineTotal = unitPrice * line.quantity;
      itemsTotal += lineTotal;

      validatedItems.push({
        productId: product._id,
        name: product.name,
        sellerId: product.sellerId || null,
        unitPrice,
        quantity: line.quantity,
        totalPrice: lineTotal,
        prescriptionRequired: !!product.prescriptionRequired
      });
    }

    // Coupon verification
    let discount = 0;
    let validCouponId = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true,
        validUntil: { $gte: new Date() }
      });

      if (coupon && itemsTotal >= coupon.minOrderValue) {
        validCouponId = coupon._id;
        if (coupon.type === 'PERCENT') {
          discount = Math.min(Math.round((itemsTotal * coupon.value) / 100), coupon.maxDiscount);
        } else {
          discount = Math.min(coupon.value, itemsTotal);
        }
      }
    }

    // Delivery fee rule: Free above ₹499 (49900 Paise), otherwise ₹49 (4900 Paise)
    const deliveryFee = itemsTotal > 49900 || itemsTotal === 0 ? 0 : 4900;
    const grandTotal = Math.max(0, itemsTotal - discount + deliveryFee);

    return {
      items: validatedItems,
      pricing: {
        itemsTotal,
        discount,
        deliveryFee,
        taxTotal: 0,
        grandTotal,
        currency: 'INR'
      },
      couponId: validCouponId
    };
  }
}
