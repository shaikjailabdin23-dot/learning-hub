const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hub_learning_secret_jwt_key_2026_super_secure', {
    expiresIn: '30d',
  });
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    let { college, branch, year, semester } = req.body;

    // Validate presence of core required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required.',
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // Validate password confirmation if provided
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Apply resilient defaults for optional educational fields if omitted
    college = (college && String(college).trim()) || 'Global Institute of Technology';
    branch = (branch && String(branch).trim()) || 'Computer Science and Engineering';
    year = (year && String(year).trim()) || '1st Year';
    semester = (semester && String(semester).trim()) || '1st Semester';

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      college,
      branch,
      year,
      semester,
      streak: 7, // Initial default streak for new active students
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account successfully registered!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        year: user.year,
        semester: user.semester,
        streak: user.streak,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again later.',
    });
  }
};

// @desc    Authenticate student & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check for user
    let user = await User.findOne({ email: normalizedEmail });

    // Demo user fallback: if user attempted alex.student@hub.edu or demo alias, support standard demo credentials
    if (!user && (normalizedEmail === 'alex.student@hub.edu' || normalizedEmail === 'demo@hub.edu')) {
      user = await User.findOne({ email: 'student@hub.edu' });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      });
    }

    // Check password (allow standard demo passwords for demo accounts)
    const isDemoAccount = user.email === 'student@hub.edu';
    const isDemoPassword = isDemoAccount && (password === 'password123' || password === 'Password123!');
    const isMatch = isDemoPassword || (await bcrypt.compare(password, user.password));

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Successfully logged in!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        year: user.year,
        semester: user.semester,
        streak: user.streak,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again later.',
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('[GetMe Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile.',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
