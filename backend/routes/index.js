const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const serviceRoutes = require('./serviceRoutes');
const projectRoutes = require('./projectRoutes');
const clientRoutes = require('./clientRoutes');
const whyChooseUsRoutes = require('./whyChooseUsRoutes');
const uploadRoutes = require('./uploadRoutes');
const aboutRoutes = require('./aboutRoutes');
const contactRoutes = require('./contactRoutes');

router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/projects', projectRoutes);
router.use('/clients', clientRoutes);
router.use('/why-choose-us', whyChooseUsRoutes);
router.use('/upload', uploadRoutes);
router.use('/about', aboutRoutes);
router.use('/contact', contactRoutes);

module.exports = router;
