require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Route files
const auth = require('./routes/authRoutes');
const patients = require('./routes/patientRoutes');
const appointments = require('./routes/appointmentRoutes');
const prescriptions = require('./routes/prescriptionRoutes');
const ai = require('./routes/aiRoutes');
const admin = require('./routes/adminRoutes');

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'API is running' });
});

// Mount routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/patients', patients);
app.use('/api/v1/appointments', appointments);
app.use('/api/v1/prescriptions', prescriptions);
app.use('/api/v1/ai', ai);
app.use('/api/v1/admin', admin);

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
