const prescriptionService = require('../services/prescriptionService');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new prescription
// @route   POST /api/v1/prescriptions
// @access  Private (Doctor)
exports.createPrescription = asyncHandler(async (req, res, next) => {
    // Only doctors can create a prescription
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to create a prescription', 403));
    }

    // Set doctor ID to the current logged in doctor if not provided
    if (!req.body.doctorId) {
        req.body.doctorId = req.user.id;
    }

    const prescription = await prescriptionService.createPrescription(req.body);

    res.status(201).json({
        success: true,
        data: prescription
    });
});

// @desc    Get prescriptions for a specific patient
// @route   GET /api/v1/patients/:patientId/prescriptions
// @access  Private
exports.getPatientPrescriptions = asyncHandler(async (req, res, next) => {
    const prescriptions = await prescriptionService.getPrescriptionsByPatient(req.params.patientId);

    res.status(200).json({
        success: true,
        count: prescriptions.length,
        data: prescriptions
    });
});

// @desc    Download Prescription as PDF
// @route   GET /api/v1/prescriptions/:id/pdf
// @access  Private
exports.downloadPrescriptionPDF = asyncHandler(async (req, res, next) => {
    const docStream = await prescriptionService.generatePDF(req.params.id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
        'Content-Disposition',
        `attachment; filename=prescription_${req.params.id}.pdf`
    );

    // Pipe the PDF document directly to the response object
    docStream.pipe(res);
});
