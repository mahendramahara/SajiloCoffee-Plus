import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  preferredCategories: [{ type: String, enum: ['espresso', 'milk', 'cold', 'specialty', 'tea'] }],
  preferredSizes: [{ type: String, enum: ['single', 'regular', 'large'] }],
  preferredAddons: [String],
  coffeeStrength: { type: String, enum: ['mild', 'medium', 'strong'], default: 'medium' },
  sweetness: { type: String, enum: ['none', 'low', 'medium', 'high'], default: 'medium' },
  temperature: { type: String, enum: ['hot', 'warm', 'cold'], default: 'hot' },
  allergies: [String],
  dislikes: [String],
  maxPrice: { type: Number, default: 1000 },
  updatedAt: { type: Date, default: Date.now }
});

export const UserPreference = mongoose.models.UserPreference || mongoose.model('UserPreference', userPreferenceSchema);
