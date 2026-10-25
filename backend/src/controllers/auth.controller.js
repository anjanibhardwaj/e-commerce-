import User from '../models/User.js';
import Seller from '../models/Seller.js';
import { AuthService } from '../services/auth.service.js';

export const registerCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Name, email, and password are required.' }
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'An account with this email already exists.' }
      });
    }

    const passwordHash = await AuthService.hashPassword(password);
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone || '+91 9999999999',
      passwordHash,
      role: 'customer'
    });

    const tokens = AuthService.generateTokens({
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name
    });

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isPlusMember: user.isPlusMember
        },
        ...tokens
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email and password are required.' }
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. If seller login, check Seller collection first or User
    if (role === 'seller') {
      const seller = await Seller.findOne({ email: cleanEmail });
      if (seller) {
        const isMatch = await AuthService.comparePassword(password, seller.passwordHash);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            error: { code: 'INVALID_CREDENTIALS', message: 'Invalid seller credentials.' }
          });
        }

        if (seller.status === 'suspended') {
          return res.status(403).json({
            success: false,
            error: { code: 'ACCOUNT_SUSPENDED', message: 'Your pharmacy seller account is suspended.' }
          });
        }

        const tokens = AuthService.generateTokens({
          id: seller._id,
          role: 'seller',
          email: seller.email,
          name: seller.businessName
        });

        return res.status(200).json({
          success: true,
          data: {
            user: {
              id: seller._id,
              name: seller.businessName,
              email: seller.email,
              role: 'seller',
              status: seller.status,
              licenseNumber: seller.licenseNumber
            },
            ...tokens
          }
        });
      }
    }

    // 2. Standard User (Customer, Pharmacist, Admin)
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' }
      });
    }

    const isMatch = await AuthService.comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' }
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: { code: 'ACCOUNT_BLOCKED', message: 'Your account has been deactivated by administration.' }
      });
    }

    // Role check if specified
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        error: { code: 'ROLE_MISMATCH', message: `Account is not registered for role: ${role}` }
      });
    }

    const tokens = AuthService.generateTokens({
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name
    });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isPlusMember: user.isPlusMember
        },
        ...tokens
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    if (req.user.role === 'seller') {
      const seller = await Seller.findById(req.user.id).select('-passwordHash');
      return res.status(200).json({ success: true, data: { user: seller } });
    }

    const user = await User.findById(req.user.id).select('-passwordHash');
    return res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};
