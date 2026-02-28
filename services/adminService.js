const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const DiagnosisLog = require('../models/DiagnosisLog');

exports.getDashboardStats = async () => {
    // 1. Total patients count
    const totalPatients = await Patient.countDocuments();

    // 2. Total doctors count
    const totalDoctors = await User.countDocuments({ role: 'doctor' });

    // 3. Monthly appointments count (for the current year)
    const currentYear = new Date().getFullYear();
    const monthlyAppointments = await Appointment.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(`${currentYear}-01-01`),
                    $lte: new Date(`${currentYear}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$date' },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Format monthly data
    const formattedMonthlyAppointments = Array.from({ length: 12 }, (_, i) => {
        const monthData = monthlyAppointments.find(m => m._id === i + 1);
        return {
            month: i + 1,
            count: monthData ? monthData.count : 0
        };
    });

    // 4. Most common diagnosis (using simple aggregation on AI diagnosis logs)
    // Assuming 'action' is 'symptom-check' and we look at the saved prompt or a simulated field
    // For a real scenario, we might have a 'Diagnosis' model. Here we'll simulate it based on logs.
    const diagnosisStats = await DiagnosisLog.aggregate([
        { $match: { action: 'symptom-check' } },
        {
            $group: {
                _id: '$prompt', // Grouping by the raw prompt for simplicity (can be a condition field in future)
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);
    const mostCommonDiagnosis = diagnosisStats.length > 0 ? diagnosisStats[0]._id : 'N/A';

    // 5. Simulated revenue (e.g., $50 per completed appointment)
    const completedAppointmentsCount = await Appointment.countDocuments({ status: 'completed' });
    const simulatedRevenue = completedAppointmentsCount * 50; // $50 per appointment

    return {
        totalPatients,
        totalDoctors,
        monthlyAppointments: formattedMonthlyAppointments,
        mostCommonDiagnosis,
        simulatedRevenue
    };
};
