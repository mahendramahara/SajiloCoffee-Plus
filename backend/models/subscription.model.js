import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema({
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'expired', 'cancelled', 'none'], default: 'none' },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  renewAt: Date,
  autoRenew: { type: Boolean, default: false }
})

export default mongoose.model('Subscription', subscriptionSchema)
