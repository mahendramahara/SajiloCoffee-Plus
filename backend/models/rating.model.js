import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
})

ratingSchema.index({ userId: 1, productId: 1 }, { unique: true })

export const Rating = mongoose.models.Rating || mongoose.model('Rating', ratingSchema)
