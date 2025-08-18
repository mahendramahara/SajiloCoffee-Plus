import mongoose from 'mongoose'

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cycle: { type: String, enum: ['monthly', '6-month', 'annual'], required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'NPR' },
  features: [String],
  perks: {
    freePowderGrams: Number,
    indoorVisitsPerMonth: Number,
    privateSpaceHours: Number
  },
  popular: { type: Boolean, default: false },
  savingsPercentVsMonthly: Number
}, { timestamps: true })

export default mongoose.model('SubscriptionPlan', subscriptionPlanSchema)
