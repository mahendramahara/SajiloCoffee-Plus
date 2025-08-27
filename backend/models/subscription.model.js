import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema({
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subscriptionNumber: { 
    type: String, 
    unique: true, 
    default: () => `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}` 
  },
  status: { 
    type: String, 
    enum: ['active', 'expired', 'cancelled', 'pending', 'suspended'], 
    default: 'pending' 
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  renewAt: { type: Date, required: true },
  autoRenew: { type: Boolean, default: false },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'digital', 'bank_transfer'],
    default: 'card'
  },
  totalPaid: { type: Number, default: 0 },
  usageStats: {
    ordersPlaced: { type: Number, default: 0 },
    totalSaved: { type: Number, default: 0 },
    lastOrderDate: Date,
    favoriteProducts: [{ 
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      orderCount: { type: Number, default: 0 }
    }]
  },
  perksUsed: {
    freePowderGrams: { type: Number, default: 0 },
    indoorVisits: { type: Number, default: 0 },
    privateSpaceHours: { type: Number, default: 0 }
  },
  cancellationReason: String,
  notes: String
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

subscriptionSchema.virtual('isActive').get(function() {
  return this.status === 'active' && new Date() <= this.endDate;
});

subscriptionSchema.virtual('daysRemaining').get(function() {
  if (this.status !== 'active') return 0;
  const now = new Date();
  const remaining = Math.ceil((this.endDate - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, remaining);
});

subscriptionSchema.virtual('renewalDue').get(function() {
  return new Date() >= this.renewAt;
});

subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ status: 1, endDate: 1 });
subscriptionSchema.index({ renewAt: 1, autoRenew: 1 });

export default mongoose.model('Subscription', subscriptionSchema)
