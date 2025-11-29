"use client";

import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

interface Project {
  id: string;
  title: string;
  location: string;
  status: 'Completed' | 'In Progress' | 'Planning';
  image: string;
  createdAt: string;
}

export default function ProjectsAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects] = useState<Project[]>([
    {
      id: '1',
      title: 'Luxury Residential Complex',
      location: 'Downtown District',
      status: 'Completed',
      image: '/images/project1.jpg',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Corporate Office Tower',
      location: 'Business Park',
      status: 'In Progress',
      image: '/images/project2.jpg',
      createdAt: '2024-02-20'
    }
  ]);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <tr key={project.id}>
                <td>
                  <img
                    src={project.image}
                    alt={project.title}
                    className={styles.projectImage}
                  />
                </td>
                <td className={styles.titleCell}>{project.title}</td>
                <td>{project.location}</td>
                <td>
                  <span className={`${styles.status} ${styles[`status${project.status.replace(' ', '')}`]}`}>
                    {project.status}
                  </span>
                </td>
                <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className={styles.actions}>
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className={styles.editButton}
                    >
                      <Edit2 size={18} />
                    </Link>
                    <button className={styles.deleteButton}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}