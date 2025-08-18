import { Schema, model } from 'mongoose';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    salt: String,
    hashedPassword: { type: String, required: true },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    department: { type: String },
    employeeId: { type: String }
  },
  { timestamps: true }
);

userSchema.virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = uuidv4();
    this.hashedPassword = crypto.createHmac('sha256', this.salt).update(password).digest('hex');
  })
  .get(function() {
    return this._password;
  });

userSchema.methods.comparePassword = function(password) {
  const hash = crypto.createHmac('sha256', this.salt).update(password).digest('hex');
  return hash === this.hashedPassword;
};

const User = model('User', userSchema);
export default User;
