"use client";

import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import styles from './ContactSection.module.css';
import {useState} from "react";

interface FormData {
    name: string;
    email: string;
    phone: string;
    projectType: string;
    message: string;
}

export default function ContactSection() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Thank you for your inquiry! We will contact you soon.');
        setFormData({ name: '', email: '', phone: '', projectType: '', message: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                                <label htmlFor="projectType">Project Type *</label>
                                <select
                                    id="projectType"
                                    name="projectType"
                                    value={formData.projectType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a project type</option>
                                    <option value="residential">Residential Construction</option>
                                    <option value="commercial">Commercial Construction</option>
                                    <option value="renovation">Interior Renovation</option>
                                    <option value="structural">Structural Repairs</option>
                                    <option value="turnkey">Turnkey Projects</option>
                                    <option value="other">Other</option>
                                </select>
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
                            <button type="submit" className={styles.submitButton}>
                                Send Message
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
                                        123 Construction Boulevard<br />
                                        Business District, NY 10001<br />
                                        United States
                                    </p>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <div className={styles.infoIconWrapper}>
                                    <Phone className={styles.infoIcon} />
                                </div>
                                <div>
                                    <h4>Phone Number</h4>
                                    <p>+1 (555) 123-4567</p>
                                    <p>+1 (555) 987-6543</p>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <div className={styles.infoIconWrapper}>
                                    <Mail className={styles.infoIcon} />
                                </div>
                                <div>
                                    <h4>Email Address</h4>
                                    <p>info@abmgrand.com</p>
                                    <p>projects@abmgrand.com</p>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <div className={styles.infoIconWrapper}>
                                    <Clock className={styles.infoIcon} />
                                </div>
                                <div>
                                    <h4>Business Hours</h4>
                                    <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                                    <p>Saturday: 9:00 AM - 2:00 PM</p>
                                    <p>Sunday: Closed</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.mapPlaceholder}>
                            <MapPin className={styles.mapIcon} />
                            <p>Map View</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}