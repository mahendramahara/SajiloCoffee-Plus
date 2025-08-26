import mongoose from 'mongoose';
import { Product } from '../models/product.model.js';
import SubscriptionPlan from '../models/subscriptionPlan.model.js';
import { Table } from '../models/table.model.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleProducts = [
  {
    name: 'Classic Espresso',
    slug: 'classic-espresso',
    description: 'Rich and bold espresso shot with intense coffee flavor',
    category: 'espresso',
    price: 150,
    sizes: [
      { size: 'single', price: 150 },
      { size: 'double', price: 250 }
    ],
    image: '/uploads/products/espresso.jpg',
    available: true,
    tags: ['strong', 'classic', 'pure']
  },
  {
    name: 'Cappuccino',
    slug: 'cappuccino',
    description: 'Perfect blend of espresso, steamed milk, and milk foam',
    category: 'milk',
    price: 200,
    sizes: [
      { size: 'regular', price: 200 },
      { size: 'large', price: 280 }
    ],
    image: '/uploads/products/cappuccino.jpg',
    available: true,
    tags: ['creamy', 'foam', 'balanced']
  },
  {
    name: 'Iced Americano',
    slug: 'iced-americano',
    description: 'Refreshing cold coffee with ice and water',
    category: 'cold',
    price: 180,
    sizes: [
      { size: 'regular', price: 180 },
      { size: 'large', price: 250 }
    ],
    image: '/uploads/products/iced-americano.jpg',
    available: true,
    tags: ['cold', 'refreshing', 'smooth']
  },
  {
    name: 'Caramel Macchiato',
    slug: 'caramel-macchiato',
    description: 'Sweet caramel flavor with espresso and steamed milk',
    category: 'specialty',
    price: 320,
    sizes: [
      { size: 'regular', price: 320 },
      { size: 'large', price: 420 }
    ],
    image: '/uploads/products/caramel-macchiato.jpg',
    available: true,
    tags: ['sweet', 'caramel', 'specialty']
  },
  {
    name: 'Masala Chai',
    slug: 'masala-chai',
    description: 'Traditional spiced tea with aromatic herbs and spices',
    category: 'tea',
    price: 120,
    sizes: [
      { size: 'regular', price: 120 },
      { size: 'large', price: 180 }
    ],
    image: '/uploads/products/masala-chai.jpg',
    available: true,
    tags: ['spiced', 'traditional', 'aromatic']
  },
  {
    name: 'Latte',
    slug: 'latte',
    description: 'Smooth espresso with steamed milk and light foam',
    category: 'milk',
    price: 220,
    sizes: [
      { size: 'regular', price: 220 },
      { size: 'large', price: 300 }
    ],
    image: '/uploads/products/latte.jpg',
    available: true,
    tags: ['smooth', 'creamy', 'mild']
  }
];

const subscriptionPlans = [
  {
    name: 'Coffee Lover',
    cycle: 'monthly',
    price: 999,
    currency: 'NPR',
    features: [
      '10% discount on all orders',
      'Free coffee powder (100g/month)',
      'Priority customer support',
      'Branded stickers pack'
    ],
    perks: {
      freePowderGrams: 100,
      indoorVisitsPerMonth: 2,
      privateSpaceHours: 0
    },
    popular: false,
    savingsPercentVsMonthly: 0
  },
  {
    name: 'Coffee Enthusiast',
    cycle: '6-month',
    price: 4999,
    currency: 'NPR',
    features: [
      '15% discount on all orders',
      'Free coffee powder (150g/month)',
      'Private space access (2 hours/month)',
      'Priority customer support',
      'Branded merchandise',
      'Free indoor visits (4/month)'
    ],
    perks: {
      freePowderGrams: 150,
      indoorVisitsPerMonth: 4,
      privateSpaceHours: 2
    },
    popular: true,
    savingsPercentVsMonthly: 17
  },
  {
    name: 'Coffee Master',
    cycle: 'annual',
    price: 8999,
    currency: 'NPR',
    features: [
      '20% discount on all orders',
      'Free coffee powder (200g/month)',
      'Private space access (5 hours/month)',
      'VIP customer support',
      'Exclusive branded merchandise',
      'Unlimited indoor visits',
      'Early access to new products',
      'Monthly coffee tasting sessions'
    ],
    perks: {
      freePowderGrams: 200,
      indoorVisitsPerMonth: -1,
      privateSpaceHours: 5
    },
    popular: false,
    savingsPercentVsMonthly: 25
  }
];

const tables = Array.from({ length: 20 }, (_, i) => ({
  tableNumber: i + 1,
  capacity: i < 10 ? 2 : i < 15 ? 4 : 6,
  status: 'available'
}));

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Product.deleteMany({});
    await SubscriptionPlan.deleteMany({});
    await Table.deleteMany({});

    await Product.insertMany(sampleProducts);
    console.log('Products seeded successfully!');

    await SubscriptionPlan.insertMany(subscriptionPlans);
    console.log('Subscription plans seeded successfully!');

    await Table.insertMany(tables);
    console.log('Tables seeded successfully!');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
