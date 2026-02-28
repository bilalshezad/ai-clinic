const mongoose = require('mongoose');

const DiagnosisLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please add a user']
    },
    action: {
        type: String,
        enum: ['symptom-check', 'prescription-explain'],
        required: [true, 'Please specify the action']
    },
    prompt: {
        type: String,
        required: [true, 'Please add the user prompt/input']
    },
    aiResponse: {
        type: Object,
        required: [true, 'Please add the AI response']
    },
    isFallback: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DiagnosisLog', DiagnosisLogSchema);
