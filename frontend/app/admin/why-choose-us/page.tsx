"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import styles from './page.module.css';
import { whyChooseUsService, WhyChooseUs } from '@/services';

export default function WhyChooseUsAdmin() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingReason, setEditingReason] = useState<WhyChooseUs | null>(null);
    const [reasons, setReasons] = useState<WhyChooseUs[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<Partial<WhyChooseUs>>({
        title: '',
        description: '',
        icon: 'award',
        order: 0,
        isActive: true
    });

    useEffect(() => {
        fetchReasons();
    }, []);

    const fetchReasons = async () => {
        try {
            setLoading(true);
            const response = await whyChooseUsService.getAll();
            setReasons(response.data || []);
            setError('');
        } catch (err: any) {
            console.error('Failed to fetch reasons:', err);
            setError('Failed to load reasons');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);
        setError('');

        try {
            if (editingReason && editingReason._id) {
                // Update existing reason
                const response = await whyChooseUsService.update(editingReason._id, formData);
                setReasons(reasons.map(r =>
                    r._id === editingReason._id ? response.data : r
                ));
            } else {
                // Create new reason
                const response = await whyChooseUsService.create(formData as WhyChooseUs);
                setReasons([...reasons, response.data]);
            }

            handleCloseForm();
        } catch (err: any) {
            console.error('Failed to save reason:', err);
            setError(err.response?.data?.message || 'Failed to save reason');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEdit = (reason: WhyChooseUs) => {
        setEditingReason(reason);
        setFormData({
            title: reason.title,
            description: reason.description,
            icon: reason.icon,
            order: reason.order || 0,
            isActive: reason.isActive ?? true
        });
        setShowForm(true);
        setError('');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this reason?')) {
            return;
        }

        try {
            await whyChooseUsService.delete(id);
            setReasons(reasons.filter(r => r._id !== id));
        } catch (err: any) {
            alert('Failed to delete reason: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingReason(null);
        setFormData({
            title: '',
            description: '',
            icon: 'award',
            order: reasons.length,
            isActive: true
        });
        setError('');
    };

    const filteredReasons = reasons.filter(reason =>
        reason.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reason.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedReasons = [...filteredReasons].sort((a, b) =>
        (a.order || 0) - (b.order || 0)
    );

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Why Choose Us</h1>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

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
                                type="button"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {error && (
                                <div className={styles.errorMessage}>
                                    {error}
                                </div>
                            )}

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
                                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                                        required
                                        min="0"
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

                            <div className={styles.formGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                    />
                                    Active
                                </label>
                            </div>

                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className={styles.cancelBtn}
                                    disabled={submitLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={styles.submitBtn}
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? 'Saving...' : (editingReason ? 'Update' : 'Add')} Reason
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className={styles.reasonsCount}>
                Showing {filteredReasons.length} of {reasons.length} reasons
            </div>

            {sortedReasons.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No reasons found. {searchTerm ? 'Try a different search.' : 'Add your first reason to get started.'}</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {sortedReasons.map((reason) => (
                        <div key={reason._id} className={styles.reasonCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconWrapper}>
                                    <span className={styles.iconBadge}>{reason.icon}</span>
                                    <span className={styles.orderBadge}>#{reason.order || 0}</span>
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
                                        onClick={() => handleDelete(reason._id!)}
                                        className={styles.deleteBtn}
                                        title="Delete reason"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3>{reason.title}</h3>
                            <p>{reason.description}</p>
                            {!reason.isActive && (
                                <div className={styles.inactiveBadge}>
                                    Inactive
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
