import { Schema, model } from 'mongoose';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const coffeePreferencesSchema = new Schema(
  {
    sweetnessLevel: { type: String, default: 'Medium' },
    coffeeStrength: { type: String, default: 'Medium' },
    milkPreference: { type: String, default: 'Regular Milk' },
    temperature: { type: String, default: 'Medium' },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    salt: String,
    hashedPassword: { type: String, required: true },
    avatar: { type: String },
    address: { type: String },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    coffeePreferences: { type: coffeePreferencesSchema, default: {} },
  },
  { timestamps: true }
);

userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.hashedPassword = crypto
      .createHmac('sha256', this.salt)
      .update(password)
      .digest('hex');
  })
  .get(function () {
    return this._password;
  });

userSchema.methods.comparePassword = function (password) {
  const hash = crypto
    .createHmac('sha256', this.salt)
    .update(password)
    .digest('hex');
  return hash === this.hashedPassword;
};

const User = model('User', userSchema);
export default User;
// No changes needed. employeeId is not present in user model.
