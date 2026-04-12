import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Award, Building2, Map, Users, ChevronDown } from 'lucide-react';
import { PROJECTS } from '../data/projects';
import { supabase } from '../lib/supabase';
import { GlowCard } from '../components/GlowCard';
import { ShimmerText } from '../components/ShimmerText';
import { BorderBeam } from '../components/BorderBeam';
import './Home.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const heroChild = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

/* ── Home Featured Projects — first 6 from shared data ── */
const HFP_PROJECTS = PROJECTS.slice(0, 6);

/* ── Featured Slideshow Component ── */
/* ── 3D Card Stack Carousel ── */
function FeaturedSlideshow({ projects, onNavigate }) {
  const [active, setActive] = useState(0);
  const total = projects.length;

  const prev = () => setActive(i => (i - 1 + total) % total);
  const next = () => setActive(i => (i + 1) % total);

  // Compute position relative to active: -2, -1, 0, 1, 2
  const getPos = (i) => {
    let d = i - active;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  };

  const getStyle = (pos) => {
    const abs = Math.abs(pos);
    if (abs > 2) return null; // hide far cards
    const x = pos * 280;
    const scale = pos === 0 ? 1 : pos === 1 || pos === -1 ? 0.82 : 0.66;
    const z = pos === 0 ? 0 : abs === 1 ? -80 : -160;
    const opacity = pos === 0 ? 1 : abs === 1 ? 0.7 : 0.4;
    const rotateY = pos * -12;
    return { x, scale, z, opacity, rotateY };
  };

  const p = projects[active];

  return (
    <div className="csc-wrap">
      {/* 3D card stack */}
      <div className="csc-stage">
        {projects.map((proj, i) => {
          const pos = getPos(i);
          const style = getStyle(pos);
          if (!style) return null;
          const isActive = pos === 0;

          return (
            <motion.div
              key={proj.id}
              className={`csc-card${isActive ? ' csc-card--active' : ''}`}
              animate={{
                x: style.x,
                scale: style.scale,
                z: style.z,
                opacity: style.opacity,
                rotateY: style.rotateY,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              onClick={() => !isActive && setActive(i)}
              style={{ cursor: isActive ? 'default' : 'pointer', zIndex: 10 - Math.abs(pos) }}
            >
              {/* Image */}
              <div className="csc-card-img">
                {proj.image
                  ? <img src={proj.image} alt={proj.name} className="csc-img" />
                  : <div className="csc-img-placeholder" />
                }
                <div className="csc-img-overlay" />
                <span className="csc-type-badge">{proj.type}</span>
              </div>

              {/* Info — only fully visible on active */}
              {isActive && (
                <AnimatePresence>
                  <motion.div
                    className="csc-card-body"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <div className="csc-meta">
                      <span className="csc-year">{proj.year}</span>
                      <span className="csc-sep">•</span>
                      <span className={`csc-status csc-status--${proj.tag.toLowerCase()}`}>{proj.tag}</span>
                    </div>
                    <h2 className="csc-title">{proj.name.toUpperCase()}</h2>
                    <p className="csc-desc">{proj.description}</p>
                    <ul className="csc-highlights">
                      {proj.highlights.slice(0, 4).map((h, j) => (
                        <li key={j}><span className="csc-bullet" />{h}</li>
                      ))}
                    </ul>
                    <button className="csc-cta" onClick={() => onNavigate('/projects')}>
                      View All Projects
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="csc-controls">
        <button className="csc-arrow" onClick={prev} aria-label="Previous">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        <div className="csc-dots">
          {projects.map((_, i) => (
            <button
              key={i}
              className={`csc-dot${i === active ? ' csc-dot--active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Go to ${i + 1}`}
            />
          ))}
        </div>

        <button className="csc-arrow" onClick={next} aria-label="Next">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
}

const Home = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  const showEnquiryToast = (e) => {
    e.preventDefault();
    setToast(true);
    setTimeout(() => setToast(false), 3500);
    // scroll to form
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Contact form state
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle'); // idle | loading | success | error

  const handleFormChange = (field, value) => setFormData(f => ({ ...f, [field]: value }));

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
      return;
    }
    setFormStatus('loading');
    const { error } = await supabase.from('enquiries').insert([{
      name: formData.name,
      email: formData.email,
      company: formData.company,
      message: formData.message,
    }]);
    if (error) {
      console.error('Supabase error:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    } else {
      setFormStatus('success');
      setFormData({ name: '', email: '', company: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 4000);
    }
  };

  return (
    <div className="home-page">
      {/* Enquiry toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="enquiry-toast"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Please fill the enquiry form to get in touch with us.
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hero Section */}
      <section className="hero-section" ref={heroRef}>
        <video 
          className="hero-video-bg" 
          autoPlay 
          muted 
          loop 
          playsInline 
          poster="/images/hero_bg_1775634365214.png"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        
        <div className="hero-overlay"></div>
        <div className="hero-aurora"></div>
        
        <motion.div 
          className="hero-content"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ y: heroY }}
        >
          <motion.div className="hero-subtitle" variants={heroChild}>
            <span className="gold-star">✦</span> SINCE 2018 - LUXURY REAL ESTATE DEVELOPMENT
          </motion.div>
          
          <motion.h1 className="hero-main-title" variants={heroChild}>
            <span className="serif-text">Winstone</span><br />
            <span className="bold-sans-text text-gold"><ShimmerText>Projects</ShimmerText></span>
          </motion.h1>
          
          <motion.div className="decorative-divider" variants={heroChild} style={{ margin: '0 auto 1.5rem' }}>
            <div className="line-seg"></div>
            <div className="line-dot"></div>
            <div className="line-seg"></div>
          </motion.div>

          <motion.h3 className="hero-dev-text" variants={heroChild}>
            Premium Real Estate Developers
          </motion.h3>

          <motion.p className="hero-desc" variants={heroChild}>
            "Where architectural dreams meet reality, creating spaces that inspire and endure."
          </motion.p>
          
          <motion.p className="hero-market" variants={heroChild}>
            India & UAE Markets
          </motion.p>

          <motion.div 
            className="hero-actions" 
            variants={heroChild}
          >
            <motion.button 
              className="btn-solid-gold" 
              onClick={() => navigate('/projects')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects &rarr;
            </motion.button>
            <motion.button 
              className="btn-outline-glass"
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else window.location.hash = '#contact';
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get in Touch <ChevronDown size={14} style={{ marginLeft: '4px' }} />
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Section Divider: Hero → Impact */}
      <div className="section-divider">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 L1440,0 L1440,60 L0,20 Z" fill="#111827"/>
        </svg>
      </div>

      {/* Ticker strip */}
      <div className="ticker-strip">
        <div className="ticker-track">
          {[
            'Luxury Real Estate', 'UAE & India', 'Premium Developments', 'Est. 2018',
            'Award Winning', 'Global Reach', 'Iconic Spaces', '3 Group Companies',
            'Luxury Real Estate', 'UAE & India', 'Premium Developments', 'Est. 2018',
            'Award Winning', 'Global Reach', 'Iconic Spaces', '3 Group Companies',
          ].map((item, i) => (
            <span key={i} className="ticker-item">
              {item}
              <span className="ticker-sep" />
            </span>
          ))}
        </div>
      </div>

      {/* Global Impact Section */}
      <section className="impact-section">
        <div className="container">
          <motion.div 
            className="impact-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="impact-pill">IMPACT</div>
            <h2 className="impact-title">Global <span className="text-gold">Impact</span></h2>
            <div className="decorative-divider centered">
              <div className="line-seg"></div>
              <div className="line-dot"></div>
              <div className="line-seg"></div>
            </div>
            <p className="impact-subtitle">Transforming industries and creating value across multiple sectors.</p>
          </motion.div>

          <div className="impact-grid-new">
            <motion.div className="impact-item-new" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <GlowCard className="impact-glow-wrap">
                <span className="impact-icon-badge">✦</span>
                <h4>Since 2018</h4>
                <p>Years of Excellence</p>
              </GlowCard>
            </motion.div>
            
            <motion.div className="impact-item-new" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <GlowCard className="impact-glow-wrap">
                <span className="impact-icon-badge">◈</span>
                <h4>UAE & India</h4>
                <p>Active Markets</p>
              </GlowCard>
            </motion.div>

            <motion.div className="impact-item-new" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <GlowCard className="impact-glow-wrap">
                <span className="impact-icon-badge">⬡</span>
                <h4>3 Ventures</h4>
                <p>Group Companies</p>
              </GlowCard>
            </motion.div>

            <motion.div className="impact-item-new" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <GlowCard className="impact-glow-wrap">
                <span className="impact-icon-badge">◎</span>
                <h4>Global Reach</h4>
                <p>Multi-Country Operations</p>
              </GlowCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="premium-partners-section">
        <div className="container">
          <motion.div 
            className="partners-header"
            variants={fadeUp} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
          >
            <div className="subtitle-pill-gold">STRATEGIC PARTNERSHIPS</div>
            <h2 className="luxury-heading">Trusted by Industry Leaders</h2>
            
            <div className="luxury-divider">
              <div className="div-line"></div>
              <div className="div-dot-gold"></div>
              <div className="div-line"></div>
            </div>

            <p className="luxury-subtext">
              Collaborating with leading companies across the Middle East and beyond, delivering excellence in every partnership
            </p>
          </motion.div>
        </div>
        
        <div className="mq-outer">
          <div className="mq-fade mq-fade--left" />
          <div className="mq-fade mq-fade--right" />

          {/* Single row — scroll left */}
          <div className="mq-row">
            <div className="mq-track mq-track--left">
              {[
                { name: 'BINGHATTI',         logo: '/images/binghatti.webp' },
                { name: 'DAMAC',             logo: '/images/damac.jpg' },
                { name: 'DANUBE PROPERTIES', logo: '/images/Danube_Properties.png' },
                { name: 'ELLINGTON',         logo: '/images/Ellington-Logo_Black-2.png' },
                { name: 'EMAAR',             logo: '/images/emaar.png' },
                { name: 'MAG',               logo: '/images/mag.png' },
                { name: 'MERAAS',            logo: '/images/meraas.png' },
                { name: 'NAKHEEL',           logo: '/images/nakheel.png' },
                { name: 'OMNIYAT',           logo: '/images/ominyat.png' },
                { name: 'ALDAR',             logo: '/images/aldar-logo-png_seeklogo-425039.png' },
                // duplicate for seamless loop
                { name: 'BINGHATTI',         logo: '/images/binghatti.webp' },
                { name: 'DAMAC',             logo: '/images/damac.jpg' },
                { name: 'DANUBE PROPERTIES', logo: '/images/Danube_Properties.png' },
                { name: 'ELLINGTON',         logo: '/images/Ellington-Logo_Black-2.png' },
                { name: 'EMAAR',             logo: '/images/emaar.png' },
                { name: 'MAG',               logo: '/images/mag.png' },
                { name: 'MERAAS',            logo: '/images/meraas.png' },
                { name: 'NAKHEEL',           logo: '/images/nakheel.png' },
                { name: 'OMNIYAT',           logo: '/images/ominyat.png' },
                { name: 'ALDAR',             logo: '/images/aldar-logo-png_seeklogo-425039.png' },
              ].map((p, i) => (
                <div key={i} className="mq-logo">
                  <img src={p.logo} alt={p.name} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Section Divider: Partners → Featured Projects */}
      <div className="section-divider">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="#0B0F1A"/>
        </svg>
      </div>

      {/* ── Featured Projects — Slideshow ── */}
      <section className="fps-section" id="projects">
        <div className="container">
          <motion.div className="fps-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="section-subtitle-pill">OUR PORTFOLIO</div>
            <h2 className="gold-gradient-text hfp-title">Featured Projects</h2>
            <div className="decorative-divider centered" style={{ margin: '1.25rem auto 1.5rem' }}>
              <div className="line-seg" /><div className="line-dot" /><div className="line-seg" />
            </div>
            <p className="hfp-subtitle">Landmark developments redefining luxury, innovation and architectural excellence across India and the UAE.</p>
          </motion.div>
        </div>

        {/* Slideshow */}
        <FeaturedSlideshow projects={HFP_PROJECTS} onNavigate={navigate} />
      </section>

      {/* About Us Section */}
      <section id="about" className="about-section">
        <div className="container">

          {/* Centered header */}
          <motion.div className="about-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="section-subtitle-pill">ABOUT US</div>
            <h2 className="about-main-title">The <span className="gold-gradient-text">Winstone Group</span></h2>
            <div className="decorative-divider centered"><div className="line-seg"/><div className="line-dot"/><div className="line-seg"/></div>
            <p className="about-intro">
              A diversified conglomerate committed to excellence across multiple industries, creating lasting value and meaningful impact in every venture we undertake.
            </p>
          </motion.div>

          {/* Split: left text / right stats */}
          <div className="about-split">

            {/* Left */}
            <motion.div
              className="about-text-col"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="about-legacy-title">Building Tomorrow's Legacy</h3>
              <p className="about-body">
                Founded in 2018, the Winstone Group has rapidly evolved into a dynamic conglomerate with a clear vision: to redefine excellence across diverse industries while maintaining our core values of innovation, quality, and customer satisfaction.
              </p>
              <p className="about-body">
                From premium real estate development to luxury automotive services and community-focused social initiatives, we believe in creating comprehensive value that extends beyond business success to meaningful community impact.
              </p>

              <h4 className="about-values-label">Our Core Values</h4>
              <div className="about-values-grid">
                {[
                  'Innovation & Technology',
                  'Quality Excellence',
                  'Customer-Centric Approach',
                  'Sustainable Development',
                  'Global Expansion',
                  'Community Impact',
                ].map((v, i) => (
                  <span key={i} className="about-value-tag">{v}</span>
                ))}
              </div>
            </motion.div>

            {/* Right — 2×2 stat cards */}
            <motion.div
              className="about-stats-col"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <div className="about-stats-grid">
                {[
                  { icon: <Award size={28} />,    num: 'Est. 2018',   label: 'Years of Excellence'  },
                  { icon: <Building2 size={28} />, num: 'UAE & India', label: 'Active Markets'        },
                  { icon: <Users size={28} />,     num: '3 Ventures',  label: 'Group Companies'       },
                  { icon: <Map size={28} />,       num: 'Global',      label: 'Multi-Country Reach'   },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    className="about-stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    whileHover={{ y: -4, borderColor: 'rgba(201,161,74,0.4)' }}
                  >
                    <div className="about-stat-icon">{s.icon}</div>
                    <span className="about-stat-num">{s.num}</span>
                    <span className="about-stat-label">{s.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>
      
      {/* Section Divider: About → Companies */}
      <div className="section-divider">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,60 L1440,20 L1440,60 L0,60 Z" fill="#111827"/>
        </svg>
      </div>

      {/* Companies Section */}
      <section id="companies" className="section-padding container">
        <motion.div style={{ textAlign: 'center', marginBottom: '4rem' }} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="section-subtitle-pill">OUR COMPANIES</div>
          <h2>The <span className="gold-gradient-text">Winstone Group</span></h2>
          <div className="decorative-divider centered">
            <div className="line-seg"></div>
            <div className="line-dot"></div>
            <div className="line-seg"></div>
          </div>
          <p className="section-desc">
            A diversified portfolio bridging luxury property markets and mobility ventures seamlessly.
          </p>
        </motion.div>
        
        <motion.div className="co-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {[
            {
              icon: <Building2 size={22} />,
              label: 'Real Estate',
              name: 'Winstone Projects LLP',
              desc: 'Premium real estate development and township projects across major Indian and UAE cities.',
              img: '/images/damac.jpg',
              href: 'https://www.instagram.com/winstoneprojectsuae?igsh=MWUzODAzbzlqcTM1Yw%3D%3D',
            },
            {
              icon: <Award size={22} />,
              label: 'Automotive',
              name: 'Winstone Motors',
              desc: 'Luxury automotive dealership and services catering to the discerning global market.',
              img: '/images/company_automotive_1775636477456.png',
              href: 'https://www.instagram.com/winstonemotors/',
            },
            {
              icon: <Users size={22} />,
              label: 'Foundation',
              name: 'Winstone Foundation',
              desc: 'Social impact and community development initiatives transforming lives globally.',
              img: '/images/company_foundation_1775636506747.png',
              href: 'https://www.instagram.com/winstonefoundation/',
            },
          ].map((co, i) => (
            <motion.a
              key={i}
              variants={fadeUp}
              className="co-card"
              href={co.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              {/* Full image */}
              <div className="co-card-img">
                <img src={co.img} alt={co.name} />
                <div className="co-card-img-overlay" />
              </div>
              {/* Content */}
              <div className="co-card-body">
                <div className="co-card-top">
                  <span className="co-icon">{co.icon}</span>
                  <span className="co-label">{co.label}</span>
                </div>
                <h3 className="co-name">{co.name}</h3>
                <p className="co-desc">{co.desc}</p>
                <div className="co-divider" />
                <span className="co-link">View on Instagram →</span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* Awards Section */}
      <section id="awards" className="section-padding">
        <div className="container">
          <motion.div className="aw-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="section-subtitle-pill">RECOGNITION</div>
            <h2 className="aw-title">Awards & <span className="gold-gradient-text">Achievements</span></h2>
            <div className="decorative-divider centered"><div className="line-seg"/><div className="line-dot"/><div className="line-seg"/></div>
            <p className="aw-subtitle">
              Recognition for exceptional achievements in luxury real estate development, innovative design, and outstanding contributions to the industry by leading organizations including NAR India and CREDAI.
            </p>
          </motion.div>

          {/* 2-col award cards grid */}
          <div className="aw-grid">
            {[
              { year: '2023', title: 'Excellence in Real Estate Development',  agency: 'NAR India (National Association of Realtors)',                    desc: 'Recognition for outstanding achievements in luxury real estate development and innovative architectural solutions.' },
              { year: '2022', title: 'Sustainable Development Excellence',     agency: 'CREDAI (Confederation of Real Estate Developers\' Associations)', desc: 'Acknowledged for implementing eco-friendly practices and sustainable construction methodologies in luxury developments.' },
              { year: '2021', title: 'Innovation in Design Excellence',        agency: 'Karnataka Real Estate Regulatory Authority',                      desc: 'Acknowledged for pioneering design-driven architecture and technology-integrated development projects.' },
              { year: '2020', title: 'Outstanding Project Management',         agency: 'NAREDCO (National Real Estate Development Council)',               desc: 'Honored for exceptional project execution and timely delivery of large-scale residential and commercial projects.' },
              { year: '2019', title: 'Customer Satisfaction Award',            agency: 'Indian Real Estate Forum',                                        desc: 'Awarded for maintaining highest standards of customer service and client satisfaction across all projects.' },
              { year: '2018', title: 'Best Luxury Villa Development',          agency: 'South India Property Awards',                                     desc: 'Recognized as the best luxury villa developer for creating premium residential spaces with world-class amenities.' },
            ].map((award, i) => (
              <motion.div
                key={i}
                className="aw-card"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4, borderColor: 'rgba(201,161,74,0.4)' }}
              >
                <div className="aw-card-left">
                  <div className="aw-trophy">
                    <Award size={20} />
                  </div>
                  <span className="aw-year">{award.year}</span>
                </div>
                <div className="aw-card-right">
                  <h3 className="aw-card-title">{award.title}</h3>
                  <p className="aw-card-agency">{award.agency}</p>
                  <p className="aw-card-desc">{award.desc}</p>
                  <div className="aw-card-footer">
                    <span className="aw-foot-item"><Map size={12} /> Global</span>
                    <span className="aw-foot-item"><Award size={12} /> {award.year}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats bar */}
          <motion.div
            className="aw-stats"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { num: 'Est. 2018',  label: 'Industry Awards'    },
              { num: 'UAE & India', label: 'Active Markets'     },
              { num: 'Luxury',     label: 'Market Segment'      },
            ].map((s, i) => (
              <div key={i} className="aw-stat-item">
                <span className="aw-stat-num">{s.num}</span>
                <span className="aw-stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Founder / Leadership Section */}
      <section id="leadership" className="founder-section">
        <div className="container">
          <div className="founder-grid">

            {/* Left — photo column */}
            <motion.div
              className="founder-photo-col"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="founder-name-above">
                <h3 className="founder-name-gold">Nayaz Faiyaz Ahmed</h3>
                <p className="founder-role-gold">Founder &amp; Chairman</p>
              </div>

              <div className="founder-img-frame">
                <img src="/images/nayaz_hero-Dal7fLmT.jpg.jpeg" alt="Nayaz Faiyaz Ahmed" className="founder-img" />
                <div className="founder-img-glow" />
              </div>

              {/* Floating quote card */}
              <motion.div
                className="founder-quote-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                <span className="founder-quote-mark">"</span>
                <p>Excellence is not a destination, but a journey of continuous innovation and meaningful impact.</p>
              </motion.div>

              {/* Mini stats row */}
              <div className="founder-mini-stats">
                {[
                  { num: 'Est. 2018',  label: 'Founded'          },
                  { num: 'UAE & India', label: 'Active Markets'  },
                  { num: 'Luxury',     label: 'Market Focus'     },
                ].map((s, i) => (
                  <div key={i} className="founder-mini-stat">
                    <span className="founder-mini-num">{s.num}</span>
                    <span className="founder-mini-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — bio column */}
            <motion.div
              className="founder-bio-col"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <div className="section-subtitle-pill" style={{ alignSelf: 'flex-start' }}>EXECUTIVE PROFILE</div>
              <h2 className="founder-bio-title">
                Visionary <span className="gold-gradient-text">Leadership</span>
              </h2>
              <div className="decorative-divider" style={{ maxWidth: '200px', marginBottom: '2rem' }}>
                <div className="line-seg" /><div className="line-dot" /><div className="line-seg" />
              </div>

              <p className="founder-bio-text">
                Born in Bangalore, Nayaz Faiyaz Ahmed made an early decision to pursue real estate despite having a different academic background. Since 2017, he has dedicated himself to mastering all aspects of the real estate business, founding Winstone Projects LLP in 2018.
              </p>
              <p className="founder-bio-text">
                Through facing competition, fraud, and various challenges, he built remarkable resilience. Today, he manages property development and township projects in Bangalore while successfully expanding into the UAE market, with ambitious plans for global growth in luxury real estate development.
              </p>

              {/* Core qualities grid */}
              <h4 className="founder-qualities-label">Core Leadership Qualities</h4>
              <div className="founder-qualities-grid">
                {['Luxury Real Estate', 'Design-Driven Architecture', 'Technology Integration', 'Premium Development', 'Global Expansion', 'Award-Winning Projects'].map((q, i) => (
                  <span key={i} className="founder-quality-tag">{q}</span>
                ))}
              </div>

              {/* Mission statement box */}
              <div className="founder-mission">
                <div className="founder-mission-dot" />
                <h4 className="founder-mission-title">Mission Statement</h4>
                <p className="founder-mission-text">
                  "Homes should be more than just spaces to live in; they should be architectural experiences. We deliver modern and thoughtful design combined with cutting-edge technology to create premium properties that stand the test of time."
                </p>
                <div className="founder-mission-dot" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="tm-section">
        <div className="container">
          <motion.div className="tm-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="section-subtitle-pill">TESTIMONIALS</div>
            <h2 className="tm-title">What Our <span className="gold-gradient-text">Partners Say</span></h2>
            <div className="decorative-divider centered"><div className="line-seg"/><div className="line-dot"/><div className="line-seg"/></div>
            <p className="tm-subtitle">Trusted by investors, developers and clients across India and the UAE.</p>
          </motion.div>

          <div className="tm-grid">
            {[
              {
                quote: "Working with Winstone Group has been a journey of professionalism. Their commitment to quality in real estate development sets them apart in the UAE market.",
                name: "Ahmed Al Farsi",
                role: "Real Estate Investor, Abu Dhabi",
                initial: "A",
              },
              {
                quote: "The DAMAC Islands project exceeded every expectation. Winstone's expertise in luxury developments is unmatched in the region.",
                name: "Khalid Al Mansoori",
                role: "Property Developer, Dubai",
                initial: "K",
              },
              {
                quote: "From the first meeting to handover, the Winstone team was transparent, professional and genuinely invested in our success. Highly recommended.",
                name: "Sara Al Hashimi",
                role: "Investment Director, Abu Dhabi",
                initial: "S",
              },
              {
                quote: "Winstone's deep knowledge of the UAE real estate market and their premium project portfolio make them the go-to partner for luxury investments.",
                name: "Omar Al Rashid",
                role: "CEO, Gulf Capital Properties, Dubai",
                initial: "O",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                className="tm-card"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <GlowCard className="tm-glow-fill">
                {/* Large quote mark */}
                <div className="tm-quote-mark">"</div>

                {/* Stars */}
                <div className="tm-stars">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#C9A14A"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>

                <p className="tm-quote">{t.quote}</p>

                <div className="tm-author">
                  <div className="tm-avatar">{t.initial}</div>
                  <div className="tm-author-info">
                    <span className="tm-author-name">{t.name}</span>
                    <span className="tm-author-role">{t.role}</span>
                  </div>
                </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="section-padding">
        <div className="container">
          <motion.div className="ct-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="section-subtitle-pill">CONTACT</div>
            <h2 className="ct-title">Let's Build <span className="gold-gradient-text">Something Exceptional</span></h2>
            <div className="decorative-divider centered"><div className="line-seg"/><div className="line-dot"/><div className="line-seg"/></div>
            <p className="ct-subtitle">Ready to create your dream property? Connect with Winstone Projects to discuss luxury real estate development, investments, or partnership opportunities.</p>
          </motion.div>

          <div className="ct-body">
            {/* Left: form */}
            <motion.div className="ct-form-wrap" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h3 className="ct-form-title">Send a Message</h3>
              <form className="ct-form" onSubmit={handleFormSubmit}>
                <div className="ct-row">
                  <input
                    className="ct-input"
                    type="text"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={e => handleFormChange('name', e.target.value)}
                    required
                  />
                  <input
                    className="ct-input"
                    type="email"
                    placeholder="Your Email *"
                    value={formData.email}
                    onChange={e => handleFormChange('email', e.target.value)}
                    required
                  />
                </div>
                <input
                  className="ct-input"
                  type="text"
                  placeholder="Company / Organization"
                  value={formData.company}
                  onChange={e => handleFormChange('company', e.target.value)}
                />
                <textarea
                  className="ct-input ct-textarea"
                  placeholder="Tell us about your project or inquiry... *"
                  rows={5}
                  value={formData.message}
                  onChange={e => handleFormChange('message', e.target.value)}
                  required
                />

                {formStatus === 'success' && (
                  <div className="ct-form-success">
                    ✓ Message sent! We'll get back to you shortly.
                  </div>
                )}
                {formStatus === 'error' && (
                  <div className="ct-form-error">
                    Please fill in all required fields and try again.
                  </div>
                )}

                <button
                  type="submit"
                  className="ct-submit"
                  disabled={formStatus === 'loading'}
                  style={{ opacity: formStatus === 'loading' ? 0.7 : 1 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  {formStatus === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
                <div className="ct-alt">
                  <span>Or send via:</span>
                  <div className="ct-alt-links">
                    <a href="#contact" onClick={showEnquiryToast} className="ct-alt-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                    <a href="#contact" onClick={showEnquiryToast} className="ct-alt-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      LinkedIn
                    </a>
                    <a href="#contact" onClick={showEnquiryToast} className="ct-alt-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      Email
                    </a>
                  </div>
                </div>
              </form>
            </motion.div>

            {/* Right: info */}
            <motion.div className="ct-info" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.15 }}>
              <h3 className="ct-info-title">Get in Touch</h3>
              <div className="ct-info-list">
                <div className="ct-info-item">
                  <div className="ct-info-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div>
                    <span className="ct-info-label">Email</span>
                    <a href="mailto:Support@winstoneprojects.com" className="ct-info-value">Support@winstoneprojects.com</a>
                  </div>
                </div>
                <div className="ct-info-item">
                  <div className="ct-info-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  </div>
                  <div>
                    <span className="ct-info-label">Phone</span>
                    <a href="tel:+971504158382" className="ct-info-value">+971 504 158 382</a>
                  </div>
                </div>
                <div className="ct-info-item">
                  <div className="ct-info-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <span className="ct-info-label">Location</span>
                    <span className="ct-info-value">Al Wasl building, Sheikh Zayed Road,<br/>Near Dubai Mall Metro station, Dubai UAE</span>
                  </div>
                </div>
              </div>

              <div className="ct-social-wrap">
                <h4 className="ct-social-title">Connect on Social</h4>
                <div className="ct-socials">
                  {[
                    { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/winstone-projects-llc-uae/', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                    { label: 'Twitter',   href: 'https://x.com/Winstone_UAE', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                    { label: 'WhatsApp',  href: 'https://web.whatsapp.com/send?phone=971545911091', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
                    { label: 'Instagram', href: 'https://www.instagram.com/winstoneprojectsuae', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                    { label: 'YouTube',   href: 'https://www.youtube.com/@WinstoneProjectsUAE', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
                  ].map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="ct-social-btn" aria-label={s.label}>{s.icon}</a>
                  ))}
                </div>
              </div>

              <div className="ct-quote">
                <p>"Homes should be more than just spaces to live in; they should be architectural experiences that blend luxury with innovation."</p>
                <span>— Winstone Projects Philosophy</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
