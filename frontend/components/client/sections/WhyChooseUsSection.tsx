'use client';

import { useEffect, useState } from 'react';
import { Award, Clock, CheckCircle2, Users, Shield, Target, Home, Building2, Hammer, Wrench } from 'lucide-react';
import styles from './WhyChooseUsSection.module.css';
import { whyChooseUsService, WhyChooseUs } from '@/services';

// Icon mapping
const iconMap: { [key: string]: any } = {
    award: Award,
    clock: Clock,
    check: CheckCircle2,
    users: Users,
    shield: Shield,
    target: Target,
    home: Home,
    building: Building2,
    hammer: Hammer,
    wrench: Wrench,
};

export default function WhyChooseUsSection() {
    const [reasons, setReasons] = useState<WhyChooseUs[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReasons();
    }, []);

    const fetchReasons = async () => {
        try {
            setLoading(true);
            const response = await whyChooseUsService.getAll();
            // Filter only active reasons and sort by order
            const activeReasons = (response.data || [])
            setReasons(activeReasons);
        } catch (error) {
            console.error('Failed to fetch reasons:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className={styles.whyChooseSection}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitleLight}>Why Choose Us</h2>
                        <div className={styles.sectionDivider}></div>
                        <p className={styles.sectionDescriptionLight}>Loading...</p>
                    </div>
                </div>
            </section>
        );
    }

    // if (reasons.length === 0) {
    //     return null; // Don't show section if no reasons
    // }

    return (
        <section className={styles.whyChooseSection}>
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitleLight}>Why Choose Us</h2>
                    <div className={styles.sectionDivider}></div>
                    <p className={styles.sectionDescriptionLight}>
                        We deliver excellence through commitment, expertise, and integrity
                    </p>
                </div>
                <div className={styles.reasonsGrid}>
                    {reasons.map((reason) => {
                        const Icon = iconMap[reason.icon] || Award;
                        return (
                            <div key={reason._id} className={styles.reasonCard}>
                                <div className={styles.reasonIconWrapper}>
                                    <Icon className={styles.reasonIcon} />
                                </div>
                                <h3>{reason.title}</h3>
                                <p>{reason.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}