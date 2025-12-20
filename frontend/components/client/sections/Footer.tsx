'use client';

import { useEffect, useState } from 'react';
import { Building2, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import styles from './Footer.module.css';
import { contactService, ContactInfo } from '@/services';

export default function Footer() {
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

    const fetchContactInfo = async () => {
        try {
            const response = await contactService.getInfo();
            setContactInfo(response.data);
        } catch (error) {
            console.error('Failed to fetch contact info:', error);
        }
    };
    useEffect(() => {
        fetchContactInfo();
    }, []);

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className={styles.footerGrid}>
                    <div className={styles.footerInfo}>
                        <div className={styles.footerLogo}>
                            <Building2 className={styles.footerIcon} />
                            <span>ABM GRAND CONSTRUCTION</span>
                        </div>
                        <p>
                            Building excellence since 1998. We transform visions into reality with unmatched quality and dedication.
                        </p>
                        <div className={styles.socialLinks}>
                            <a href="#" aria-label="Facebook">
                                <Facebook />
                            </a>
                            <a href="#" aria-label="Twitter">
                                <Twitter />
                            </a>
                            <a href="#" aria-label="Instagram">
                                <Instagram />
                            </a>
                            <a href="#" aria-label="LinkedIn">
                                <Linkedin />
                            </a>
                        </div>
                    </div>
                    <div className={styles.footerLinks}>
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#projects">Projects</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                    <div className={styles.footerServices}>
                        <h4>Services</h4>
                        <ul>
                            <li><a href="#services">Residential</a></li>
                            <li><a href="#services">Commercial</a></li>
                            <li><a href="#services">Renovation</a></li>
                            <li><a href="#services">Structural Repairs</a></li>
                            <li><a href="#services">Turnkey Projects</a></li>
                        </ul>
                    </div>
                    <div className={styles.footerContact}>
                        <h4>Contact Info</h4>
                        <ul>
                            <li>{contactInfo?.streetAddress || '123 Construction Boulevard'}</li>
                            <li>{contactInfo?.cityAndZip || 'Business District, NY 10001'}</li>
                            <li>{contactInfo?.primaryPhone || '+1 (555) 123-4567'}</li>
                            <li>{contactInfo?.primaryEmail || 'info@abmgrand.com'}</li>
                        </ul>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <div className={styles.copyright}>
                        <p>&copy; 2024 ABM GRAND CONSTRUCTION. All rights reserved.</p>
                    </div>
                    <div className={styles.bottomLinks}>
                        <a href="#">Privacy Policy</a>
                        <span>|</span>
                        <a href="#">Terms of Service</a>
                        <span>|</span>
                        <a href="#">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}