import Coupon from '../models/Coupon.js';

export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      validUntil: { $gte: new Date() }
    }).sort({ value: -1 });

    const formatted = coupons.map((c) => ({
      id: c._id,
      code: c.code,
      type: c.type,
      discountPercent: c.type === 'PERCENT' ? c.value : 0,
      flatDiscount: c.type === 'FLAT' ? c.value / 100 : 0,
      maxDiscount: c.maxDiscount ? c.maxDiscount / 100 : 200,
      minOrder: c.minOrderValue ? c.minOrderValue / 100 : 0,
      description: c.type === 'PERCENT'
        ? `Get ${c.value}% OFF on orders above ₹${c.minOrderValue ? c.minOrderValue / 100 : 0}`
        : `Flat ₹${c.value / 100} OFF on orders above ₹${c.minOrderValue ? c.minOrderValue / 100 : 0}`,
      validUntil: c.validUntil
    }));

    return res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
};

export const verifyCoupon = async (req, res, next) => {
  try {
    const { code, totalAmount } = req.body;
    if (!code) {
      return res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'Coupon code is required.' }
      });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
      validUntil: { $gte: new Date() }
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: { code: 'INVALID_COUPON', message: 'Invalid or expired coupon code.' }
      });
    }

    const orderAmountPaise = Math.round((Number(totalAmount) || 0) * 100);
    if (coupon.minOrderValue && orderAmountPaise < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MIN_ORDER_NOT_MET',
          message: `Minimum order value for coupon ${coupon.code} is ₹${coupon.minOrderValue / 100}.`
        }
      });
    }

    let discountPaise = 0;
    if (coupon.type === 'PERCENT') {
      discountPaise = Math.round((orderAmountPaise * coupon.value) / 100);
      if (coupon.maxDiscount && discountPaise > coupon.maxDiscount) {
        discountPaise = coupon.maxDiscount;
      }
    } else {
      discountPaise = coupon.value;
    }

    return res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        discount: discountPaise / 100,
        type: coupon.type,
        message: `Coupon ${coupon.code} applied successfully!`
      }
    });
  } catch (error) {
    next(error);
  }
};
