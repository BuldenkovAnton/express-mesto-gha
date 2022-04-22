const router = require('express').Router();
const { celebrate } = require('celebrate');

const {
  getUserByIdSchema,
  updateUserProfileSchema,
  updateUserAvatarSchema,
} = require('../middlewares/validator');

const {
  getUsers,
  getUserById,
  getMyProfile,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/me', getMyProfile);
router.get('/:userId', celebrate({ params: getUserByIdSchema }), getUserById);
router.patch('/me', celebrate({ body: updateUserProfileSchema }), updateUserProfile);
router.patch('/me/avatar', celebrate({ body: updateUserAvatarSchema }), updateUserAvatar);

module.exports = router;
