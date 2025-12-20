'use client';

import { useEffect, useState } from 'react';
import { Home, Building2, Hammer, Wrench, CheckCircle2, Target, Award, Clock, Shield, Users } from 'lucide-react';
import styles from './ServicesSection.module.css';
import { serviceService, Service } from '@/services';

// Icon mapping
const iconMap: { [key: string]: any } = {
    home: Home,
    building: Building2,
    hammer: Hammer,
    wrench: Wrench,
    check: CheckCircle2,
    target: Target,
    award: Award,
    clock: Clock,
    shield: Shield,
    users: Users,
};

export default function ServicesSection() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await serviceService.getAll();
            // Filter only active services and sort by order
            const activeServices = (response.data || [])
                .filter((service: Service) => service.isActive)
                .sort((a: Service, b: Service) => (a.order || 0) - (b.order || 0));
            setServices(activeServices);
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section id="services" className={styles.servicesSection}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Our Services</h2>
                        <div className={styles.sectionDivider}></div>
                        <p className={styles.sectionDescription}>Loading...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (services.length === 0) {
        return null; // Don't show section if no services
    }

    return (
        <section id="services" className={styles.servicesSection}>
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Our Services</h2>
                    <div className={styles.sectionDivider}></div>
                    <p className={styles.sectionDescription}>
                        We offer comprehensive construction services tailored to meet your specific needs
                    </p>
                </div>
                <div className={styles.servicesGrid}>
                    {services.map((service) => {
                        const Icon = iconMap[service.icon] || Home;
                        return (
                            <div key={service._id} className={styles.serviceCard}>
                                <div className={styles.serviceIconWrapper}>
                                    <Icon className={styles.serviceIcon} />
                                </div>
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}