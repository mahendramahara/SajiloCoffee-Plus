import mongoose from 'mongoose'

const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  generatedAt: { type: Date, default: Date.now },
  recommendations: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      reason: { type: String, required: true }
    }
  ]
})

export const Recommendation = mongoose.models.Recommendation || mongoose.model('Recommendation', recommendationSchema)
