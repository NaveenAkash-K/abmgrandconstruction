"use client";

import { useState } from 'react';
import { Save } from 'lucide-react';
import styles from './page.module.css';

export default function AboutAdmin() {
  const [formData, setFormData] = useState({
    description: 'ABM Grand Construction is a premier construction company dedicated to delivering exceptional quality and innovative solutions. With decades of experience, we\'ve built a reputation for excellence in residential, commercial, and industrial construction projects.',
    yearsExperience: '25+',
    completedProjects: '500+',
    locationsServed: '15+'
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to backend
    console.log('Saving about section:', formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>About Section</h1>
          <p>Manage your about section content</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="description">Company Description *</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            rows={5}
            placeholder="Enter company description"
          />
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="yearsExperience">Years of Experience *</label>
            <input
              type="text"
              id="yearsExperience"
              value={formData.yearsExperience}
              onChange={(e) => setFormData({...formData, yearsExperience: e.target.value})}
              required
              placeholder="e.g., 25+"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="completedProjects">Completed Projects *</label>
            <input
              type="text"
              id="completedProjects"
              value={formData.completedProjects}
              onChange={(e) => setFormData({...formData, completedProjects: e.target.value})}
              required
              placeholder="e.g., 500+"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="locationsServed">Locations Served *</label>
            <input
              type="text"
              id="locationsServed"
              value={formData.locationsServed}
              onChange={(e) => setFormData({...formData, locationsServed: e.target.value})}
              required
              placeholder="e.g., 15+"
            />
          </div>
        </div>

        <div className={styles.formActions}>
          {saved && <span className={styles.successMessage}>Changes saved successfully!</span>}
          <button type="submit" className={styles.saveButton}>
            <Save size={20} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}