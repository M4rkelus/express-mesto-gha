const router = require('express').Router();

const {
  getUsers,
  getUserById,
  getCurrentUser,
  updProfile,
  updAvatar,
} = require('../controllers/users');
const {
  userValidate,
  userIdValidate,
  avatarValidate,
} = require('../middlewares/validation');

router.get('/', getUsers); // Get all users
router.get('/me', getCurrentUser); // Get current user by ID
router.get('/:userId', userIdValidate, getUserById); // Get user by ID
router.patch('/me', userValidate, updProfile); // Update user profile
router.patch('/me/avatar', avatarValidate, updAvatar); // Update user avatar

module.exports = router;
