const appointmentService = require('../services/appointmentService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Book an appointment
// @route   POST /api/v1/appointments
// @access  Private (Admin, Receptionist)
exports.bookAppointment = asyncHandler(async (req, res, next) => {
    const appointment = await appointmentService.bookAppointment(req.body);

    res.status(201).json({
        success: true,
        data: appointment
    });
});

// @desc    Get all appointments (can filter by doctorId or date in query)
// @route   GET /api/v1/appointments
// @access  Private
exports.getAppointments = asyncHandler(async (req, res, next) => {
    const appointments = await appointmentService.getAppointments(req.query, req.user);

    res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
    });
});

// @desc    Update appointment status
// @route   PUT /api/v1/appointments/:id/status
// @access  Private
exports.updateAppointmentStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;
    const appointment = await appointmentService.updateAppointmentStatus(req.params.id, status, req.user);

    res.status(200).json({
        success: true,
        data: appointment
    });
});

// @desc    Cancel appointment
// @route   PUT /api/v1/appointments/:id/cancel
// @access  Private
exports.cancelAppointment = asyncHandler(async (req, res, next) => {
    const appointment = await appointmentService.cancelAppointment(req.params.id, req.user);

    res.status(200).json({
        success: true,
        data: appointment
    });
});
