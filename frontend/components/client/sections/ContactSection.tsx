"use client";

import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import styles from './ContactSection.module.css';
import { contactService, quoteService, ContactInfo, QuoteRequest } from '@/services';
import { serviceService, Service } from '@/services/serviceService';

interface FormData {
    name: string;
    email: string;
    phone: string;
    siteLocation: string;
    service: string;
    message: string;
}

export default function ContactSection() {
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        siteLocation: '',
        service: '',
        message: ''
    });
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        fetchContactInfo();
        fetchServices();
    }, []);

    const fetchContactInfo = async () => {
        try {
            setLoading(true);
            const response = await contactService.getInfo();
            setContactInfo(response.data);
        } catch (error) {
            console.error('Failed to fetch contact info:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await serviceService.getAll();
            // Filter only active services if needed
            const activeServices = response.data?.filter((s: Service) => s.isActive !== false) || response.data || [];
            setServices(activeServices);
        } catch (error) {
            console.error('Failed to fetch services:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);

        try {
            // Find selected service title
            const selectedService = services.find(s => s._id === formData.service);
            const serviceName = selectedService?.title || formData.service;

            // Send quote request
            const quoteData: QuoteRequest = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                siteLocation: formData.siteLocation,
                service: formData.service,
                message: formData.message,
            };

            await quoteService.sendQuote(quoteData);

            setSubmitSuccess(true);
            setFormData({ name: '', email: '', phone: '', siteLocation: '', service: '', message: '' });

            // Clear success message after 5 seconds
            setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again.';
            setSubmitError(errorMessage);
            console.error('Failed to send quote:', error);

            // Clear error message after 5 seconds
            setTimeout(() => setSubmitError(''), 5000);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Generate Google Maps directions URL
    const getDirectionsUrl = () => {
        if (!contactInfo) {
            return 'https://www.google.com/maps/dir//Empire+State+Building';
        }

        const address = `${contactInfo.streetAddress}, ${contactInfo.cityAndZip}, ${contactInfo.country}`;
        const encodedAddress = encodeURIComponent(address);
        return `https://www.google.com/maps/dir//${encodedAddress}`;
    };

    return (
        <section id="contact" className={styles.contactSection}>
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Contact Us</h2>
                    <div className={styles.sectionDivider}></div>
                    <p className={styles.sectionDescription}>
                        Get in touch with us to discuss your next project
                    </p>
                </div>
                <div className={styles.contactGrid}>
                    <div className={styles.contactFormWrapper}>
                        <form onSubmit={handleSubmit} className={styles.contactForm}>
                            {submitSuccess && (
                                <div className={styles.successMessage}>
                                    Thank you for your inquiry! We will contact you soon.
                                </div>
                            )}
                            {submitError && (
                                <div className={styles.errorMessage}>
                                    {submitError}
                                </div>
                            )}

                            <div className={styles.formGroup}>
                                <label htmlFor="name">Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your full name"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="phone">Phone *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="siteLocation">Site Location *</label>
                                <input
                                    type="text"
                                    id="siteLocation"
                                    name="siteLocation"
                                    value={formData.siteLocation}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your site location"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="service">Service *</label>
                                <select
                                    id="service"
                                    name="service"
                                    value={formData.service}
                                    onChange={handleChange}
                                    required
                                    className={styles.selectInput}
                                >
                                    <option value="">Select a service</option>
                                    {services.map((service) => (
                                        <option key={service._id} value={service._id}>
                                            {service.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className={styles.submitButton} disabled={submitting}>
                                {submitting ? 'Sending...' : 'Send Quote'}
                            </button>
                        </form>
                    </div>
                    <div className={styles.contactInfo}>
                        <div>
                            <h3>Get In Touch</h3>
                            <p className={styles.contactIntro}>
                                We're here to answer your questions and discuss how we can help bring your construction project to life.
                            </p>
                        </div>
                        <div className={styles.infoItems}>
                            <div className={styles.infoItem}>
                                <div className={styles.infoIconWrapper}>
                                    <MapPin className={styles.infoIcon} />
                                </div>
                                <div>
                                    <h4>Office Address</h4>
                                    <p>
                                        {contactInfo?.streetAddress || '123 Construction Boulevard'}<br />
                                        {contactInfo?.cityAndZip || 'Business District, NY 10001'}<br />
                                        {contactInfo?.country || 'United States'}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <div className={styles.infoIconWrapper}>
                                    <Phone className={styles.infoIcon} />
                                </div>
                                <div>
                                    <h4>Phone Number</h4>
                                    <p>{contactInfo?.primaryPhone || '+1 (555) 123-4567'}</p>
                                    {contactInfo?.secondaryPhone && <p>{contactInfo.secondaryPhone}</p>}
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <div className={styles.infoIconWrapper}>
                                    <Mail className={styles.infoIcon} />
                                </div>
                                <div>
                                    <h4>Email Address</h4>
                                    <p>{contactInfo?.primaryEmail || 'info@abmgrand.com'}</p>
                                    {contactInfo?.secondaryEmail && <p>{contactInfo.secondaryEmail}</p>}
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <div className={styles.infoIconWrapper}>
                                    <Clock className={styles.infoIcon} />
                                </div>
                                <div>
                                    <h4>Business Hours</h4>
                                    <p>{contactInfo?.businessHoursWeekdays || 'Monday - Friday: 8:00 AM - 6:00 PM'}</p>
                                    <p>{contactInfo?.businessHoursSaturday || 'Saturday: 9:00 AM - 2:00 PM'}</p>
                                    <p>{contactInfo?.businessHoursSunday || 'Sunday: Closed'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Google Maps Integration */}

                    </div>
                </div>
                <div className={styles.mapContainer}>
                    <div className={styles.mapHeader}>
                        <h4>
                            <MapPin size={18} />
                            Find Us on Map
                        </h4>
                        <a
                            href={getDirectionsUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.directionsButton}
                        >
                            Get Directions
                        </a>
                    </div>
                    <div className={styles.mapWrapper}>
                        <iframe
                            src={`https://www.google.com/maps?q=${encodeURIComponent(
                                contactInfo
                                    ? `${contactInfo.streetAddress}, ${contactInfo.cityAndZip}, ${contactInfo.country}`
                                    : '123 Construction Boulevard, Business District, NY 10001, United States'
                            )}&output=embed`}
                            className={styles.mapIframe}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Office Location"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}