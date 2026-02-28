const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    age: {
        type: Number,
        required: [true, 'Please add an age']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: [true, 'Please add gender']
    },
    contact: {
        type: String,
        required: [true, 'Please add a contact number']
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Patient', PatientSchema);
