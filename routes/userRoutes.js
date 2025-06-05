const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/auth');

// Register user baru
router.post('/register', userController.register);

// Login user
router.post('/login', userController.login);

// Get all user
router.get('/', authenticateToken, userController.getAllUsers);

// Edit user (tanpa update password)
router.put('/:id', authenticateToken, userController.edit);

// Update password user
router.put('/:id/password', authenticateToken, userController.updatePassword);

module.exports = router;
