const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updProfile,
  updAvatar,
} = require('../controllers/users');

router.get('/', getUsers); // Get all users
router.get('/:userId', getUserById); // Get user by ID
router.post('/', createUser); // Create new user
router.patch('/me', updProfile); // Update user profile
router.patch('/me/avatar', updAvatar); // Update user avatar

module.exports = router;
