const express = require('express');
const {
    symptomCheck,
    prescriptionExplain
} = require('../controllers/aiController');

const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect); // Ensure user is logged in to use AI endpoints

router.post('/symptom-check', symptomCheck);
router.post('/prescription-explain', prescriptionExplain);

module.exports = router;
