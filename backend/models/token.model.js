import mongoose from 'mongoose'

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 }
})

export const Token = mongoose.models.Token || mongoose.model('Token', tokenSchema)
