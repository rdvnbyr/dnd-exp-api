const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createUser,
  login,
  logout,
  updateUser,
  getMe,
  deleteUser,
} = require('../controllers/user');

/**
 * @route   POST api/users
 * @desc    Register a user
 * @access  Public (no token required)
 * @returns {message} string message
 * @returns {error} 400 if email already exists
 * @returns {error} 500 if server error
 */
router.post('/', createUser);

/**
 * @route   POST api/users/login
 * @desc    Login a user
 * @access  Public (no token required)
 * @returns {token, user} token and user object includes (id, username, email)
 * @returns {error} 400 if invalid credentials
 * @returns {error} 404 if user not found
 * @returns {error} 500 if server error
 */
router.post('/login', login);

/**
 * @route   POST api/users/logout
 * @desc    Logout a user
 * @access  Private (token required)
 * @returns {message} string message
 */
router.post('/logout', protect, logout);

/**
 * @route   PATCH api/users
 * @desc    Update a user
 * @access  Private (token required)
 * @returns {message} string message
 */
router.patch('/', protect, updateUser);

/**
 * @route   GET api/users/me
 * @desc    Get current user
 * @access  Private (token required) - user can only get his own data
 * @returns {user} user object includes (id, username, email)
 */
router.get('/me', protect, getMe);

/**
 * @route   DELETE api/users
 * @desc    Delete a user
 * @access  Private (token required) - user can only delete his own data
 * @returns {message} string message
 */
router.delete('/', protect, deleteUser);

module.exports = router;
