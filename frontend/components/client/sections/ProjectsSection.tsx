'use client';

import { useEffect, useState } from 'react';
import styles from './ProjectsSection.module.css';
import { projectService, Project } from '@/services';

export default function ProjectsSection() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await projectService.getAll();
            // Filter only active projects and limit to 6 for display
            setProjects(response.data.slice(0, 6) || []);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section id="projects" className={styles.projectsSection}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Featured Projects</h2>
                        <div className={styles.sectionDivider}></div>
                        <p className={styles.sectionDescription}>Loading...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (projects.length === 0) {
        return null; // Don't show section if no projects
    }

    return (
        <section id="projects" className={styles.projectsSection}>
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Featured Projects</h2>
                    <div className={styles.sectionDivider}></div>
                    <p className={styles.sectionDescription}>
                        Explore our portfolio of successfully completed projects
                    </p>
                </div>
                <div className={styles.projectsGrid}>
                    {projects.map((project) => (
                        <div key={project._id} className={styles.projectCard}>
                            <div className={styles.projectImageWrapper}>
                                <img
                                    className={styles.projectImage}
                                    src={project.imageUrl || project.images?.[0] || 'https://images.unsplash.com/photo-1763189158851-a12144e779b5?w=400'}
                                    alt={project.title}
                                    width={500}
                                    height={500}
                                />
                                <div
                                    className={`${styles.projectStatus} ${styles[`status${project.status.replace(' ', '')}`]}`}>
                                    {project.status}
                                </div>
                            </div>
                            <div className={styles.projectContent}>
                                <h3>{project.title}</h3>
                                <p className={styles.projectLocation}>{project.location}</p>
                                <p className={styles.projectDescription}>{project.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}