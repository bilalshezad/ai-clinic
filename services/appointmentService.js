const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.bookAppointment = async (appointmentData) => {
    // Check if patient exists
    const patient = await Patient.findById(appointmentData.patientId);
    if (!patient) {
        throw new ErrorResponse(`No patient with the id of ${appointmentData.patientId}`, 404);
    }

    // Check if doctor exists and has role 'doctor'
    const doctor = await User.findById(appointmentData.doctorId);
    if (!doctor) {
        throw new ErrorResponse(`No user with the id of ${appointmentData.doctorId}`, 404);
    }
    if (doctor.role !== 'doctor') {
        throw new ErrorResponse(`The user with id ${appointmentData.doctorId} is not a doctor`, 400);
    }

    // Create appointment
    const appointment = await Appointment.create(appointmentData);
    return appointment;
};

exports.getAppointments = async (query, user) => {
    let reqQuery = { ...query };

    // Set role-based filtering
    if (user.role === 'doctor') {
        reqQuery.doctorId = user.id;
    } // Admin and receptionist can see all, unless specified in query

    // Filters for date (e.g. date[gte]=2023-01-01)
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    let mongooseQuery = Appointment.find(JSON.parse(queryStr))
        .populate({ path: 'patientId', select: 'name contact' })
        .populate({ path: 'doctorId', select: 'name email' })
        .sort({ date: 1 });

    const appointments = await mongooseQuery;
    return appointments;
};

exports.updateAppointmentStatus = async (id, status, user) => {
    let appointment = await Appointment.findById(id);

    if (!appointment) {
        throw new ErrorResponse(`Appointment not found with id of ${id}`, 404);
    }

    // Role checks
    if (user.role === 'doctor' && appointment.doctorId.toString() !== user.id) {
        throw new ErrorResponse(`Doctor not authorized to update this appointment`, 403);
    }

    appointment.status = status;
    await appointment.save();

    return appointment;
};

exports.cancelAppointment = async (id, user) => {
    let appointment = await Appointment.findById(id);

    if (!appointment) {
        throw new ErrorResponse(`Appointment not found with id of ${id}`, 404);
    }

    // Role checks
    if (user.role === 'doctor' && appointment.doctorId.toString() !== user.id) {
        throw new ErrorResponse(`Doctor not authorized to cancel this appointment`, 403);
    }

    appointment.status = 'cancelled';
    await appointment.save();

    return appointment;
};
