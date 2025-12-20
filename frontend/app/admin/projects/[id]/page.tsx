"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import styles from './page.module.css';
import { projectService, Project } from '@/services';

export default function ProjectForm() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const isEdit = params.id !== 'new';

  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    location: '',
    description: '',
    status: 'Planning',
    image: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchProject();
    }
  }, [isEdit]);

  const fetchProject = async () => {
    try {
      setFetchLoading(true);
      const response = await projectService.getById(params.id);
      const project = response.data;

      setFormData({
        title: project.title || '',
        location: project.location || '',
        description: project.description || '',
        status: project.status || 'PLANNING',
        image: project.image || '',
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      });
    } catch (err: any) {
      console.error('Failed to fetch project:', err);
      setError('Failed to load project details');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await projectService.update(params.id, formData);
      } else {
        await projectService.create(formData as Project);
      }
      router.push('/admin/projects');
    } catch (err: any) {
      console.error('Failed to save project:', err);
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (fetchLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Loading...</h1>
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
        <Link href="/admin/projects" className={styles.backButton}>
          <ArrowLeft size={20} />
          Back to Projects
        </Link>
        <h1>{isEdit ? 'Edit Project' : 'Add New Project'}</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Project Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter project title"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Enter project location"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="PLANNING">Planning</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Enter project description"
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <Link href="/admin/projects" className={styles.cancelButton}>
            Cancel
          </Link>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Project' : 'Add Project')}
          </button>
        </div>
      </form>
    </div>
  );
}