const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Controller files
const authController = require('./controllers/authController');
const serviceController = require('./controllers/serviceController');
const projectController = require('./controllers/projectController');
const clientController = require('./controllers/clientController');
const whyChooseUsController = require('./controllers/whyChooseUsController');
const uploadController = require('./controllers/uploadController');

// Middleware
const { protect } = require('./middleware/auth');
const upload = require('./middleware/upload');

const app = express();

// Body parser with increased limit for base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Set security headers
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
// app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', protect, authController.getMe);
app.post('/api/auth/logout', authController.logout);

// Service routes
app.get('/api/services', serviceController.getServices);
app.get('/api/services/:id', serviceController.getService);
app.post('/api/services', protect, serviceController.createService);
app.put('/api/services/:id', protect, serviceController.updateService);
app.delete('/api/services/:id', protect, serviceController.deleteService);

// Project routes
app.get('/api/projects', projectController.getProjects);
app.get('/api/projects/:id', projectController.getProject);
app.post('/api/projects', protect, projectController.createProject);
app.put('/api/projects/:id', protect, projectController.updateProject);
app.delete('/api/projects/:id', protect, projectController.deleteProject);

// Client routes
app.get('/api/clients/featured', clientController.getFeaturedClients);
app.get('/api/clients/stats', protect, clientController.getClientStats);
app.get('/api/clients/industry/:industry', clientController.getClientsByIndustry);
app.get('/api/clients', clientController.getClients);
app.get('/api/clients/:id', clientController.getClient);
app.post('/api/clients', protect, clientController.createClient);
app.put('/api/clients/reorder', protect, clientController.reorderClients);
app.put('/api/clients/:id/toggle', protect, clientController.toggleClient);
app.put('/api/clients/:id/feature', protect, clientController.toggleFeatured);
app.put('/api/clients/:id', protect, clientController.updateClient);
app.delete('/api/clients/:id', protect, clientController.deleteClient);

// Why Choose Us routes
app.get('/api/why-choose-us', whyChooseUsController.getWhyChooseUs);
app.get('/api/why-choose-us/:id', whyChooseUsController.getWhyChooseUsById);
app.post('/api/why-choose-us', protect, whyChooseUsController.createWhyChooseUs);
app.put('/api/why-choose-us/reorder', protect, whyChooseUsController.reorderWhyChooseUs);
app.put('/api/why-choose-us/:id/toggle', protect, whyChooseUsController.toggleWhyChooseUs);
app.put('/api/why-choose-us/:id', protect, whyChooseUsController.updateWhyChooseUs);
app.delete('/api/why-choose-us/:id', protect, whyChooseUsController.deleteWhyChooseUs);

// Testimonial routes
// app.get('/api/testimonials', testimonialController.getTestimonials);
// app.get('/api/testimonials/:id', testimonialController.getTestimonial);
// app.post('/api/testimonials', protect, testimonialController.createTestimonial);
// app.put('/api/testimonials/:id', protect, testimonialController.updateTestimonial);
// app.delete('/api/testimonials/:id', protect, testimonialController.deleteTestimonial);
//
// // Contact routes
// app.get('/api/contacts', protect, contactController.getContacts);
// app.get('/api/contacts/:id', protect, contactController.getContact);
// app.post('/api/contacts', contactController.createContact);
// app.put('/api/contacts/:id', protect, contactController.updateContact);
// app.delete('/api/contacts/:id', protect, contactController.deleteContact);
//
// // Team Member routes
// app.get('/api/team-members', teamMemberController.getTeamMembers);
// app.get('/api/team-members/:id', teamMemberController.getTeamMember);
// app.post('/api/team-members', protect, teamMemberController.createTeamMember);
// app.put('/api/team-members/:id', protect, teamMemberController.updateTeamMember);
// app.delete('/api/team-members/:id', protect, teamMemberController.deleteTeamMember);

// Upload routes
app.get('/api/upload', protect, uploadController.getImages);
app.get('/api/upload/:id', uploadController.getImage);
app.get('/api/upload/:id/info', uploadController.getImageInfo);
app.post('/api/upload', protect, upload.single('image'), uploadController.uploadImage);
app.post('/api/upload/multiple', protect, upload.array('images', 10), uploadController.uploadMultipleImages);
app.delete('/api/upload', protect, uploadController.deleteImageByUrl);
app.delete('/api/upload/multiple', protect, uploadController.deleteMultipleImages);
app.delete('/api/upload/:id', protect, uploadController.deleteImage);

// Error handler middleware
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

module.exports = app;