import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import User from '../models/User.js';

const serializeUser = (user) => ({
  id: String(user._id),
  _id: String(user._id),
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  avatar: user.avatar || '',
  lastLogin: user.lastLogin || null,
});

const signToken = (user) =>
  jwt.sign(
    {
      id: String(user._id),
      email: user.email,
      role: user.role,
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );

export const register = async (req, res) => {
  try {
    const fullName = String(req.body.fullName || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const role = req.body.role || 'Analyst';

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    const user = await User.create({ fullName, email, password, role });
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      data: {
        token: signToken(user),
        user: serializeUser(user),
      },
    });
  } catch (error) {
    const isDuplicate = error.code === 11000;
    res.status(isDuplicate ? 409 : 500).json({
      success: false,
      message: isDuplicate
        ? 'A user with this email already exists.'
        : 'Failed to register user.',
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated.',
      });
    }

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        token: signToken(user),
        user: serializeUser(user),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to log in.',
      error: error.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: serializeUser(req.user),
    },
  });
};

export const logout = async (_req, res) => {
  res.status(200).json({
    success: true,
    data: null,
    message: 'Logged out successfully.',
  });
};
