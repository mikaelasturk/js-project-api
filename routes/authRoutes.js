
import express from 'express';
import passport from 'passport';
import { authLimiter } from '../middleware/rateLimiters.js';
const router = express.Router();

// Start Google OAuth login
router.get(
  '/google',
  authLimiter,
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

// Google OAuth callback
router.get(
  '/google/callback',
  authLimiter,
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  (req, res) => {
    // Successful authentication, redirect or respond as needed
    res.redirect('/'); // Change to your frontend URL or dashboard
  },
);

// Logout route
router.get('/logout', authLimiter, (req, res) => {
  req.logout(() => {
    res.redirect('/'); // Change to your frontend URL
  });
});

export default router;
