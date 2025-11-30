import styles from './ClientsSection.module.css';

const clients = ['COMPANY A', 'COMPANY B', 'COMPANY C', 'COMPANY D', 'COMPANY E', 'COMPANY F', 'COMPANY G', 'COMPANY H'];

export default function ClientsSection() {
    return (
        <section className={styles.clientsSection}>
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Our Clients</h2>
                    <div className={styles.sectionDivider}></div>
                    <p className={styles.sectionDescription}>
                        Trusted by leading developers and businesses
                    </p>
                </div>
                <div className={styles.clientsGrid}>
                    {clients.map((company, index) => (
                        <div key={index} className={styles.clientCard}>
                            <span>{company}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}