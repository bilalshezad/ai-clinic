const express = require('express');
const {
    createPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient
} = require('../controllers/patientController');

const { protect, authorize } = require('../middlewares/auth');

// Include other resource routers
const prescriptionRouter = require('./prescriptionRoutes');

const router = express.Router();

// Apply auth middleware to all patient routes
router.use(protect);

// Re-route into other resource routers
router.use('/:patientId/prescriptions', prescriptionRouter);

router
    .route('/')
    .get(getPatients)
    .post(createPatient);

router
    .route('/:id')
    .get(getPatient)
    .put(updatePatient)
    .delete(deletePatient);

module.exports = router;
