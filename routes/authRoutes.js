const express = require('express');
const { register, login } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Route to verify the protecred access and role (for testing purposes)
// Example test route
// const { authorize } = require('../middlewares/auth');
// router.get('/me', protect, (req, res) => { res.status(200).json({ success: true, data: req.user }) });

module.exports = router;
