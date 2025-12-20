'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './AboutSection.module.css';
import { aboutService, About } from '@/services';

export default function AboutSection() {
    const [isVisible, setIsVisible] = useState(false);
    const [aboutData, setAboutData] = useState<About | null>(null);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        fetchAboutData();
    }, []);

    const fetchAboutData = async () => {
        try {
            setLoading(true);
            const response = await aboutService.get();
            setAboutData(response.data);
        } catch (error) {
            console.error('Failed to fetch about data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateYearsExperience = () => {
        if (!aboutData?.yearsOfExperience) return '25+';
        return `${aboutData.yearsOfExperience}+`;
    };

    if (loading) {
        return (
            <section id="about" className={styles.aboutSection} ref={sectionRef}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>About Us</h2>
                        <div className={styles.sectionDivider}></div>
                        <p className={styles.sectionDescription}>Loading...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            id="about"
            className={styles.aboutSection}
            ref={sectionRef}
        >
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        {aboutData?.title || 'About Us'}
                    </h2>
                    <div className={styles.sectionDivider}></div>
                    <p className={styles.sectionDescription}>
                        {aboutData?.description || 'ABM Grand Construction is a premier construction company dedicated to delivering exceptional quality and innovative solutions.'}
                    </p>
                </div>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>{calculateYearsExperience()}</div>
                        <h3>Years of Experience</h3>
                        <p>Serving clients with dedication and expertise</p>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>{aboutData?.completedProjects + '+'}</div>
                        <h3>Completed Projects</h3>
                        <p>Successfully delivered across various sectors</p>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>{aboutData?.locationsServed + '+'}</div>
                        <h3>Locations Served</h3>
                        <p>Expanding our reach nationwide</p>
                    </div>
                </div>
            </div>
        </section>
    );
}