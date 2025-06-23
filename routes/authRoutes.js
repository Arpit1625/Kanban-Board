const express = require('express');
const router = express.Router();

console.log('✅ authRoutes loaded'); // Debug check

const { register, login, getAllUsers } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware'); // ✅ Import protect middleware

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get("/users", protect, getAllUsers);

module.exports = router;
