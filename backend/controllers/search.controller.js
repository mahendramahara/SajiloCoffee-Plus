import { Product } from '../models/product.model.js';
import Order from '../models/order.model.js';
import { success, error } from '../utils/apiResponse.js';

export const searchProducts = async (req, res) => {
  try {
    const { 
      q, 
      category, 
      minPrice, 
      maxPrice, 
      minRating,
      tags,
      sortBy = 'relevance',
      limit = 20, 
      page = 1 
    } = req.query;

    let pipeline = [];

    let matchStage = { available: true };
    
    if (q) {
      matchStage.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    if (category) matchStage.category = category;
    
    if (minPrice || maxPrice) {
      matchStage.price = {};
      if (minPrice) matchStage.price.$gte = parseFloat(minPrice);
      if (maxPrice) matchStage.price.$lte = parseFloat(maxPrice);
    }

    if (minRating) {
      matchStage.ratingAverage = { $gte: parseFloat(minRating) };
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      matchStage.tags = { $in: tagArray };
    }

    pipeline.push({ $match: matchStage });

    if (q && sortBy === 'relevance') {
      pipeline.push({
        $addFields: {
          relevanceScore: {
            $add: [
              { $cond: [{ $regexMatch: { input: '$name', regex: new RegExp(q, 'i') } }, 10, 0] },
              { $cond: [{ $regexMatch: { input: '$description', regex: new RegExp(q, 'i') } }, 5, 0] },
              { $cond: [{ $in: [new RegExp(q, 'i'), '$tags'] }, 3, 0] }
            ]
          }
        }
      });
      pipeline.push({ $sort: { relevanceScore: -1, ratingAverage: -1 } });
    } else {
      let sortOptions = {};
      switch (sortBy) {
        case 'price_low':
          sortOptions.price = 1;
          break;
        case 'price_high':
          sortOptions.price = -1;
          break;
        case 'rating':
          sortOptions.ratingAverage = -1;
          break;
        case 'newest':
          sortOptions.createdAt = -1;
          break;
        default:
          sortOptions.name = 1;
      }
      pipeline.push({ $sort: sortOptions });
    }

    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: parseInt(limit) });

    const products = await Product.aggregate(pipeline);
    
    const totalPipeline = [{ $match: matchStage }, { $count: 'total' }];
    const totalResult = await Product.aggregate(totalPipeline);
    const total = totalResult[0]?.total || 0;

    return success(res, {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total
      },
      searchQuery: q,
      filters: {
        category,
        minPrice,
        maxPrice,
        minRating,
        tags
      }
    }, 'Search results retrieved successfully');
  } catch (err) {
    return error(res, 'Search failed', 500);
  }
};

export const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return success(res, [], 'Search suggestions retrieved successfully');
    }

    const [productSuggestions, categorySuggestions, tagSuggestions] = await Promise.all([
      Product.find({
        name: { $regex: q, $options: 'i' },
        available: true
      })
      .select('name slug')
      .limit(5),

      Product.distinct('category', {
        category: { $regex: q, $options: 'i' }
      }),

      Product.distinct('tags', {
        tags: { $in: [new RegExp(q, 'i')] }
      })
    ]);

    const suggestions = [
      ...productSuggestions.map(p => ({ type: 'product', name: p.name, slug: p.slug })),
      ...categorySuggestions.map(c => ({ type: 'category', name: c })),
      ...tagSuggestions.slice(0, 3).map(t => ({ type: 'tag', name: t }))
    ];

    return success(res, suggestions.slice(0, 10), 'Search suggestions retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get search suggestions', 500);
  }
};

export const getTrendingSearches = async (req, res) => {
  try {
    const popularProducts = await Product.find({ available: true })
      .sort({ ratingCount: -1 })
      .limit(8)
      .select('name slug category');

    const trendingCategories = await Product.aggregate([
      { $match: { available: true } },
      {
        $group: {
          _id: '$category',
          productCount: { $sum: 1 },
          averageRating: { $avg: '$ratingAverage' }
        }
      },
      { $sort: { productCount: -1, averageRating: -1 } },
      { $limit: 5 }
    ]);

    return success(res, {
      popularProducts,
      trendingCategories: trendingCategories.map(cat => ({
        category: cat._id,
        productCount: cat.productCount,
        averageRating: Math.round(cat.averageRating * 10) / 10
      }))
    }, 'Trending searches retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get trending searches', 500);
  }
};
