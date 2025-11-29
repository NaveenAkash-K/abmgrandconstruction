"use client";

import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import styles from './page.module.css';

interface Client {
  id: string;
  name: string;
  logo?: string;
  active: boolean;
}

export default function ClientsAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'COMPANY A', active: true },
    { id: '2', name: 'COMPANY B', active: true },
    { id: '3', name: 'COMPANY C', active: true },
    { id: '4', name: 'COMPANY D', active: false },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      setClients(clients.map(c =>
        c.id === editingClient.id ? { ...c, ...formData } : c
      ));
    } else {
      setClients([...clients, {
        id: Date.now().toString(),
        ...formData
      }]);
    }
    setShowForm(false);
    setEditingClient(null);
    setFormData({ name: '', logo: '', active: true });
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      logo: client.logo || '',
      active: client.active
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className={styles.formModal}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2>{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
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
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                />
                Active Client
              </label>
            </div>
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingClient(null);
                }}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn}>
                {editingClient ? 'Update' : 'Add'} Client
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.grid}>
        {filteredClients.map((client) => (
          <div key={client.id} className={styles.clientCard}>
            <div className={styles.clientInfo}>
              <h3>{client.name}</h3>
              <span className={`${styles.status} ${client.active ? styles.active : styles.inactive}`}>
                {client.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className={styles.actions}>
              <button onClick={() => handleEdit(client)} className={styles.editBtn}>
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(client.id)} className={styles.deleteBtn}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}