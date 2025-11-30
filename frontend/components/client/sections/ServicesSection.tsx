import { Home, Building2, Hammer, Wrench, CheckCircle2, Target } from 'lucide-react';
import styles from './ServicesSection.module.css';

const services = [
    {
        icon: Home,
        title: 'Residential Construction',
        description: 'Custom homes, renovations, and residential developments built to the highest standards of quality and comfort.'
    },
    {
        icon: Building2,
        title: 'Commercial Construction',
        description: 'Office buildings, retail spaces, and commercial complexes designed for functionality and aesthetic appeal.'
    },
    {
        icon: Hammer,
        title: 'Interior Renovation',
        description: 'Transform existing spaces with modern designs, quality materials, and expert craftsmanship.'
    },
    {
        icon: Wrench,
        title: 'Structural Repairs',
        description: 'Expert structural assessment and repair services to ensure safety and longevity of your buildings.'
    },
    {
        icon: CheckCircle2,
        title: 'Turnkey Projects',
        description: 'Complete end-to-end solutions from planning and design to construction and handover.'
    },
    {
        icon: Target,
        title: 'Project Management',
        description: 'Professional oversight ensuring projects are delivered on time, within budget, and to specification.'
    }
];

export default function ServicesSection() {
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
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div key={index} className={styles.serviceCard}>
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