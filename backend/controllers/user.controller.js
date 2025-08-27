import User from "../models/user.model.js";
import { Token } from "../models/token.model.js";
import { validationResult } from 'express-validator';
import { success, error, validation, notFound, unauthorized } from '../utils/apiResponse.js';
import { generateUserAccessToken, generateOTP } from "../utils/generateToken.js";
import { sentEmail } from "../utils/setEmail.js";
import mongoose from 'mongoose';
import { 
    emailVerificationTemplate, 
    welcomeEmailTemplate, 
    passwordResetTemplate, 
    passwordChangeConfirmationTemplate,
    loginNotificationTemplate 
} from "../utils/emailTemplates.js";

export const register = async (req, res) => {
    const session = await mongoose.startSession();
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            await session.endSession();
            return validation(res, 'Validation failed', errors.array());
        }

        const { name, email, password, sweetnessLevel, coffeeStrength, milkPreference, temperature } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            await session.endSession();
            return error(res, 'User already exists with this email', 400);
        }

        let savedUser;
        
        await session.withTransaction(async () => {
            const user = new User({ 
                name, 
                email, 
                password,
                coffeePreferences: {
                    sweetnessLevel,
                    coffeeStrength,
                    milkPreference,
                    temperature
                }
            });
            await user.save({ session });
            savedUser = user;

            const otp = generateOTP();
            const token = new Token({ userId: user._id, otp });
            await token.save({ session });

            await sentEmail({
                to: email,
                subject: "Verify Your Email - Sajilo Coffee Plus ☕",
                html: emailVerificationTemplate(name, otp)
            });
        });

        await session.endSession();

        const userResponse = {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            isEmailVerified: savedUser.isEmailVerified,
            createdAt: savedUser.createdAt,
            coffeePreferences: savedUser.coffeePreferences
        };
        
        return success(res, { user: userResponse }, "Registration successful. Please check your email for verification.", 201);

    } catch (err) {
        await session.endSession();
        console.error('Registration error:', err);
        
        if (err.code === 11000) {
            return error(res, 'User already exists with this email', 400);
        }
        
        if (err.name === 'ValidationError') {
            return error(res, 'Validation failed', 400);
        }
        
        return error(res, 'Registration failed. Please try again.', 500);
    }
};

export const resendVerificationOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return notFound(res, 'User not found');
        }

        if (user.isEmailVerified) {
            return error(res, 'Email is already verified', 400);
        }

        await Token.deleteMany({ userId: user._id });

        const otp = generateOTP();
        const token = new Token({ userId: user._id, otp });
        await token.save();

        await sentEmail({
            to: user.email,
            subject: "Email Verification Code - Sajilo Coffee Plus ☕",
            html: emailVerificationTemplate(user.name, otp)
        });

        return success(res, { message: 'Verification code sent to your email' }, "Verification OTP resent successfully");
    } catch (err) {
        console.error('Resend OTP error:', err);
        return error(res, 'Failed to resend OTP', 500);
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validation(res, 'Validation failed', errors.array());
        }

        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return notFound(res, 'User not found');
        }

        if (user.isEmailVerified) {
            return error(res, 'Email is already verified', 400);
        }

        const token = await Token.findOne({ userId: user._id, otp });
        if (!token) {
            return error(res, 'Invalid or expired OTP', 400);
        }

        user.isEmailVerified = true;
        await user.save();

        await Token.deleteOne({ _id: token._id });

        await sentEmail({
            to: user.email,
            subject: "Welcome to Sajilo Coffee Plus! ☕🎉",
            html: welcomeEmailTemplate(user.name)
        });

        const accessToken = generateUserAccessToken(user);
        
        // Set cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return success(res, { 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                isActive: user.isActive, 
                isEmailVerified: user.isEmailVerified 
            }, 
            accessToken,
            tokenExpiresIn: '7 days'
        }, "Email verified successfully");
    } catch (err) {
        console.error('Email verification error:', err);
        return error(res, 'Email verification failed', 500);
    }
};

export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validation(res, 'Validation failed', errors.array());
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email, isActive: true });
        if (!user) {
            return unauthorized(res, 'Invalid credentials');
        }

        if (!user.isEmailVerified) {
            return unauthorized(res, 'Please verify your email first');
        }

        const isPasswordValid = user.comparePassword(password);
        if (!isPasswordValid) {
            return unauthorized(res, 'Invalid credentials');
        }

        user.lastLogin = new Date();
        await user.save();

        const loginDetails = {
            time: new Date().toLocaleString(),
            location: req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown',
            device: req.headers['user-agent'] || 'Unknown'
        };

        await sentEmail({
            to: user.email,
            subject: "New Login Alert - Sajilo Coffee Plus 🔐",
            html: loginNotificationTemplate(user.name, loginDetails)
        });

        const accessToken = generateUserAccessToken(user);
        
        // Set cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return success(res, { 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email 
            }, 
            accessToken,
            tokenExpiresIn: '7 days'
        }, "Login successful");
    } catch (err) {
        return error(res, 'Login failed', 500);
    }
};

