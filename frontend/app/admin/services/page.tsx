"use client";

import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import styles from './page.module.css';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string
  active: boolean;
}

export default function ServicesAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      title: 'Residential Construction',
      description: 'Custom homes, renovations, and residential developments',
      icon: 'home',
      active: true
    },
    {
      id: '2',
      title: 'Commercial Construction',
      description: 'Office buildings, retail spaces, and commercial complexes',
      icon: 'building',
      active: true
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'home',
    active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      setServices(services.map(s =>
        s.id === editingService.id ? { ...s, ...formData } : s
      ));
    } else {
      setServices([...services, {
        id: Date.now().toString(),
        ...formData
      }]);
    }
    setShowForm(false);
    setEditingService(null);
    setFormData({ title: '', description: '', icon: 'home', active: true });
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      active: service.active
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className={styles.formModal}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
            <div className={styles.formGroup}>
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                rows={3}
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
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                />
                Active
              </label>
            </div>
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingService(null);
                }}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn}>
                {editingService ? 'Update' : 'Add'} Service
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.grid}>
        {filteredServices.map((service) => (
          <div key={service.id} className={styles.serviceCard}>
            <div className={styles.serviceHeader}>
              <h3>{service.title}</h3>
              <span className={`${styles.badge} ${service.active ? styles.active : styles.inactive}`}>
                {service.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p>{service.description}</p>
            <div className={styles.actions}>
              <button onClick={() => handleEdit(service)} className={styles.editBtn}>
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(service.id)} className={styles.deleteBtn}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}