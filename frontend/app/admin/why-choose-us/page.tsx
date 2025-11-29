"use client";

import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import styles from './page.module.css';

interface Reason {
    id: string;
    title: string;
    description: string;
    icon: string;
    order: number;
}

export default function WhyChooseUsAdmin() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingReason, setEditingReason] = useState<Reason | null>(null);
    const [reasons, setReasons] = useState<Reason[]>([
        {
            id: '1',
            title: 'Quality Work',
            description: 'We never compromise on quality. Every project is executed with precision and attention to detail.',
            icon: 'award',
            order: 1
        },
        {
            id: '2',
            title: 'On-Time Delivery',
            description: 'We understand the value of time. Our projects are delivered within agreed timelines, every time.',
            icon: 'clock',
            order: 2
        },
        {
            id: '3',
            title: 'Transparency',
            description: 'Clear communication and transparent processes ensure you\'re always informed about your project.',
            icon: 'check',
            order: 3
        },
        {
            id: '4',
            title: 'Reliable Workforce',
            description: 'Our skilled and experienced team brings professionalism and expertise to every project.',
            icon: 'users',
            order: 4
        },
        {
            id: '5',
            title: 'Safety Standards',
            description: 'We maintain the highest safety standards to protect our workers and ensure secure worksites.',
            icon: 'shield',
            order: 5
        },
        {
            id: '6',
            title: 'Client-Focused',
            description: 'Your vision is our mission. We work closely with you to bring your dream project to life.',
            icon: 'target',
            order: 6
        }
    ]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: 'award',
        order: reasons.length + 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingReason) {
            setReasons(reasons.map(r =>
                r.id === editingReason.id
                    ? { ...r, ...formData }
                    : r
            ));
        } else {
            const newReason: Reason = {
                id: Date.now().toString(),
                ...formData
            };
            setReasons([...reasons, newReason]);
        }
        handleCloseForm();
    };

    const handleEdit = (reason: Reason) => {
        setEditingReason(reason);
        setFormData({
            title: reason.title,
            description: reason.description,
            icon: reason.icon,
            order: reason.order
        });
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this reason?')) {
            setReasons(reasons.filter(r => r.id !== id));
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingReason(null);
        setFormData({
            title: '',
            description: '',
            icon: 'award',
            order: reasons.length + 1
        });
    };

    const filteredReasons = reasons.filter(reason =>
        reason.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reason.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedReasons = [...filteredReasons].sort((a, b) => a.order - b.order);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Why Choose Us</h1>
                    <p>Manage reasons why clients should choose your services</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className={styles.addButton}
                >
                    <Plus size={20} />
                    Add Reason
                </button>
            </div>

            <div className={styles.searchBar}>
                <Search className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search reasons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {showForm && (
                <div className={styles.modalOverlay} onClick={handleCloseForm}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{editingReason ? 'Edit Reason' : 'Add New Reason'}</h2>
                            <button
                                className={styles.closeButton}
                                onClick={handleCloseForm}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="title">Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    required
                                    placeholder="Enter reason title"
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="icon">Icon *</label>
                                    <select
                                        id="icon"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                        required
                                    >
                                        <option value="award">Award (Quality)</option>
                                        <option value="clock">Clock (Time)</option>
                                        <option value="check">Check Circle (Verification)</option>
                                        <option value="users">Users (Team)</option>
                                        <option value="shield">Shield (Safety)</option>
                                        <option value="target">Target (Focus)</option>
                                        <option value="hammer">Hammer (Work)</option>
                                        <option value="wrench">Wrench (Service)</option>
                                        <option value="building">Building (Structure)</option>
                                        <option value="home">Home (Residential)</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="order">Display Order *</label>
                                    <input
                                        type="number"
                                        id="order"
                                        value={formData.order}
                                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                                        required
                                        min="1"
                                        placeholder="Display order"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="description">Description *</label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    required
                                    rows={4}
                                    placeholder="Enter detailed description of this reason"
                                />
                            </div>

                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className={styles.cancelBtn}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitBtn}>
                                    {editingReason ? 'Update' : 'Add'} Reason
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className={styles.reasonsCount}>
                Showing {filteredReasons.length} of {reasons.length} reasons
            </div>

            <div className={styles.grid}>
                {sortedReasons.map((reason) => (
                    <div key={reason.id} className={styles.reasonCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}>
                                <span className={styles.iconBadge}>{reason.icon}</span>
                                <span className={styles.orderBadge}>#{reason.order}</span>
                            </div>
                            <div className={styles.actions}>
                                <button
                                    onClick={() => handleEdit(reason)}
                                    className={styles.editBtn}
                                    title="Edit reason"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(reason.id)}
                                    className={styles.deleteBtn}
                                    title="Delete reason"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <h3>{reason.title}</h3>
                        <p>{reason.description}</p>
                    </div>
                ))}
            </div>

            {sortedReasons.length === 0 && (
                <div className={styles.emptyState}>
                    <p>No reasons found. Add your first reason to get started.</p>
                </div>
            )}
        </div>
    );
}
