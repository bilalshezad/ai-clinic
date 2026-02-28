const patientService = require('../services/patientService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create new patient
// @route   POST /api/v1/patients
// @access  Private
exports.createPatient = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    const patient = await patientService.createPatient(req.body);

    res.status(201).json({
        success: true,
        data: patient
    });
});

// @desc    Get all patients
// @route   GET /api/v1/patients
// @access  Private
exports.getPatients = asyncHandler(async (req, res, next) => {
    const result = await patientService.getPatients(req.query);

    res.status(200).json({
        success: true,
        count: result.data.length,
        pagination: result.pagination,
        data: result.data
    });
});

// @desc    Get single patient
// @route   GET /api/v1/patients/:id
// @access  Private
exports.getPatient = asyncHandler(async (req, res, next) => {
    const patient = await patientService.getPatientById(req.params.id);

    res.status(200).json({
        success: true,
        data: patient
    });
});

// @desc    Update patient
// @route   PUT /api/v1/patients/:id
// @access  Private
exports.updatePatient = asyncHandler(async (req, res, next) => {
    const patient = await patientService.updatePatient(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
    );

    res.status(200).json({
        success: true,
        data: patient
    });
});

// @desc    Delete patient
// @route   DELETE /api/v1/patients/:id
// @access  Private
exports.deletePatient = asyncHandler(async (req, res, next) => {
    await patientService.deletePatient(
        req.params.id,
        req.user.id,
        req.user.role
    );

    res.status(200).json({
        success: true,
        data: {}
    });
});
