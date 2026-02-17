const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');

const User = require('../models/User');
const { validateBody, registerSchema, loginSchema } = require('../utils/validation');

const router = express.Router();

const createToken = (user) => {
  const payload = {
    sub: user._id.toString(),
    email: user.email,
    name: user.name || null,
    picture: user.picture || null,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Register
router.post('/register', validateBody(registerSchema), async (req, res, next) => {
  try {
    const { email, password, name } = req.validatedBody;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Conflict', message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ email, passwordHash, name, authProvider: 'local' });

    const token = createToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (err) {
    return next(err);
  }
});

// Login here we are validating the user credentials and creating a token for the user
router.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.validatedBody;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
    }

    // Check if user signed up with Google
    if (user.authProvider === 'google') {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'This account uses Google Sign-In. Please use "Continue with Google"' 
      });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
    }

    const token = createToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (err) {
    return next(err);
  }
});

// Google OAuth - Initiate authentication
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

// Google OAuth - Callback
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: process.env.FRONTEND_URL + '/login?error=auth_failed',
  }),
  (req, res) => {
    try {
      // Create JWT token for the user
      const token = createToken(req.user);

      // Redirect to frontend with token
      const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      res.redirect(process.env.FRONTEND_URL + '/login?error=token_creation_failed');
    }
  }
);

module.exports = router;

