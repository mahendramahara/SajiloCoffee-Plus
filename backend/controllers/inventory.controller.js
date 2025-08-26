import { Product } from '../models/product.model.js';
import { success, error, notFound, validation } from '../utils/apiResponse.js';
import { systemLogger } from '../utils/systemLogger.js';

export const createProduct = async (req, res) => {
  try {
    const { name, slug, description, category, price, sizes, image, tags } = req.body;

    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return validation(res, 'Product with this slug already exists');
    }

    const product = new Product({
      name,
      slug,
      description,
      category,
      price,
      sizes: sizes || [],
      image,
      tags: tags || []
    });

    await product.save();

    systemLogger.activity('admin', 'product created', {
      productId: product._id,
      name,
      category,
      price
    });

    return success(res, product, 'Product created successfully', 201);
  } catch (err) {
    systemLogger.error('Failed to create product', err);
    return error(res, 'Failed to create product', 500);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return notFound(res, 'Product not found');
    }

    if (updates.slug && updates.slug !== product.slug) {
      const existingProduct = await Product.findOne({ slug: updates.slug });
      if (existingProduct) {
        return validation(res, 'Product with this slug already exists');
      }
    }

    Object.assign(product, updates);
    await product.save();

    systemLogger.activity('admin', 'product updated', {
      productId: product._id,
      name: product.name,
      updates: Object.keys(updates)
    });

    return success(res, product, 'Product updated successfully');
  } catch (err) {
    systemLogger.error('Failed to update product', err);
    return error(res, 'Failed to update product', 500);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return notFound(res, 'Product not found');
    }

    await Product.findByIdAndDelete(productId);

    systemLogger.activity('admin', 'product deleted', {
      productId,
      name: product.name,
      category: product.category
    });

    return success(res, null, 'Product deleted successfully');
  } catch (err) {
    systemLogger.error('Failed to delete product', err);
    return error(res, 'Failed to delete product', 500);
  }
};

export const toggleProductAvailability = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return notFound(res, 'Product not found');
    }

    product.available = !product.available;
    await product.save();

    systemLogger.activity('admin', `product ${product.available ? 'enabled' : 'disabled'}`, {
      productId,
      name: product.name,
      available: product.available
    });

    return success(res, product, `Product ${product.available ? 'enabled' : 'disabled'} successfully`);
  } catch (err) {
    systemLogger.error('Failed to toggle product availability', err);
    return error(res, 'Failed to toggle product availability', 500);
  }
};

export const getProductStats = async (req, res) => {
  try {
    const [
      totalProducts,
      availableProducts,
      categoryStats,
      ratingStats,
      topRatedProducts
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ available: true }),
      
      Product.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            averagePrice: { $avg: '$price' }
          }
        }
      ]),
      
      Product.aggregate([
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$ratingAverage' },
            totalRatings: { $sum: '$ratingCount' }
          }
        }
      ]),
      
      Product.find({ available: true })
        .sort({ ratingAverage: -1, ratingCount: -1 })
        .limit(5)
        .select('name ratingAverage ratingCount category')
    ]);

    return success(res, {
      totalProducts,
      availableProducts,
      unavailableProducts: totalProducts - availableProducts,
      categoryStats,
      averageRating: ratingStats[0]?.averageRating || 0,
      totalRatings: ratingStats[0]?.totalRatings || 0,
      topRatedProducts
    }, 'Product statistics retrieved successfully');
  } catch (err) {
    systemLogger.error('Failed to get product stats', err);
    return error(res, 'Failed to get product statistics', 500);
  }
};
