import { Award, Clock, CheckCircle2, Users, Shield, Target } from 'lucide-react';
import styles from './WhyChooseUsSection.module.css';

const reasons = [
    {
        icon: Award,
        title: 'Quality Work',
        description: 'We never compromise on quality. Every project is executed with precision and attention to detail.'
    },
    {
        icon: Clock,
        title: 'On-Time Delivery',
        description: 'We understand the value of time. Our projects are delivered within agreed timelines, every time.'
    },
    {
        icon: CheckCircle2,
        title: 'Transparency',
        description: 'Clear communication and transparent processes ensure you\'re always informed about your project.'
    },
    {
        icon: Users,
        title: 'Reliable Workforce',
        description: 'Our skilled and experienced team brings professionalism and expertise to every project.'
    },
    {
        icon: Shield,
        title: 'Safety Standards',
        description: 'We maintain the highest safety standards to protect our workers and ensure secure worksites.'
    },
    {
        icon: Target,
        title: 'Client-Focused',
        description: 'Your vision is our mission. We work closely with you to bring your dream project to life.'
    }
];

export default function WhyChooseUsSection() {
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
                    {reasons.map((reason, index) => {
                        const Icon = reason.icon;
                        return (
                            <div key={index} className={styles.reasonCard}>
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