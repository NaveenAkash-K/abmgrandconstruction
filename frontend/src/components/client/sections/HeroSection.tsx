import {ArrowRight} from 'lucide-react';
import styles from './HeroSection.module.css';

export default function HeroSection() {
    return (
        <section className={styles.heroSection} id={"home"}>
            <div className={styles.heroBackground}>
                <img
                    className={styles.heroImage}
                    src={"https://images.unsplash.com/photo-1763189158851-a12144e779b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwbW9kZXJuJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYzODk3NDE2fDA&ixlib=rb-4.1.0&q=80&w=1080"}
                    alt={"Construction site"} width={500} height={500}/>

                <div className={styles.heroOverlay}></div>
            </div>
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                    ABM GRAND CONSTRUCTION
                </h1>
                <p className={styles.heroSubtitle}>
                    Building Strong Foundations for Your Future.
                </p>
                <div className={styles.heroButtons}>
                    <a href="#projects" className={styles.btnPrimary}>
                        Our Projects
                        <ArrowRight className={styles.btnIcon}/>
                    </a>
                    <a href="#contact" className={styles.btnSecondary}>
                        Request a Quote
                        <ArrowRight className={styles.btnIcon}/>
                    </a>
                </div>
            </div>
        </section>
    );
}