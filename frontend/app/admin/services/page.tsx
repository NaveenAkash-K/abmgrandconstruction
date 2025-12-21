"use client";

import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Search, Upload, X } from 'lucide-react';
import styles from './page.module.css';
import { serviceService, Service, uploadService } from '@/services';
import {Checkbox} from "@radix-ui/themes";

export default function ServicesAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    icon: 'home',
    image: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await serviceService.getAll();
      setServices(response.data || []);
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch services:', err);
      setError('Failed to load services');
    } finally {
      setLoading(false);
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
      const response = await uploadService.uploadImage(file, 'services');

      if (response.success && response.data.url) {
        setFormData(prev => ({ ...prev, image: response.data.url, imageUrl: response.data.url }));
      }
    } catch (err: any) {
      console.error('Failed to upload image:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      if (editingService && editingService._id) {
        // Update existing service
        const response = await serviceService.update(editingService._id, formData);
        setServices(services.map(s =>
          s._id === editingService._id ? response.data : s
        ));
      } else {
        // Create new service
        const response = await serviceService.create(formData as Service);
        setServices([...services, response.data]);
      }

      // Reset form
      setShowForm(false);
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        icon: 'home',
        image: '',
        order: 0,
        isActive: true
      });
    } catch (err: any) {
      console.error('Failed to save service:', err);
      setError(err.response?.data?.message || 'Failed to save service');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      image: service.image || '',
      order: service.order || 0,
      isActive: service.isActive ?? true,
        imageUrl: service.imageUrl || '',
    });
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await serviceService.delete(id);
      setServices(services.filter(s => s._id !== id));
    } catch (err: any) {
      alert('Failed to delete service: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      icon: 'home',
      image: '',
      order: 0,
      isActive: true
    });
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Services</h1>
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
          <h1>Services</h1>
          <p>Manage construction services</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className={styles.addButton}
        >
          <Plus size={20} />
          Add Service
        </button>
      </div>

      <div className={styles.searchBar}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {showForm && (
        <div className={styles.formModal} onClick={handleCancel}>
          <form onSubmit={handleSubmit} className={styles.form} onClick={(e) => e.stopPropagation()}>
            <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <div className={styles.formGroup}>
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                placeholder="Enter service title"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                rows={3}
                placeholder="Enter service description"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Icon</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
              >
                <option value="home">Home</option>
                <option value="building">Building</option>
                <option value="hammer">Hammer</option>
                <option value="wrench">Wrench</option>
                <option value="check">Check Circle</option>
                <option value="target">Target</option>
                <option value="briefcase">Briefcase</option>
                <option value="tool">Tool</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Service Image</label>

              {!formData.imageUrl ? (
                <div
                  className={styles.uploadArea}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={48} />
                  <p>Click to upload service image</p>
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
                    alt="Service preview"
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

            <div className={styles.formGroup}>
              <label>Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                placeholder="Display order"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <Checkbox
                  color={"orange"}
                  size="3"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked === true})}
                />
                <span className={styles.checkboxText}>Active</span>
              </label>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelBtn}
                disabled={submitLoading || uploadingImage}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitLoading || uploadingImage}
              >
                {submitLoading ? 'Saving...' : (editingService ? 'Update' : 'Add')} Service
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredServices.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No services found. {searchTerm ? 'Try a different search.' : 'Create your first service!'}</p>
        </div>
      ) : (
        <div className={styles.flex}>
          {filteredServices.map((service) => (
            <div key={service._id} className={styles.serviceCard}>
              <div className={styles.serviceCardImage}>
                {service.imageUrl && (
                  <div className={styles.serviceImage}>
                    <img src={service.imageUrl} alt={service.title} />
                  </div>
                )}
              </div>
              <div className={styles.serviceCardContent}>
                <div className={styles.serviceHeader}>
                  <h3>{service.title}</h3>
                  <span className={`${styles.badge} ${service.isActive ? styles.active : styles.inactive}`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p>{service.description}</p>

                <div className={styles.serviceFooter}>
                  <span className={styles.iconBadge}>Icon: {service.icon}</span>
                  <span className={styles.orderBadge}>Order: {service.order || 0}</span>
                </div>
                <div className={styles.actions}>
                  <button onClick={() => handleEdit(service)} className={styles.editBtn}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(service._id!)} className={styles.deleteBtn}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}