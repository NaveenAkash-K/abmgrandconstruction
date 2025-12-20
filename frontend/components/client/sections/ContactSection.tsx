"use client";

import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import styles from './ContactSection.module.css';
import { contactService, ContactInfo, ContactMessage } from '@/services';

interface FormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

export default function ContactSection() {
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    useEffect(() => {
        fetchContactInfo();
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const messageData: ContactMessage = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message
            };

            await contactService.sendMessage(messageData);
            alert('Thank you for your inquiry! We will contact you soon.');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch (error: any) {
            alert('Failed to send message. Please try again.');
            console.error('Failed to send message:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Generate Google Maps URL from address
    const getMapEmbedUrl = () => {
        if (!contactInfo) {
            return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.74844097932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus';
        }

        const address = `${contactInfo.streetAddress}, ${contactInfo.cityAndZip}, ${contactInfo.country}`;
        const encodedAddress = encodeURIComponent(address);
        return `https://www.google.com/maps/embed/v1/place?key=&q=${encodedAddress}`;
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
                                <label htmlFor="subject">Subject *</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="What is your inquiry about?"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="message">Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    placeholder="Tell us about your project..."
                                />
                            </div>
                            <button type="submit" className={styles.submitButton} disabled={submitting}>
                                {submitting ? 'Sending...' : 'Send Message'}
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
                </div>
            </div>
        </section>
    );
}