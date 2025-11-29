import styles from './ProjectsSection.module.css';
import Image from "next/image";

const projects = [
    {
        title: 'Luxury Residential Complex',
        location: 'Downtown District',
        description: 'A premium residential development featuring 120 luxury apartments with modern amenities and sustainable design.',
        image: 'https://images.unsplash.com/photo-1759780020180-fa0def18ca65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXNpZGVudGlhbCUyMGJ1aWxkaW5nJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzYzODM5ODE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        status: 'Completed'
    },
    {
        title: 'Corporate Office Tower',
        location: 'Business Park, Zone A',
        description: 'A 12-story commercial building with state-of-the-art facilities and energy-efficient systems.',
        image: 'https://images.unsplash.com/photo-1758081564729-e563d96565ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzYzODQ2ODQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        status: 'Completed'
    },
    {
        title: 'Boutique Hotel Renovation',
        location: 'Historic District',
        description: 'Complete interior transformation of a heritage building into a luxury boutique hotel with 45 rooms.',
        image: 'https://images.unsplash.com/photo-1581784878214-8d5596b98a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NjM4NzI4ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        status: 'Completed'
    },
    {
        title: 'Tech Campus Development',
        location: 'Innovation Hub',
        description: 'A modern tech campus featuring collaborative workspaces, cafeterias, and recreational facilities.',
        image: 'https://images.unsplash.com/photo-1694702740570-0a31ee1525c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjM4MzEzMjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        status: 'In Progress'
    },
    {
        title: 'Industrial Warehouse',
        location: 'Logistics Zone',
        description: 'Construction of a 50,000 sq ft warehouse with advanced logistics and storage solutions.',
        image: 'https://images.unsplash.com/photo-1634231647709-06609f7dd3ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXJzJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYzODk3NDE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        status: 'In Progress'
    },
    {
        title: 'Mixed-Use Development',
        location: 'Waterfront Area',
        description: 'An ambitious project combining residential, commercial, and retail spaces in a prime location.',
        image: 'https://images.unsplash.com/photo-1763189158851-a12144e779b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwbW9kZXJuJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYzODk3NDE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        status: 'Planning'
    }
];

export default function ProjectsSection() {
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
                    {projects.map((project, index) => (
                        <div key={index} className={styles.projectCard}>
                            <div className={styles.projectImageWrapper}>
                                <img className={styles.projectImage} src={project.image} alt={project.title} width={500} height={500}/>
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