import { UserPreference } from '../models/userPreference.model.js';
import { success, error, notFound } from '../utils/apiResponse.js';
import { systemLogger } from '../utils/systemLogger.js';

export const getUserPreferences = async (req, res) => {
  try {
    let preferences = await UserPreference.findOne({ userId: req.user._id });
    
    if (!preferences) {
      preferences = new UserPreference({
        userId: req.user._id,
        preferredCategories: [],
        preferredSizes: ['regular'],
        coffeeStrength: 'medium',
        sweetness: 'medium',
        temperature: 'hot'
      });
      await preferences.save();
    }

    return success(res, preferences, 'User preferences retrieved successfully');
  } catch (err) {
    systemLogger.error('Failed to get user preferences', err, { userId: req.user._id });
    return error(res, 'Failed to get user preferences', 500);
  }
};

export const updateUserPreferences = async (req, res) => {
  try {
    const {
      preferredCategories,
      preferredSizes,
      preferredAddons,
      coffeeStrength,
      sweetness,
      temperature,
      allergies,
      dislikes,
      maxPrice
    } = req.body;

    let preferences = await UserPreference.findOne({ userId: req.user._id });
    
    if (!preferences) {
      preferences = new UserPreference({ userId: req.user._id });
    }

    if (preferredCategories !== undefined) preferences.preferredCategories = preferredCategories;
    if (preferredSizes !== undefined) preferences.preferredSizes = preferredSizes;
    if (preferredAddons !== undefined) preferences.preferredAddons = preferredAddons;
    if (coffeeStrength !== undefined) preferences.coffeeStrength = coffeeStrength;
    if (sweetness !== undefined) preferences.sweetness = sweetness;
    if (temperature !== undefined) preferences.temperature = temperature;
    if (allergies !== undefined) preferences.allergies = allergies;
    if (dislikes !== undefined) preferences.dislikes = dislikes;
    if (maxPrice !== undefined) preferences.maxPrice = maxPrice;
    
    preferences.updatedAt = new Date();
    await preferences.save();

    systemLogger.activity(req.user._id, 'preferences updated', {
      updatedFields: Object.keys(req.body)
    });

    return success(res, preferences, 'User preferences updated successfully');
  } catch (err) {
    systemLogger.error('Failed to update user preferences', err, { userId: req.user._id });
    return error(res, 'Failed to update user preferences', 500);
  }
};

export const resetUserPreferences = async (req, res) => {
  try {
    const preferences = await UserPreference.findOne({ userId: req.user._id });
    
    if (!preferences) {
      return notFound(res, 'User preferences not found');
    }

    preferences.preferredCategories = [];
    preferences.preferredSizes = ['regular'];
    preferences.preferredAddons = [];
    preferences.coffeeStrength = 'medium';
    preferences.sweetness = 'medium';
    preferences.temperature = 'hot';
    preferences.allergies = [];
    preferences.dislikes = [];
    preferences.maxPrice = 1000;
    preferences.updatedAt = new Date();
    
    await preferences.save();

    systemLogger.activity(req.user._id, 'preferences reset');

    return success(res, preferences, 'User preferences reset successfully');
  } catch (err) {
    systemLogger.error('Failed to reset user preferences', err, { userId: req.user._id });
    return error(res, 'Failed to reset user preferences', 500);
  }
};
