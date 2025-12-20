"use client";

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import styles from './page.module.css';
import { aboutService, About } from '@/services';

export default function AboutAdmin() {
  const [formData, setFormData] = useState<Partial<About>>({
    title: '',
    description: '',
    mission: '',
    vision: '',
    values: [],
    teamImage: '',
    yearsFounded: undefined
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // For displaying stats (calculated from yearsFounded)
  const [statsData, setStatsData] = useState({
    yearsExperience: '',
    completedProjects: '',
    locationsServed: ''
  });

  useEffect(() => {
    fetchAboutInfo();
  }, []);

  // Calculate years of experience from yearsFounded
  useEffect(() => {
    if (formData.yearsFounded) {
      const currentYear = new Date().getFullYear();
      const years = currentYear - formData.yearsFounded;
      setStatsData(prev => ({
        ...prev,
        yearsExperience: `${years}+`
      }));
    }
  }, [formData.yearsFounded]);

  const fetchAboutInfo = async () => {
    try {
      setLoading(true);
      const response = await aboutService.get();

      if (response.data) {
        setFormData({
          title: response.data.title || '',
          description: response.data.description || '',
          mission: response.data.mission || '',
          vision: response.data.vision || '',
          values: response.data.values || [],
          teamImage: response.data.teamImage || '',
          yearsFounded: response.data.yearsFounded || undefined
        });

        // Set stats data for display (these might come from backend or be calculated)
        const currentYear = new Date().getFullYear();
        const years = response.data.yearsFounded
          ? currentYear - response.data.yearsFounded
          : 0;

        setStatsData({
          yearsExperience: `${years}+`,
          completedProjects: '500+', // This could come from backend
          locationsServed: '15+' // This could come from backend
        });
      }
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch about info:', err);
      setError('Failed to load about information');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      await aboutService.update(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error('Failed to save about info:', err);
      setError(err.response?.data?.message || 'Failed to save about information');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(e.target.value);
    setFormData(prev => ({ ...prev, yearsFounded: year }));
  };

  const handleValuesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Split by newlines to create array of values
    const valuesArray = e.target.value.split('\n').filter(v => v.trim());
    setFormData(prev => ({ ...prev, values: valuesArray }));
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>About Section</h1>
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
          <h1>About Section</h1>
          <p>Manage your about section content</p>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Section Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., About ABM Grand Construction"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Company Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Enter company description"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="mission">Mission Statement</label>
          <textarea
            id="mission"
            name="mission"
            value={formData.mission}
            onChange={handleChange}
            rows={3}
            placeholder="Enter your company's mission statement (optional)"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="vision">Vision Statement</label>
          <textarea
            id="vision"
            name="vision"
            value={formData.vision}
            onChange={handleChange}
            rows={3}
            placeholder="Enter your company's vision statement (optional)"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="values">Company Values</label>
          <textarea
            id="values"
            value={formData.values?.join('\n')}
            onChange={handleValuesChange}
            rows={5}
            placeholder="Enter one value per line, e.g.:
Quality Excellence
Customer Satisfaction
Innovation"
          />
          <small className={styles.helpText}>Enter one value per line</small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="teamImage">Team Image URL</label>
          <input
            type="text"
            id="teamImage"
            name="teamImage"
            value={formData.teamImage}
            onChange={handleChange}
            placeholder="Enter team/office image URL (optional)"
          />
        </div>

        {formData.teamImage && (
          <div className={styles.imagePreview}>
            <label>Image Preview</label>
            <div className={styles.previewContainer}>
              <img src={formData.teamImage} alt="Team preview" />
            </div>
          </div>
        )}

        <div className={styles.statsSection}>
          <h3>Company Statistics</h3>
          <div className={styles.statsGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="yearsFounded">Year Founded *</label>
              <input
                type="number"
                id="yearsFounded"
                name="yearsFounded"
                value={formData.yearsFounded || ''}
                onChange={handleYearChange}
                required
                min="1900"
                max={new Date().getFullYear()}
                placeholder="e.g., 1999"
              />
              {statsData.yearsExperience && (
                <small className={styles.helpText}>
                  {statsData.yearsExperience} years of experience
                </small>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="completedProjects">Completed Projects Display</label>
              <input
                type="text"
                id="completedProjects"
                value={statsData.completedProjects}
                onChange={(e) => setStatsData({...statsData, completedProjects: e.target.value})}
                placeholder="e.g., 500+"
              />
              <small className={styles.helpText}>Display value (not stored in backend)</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="locationsServed">Locations Served Display</label>
              <input
                type="text"
                id="locationsServed"
                value={statsData.locationsServed}
                onChange={(e) => setStatsData({...statsData, locationsServed: e.target.value})}
                placeholder="e.g., 15+"
              />
              <small className={styles.helpText}>Display value (not stored in backend)</small>
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          {saved && <span className={styles.successMessage}>Changes saved successfully!</span>}
          <button
            type="submit"
            className={styles.saveButton}
            disabled={saving}
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}