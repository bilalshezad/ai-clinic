const aiService = require('../services/aiService');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Perform symptom check using AI
// @route   POST /api/v1/ai/symptom-check
// @access  Private
exports.symptomCheck = asyncHandler(async (req, res, next) => {
    const { symptoms } = req.body;

    if (!symptoms) {
        return next(new ErrorResponse('Please provide symptoms to analyze', 400));
    }

    const analysis = await aiService.symptomCheck(symptoms, req.user.id);

    res.status(200).json({
        success: true,
        data: analysis
    });
});

// @desc    Explain prescription using AI
// @route   POST /api/v1/ai/prescription-explain
// @access  Private
exports.prescriptionExplain = asyncHandler(async (req, res, next) => {
    const { prescription } = req.body;

    if (!prescription) {
        return next(new ErrorResponse('Please provide a prescription to explain', 400));
    }

    const explanation = await aiService.prescriptionExplain(prescription, req.user.id);

    res.status(200).json({
        success: true,
        data: explanation
    });
});
