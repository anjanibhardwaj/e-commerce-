import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const getProducts = async (req, res, next) => {
  try {
    const {
      q,
      category,
      brand,
      rx,
      minPrice,
      maxPrice,
      sort = 'featured',
      page = 1,
      limit = 24
    } = req.query;

    const filter = {
      status: 'ACTIVE',
      approvalStatus: 'approved'
    };

    if (q) {
      filter.$text = { $search: q };
    }

    if (category) {
      filter.categoryName = category;
    }

    if (brand) {
      filter.brand = brand;
    }

    if (rx === 'true') {
      filter.prescriptionRequired = true;
    } else if (rx === 'false') {
      filter.prescriptionRequired = false;
    }

    if (minPrice || maxPrice) {
      filter.sellingPrice = {};
      if (minPrice) filter.sellingPrice.$gte = Number(minPrice) * 100; // convert ₹ to Paise
      if (maxPrice) filter.sellingPrice.$lte = Number(maxPrice) * 100;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low') sortOptions = { sellingPrice: 1 };
    else if (sort === 'price-high') sortOptions = { sellingPrice: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Product.find(filter).sort(sortOptions).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter)
    ]);

    // Format sellingPrice and mrp back to Rupees for friendly frontend consumption
    const formatted = items.map((item) => ({
      id: item._id,
      name: item.name,
      slug: item.slug,
      brand: item.brand,
      category: item.categoryName,
      mrp: item.mrp / 100,
      price: item.sellingPrice / 100,
      discount: item.discountPercent,
      prescriptionRequired: item.prescriptionRequired,
      scheduleType: item.scheduleType,
      image: item.images[0] || '',
      images: item.images,
      description: item.description,
      dosage: item.dosage,
      rating: item.rating,
      reviewsCount: item.reviewCount,
      sellerName: item.sellerName || 'Apollo Care Pharmacy'
    }));

    return res.status(200).json({
      success: true,
      data: {
        items: formatted,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Medicine product not found.' }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: product._id,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        category: product.categoryName,
        mrp: product.mrp / 100,
        price: product.sellingPrice / 100,
        discount: product.discountPercent,
        prescriptionRequired: product.prescriptionRequired,
        scheduleType: product.scheduleType,
        image: product.images[0] || '',
        images: product.images,
        description: product.description,
        dosage: product.dosage,
        packSize: product.packSize,
        rating: product.rating,
        reviewsCount: product.reviewCount,
        sellerId: product.sellerId,
        sellerName: product.sellerName || 'Apollo Care Pharmacy'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1 });
    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
