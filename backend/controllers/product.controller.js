import { Product } from '../models/product.model.js';
import { Rating } from '../models/rating.model.js';
import { success, error, notFound, validation } from '../utils/apiResponse.js';
import { systemLogger } from '../utils/systemLogger.js';

export const getProducts = async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      available, 
      sortBy = 'name',
      sortOrder = 'asc',
      limit = 20, 
      page = 1 
    } = req.query;

    const filter = {};
    
    if (category) filter.category = category;
    if (available !== undefined) filter.available = available === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    return success(res, {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total
      }
    }, 'Products retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get products', 500);
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return notFound(res, 'Product not found');
    }

    return success(res, product, 'Product retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get product', 500);
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug });
    if (!product) {
      return notFound(res, 'Product not found');
    }

    return success(res, product, 'Product retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get product', 500);
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    return success(res, categories, 'Categories retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get categories', 500);
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({ 
      available: true,
      ratingAverage: { $gte: 4.0 }
    })
    .sort({ ratingAverage: -1, ratingCount: -1 })
    .limit(parseInt(limit));

    return success(res, products, 'Featured products retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get featured products', 500);
  }
};

export const getPopularProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({ available: true })
      .sort({ ratingCount: -1, ratingAverage: -1 })
      .limit(parseInt(limit));

    return success(res, products, 'Popular products retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get popular products', 500);
  }
};

export const rateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, feedback } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return notFound(res, 'Product not found');
    }

    if (rating < 1 || rating > 5) {
      return validation(res, 'Rating must be between 1 and 5');
    }

    const existingRating = await Rating.findOne({ 
      userId: req.user._id, 
      productId 
    });

    if (existingRating) {
      const oldRating = existingRating.rating;
      existingRating.rating = rating;
      existingRating.feedback = feedback;
      await existingRating.save();

      const totalRating = (product.ratingAverage * product.ratingCount) - oldRating + rating;
      product.ratingAverage = totalRating / product.ratingCount;
    } else {
      const newRating = new Rating({
        userId: req.user._id,
        productId,
        rating,
        feedback
      });
      await newRating.save();

      const totalRating = (product.ratingAverage * product.ratingCount) + rating;
      product.ratingCount += 1;
      product.ratingAverage = totalRating / product.ratingCount;
    }

    await product.save();

    systemLogger.activity(req.user._id, 'product rated', {
      productId,
      productName: product.name,
      rating,
      feedback: feedback ? 'provided' : 'none'
    });

    return success(res, { rating, feedback }, 'Product rated successfully');
  } catch (err) {
    return error(res, 'Failed to rate product', 500);
  }
};

export const getProductRatings = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const product = await Product.findById(productId);
    if (!product) {
      return notFound(res, 'Product not found');
    }

    const ratings = await Rating.find({ productId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Rating.countDocuments({ productId });

    return success(res, {
      ratings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRatings: total
      }
    }, 'Product ratings retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get product ratings', 500);
  }
};
