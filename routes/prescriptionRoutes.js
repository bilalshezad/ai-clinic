const express = require('express');
const {
    createPrescription,
    getPatientPrescriptions,
    downloadPrescriptionPDF
} = require('../controllers/prescriptionController');

const { protect, authorize } = require('../middlewares/auth');

// We need to merge params so that we can access patientId from /api/v1/patients/:patientId/prescriptions
const router = express.Router({ mergeParams: true });

// Apply auth middleware
router.use(protect);

router
    .route('/')
    .get(getPatientPrescriptions)
    .post(authorize('doctor', 'admin'), createPrescription);

router
    .route('/:id/pdf')
    .get(downloadPrescriptionPDF);

module.exports = router;
