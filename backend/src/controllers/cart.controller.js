import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    // Populate live products
    const productIds = cart.items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const populatedItems = cart.items
      .map((item) => {
        const prod = productMap.get(item.productId.toString());
        if (!prod) return null;
        return {
          productId: prod._id,
          name: prod.name,
          brand: prod.brand,
          image: prod.images[0] || '',
          mrp: prod.mrp / 100,
          price: prod.sellingPrice / 100,
          quantity: item.quantity,
          lineTotal: (prod.sellingPrice * item.quantity) / 100,
          prescriptionRequired: prod.prescriptionRequired
        };
      })
      .filter(Boolean);

    const subtotal = populatedItems.reduce((sum, it) => sum + it.lineTotal, 0);

    return res.status(200).json({
      success: true,
      data: {
        cartId: cart._id,
        items: populatedItems,
        subtotal,
        couponCode: cart.couponCode
      }
    });
  } catch (error) {
    next(error);
  }
};

export const addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product || product.status !== 'ACTIVE') {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Product not available.' }
      });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existingIdx = cart.items.findIndex((i) => i.productId.toString() === productId);
    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += Number(quantity);
      cart.items[existingIdx].unitPriceSnapshot = product.sellingPrice;
    } else {
      cart.items.push({
        productId: product._id,
        quantity: Number(quantity),
        unitPriceSnapshot: product.sellingPrice,
        prescriptionRequired: product.prescriptionRequired
      });
    }

    await cart.save();
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const updateItemQuantity = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Cart not found.' } });
    }

    if (Number(quantity) <= 0) {
      cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    } else {
      const item = cart.items.find((i) => i.productId.toString() === productId);
      if (item) {
        item.quantity = Number(quantity);
      }
    }

    await cart.save();
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
      await cart.save();
    }
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};
