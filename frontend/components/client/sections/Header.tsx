"use client";

import React, { useState, useEffect } from 'react';
import { Building2, Menu, X } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const href = e.currentTarget.getAttribute('href');
        if (href?.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                const offset = 80; // Height of fixed header
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                });
            }
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
            <div className={styles.headerContainer}>
                <div className={styles.logo}>
                    <Building2 className={styles.logoIcon} />
                    <span>ABM GRAND CONSTRUCTION</span>
                </div>

                <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navMobileOpen : ''}`}>
                    <a href="#home" onClick={handleNavClick}>Home</a>
                    <a href="#about" onClick={handleNavClick}>About</a>
                    <a href="#services" onClick={handleNavClick}>Services</a>
                    <a href="#projects" onClick={handleNavClick}>Projects</a>
                    <a href="#contact" onClick={handleNavClick}>Contact</a>
                </nav>

                <button className={styles.mobileMenuToggle} onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>
        </header>
    );
}