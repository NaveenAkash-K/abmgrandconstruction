const Quote = require('../models/Quote');
const ErrorResponse = require('../utils/errorResponse');
const nodemailer = require('nodemailer');

class QuoteService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email configuration missing. Email notifications will be disabled.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendQuoteNotification(quoteData) {
    if (!this.transporter) {
      console.warn('Email transporter not configured. Skipping email notification.');
      return;
    }

    const { name, email, phone, siteLocation, service } = quoteData;
    const recipientEmail = process.env.QUOTE_NOTIFICATION_EMAIL || process.env.EMAIL_USER;

    const mailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: recipientEmail,
      subject: 'New Quote Request - ABM Grand Construction',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
            New Quote Request
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
            <p style="margin: 10px 0;"><strong>Service:</strong> ${service}</p>
            <p style="margin: 10px 0;"><strong>Site Location:</strong> ${siteLocation}</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated notification from ABM Grand Construction website.
          </p>
        </div>
      `,
      text: `
New Quote Request

Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${service}
Site Location: ${siteLocation}

---
This is an automated notification from ABM Grand Construction website.
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Quote notification email sent successfully');
    } catch (error) {
      console.error('Failed to send quote notification email:', error.message);
    }
  }

  async createQuote(quoteData) {
    const { name, email, phone, siteLocation, service } = quoteData;

    if (!name || !email || !phone || !siteLocation || !service) {
      throw new ErrorResponse('Please provide name, email, phone, site location, and service', 400);
    }

    const quote = await Quote.create({
      name,
      email,
      phone,
      siteLocation,
      service,
    });

    await this.sendQuoteNotification(quoteData);

    return quote;
  }

  async getAllQuotes(filters = {}) {
    const { page = 1, limit = 20 } = filters;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const quotes = await Quote.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Quote.countDocuments();

    return {
      quotes,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    };
  }

  async getQuoteById(quoteId) {
    const quote = await Quote.findById(quoteId);

    if (!quote) {
      throw new ErrorResponse(`Quote not found with id of ${quoteId}`, 404);
    }

    return quote;
  }

  async deleteQuote(quoteId) {
    const quote = await Quote.findById(quoteId);

    if (!quote) {
      throw new ErrorResponse(`Quote not found with id of ${quoteId}`, 404);
    }

    await quote.deleteOne();

    return { message: 'Quote deleted successfully' };
  }

}

module.exports = new QuoteService();
