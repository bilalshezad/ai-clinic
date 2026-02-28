const express = require('express');
const {
    bookAppointment,
    getAppointments,
    updateAppointmentStatus,
    cancelAppointment
} = require('../controllers/appointmentController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Apply auth middleware to all appointment routes
router.use(protect);

router
    .route('/')
    .get(getAppointments)
    .post(authorize('admin', 'receptionist'), bookAppointment);

router
    .route('/:id/status')
    .put(updateAppointmentStatus);

router
    .route('/:id/cancel')
    .put(cancelAppointment);

module.exports = router;
