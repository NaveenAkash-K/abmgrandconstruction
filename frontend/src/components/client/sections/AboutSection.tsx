'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './AboutSection.module.css';

export default function AboutSection() {
    const [isVisible, setIsVisible] = useState(false);
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

    return (
        <section
            id="about"
            className={styles.aboutSection}
            ref={sectionRef}
        >
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>About Us</h2>
                    <div className={styles.sectionDivider}></div>
                    <p className={styles.sectionDescription}>
                        ABM Grand Construction is a premier construction company dedicated to delivering exceptional quality and innovative solutions.
                        With decades of experience, we've built a reputation for excellence in residential, commercial, and industrial construction projects.
                        Our commitment to integrity, safety, and client satisfaction sets us apart in the industry.
                    </p>
                </div>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>25+</div>
                        <h3>Years of Experience</h3>
                        <p>Serving clients with dedication and expertise</p>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>500+</div>
                        <h3>Completed Projects</h3>
                        <p>Successfully delivered across various sectors</p>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>15+</div>
                        <h3>Locations Served</h3>
                        <p>Expanding our reach nationwide</p>
                    </div>
                </div>
            </div>
        </section>
    );
}