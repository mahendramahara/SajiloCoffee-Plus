import { Schema, model } from 'mongoose'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

const modulePermissionSchema = new Schema({
  read: { type: Boolean, default: false },
  create: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  delete: { type: Boolean, default: false }
}, { _id: false })

const productsPermissionSchema = new Schema({
  read: { type: Boolean, default: false },
  create: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
  bulkActions: { type: Boolean, default: false }
}, { _id: false })

const ordersPermissionSchema = new Schema({
  read: { type: Boolean, default: false },
  create: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
  refund: { type: Boolean, default: false },
  statusChange: { type: Boolean, default: false }
}, { _id: false })

const usersPermissionSchema = new Schema({
  read: { type: Boolean, default: false },
  create: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
  suspend: { type: Boolean, default: false },
  viewStats: { type: Boolean, default: false }
}, { _id: false })

const subscriptionsPermissionSchema = new Schema({
  read: { type: Boolean, default: false },
  create: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
  analytics: { type: Boolean, default: false }
}, { _id: false })

const analyticsPermissionSchema = new Schema({
  sales: { type: Boolean, default: false },
  products: { type: Boolean, default: false },
  users: { type: Boolean, default: false },
  revenue: { type: Boolean, default: false },
  export: { type: Boolean, default: false }
}, { _id: false })

const settingsPermissionSchema = new Schema({
  cafe: { type: Boolean, default: false },
  tables: { type: Boolean, default: false },
  pricing: { type: Boolean, default: false },
  notifications: { type: Boolean, default: false }
}, { _id: false })

const permissionsSchema = new Schema({
  products: { type: productsPermissionSchema, default: {} },
  orders: { type: ordersPermissionSchema, default: {} },
  users: { type: usersPermissionSchema, default: {} },
  subscriptions: { type: subscriptionsPermissionSchema, default: {} },
  analytics: { type: analyticsPermissionSchema, default: {} },
  settings: { type: settingsPermissionSchema, default: {} },
  admins: { type: modulePermissionSchema, default: {} }
}, { _id: false })

const adminSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    role: { type: String, enum: ['admin', 'manager', 'staff'], required: true },
    permissions: { type: permissionsSchema, default: {} },
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true },
    department: { type: String },
    employeeId: { type: String, unique: true },
    salt: String,
    hashedPassword: { type: String, required: true }
  },
  { timestamps: true }
)

adminSchema.virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = uuidv4()
    this.hashedPassword = crypto.createHmac('sha256', this.salt).update(password).digest('hex')
  })
  .get(function() {
    return this._password
  })

adminSchema.methods.comparePassword = function(password) {
  const hash = crypto.createHmac('sha256', this.salt).update(password).digest('hex')
  return hash === this.hashedPassword
}

export const Admin = model('Admin', adminSchema)
