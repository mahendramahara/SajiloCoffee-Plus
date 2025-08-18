import { Schema, model } from 'mongoose'

const sizeSchema = new Schema({
  size: { type: String, required: true },
  price: { type: Number, required: true }
})

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['espresso', 'milk', 'cold', 'specialty', 'tea'], 
      required: true 
    },
    price: { type: Number, required: true },
    sizes: [sizeSchema],
    image: { type: String, required: true },
    available: { type: Boolean, default: true },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    tags: [{ type: String }]
  },
  { timestamps: true }
)

export const Product = model('Product', productSchema)
