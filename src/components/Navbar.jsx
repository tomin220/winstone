import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${navScrolled ? 'nav-scrolled' : 'nav-transparent'}`}>
      <div className="container nav-content">
        <a href="/" className="logo">
          <div className="logo-image-wrapper">
            <img src="/images/winstonelogo.jpg" alt="Winstone Logo" className="nav-logo-img" />
          </div>
          <div className="logo-text">
            <span className="winstone">WINSTONE.</span>
            <span className="projects">PROJECTS</span>
          </div>
        </a>
        <div className="nav-links">
          <a href="/">HOME</a>
          <a href="/projects">PROJECTS</a>
          <a href="/#about">ABOUT US</a>
          <a href="/#testimonials">TESTIMONIALS</a>
          <a href="/#awards">AWARDS</a>
          <a href="/#contact">CONTACT</a>
        </div>
        <a href="/#contact" className="btn-solid-gold" style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem', textDecoration: 'none' }}>Get Started</a>
      </div>
    </nav>
  );
};

export default Navbar;
