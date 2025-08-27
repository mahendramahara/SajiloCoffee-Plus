import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, 
  productName: { type: String, required: true },
  category: { type: String, required: true },
  size: { type: String, enum: ['small', 'regular', 'large'], required: true },
  qty: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  itemTotal: { type: Number, required: true, min: 0 },
  addons: [{ 
    name: String, 
    price: { type: Number, default: 0 } 
  }]
});

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, unique: true, default: () => `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}` },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    table: { type: Number, required: true },
    items: { type: [OrderItemSchema], required: true },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'], 
      default: 'pending' 
    },
    orderType: {
      type: String,
      enum: ['dine-in', 'takeaway', 'subscription'],
      default: 'dine-in'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'digital', 'subscription'],
      default: 'cash'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    placedAt: { type: Date, default: Date.now },
    preparedAt: Date,
    servedAt: Date,
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription' },
    subscriptionPerkApplied: { type: Boolean, default: false },
    subscriptionDiscount: { type: Number, default: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    notes: { type: String, trim: true },
    rating: {
      stars: { type: Number, min: 1, max: 5 },
      comment: String,
      ratedAt: Date
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

OrderSchema.virtual('preparationTime').get(function() {
  if (this.preparedAt && this.placedAt) {
    return Math.round((this.preparedAt - this.placedAt) / (1000 * 60));
  }
  return null;
});

OrderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((sum, item) => sum + item.qty, 0);
});

OrderSchema.index({ userId: 1, placedAt: -1 });
OrderSchema.index({ status: 1, placedAt: -1 });
OrderSchema.index({ placedAt: -1 });
OrderSchema.index({ subscriptionId: 1 });

export default model('Order', OrderSchema);
