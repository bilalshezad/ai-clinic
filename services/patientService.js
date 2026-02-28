const Patient = require('../models/Patient');
const ErrorResponse = require('../utils/errorResponse');

exports.createPatient = async (patientData) => {
    return await Patient.create(patientData);
};

exports.getPatients = async (query) => {
    let reqQuery = { ...query };

    // Fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    let mongooseQuery = Patient.find(JSON.parse(queryStr)).populate({
        path: 'createdBy',
        select: 'name email role'
    });

    // Pagination
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    mongooseQuery = mongooseQuery.skip(startIndex).limit(limit);

    const patients = await mongooseQuery;
    const total = await Patient.countDocuments(JSON.parse(queryStr));

    return {
        data: patients,
        pagination: {
            page,
            limit,
            total
        }
    };
};

exports.getPatientById = async (id) => {
    const patient = await Patient.findById(id).populate({
        path: 'createdBy',
        select: 'name email role'
    });

    if (!patient) {
        throw new ErrorResponse(`Patient not found with id of ${id}`, 404);
    }
    return patient;
};

exports.updatePatient = async (id, updateData, userId, userRole) => {
    let patient = await Patient.findById(id);

    if (!patient) {
        throw new ErrorResponse(`Patient not found with id of ${id}`, 404);
    }

    // Ensure user is patient creator or an admin
    if (patient.createdBy.toString() !== userId && userRole !== 'admin') {
        throw new ErrorResponse(`User not authorized to update this patient`, 403);
    }

    patient = await Patient.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });

    return patient;
};

exports.deletePatient = async (id, userId, userRole) => {
    const patient = await Patient.findById(id);

    if (!patient) {
        throw new ErrorResponse(`Patient not found with id of ${id}`, 404);
    }

    // Ensure user is patient creator or an admin
    if (patient.createdBy.toString() !== userId && userRole !== 'admin') {
        throw new ErrorResponse(`User not authorized to delete this patient`, 403);
    }

    await patient.deleteOne();
};
