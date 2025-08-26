import { Recommendation } from '../models/recommendation.model.js';
import { Product } from '../models/product.model.js';
import { Rating } from '../models/rating.model.js';
import Order from '../models/order.model.js';
import { UserPreference } from '../models/userPreference.model.js';
import { success, error } from '../utils/apiResponse.js';
import { systemLogger } from '../utils/systemLogger.js';

export const getRecommendations = async (req, res) => {
  try {
    let recommendations = await Recommendation.findOne({ userId: req.user._id })
      .populate('recommendations.productId')
      .sort({ generatedAt: -1 });

    if (!recommendations || isRecommendationOld(recommendations.generatedAt)) {
      recommendations = await generateRecommendations(req.user._id);
    }

    const validRecommendations = recommendations.recommendations.filter(
      rec => rec.productId && rec.productId.available
    );

    return success(res, validRecommendations, 'Recommendations retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get recommendations', 500);
  }
};

export const refreshRecommendations = async (req, res) => {
  try {
    const recommendations = await generateRecommendations(req.user._id);
    
    const validRecommendations = recommendations.recommendations.filter(
      rec => rec.productId && rec.productId.available
    );

    return success(res, validRecommendations, 'Recommendations refreshed successfully');
  } catch (err) {
    return error(res, 'Failed to refresh recommendations', 500);
  }
};

const generateRecommendations = async (userId) => {
  const recommendations = [];

  const userPreferences = await UserPreference.findOne({ userId });
  const userRatings = await Rating.find({ userId }).populate('productId');
  const userOrders = await Order.find({ userId, status: 'served' }).populate('items.productId');

  const likedCategories = new Map();
  const likedProducts = new Set();

  userRatings.forEach(rating => {
    if (rating.rating >= 4 && rating.productId) {
      const category = rating.productId.category;
      likedCategories.set(category, (likedCategories.get(category) || 0) + rating.rating);
      likedProducts.add(rating.productId._id.toString());
    }
  });

  const orderedProducts = new Map();
  userOrders.forEach(order => {
    order.items.forEach(item => {
      if (item.productId) {
        const productId = item.productId._id.toString();
        orderedProducts.set(productId, (orderedProducts.get(productId) || 0) + item.qty);
        
        const category = item.productId.category;
        likedCategories.set(category, (likedCategories.get(category) || 0) + 1);
      }
    });
  });

  const topCategories = Array.from(likedCategories.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(entry => entry[0]);

  let searchFilter = { available: true };
  
  if (userPreferences) {
    if (userPreferences.preferredCategories.length > 0) {
      searchFilter.category = { $in: userPreferences.preferredCategories };
    }
    if (userPreferences.maxPrice) {
      searchFilter.price = { $lte: userPreferences.maxPrice };
    }
    if (userPreferences.dislikes.length > 0) {
      searchFilter.name = { $nin: userPreferences.dislikes.map(d => new RegExp(d, 'i')) };
    }
  }

  if (topCategories.length > 0 && !userPreferences?.preferredCategories.length) {
    searchFilter.category = { $in: topCategories };
  }

  if (Object.keys(searchFilter).length > 1) {
    searchFilter._id = { $nin: Array.from(likedProducts) };
    
    const categoryProducts = await Product.find(searchFilter)
      .sort({ ratingAverage: -1 })
      .limit(4);

    categoryProducts.forEach(product => {
      let reason = 'Based on your ';
      if (userPreferences?.preferredCategories.includes(product.category)) {
        reason += `preference for ${product.category} coffee`;
      } else {
        reason += `taste history with ${product.category} coffee`;
      }
      
      recommendations.push({
        productId: product._id,
        reason
      });
    });
  }

  const popularProducts = await Product.find({
    available: true,
    ratingAverage: { $gte: 4.0 },
    _id: { $nin: Array.from(likedProducts) }
  }).sort({ ratingCount: -1, ratingAverage: -1 }).limit(3);

  popularProducts.forEach(product => {
    if (!recommendations.find(rec => rec.productId.toString() === product._id.toString())) {
      recommendations.push({
        productId: product._id,
        reason: 'Popular choice among coffee lovers'
      });
    }
  });

  if (recommendations.length < 5) {
    const newProducts = await Product.find({
      available: true,
      _id: { $nin: Array.from(likedProducts) }
    }).sort({ createdAt: -1 }).limit(5 - recommendations.length);

    newProducts.forEach(product => {
      if (!recommendations.find(rec => rec.productId.toString() === product._id.toString())) {
        recommendations.push({
          productId: product._id,
          reason: 'New addition to our menu'
        });
      }
    });
  }

  const existingRecommendation = await Recommendation.findOne({ userId });
  if (existingRecommendation) {
    existingRecommendation.recommendations = recommendations;
    existingRecommendation.generatedAt = new Date();
    await existingRecommendation.save();
    return await Recommendation.findById(existingRecommendation._id).populate('recommendations.productId');
  } else {
    const newRecommendation = new Recommendation({
      userId,
      recommendations
    });
    await newRecommendation.save();
    return await Recommendation.findById(newRecommendation._id).populate('recommendations.productId');
  }
};

const isRecommendationOld = (generatedAt) => {
  const now = new Date();
  const diffHours = (now - generatedAt) / (1000 * 60 * 60);
  return diffHours > 24;
};
