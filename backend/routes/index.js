const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const serviceRoutes = require('./serviceRoutes');
const projectRoutes = require('./projectRoutes');
const whyChooseUsRoutes = require('./whyChooseUsRoutes');
const uploadRoutes = require('./uploadRoutes');
const aboutRoutes = require('./aboutRoutes');
const contactRoutes = require('./contactRoutes');
const quoteRoutes = require('./quoteRoutes');

router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/projects', projectRoutes);
router.use('/why-choose-us', whyChooseUsRoutes);
router.use('/upload', uploadRoutes);
router.use('/about', aboutRoutes);
router.use('/contact', contactRoutes);
router.use('/quotes', quoteRoutes);

module.exports = router;
