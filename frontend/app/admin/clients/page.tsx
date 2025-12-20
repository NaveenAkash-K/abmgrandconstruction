"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import styles from './page.module.css';
import { clientService, Client } from '@/services';

export default function ClientsAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    logo: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientService.getAll();
      setClients(response.data || []);
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch clients:', err);
      setError('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      if (editingClient && editingClient._id) {
        // Update existing client
        const response = await clientService.update(editingClient._id, formData);
        setClients(clients.map(c =>
          c._id === editingClient._id ? response.data : c
        ));
      } else {
        // Create new client
        const response = await clientService.create(formData as Client);
        setClients([...clients, response.data]);
      }

      // Reset form
      setShowForm(false);
      setEditingClient(null);
      setFormData({
        name: '',
        logo: '',
        order: 0,
        isActive: true
      });
    } catch (err: any) {
      console.error('Failed to save client:', err);
      setError(err.response?.data?.message || 'Failed to save client');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      logo: client.logo || '',
      order: client.order || 0,
      isActive: client.isActive ?? true
    });
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) {
      return;
    }

    try {
      await clientService.delete(id);
      setClients(clients.filter(c => c._id !== id));
    } catch (err: any) {
      alert('Failed to delete client: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingClient(null);
    setFormData({
      name: '',
      logo: '',
      order: 0,
      isActive: true
    });
    setError('');
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Clients</h1>
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
          <h1>Clients</h1>
          <p>Manage your client list</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className={styles.addButton}
        >
          <Plus size={20} />
          Add Client
        </button>
      </div>

      <div className={styles.searchBar}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {showForm && (
        <div className={styles.formModal} onClick={handleCancel}>
          <div onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <h2>{editingClient ? 'Edit Client' : 'Add New Client'}</h2>

              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Company Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Enter company name"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Logo URL</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => setFormData({...formData, logo: e.target.value})}
                  placeholder="Enter logo URL (optional)"
                />
              </div>

              {formData.logo && (
                <div className={styles.logoPreview}>
                  <label>Logo Preview</label>
                  <div className={styles.previewImage}>
                    <img src={formData.logo} alt="Logo preview" />
                  </div>
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Display Order</label>
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
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  Active Client
                </label>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={handleCancel}
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
                  {submitLoading ? 'Saving...' : (editingClient ? 'Update' : 'Add')} Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filteredClients.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No clients found. {searchTerm ? 'Try a different search.' : 'Add your first client!'}</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredClients.map((client) => (
            <div key={client._id} className={styles.clientCard}>
              {client.logo && (
                <div className={styles.clientLogo}>
                  <img src={client.logo} alt={client.name} />
                </div>
              )}
              <div className={styles.clientInfo}>
                <h3>{client.name}</h3>
                <span className={`${styles.status} ${client.isActive ? styles.active : styles.inactive}`}>
                  {client.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className={styles.clientMeta}>
                <span className={styles.orderBadge}>Order: {client.order || 0}</span>
              </div>
              <div className={styles.actions}>
                <button onClick={() => handleEdit(client)} className={styles.editBtn}>
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(client._id!)} className={styles.deleteBtn}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}