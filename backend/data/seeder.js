import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Admin } from '../models/admin.model.js';
import User from '../models/user.model.js';
import { Product } from '../models/product.model.js';
import { Table } from '../models/table.model.js';
import SubscriptionPlan from '../models/subscriptionPlan.model.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadJSONData = (filename) => {
  try {
    const filePath = path.join(__dirname, filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error loading ${filename}:`, error.message);
    throw error;
  }
};

const seedData = async (force = false) => {
  try {
    console.log('🌱 Starting database seeding...');

    if (force) {
      console.log('🔄 Force flag detected - clearing all existing data...');
      await Admin.deleteMany({});
      await User.deleteMany({});
      await Product.deleteMany({});
      await Table.deleteMany({});
      await SubscriptionPlan.deleteMany({});
      console.log('🧹 All existing data cleared');
    } else {
      const existingAdmins = await Admin.countDocuments();
      const existingUsers = await User.countDocuments();
      const existingProducts = await Product.countDocuments();
      
      if (existingAdmins > 0 || existingUsers > 0 || existingProducts > 0) {
        console.log('⚠️  Database already contains data. Use --force flag to overwrite existing data.');
        console.log('   Example: npm run seed -- --force');
        return;
      }
    }

    console.log('📂 Loading data from JSON files...');
    const adminsData = loadJSONData('admins.json');
    const usersData = loadJSONData('users.json');
    const productsData = loadJSONData('products.json');
    const tablesData = loadJSONData('tables.json');
    const subscriptionPlansData = loadJSONData('subscriptionPlans.json');

    console.log('👨‍💼 Seeding admins...');
    for (const adminData of adminsData) {
      const admin = new Admin(adminData);
      admin.password = adminData.password;
      await admin.save();
      console.log(`   ✅ Created admin: ${adminData.name} (${adminData.email})`);
    }

    console.log('👥 Seeding users...');
    for (const userData of usersData) {
      const user = new User(userData);
      user.password = userData.password;
      await user.save();
      console.log(`   ✅ Created user: ${userData.name} (${userData.email})`);
    }

    console.log('☕ Seeding products...');
    for (const productData of productsData) {
      const product = new Product(productData);
      await product.save();
      console.log(`   ✅ Created product: ${productData.name}`);
    }

    console.log('🪑 Seeding tables...');
    for (const tableData of tablesData) {
      const table = new Table(tableData);
      await table.save();
      console.log(`   ✅ Created table: Table ${tableData.tableNumber}`);
    }

    console.log('💳 Seeding subscription plans...');
    for (const planData of subscriptionPlansData) {
      const plan = new SubscriptionPlan(planData);
      await plan.save();
      console.log(`   ✅ Created subscription plan: ${planData.name}`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Seeded Data Summary:');
    console.log(`   👨‍💼 Admins: ${adminsData.length}`);
    console.log(`   👥 Users: ${usersData.length}`);
    console.log(`   ☕ Products: ${productsData.length}`);
    console.log(`   🪑 Tables: ${tablesData.length}`);
    console.log(`   💳 Subscription Plans: ${subscriptionPlansData.length}`);
    
    console.log('\n🔐 Login Credentials (Password: Admin@1234):');
    console.log('\n   👨‍💼 Admin Accounts:');
    adminsData.forEach(admin => {
      console.log(`     ${admin.role.toUpperCase()}: ${admin.email} | ${admin.name}`);
    });
    
    console.log('\n   👤 User Accounts:');
    usersData.forEach(user => {
      console.log(`     USER: ${user.email} | ${user.name}`);
    });

  } catch (error) {
    console.error('💥 Seeding failed:', error);
    throw error;
  }
};

const runSeeder = async () => {
  try {
    console.log('🚀 Connecting to database...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected successfully!');
    
    const args = process.argv.slice(2);
    const forceFlag = args.includes('--force') || args.includes('-f');
    
    await seedData(forceFlag);
    
    console.log('✨ Seeding process completed successfully!');
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

runSeeder();
