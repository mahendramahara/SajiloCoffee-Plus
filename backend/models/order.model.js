import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const OrderItemSchema = new Schema({
  productId: { type: String, required: true }, 
  size: { type: String, enum: ['single', 'regular', 'large'], required: true },
  qty: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  addons: { type: [String], default: [] }
});

const OrderSchema = new Schema(
  {
    id: { type: String, default: uuidv4 },
    userId: { type: String, required: true },
    table: { type: Number, required: true },
    items: { type: [OrderItemSchema], required: true },
    status: { 
      type: String, 
      enum: ['pending', 'preparing', 'served', 'cancelled'], 
      default: 'pending' 
    },
    placedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    subscriptionPerkApplied: { type: Boolean, default: false },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  { timestamps: { createdAt: 'placedAt', updatedAt: 'updatedAt' } }
);

export default model('Order', OrderSchema);
