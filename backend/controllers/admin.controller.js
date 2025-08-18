import { Admin } from '../models/admin.model.js';
import { validationResult } from 'express-validator';
import { success, error, validation } from '../utils/apiResponse.js';
import { generateAdminAccessToken } from '../utils/generateToken.js';

const getDefaultPermissions = (isRootAdmin = false) => {
  const allTrue = isRootAdmin;
  return {
    products: {
      read: allTrue,
      create: allTrue,
      update: allTrue,
      delete: allTrue,
      bulkActions: allTrue
    },
    orders: {
      read: allTrue,
      create: allTrue,
      update: allTrue,
      delete: allTrue,
      refund: allTrue,
      statusChange: allTrue
    },
    users: {
      read: allTrue,
      create: allTrue,
      update: allTrue,
      delete: allTrue,
      suspend: allTrue,
      viewStats: allTrue
    },
    subscriptions: {
      read: allTrue,
      create: allTrue,
      update: allTrue,
      delete: allTrue,
      analytics: allTrue
    },
    analytics: {
      sales: allTrue,
      products: allTrue,
      users: allTrue,
      revenue: allTrue,
      export: allTrue
    },
    settings: {
      cafe: allTrue,
      tables: allTrue,
      pricing: allTrue,
      notifications: allTrue
    },
    admins: {
      read: allTrue,
      create: allTrue,
      update: allTrue,
      delete: allTrue
    }
  };
};

export const createAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, "Validation failed", errors.array());
    }

    const { name, email, password, role, department, employeeId, permissions } = req.body;

    let adminPermissions;
    if (!permissions) {
      adminPermissions = getDefaultPermissions(true);
    } else {
      adminPermissions = permissions;
    }

    const adminData = {
      name,
      email,
      password,
      role,
      department,
      employeeId,
      permissions: adminPermissions
    };

    const newAdmin = new Admin(adminData);
    await newAdmin.save();

    const adminResponse = newAdmin.toObject();
    delete adminResponse.salt;
    delete adminResponse.hashedPassword;

    return success(res, adminResponse, "Admin created successfully", 201);
  } catch (err) {
    console.error("Error creating admin:", err);
    if (err.code === 11000) {
      return error(res, "Email or Employee ID already exists", 400);
    }
    return error(res, "Failed to create admin", 500);
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, "Validation failed", errors.array());
    }

    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return error(res, "Invalid email or password", 401);
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return error(res, "Invalid email or password", 401);
    }
    
    const token = generateAdminAccessToken(admin);
    
    // Set cookie
    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    
    return success(res, { 
        token, 
        admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions
        },
        tokenExpiresIn: '30 days'
    }, "Admin logged in successfully");
  } catch (err) {
    console.error("Error logging in admin:", err);
    return error(res, "Failed to log in admin", 500);
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    return success(res, admins, "Admins retrieved successfully");
  } catch (err) {
    console.error("Error retrieving admins:", err);
    return error(res, "Failed to retrieve admins", 500);
  }
};

export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return error(res, "Admin not found", 404);
    }
    return success(res, admin, "Admin retrieved successfully");
  } catch (err) {
    console.error("Error retrieving admin:", err);
    return error(res, "Failed to retrieve admin", 500);
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validation(res, "Validation failed", errors.array());
    }

    if (req.file && req.file.path) {
      req.body.avatar = req.file.path;
    }

    const updateData = { ...req.body };
    if (updateData.permissions) {
      const existingAdmin = await Admin.findById(req.params.id);
      if (!existingAdmin) {
        return error(res, "Admin not found", 404);
      }
      updateData.permissions = {
        ...existingAdmin.permissions.toObject(),
        ...updateData.permissions
      };
    }

    const admin = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-salt -hashedPassword');
    if (!admin) {
      return error(res, "Admin not found", 404);
    }
    return success(res, admin, "Admin updated successfully");
  } catch (err) {
    console.error("Error updating admin:", err);
    return error(res, "Failed to update admin", 500);
  }
}

export const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    return success(res, null, "Admin logged out successfully");
  } catch (err) {
    console.error("Error logging out admin:", err);
    return error(res, "Failed to log out admin", 500);
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return error(res, "Admin not found", 404);
    }
    return success(res, admin, "Admin deleted successfully");
  } catch (err) {
    console.error("Error deleting admin:", err);
    return error(res, "Failed to delete admin", 500);
  }
};