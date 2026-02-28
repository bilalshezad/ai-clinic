const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient',
        required: [true, 'Please add a patient']
    },
    doctorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please add a doctor']
    },
    medicines: [{
        name: {
            type: String,
            required: [true, 'Please add medicine name']
        },
        dosage: {
            type: String,
            required: [true, 'Please add medicine dosage']
        }
    }],
    instructions: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
