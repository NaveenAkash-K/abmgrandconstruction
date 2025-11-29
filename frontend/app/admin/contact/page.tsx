"use client";

import { useState } from 'react';
import { Save, MapPin, Phone, Mail, Clock } from 'lucide-react';
import styles from './page.module.css';

export default function ContactAdmin() {
  const [formData, setFormData] = useState({
    address: '123 Construction Boulevard',
    city: 'Business District, NY 10001',
    country: 'United States',
    phone1: '+1 (555) 123-4567',
    phone2: '+1 (555) 987-6543',
    email1: 'info@abmgrand.com',
    email2: 'projects@abmgrand.com',
    businessHours: {
      weekdays: 'Monday - Friday: 8:00 AM - 6:00 PM',
      saturday: 'Saturday: 9:00 AM - 2:00 PM',
      sunday: 'Sunday: Closed'
    }
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to backend
    console.log('Saving contact info:', formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Contact Information</h1>
          <p>Manage your business contact details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <MapPin size={20} />
            <h2>Office Address</h2>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Street Address *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
                placeholder="Enter street address"
              />
            </div>
            <div className={styles.formGroup}>
              <label>City & ZIP *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                required
                placeholder="Enter city and ZIP code"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Country *</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                required
                placeholder="Enter country"
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Phone size={20} />
            <h2>Phone Numbers</h2>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Primary Phone *</label>
              <input
                type="tel"
                value={formData.phone1}
                onChange={(e) => setFormData({...formData, phone1: e.target.value})}
                required
                placeholder="Enter primary phone"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Secondary Phone</label>
              <input
                type="tel"
                value={formData.phone2}
                onChange={(e) => setFormData({...formData, phone2: e.target.value})}
                placeholder="Enter secondary phone (optional)"
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Mail size={20} />
            <h2>Email Addresses</h2>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Primary Email *</label>
              <input
                type="email"
                value={formData.email1}
                onChange={(e) => setFormData({...formData, email1: e.target.value})}
                required
                placeholder="Enter primary email"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Secondary Email</label>
              <input
                type="email"
                value={formData.email2}
                onChange={(e) => setFormData({...formData, email2: e.target.value})}
                placeholder="Enter secondary email (optional)"
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Clock size={20} />
            <h2>Business Hours</h2>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Weekdays *</label>
              <input
                type="text"
                value={formData.businessHours.weekdays}
                onChange={(e) => setFormData({
                  ...formData,
                  businessHours: {...formData.businessHours, weekdays: e.target.value}
                })}
                required
                placeholder="e.g., Monday - Friday: 9:00 AM - 6:00 PM"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Saturday *</label>
              <input
                type="text"
                value={formData.businessHours.saturday}
                onChange={(e) => setFormData({
                  ...formData,
                  businessHours: {...formData.businessHours, saturday: e.target.value}
                })}
                required
                placeholder="e.g., Saturday: 9:00 AM - 2:00 PM"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Sunday *</label>
              <input
                type="text"
                value={formData.businessHours.sunday}
                onChange={(e) => setFormData({
                  ...formData,
                  businessHours: {...formData.businessHours, sunday: e.target.value}
                })}
                required
                placeholder="e.g., Sunday: Closed"
              />
            </div>
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