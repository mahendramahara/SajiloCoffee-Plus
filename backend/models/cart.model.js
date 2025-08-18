import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: String, enum: ['single', 'regular', 'large'], required: true },
  qty: { type: Number, required: true, default: 1 },
  addons: { type: [String], default: [] }
}, { _id: false })

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: { type: [cartItemSchema], default: [] },
  updatedAt: { type: Date, default: Date.now }
})

export const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema)
