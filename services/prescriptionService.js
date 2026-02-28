const PDFDocument = require('pdfkit');
const fs = require('fs');

const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.createPrescription = async (prescriptionData) => {
    // Verify patient
    const patient = await Patient.findById(prescriptionData.patientId);
    if (!patient) {
        throw new ErrorResponse(`No patient with the id of ${prescriptionData.patientId}`, 404);
    }

    // Verify doctor
    const doctor = await User.findById(prescriptionData.doctorId);
    if (!doctor || doctor.role !== 'doctor') {
        throw new ErrorResponse(`Invalid doctor id: ${prescriptionData.doctorId}`, 400);
    }

    const prescription = await Prescription.create(prescriptionData);
    return prescription;
};

exports.getPrescriptionsByPatient = async (patientId) => {
    const prescriptions = await Prescription.find({ patientId })
        .populate({ path: 'doctorId', select: 'name email' })
        .populate({ path: 'patientId', select: 'name age gender contact' })
        .sort({ createdAt: -1 });

    return prescriptions;
};

exports.generatePDF = async (prescriptionId) => {
    const prescription = await Prescription.findById(prescriptionId)
        .populate({ path: 'doctorId', select: 'name email' })
        .populate({ path: 'patientId', select: 'name age gender contact' });

    if (!prescription) {
        throw new ErrorResponse(`Prescription not found with id of ${prescriptionId}`, 404);
    }

    const doc = new PDFDocument({ margin: 50 });

    // PDF Generation
    doc.fontSize(20).text('Medical Prescription', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    doc.text(`Doctor: ${prescription.doctorId.name}`);
    doc.text(`Email: ${prescription.doctorId.email}`);
    doc.moveDown();

    // Patient Info
    doc.text(`Patient: ${prescription.patientId.name}`);
    doc.text(`Age: ${prescription.patientId.age} | Gender: ${prescription.patientId.gender}`);
    doc.text(`Contact: ${prescription.patientId.contact}`);
    doc.moveDown(2);

    // Medicines
    doc.fontSize(14).text('Medicines:', { underline: true });
    doc.moveDown();

    prescription.medicines.forEach((med, index) => {
        doc.fontSize(12).text(`${index + 1}. ${med.name} - ${med.dosage}`);
    });

    doc.moveDown(2);

    // Instructions
    if (prescription.instructions) {
        doc.fontSize(14).text('Instructions:', { underline: true });
        doc.moveDown();
        doc.fontSize(12).text(prescription.instructions);
    }

    doc.end();

    return doc; // Return the PDF document stream
};
