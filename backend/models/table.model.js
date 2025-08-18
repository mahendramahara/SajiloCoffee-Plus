import mongoose from 'mongoose'

const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ['available', 'occupied', 'reserved'], default: 'available' },
  currentOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null }
})

export const Table = mongoose.models.Table || mongoose.model('Table', tableSchema)
