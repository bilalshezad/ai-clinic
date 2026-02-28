const adminService = require('../services/adminService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/v1/admin/dashboard
// @access  Private (Admin Only)
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
    const stats = await adminService.getDashboardStats();

    res.status(200).json({
        success: true,
        data: stats
    });
});
