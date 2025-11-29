"use client";

import { useState } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import styles from './page.module.css';

export default function ProjectForm() {
  const router = useRouter();
    const params = useParams<{ id: string }>();
    const isEdit = params.id !== 'new';

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    status: 'Planning',
    image: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    router.push('/admin/projects');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/admin/projects" className={styles.backButton}>
          <ArrowLeft size={20} />
          Back to Projects
        </Link>
        <h1>{isEdit ? 'Edit Project' : 'Add New Project'}</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Project Title *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              placeholder="Enter project title"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
              placeholder="Enter project location"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              required
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows={4}
              placeholder="Enter project description"
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="image">Project Image</label>
            <div className={styles.uploadArea}>
              <Upload size={32} />
              <p>Click to upload or drag and drop</p>
              <span>PNG, JPG up to 10MB</span>
              <input
                type="file"
                id="image"
                accept="image/*"
                className={styles.fileInput}
              />
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <Link href="/admin/projects" className={styles.cancelButton}>
            Cancel
          </Link>
          <button type="submit" className={styles.submitButton}>
            {isEdit ? 'Update Project' : 'Add Project'}
          </button>
        </div>
      </form>
    </div>
  );
}