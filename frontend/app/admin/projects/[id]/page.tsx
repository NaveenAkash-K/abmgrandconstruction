"use client";

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import styles from './page.module.css';
import { projectService, Project, uploadService } from '@/services';

export default function ProjectForm() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const isEdit = params.id !== 'new';
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [uploadingImage, setUploadingImage] = useState(false);
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
          imageUrl: project.imageUrl || '',
      });
    } catch (err: any) {
      console.error('Failed to fetch project:', err);
      setError('Failed to load project details');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      setError('');
      const response = await uploadService.uploadImage(file, 'projects');

      if (response.success && response.data.url) {
        setFormData(prev => ({ ...prev, imageUrl: response.data.url }));
      }
    } catch (err: any) {
      console.error('Failed to upload image:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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



          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
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

          {/*<div className={`${styles.formGroup} ${styles.fullWidth}`}>*/}
          {/*  <label htmlFor="description">Description</label>*/}
          {/*  <textarea*/}
          {/*    id="description"*/}
          {/*    name="description"*/}
          {/*    value={formData.description}*/}
          {/*    onChange={handleChange}*/}
          {/*    rows={4}*/}
          {/*    placeholder="Enter project description"*/}
          {/*  />*/}
          {/*</div>*/}

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Project Image</label>

            {!formData.imageUrl ? (
              <div
                className={styles.uploadArea}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={48} />
                <p>Click to upload project image</p>
                <span>PNG, JPG, JPEG up to 5MB</span>
                {uploadingImage && (
                  <div className={styles.uploadProgress}>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mt-4"></div>
                    <p className={styles.uploadingText}>Uploading...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.imagePreview}>
                <img
                  src={formData.imageUrl}
                  alt="Project preview"
                  className={styles.previewImage}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className={styles.removeButton}
                  disabled={uploadingImage}
                >
                  <X size={20} />
                  Remove Image
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.fileInput}
              disabled={uploadingImage}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <Link href="/admin/projects" className={styles.cancelButton}>
            Cancel
          </Link>
          <button type="submit" className={styles.submitButton} disabled={loading || uploadingImage}>
            {loading ? 'Saving...' : (isEdit ? 'Update Project' : 'Add Project')}
          </button>
        </div>
      </form>
    </div>
  );
}