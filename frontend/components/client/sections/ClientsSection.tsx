'use client';

import { useEffect, useState } from 'react';
import styles from './ClientsSection.module.css';
import { clientService, Client } from '@/services';

export default function ClientsSection() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await clientService.getAll();
            // Filter only active clients and sort by order
            const activeClients = (response.data || [])
                .filter((client: Client) => client.isActive)
                .sort((a: Client, b: Client) => (a.order || 0) - (b.order || 0));
            setClients(activeClients);
        } catch (error) {
            console.error('Failed to fetch clients:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className={styles.clientsSection}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Our Clients</h2>
                        <div className={styles.sectionDivider}></div>
                        <p className={styles.sectionDescription}>Loading...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (clients.length === 0) {
        return null; // Don't show section if no clients
    }

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
                    {clients.map((client) => (
                        <div key={client._id} className={styles.clientCard}>
                            {client.logo ? (
                                <img src={client.logo} alt={client.name} className={styles.clientLogo} />
                            ) : (
                                <span>{client.name}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}