export const forgetPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validation(res, 'Validation failed', errors.array());
        }

        const { email } = req.body;

        const user = await User.findOne({ email, isActive: true });
        if (!user) {
            return notFound(res, 'User not found with this email');
        }

        await Token.deleteMany({ userId: user._id });

        const otp = generateOTP();
        const token = new Token({ userId: user._id, otp });
        await token.save();

        await sentEmail({
            to: email,
            subject: "Password Reset Request - Sajilo Coffee Plus 🔐",
            html: passwordResetTemplate(user.name, otp)
        });

        return success(res, null, "Password reset OTP sent successfully");
    } catch (err) {
        console.error('Forget password error:', err);
        return error(res, 'Password reset request failed', 500);
    }
};

export const resetPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validation(res, 'Validation failed', errors.array());
        }

        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email, isActive: true });
        if (!user) {
            return notFound(res, 'User not found with this email');
        }

        const token = await Token.findOne({ userId: user._id, otp });
        if (!token) {
            return error(res, 'Invalid or expired OTP', 400);
        }

        user.password = newPassword;
        user.lastLogin = new Date();
        await user.save();

        await Token.deleteOne({ _id: token._id });

        await sentEmail({
            to: user.email,
            subject: "Password Changed Successfully - Sajilo Coffee Plus ✅",
            html: passwordChangeConfirmationTemplate(user.name)
        });

        const accessToken = generateUserAccessToken(user);
        
        // Set cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return success(res, { 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email 
            }, 
            accessToken,
            tokenExpiresIn: '7 days'
        }, "Password reset successfully and logged in");
    } catch (err) {
        console.error('Password reset error:', err);
        return error(res, 'Password reset failed', 500);
    }
};

export const changePassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validation(res, 'Validation failed', errors.array());
        }

        const { oldPassword, newPassword } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return notFound(res, 'User not found');
        }

        const isOldPasswordValid = user.comparePassword(oldPassword);
        if (!isOldPasswordValid) {
            return unauthorized(res, 'Current password is incorrect');
        }

        user.password = newPassword;
        await user.save();

        await sentEmail({
            to: user.email,
            subject: "Password Updated Successfully - Sajilo Coffee Plus ✅",
            html: passwordChangeConfirmationTemplate(user.name)
        });

        return success(res, null, "Password changed successfully");
    } catch (err) {
        return error(res, 'Password change failed', 500);
    }
};

export const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find({ isActive: true })
            .select('-hashedPassword -salt')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments({ isActive: true });

        return success(res, { users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }, "Users retrieved successfully");
    } catch (err) {
        return error(res, 'Failed to retrieve users', 500);
    }
};

export const getUserById = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validation(res, 'Validation failed', errors.array());
        }

        const { id } = req.params;

        const user = await User.findById(id).select('-hashedPassword -salt');
        if (!user || !user.isActive) {
            return notFound(res, 'User not found');
        }

        return success(res, { user }, "User retrieved successfully");
    } catch (err) {
        return error(res, 'Failed to retrieve user', 500);
    }
};

export const getMe = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select('-hashedPassword -salt');
        if (!user || !user.isActive) {
            return notFound(res, 'User not found');
        }

        return success(res, { user }, "User profile retrieved successfully");
    } catch (err) {
        return error(res, 'Failed to retrieve user profile', 500);
    }
};

export const updateUser = async (req, res) => {
    try {
        console.log('Update user request received');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validation(res, 'Validation failed', errors.array());
        }

        const userId = req.user._id;
        const updateData = { ...req.body };

        if (req.file && req.file.path) {
            console.log('File uploaded to Cloudinary:', req.file.path);
            updateData.avatar = req.file.path;
        } else {
            console.log('No file uploaded');
        }

        delete updateData.password;
        delete updateData.email;
        delete updateData.role;
        delete updateData.coffeePreferences;

        Object.keys(updateData).forEach(key => {
            if (updateData[key] === '' || updateData[key] === null || updateData[key] === undefined || 
                (typeof updateData[key] === 'object' && Object.keys(updateData[key]).length === 0)) {
                delete updateData[key];
            }
        });

        console.log('Final update data:', updateData);

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-hashedPassword -salt');
        if (!user) {
            return notFound(res, 'User not found');
        }

        console.log('User updated successfully:', user);
        return success(res, { user }, "User updated successfully");
    } catch (err) {
        console.error('User update error:', err);
        return error(res, `User update failed: ${err.message}`, 500);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });
        if (!user) {
            return notFound(res, 'User not found');
        }

        return success(res, null, "User deleted successfully");
    } catch (err) {
        return error(res, 'User deletion failed', 500);
    }
};

export const logout = async (req, res) => {
    try {
        return success(res, null, "Logged out successfully");
    } catch (err) {
        return error(res, 'Logout failed', 500);
    }
};

export const getCoffeePreferences = async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId).select('coffeePreferences');
    if (!user) {
        return error(res, 'User not found', 404);
    }
    return success(res, { coffeePreferences: user.coffeePreferences }, "Coffee preferences retrieved successfully");
};

export const updateCoffeePreferences = async (req, res) => {
    const userId = req.user._id;
    const update = { coffeePreferences: req.body };
    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('coffeePreferences');
    if (!user) {
        return error(res, 'User not found', 404);
    }
    return success(res, { coffeePreferences: user.coffeePreferences }, "Coffee preferences updated successfully");
};