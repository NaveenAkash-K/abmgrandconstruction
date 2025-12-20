"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';
import { projectService, Project } from '@/services';

export default function ProjectsAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getAll();
      setProjects(response.data || []);
    } catch (err: any) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectService.delete(id);
      setProjects(projects.filter(p => p._id !== id));
    } catch (err: any) {
      alert('Failed to delete project: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Projects</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Projects</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Projects</h1>
          <p>Manage your portfolio projects</p>
        </div>
        <Link href="/admin/projects/new" className={styles.addButton}>
          <Plus size={20} />
          Add Project
        </Link>
      </div>

      <div className={styles.searchBar}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No projects found. Create your first project!</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Location</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project._id}>
                  <td>
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className={styles.projectImage}
                      />
                    ) : (
                      <div className={styles.noImage}>No Image</div>
                    )}
                  </td>
                  <td className={styles.titleCell}>{project.title}</td>
                  <td>{project.location}</td>
                  <td>
                    <span className={`${styles.status} ${styles[`status${project.status}`]}`}>
                      {project.status}
                    </span>
                  </td>
                  <td>{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`/admin/projects/${project._id}`}
                        className={styles.editButton}
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(project._id!)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}