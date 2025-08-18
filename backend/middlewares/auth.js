import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";
import { unauthorized, error } from "../utils/apiResponse.js";

export const verifyJWT = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;
    
    if (!token && req.headers['authorization']) {
      const authHeader = req.headers['authorization'];
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }
    
    if (!token) {
      token = req.body?.token || req.query?.token;
    }
    
    if (!token) {
      return unauthorized(res, 'No token provided');
    }
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return unauthorized(res, 'Invalid token');
    }

    let user;
    if (decodedToken.role === 'admin') {
      user = await Admin.findById(decodedToken?.id).select('-salt -hashedPassword');
    } else {
      user = await User.findById(decodedToken?.id).select('-salt -hashedPassword');
    }
    
    if (!user) {
      return error(res, 'User not found', 404);
    }

    req.user = { ...user.toObject(), role: decodedToken?.role };
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    if (err.name === 'TokenExpiredError') {
      return unauthorized(res, 'Token expired');
    }
    if (err.name === 'JsonWebTokenError') {
      return unauthorized(res, 'Invalid token');
    }
    return error(res, 'Internal server error', 500);
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return unauthorized(res, 'Admin access required');
    }
    next();
  } catch (err) {
    console.error("Admin verification error:", err);
    return error(res, 'Internal server error', 500);
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'user') {
      return unauthorized(res, 'User access required');
    }
    next();
  } catch (err) {
    console.error("User verification error:", err);
    return error(res, 'Internal server error', 500);
  }
};
