const express = require('express');
const { getDashboardStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Apply auth and admin-only authorization
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);

module.exports = router;
