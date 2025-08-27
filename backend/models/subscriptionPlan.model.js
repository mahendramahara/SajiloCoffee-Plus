import mongoose from 'mongoose'

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  cycle: { 
    type: String, 
    enum: ['monthly', '3-month', '6-month', 'annual'], 
    required: true 
  },
  duration: { type: Number, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  currency: { type: String, default: 'NPR' },
  features: [{ 
    name: String, 
    description: String,
    included: { type: Boolean, default: true }
  }],
  perks: {
    freePowderGrams: { type: Number, default: 0 },
    indoorVisitsPerMonth: { type: Number, default: 0 },
    privateSpaceHours: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    freeDelivery: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false },
    exclusiveProducts: { type: Boolean, default: false }
  },
  limits: {
    maxOrdersPerMonth: Number,
    maxOrderValue: Number,
    applicableCategories: [String]
  },
  popular: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  savingsPercentVsMonthly: { type: Number, default: 0 },
  maxSubscribers: Number,
  currentSubscribers: { type: Number, default: 0 },
  tags: [String],
  validFrom: { type: Date, default: Date.now },
  validUntil: Date
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

subscriptionPlanSchema.virtual('isAvailable').get(function() {
  const now = new Date();
  return this.active && 
         (!this.validUntil || now <= this.validUntil) &&
         (!this.maxSubscribers || this.currentSubscribers < this.maxSubscribers);
});

subscriptionPlanSchema.virtual('monthlyCost').get(function() {
  const monthsInCycle = {
    'monthly': 1,
    '3-month': 3,
    '6-month': 6,
    'annual': 12
  };
  return this.price / (monthsInCycle[this.cycle] || 1);
});

subscriptionPlanSchema.index({ cycle: 1, active: 1 });
subscriptionPlanSchema.index({ popular: -1, price: 1 });
subscriptionPlanSchema.index({ validFrom: 1, validUntil: 1 });

export default mongoose.model('SubscriptionPlan', subscriptionPlanSchema)
