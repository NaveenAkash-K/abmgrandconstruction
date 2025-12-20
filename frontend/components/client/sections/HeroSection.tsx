'use client';

import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './HeroSection.module.css';

const heroImages = [
    {
        url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&q=80',
        alt: 'Modern Construction Site'
    },
    {
        url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&q=80',
        alt: 'Building Architecture'
    },
    {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80',
        alt: 'Commercial Building'
    },
    {
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80',
        alt: 'Construction Workers'
    },
    {
        url: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=1920&q=80',
        alt: 'Residential Construction'
    }
];

export default function HeroSection() {
    const [currentImage, setCurrentImage] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-advance slides
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroImages.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToSlide = (index: number) => {
        setCurrentImage(index);
        setIsAutoPlaying(false);
        // Resume auto-play after 10 seconds
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const goToPrevious = () => {
        setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const goToNext = () => {
        setCurrentImage((prev) => (prev + 1) % heroImages.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    return (
        <section className={styles.heroSection} id="home">
            <div className={styles.heroBackground}>
                {/* Image Slides */}
                {heroImages.map((image, index) => (
                    <div
                        key={index}
                        className={`${styles.heroSlide} ${
                            index === currentImage ? styles.heroSlideActive : ''
                        }`}
                    >
                        <img
                            className={styles.heroImage}
                            src={image.url}
                            alt={image.alt}
                            loading={index === 0 ? 'eager' : 'lazy'}
                        />
                    </div>
                ))}
                <div className={styles.heroOverlay}></div>
            </div>

            {/* Navigation Arrows */}
            <button
                className={`${styles.navButton} ${styles.navButtonLeft}`}
                onClick={goToPrevious}
                aria-label="Previous slide"
            >
                <ChevronLeft size={32} />
            </button>
            <button
                className={`${styles.navButton} ${styles.navButtonRight}`}
                onClick={goToNext}
                aria-label="Next slide"
            >
                <ChevronRight size={32} />
            </button>

            {/* Content */}
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>ABM GRAND CONSTRUCTION</h1>
                <p className={styles.heroSubtitle}>
                    Building Strong Foundations for Your Future.
                </p>
                <div className={styles.heroButtons}>
                    <a href="#projects" className={styles.btnPrimary}>
                        Our Projects
                        <ArrowRight className={styles.btnIcon} />
                    </a>
                    <a href="#contact" className={styles.btnSecondary}>
                        Request a Quote
                        <ArrowRight className={styles.btnIcon} />
                    </a>
                </div>

                {/* Slide Indicators */}
                <div className={styles.slideIndicators}>
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.indicator} ${
                                index === currentImage ? styles.indicatorActive : ''
                            }`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}