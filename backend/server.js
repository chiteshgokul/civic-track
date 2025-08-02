const express = require('express');
const { configureMiddleware } = require('./config/middleware');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');
const categoryRoutes = require('./routes/categories');
const citizenRoutes = require('./routes/citizens');
const departmentRoutes = require('./routes/departments');
const officerRoutes = require('./routes/officers');
const complaintRoutes = require('./routes/complaints');
const logger = require('./utils/logger');

const app = express();

// Configure middleware
configureMiddleware(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/citizens', citizenRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/officers', officerRoutes);
app.use('/api/complaints', complaintRoutes);

// Error handling
app.use(errorHandler);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});