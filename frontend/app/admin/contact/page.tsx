"use client";

import { useState, useEffect } from 'react';
import { Save, MapPin, Phone, Mail, Clock } from 'lucide-react';
import styles from './page.module.css';
import { contactService, ContactInfo } from '@/services';

export default function ContactAdmin() {
  const [formData, setFormData] = useState<Partial<ContactInfo>>({
    streetAddress: '',
    cityAndZip: '',
    country: '',
    primaryPhone: '',
    secondaryPhone: '',
    primaryEmail: '',
    secondaryEmail: '',
    businessHoursWeekdays: '',
    businessHoursSaturday: '',
    businessHoursSunday: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const response = await contactService.getInfo();

      if (response.data) {
        setFormData({
          streetAddress: response.data.streetAddress || '',
          cityAndZip: response.data.cityAndZip || '',
          country: response.data.country || '',
          primaryPhone: response.data.primaryPhone || '',
          secondaryPhone: response.data.secondaryPhone || '',
          primaryEmail: response.data.primaryEmail || '',
          secondaryEmail: response.data.secondaryEmail || '',
          businessHoursWeekdays: response.data.businessHoursWeekdays || '',
          businessHoursSaturday: response.data.businessHoursSaturday || '',
          businessHoursSunday: response.data.businessHoursSunday || ''
        });
      }
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch contact info:', err);
      setError('Failed to load contact information');
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
      await contactService.updateInfo(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error('Failed to save contact info:', err);
      setError(err.response?.data?.message || 'Failed to save contact information');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Contact Information</h1>
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
          <h1>Contact Information</h1>
          <p>Manage your business contact details</p>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <MapPin size={20} />
            <h2>Office Address</h2>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="streetAddress">Street Address *</label>
              <input
                type="text"
                id="streetAddress"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                required
                placeholder="Enter street address"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cityAndZip">City & ZIP *</label>
              <input
                type="text"
                id="cityAndZip"
                name="cityAndZip"
                value={formData.cityAndZip}
                onChange={handleChange}
                required
                placeholder="Enter city and ZIP code"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="country">Country *</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
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
              <label htmlFor="primaryPhone">Primary Phone *</label>
              <input
                type="tel"
                id="primaryPhone"
                name="primaryPhone"
                value={formData.primaryPhone}
                onChange={handleChange}
                required
                placeholder="Enter primary phone"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="secondaryPhone">Secondary Phone</label>
              <input
                type="tel"
                id="secondaryPhone"
                name="secondaryPhone"
                value={formData.secondaryPhone}
                onChange={handleChange}
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
              <label htmlFor="primaryEmail">Primary Email *</label>
              <input
                type="email"
                id="primaryEmail"
                name="primaryEmail"
                value={formData.primaryEmail}
                onChange={handleChange}
                required
                placeholder="Enter primary email"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="secondaryEmail">Secondary Email</label>
              <input
                type="email"
                id="secondaryEmail"
                name="secondaryEmail"
                value={formData.secondaryEmail}
                onChange={handleChange}
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
              <label htmlFor="businessHoursWeekdays">Weekdays *</label>
              <input
                type="text"
                id="businessHoursWeekdays"
                name="businessHoursWeekdays"
                value={formData.businessHoursWeekdays}
                onChange={handleChange}
                required
                placeholder="e.g., Monday - Friday: 9:00 AM - 6:00 PM"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="businessHoursSaturday">Saturday *</label>
              <input
                type="text"
                id="businessHoursSaturday"
                name="businessHoursSaturday"
                value={formData.businessHoursSaturday}
                onChange={handleChange}
                required
                placeholder="e.g., Saturday: 9:00 AM - 2:00 PM"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="businessHoursSunday">Sunday *</label>
              <input
                type="text"
                id="businessHoursSunday"
                name="businessHoursSunday"
                value={formData.businessHoursSunday}
                onChange={handleChange}
                required
                placeholder="e.g., Sunday: Closed"
              />
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