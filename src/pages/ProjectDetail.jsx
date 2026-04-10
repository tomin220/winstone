import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, ArrowLeft, CheckCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { PROJECTS } from '../data/projects';
import './ProjectDetail.css';

function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="pd-notfound">
        <h2>Project not found</h2>
        <button onClick={() => navigate('/projects')}>Back to Projects</button>
      </div>
    );
  }

  const hasSubProjects = project.subProjects && project.subProjects.length > 0;

  return (
    <div className="pd-page">

      {/* Back button */}
      <div className="container pd-back-wrap">
        <motion.button
          className="pd-back"
          onClick={() => navigate('/projects')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ArrowLeft size={15} /> Back to Projects
        </motion.button>
      </div>

      {/* ── SINGLE PROJECT LAYOUT (Saif style) ── */}
      {project.isSingleProject && (
        <>
          {/* Hero: title left, image right */}
          <section className="sp-hero">
            <div className="container sp-hero-inner">
              <motion.div
                className="sp-hero-left"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                {project.type && (
                  <span className="sp-type-badge">{project.type}</span>
                )}
                <h1 className="sp-title">{project.name}</h1>
                <p className="sp-desc">{project.description}</p>
                <div className="sp-meta-grid">
                  <div className="sp-meta-box">
                    <span className="sp-meta-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      Location
                    </span>
                    <span className="sp-meta-val">{project.location}</span>
                  </div>
                  <div className="sp-meta-box">
                    <span className="sp-meta-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      Year
                    </span>
                    <span className="sp-meta-val">{project.year}</span>
                  </div>
                  {project.units && (
                    <div className="sp-meta-box">
                      <span className="sp-meta-label">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                        Units
                      </span>
                      <span className="sp-meta-val">{project.units}</span>
                    </div>
                  )}
                  <div className="sp-meta-box">
                    <span className="sp-meta-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      Price Range
                    </span>
                    <span className="sp-meta-val">{project.price}</span>
                  </div>
                </div>
                <a href="#" className="sp-download-btn">
                  <Download size={15} /> Download Brochure
                </a>
              </motion.div>

              <motion.div
                className="sp-hero-right"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                {project.image
                  ? <img src={project.image} alt={project.name} className="sp-hero-img" />
                  : <div className="sp-hero-placeholder" />
                }
              </motion.div>
            </div>
          </section>

          {/* Gallery placeholder */}
          <section className="sp-gallery-section">
            <div className="container">
              <div className="sp-section-header">
                <h2 className="sp-section-title">PROJECT GALLERY</h2>
                <p className="sp-section-sub">Experience the grandeur of our visionary development through our curated collection</p>
              </div>
              <div className="sp-gallery-placeholder">
                <p>No gallery images available</p>
                <span>Add images from the admin panel</span>
              </div>
            </div>
          </section>

          {/* Key Highlights */}
          <section className="sp-highlights-section">
            <div className="container">
              <div className="sp-section-header">
                <h2 className="sp-section-title">KEY HIGHLIGHTS</h2>
                <p className="sp-section-sub">Discover what makes this project exceptional</p>
              </div>
              <div className="sp-highlights-grid">
                {project.highlights.map((h, i) => (
                  <motion.div
                    key={i}
                    className="sp-highlight-pill"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <CheckCircle size={16} className="sp-hl-icon" />
                    {h}
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div className="sp-cta-row">
                <div className="sp-cta-line" />
                <a href="/#contact" className="sp-cta-btn">Contact Us for More Information</a>
                <div className="sp-cta-line" />
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── DAMAC STYLE: developer hero + sub-project cards ── */}
      {hasSubProjects && (
        <>
          <section className="pd-hero">
            <div className="pd-hero-bg" />
            <div className="pd-hero-overlay" />
            <div className="container pd-hero-inner">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <span className="pd-ongoing-pill">ONGOING PROJECTS</span>
                <div className="pd-developer-name">{project.developer}</div>
                <p className="pd-hero-sub">{project.description}</p>
              </motion.div>
            </div>
          </section>

          <section className="pd-listings">
            <div className="container">
              {project.subProjects.map((sp, i) => (
                <motion.div
                  key={sp.id}
                  className={`pd-card${sp.imageRight ? ' pd-card--reverse' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                >
                  <div className="pd-card-img">
                    {sp.image
                      ? <img src={sp.image} alt={sp.name} className="pd-real-img" />
                      : <div className="pd-img-placeholder" />
                    }
                    <div className="pd-card-badges">
                      <span className="pd-badge pd-badge--type">Residential</span>
                      <span className="pd-badge pd-badge--dev">DAMAC</span>
                    </div>
                    <div className="pd-card-icon"><CheckCircle size={16} /></div>
                  </div>
                  <div className="pd-card-details">
                    <h2 className="pd-card-title">{sp.name.toUpperCase()}</h2>
                    <div className="pd-meta-row">
                      <div className="pd-meta-box">
                        <span className="pd-meta-label"><MapPin size={11} /> Location</span>
                        <span className="pd-meta-value">{sp.location}</span>
                      </div>
                      <div className="pd-meta-box">
                        <span className="pd-meta-label">&#128197; Year</span>
                        <span className="pd-meta-value">{sp.year}</span>
                      </div>
                      <div className="pd-meta-box">
                        <span className="pd-meta-label"><Star size={11} /> Price</span>
                        <span className="pd-meta-value">{sp.price}</span>
                      </div>
                    </div>
                    <div className="pd-highlights">
                      <h4 className="pd-highlights-title">Key Highlights</h4>
                      <div className="pd-highlights-list">
                        {sp.highlights.map((h, j) => (
                          <span key={j} className="pd-highlight-tag">
                            <CheckCircle size={12} /> {h}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a href="/#contact" className="pd-learn-btn">Learn More &rarr;</a>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Fallback for enquiry-only projects */}
      {!hasSubProjects && !project.isSingleProject && (
        <section className="pd-listings" style={{ paddingTop: '40px' }}>
          <div className="container">
            <motion.div className="pd-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="pd-card-img">
                {project.image ? <img src={project.image} alt={project.name} className="pd-real-img" /> : <div className="pd-img-placeholder" />}
                <div className="pd-card-badges">
                  <span className="pd-badge pd-badge--type">{project.type}</span>
                </div>
              </div>
              <div className="pd-card-details">
                <h2 className="pd-card-title">{project.name.toUpperCase()}</h2>
                <div className="pd-meta-row">
                  <div className="pd-meta-box">
                    <span className="pd-meta-label"><MapPin size={11} /> Location</span>
                    <span className="pd-meta-value">{project.location}</span>
                  </div>
                  <div className="pd-meta-box">
                    <span className="pd-meta-label"><Star size={11} /> Price</span>
                    <span className="pd-meta-value">{project.price}</span>
                  </div>
                </div>
                <div className="pd-highlights">
                  <h4 className="pd-highlights-title">Key Highlights</h4>
                  <div className="pd-highlights-list">
                    {project.highlights.map((h, i) => (
                      <span key={i} className="pd-highlight-tag"><CheckCircle size={12} /> {h}</span>
                    ))}
                  </div>
                </div>
                <a href="/#contact" className="pd-learn-btn">Learn More &rarr;</a>
              </div>
            </motion.div>
          </div>
        </section>
      )}

    </div>
  );
}

export default ProjectDetail;
