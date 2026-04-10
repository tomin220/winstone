import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Star, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "../data/projects";
import "./Projects.css";

const FILTERS = ["All", "Active", "Ongoing", "Completed"];

function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();

  const filtered = activeFilter === "All"
    ? PROJECTS
    : PROJECTS.filter((p) => p.tag === activeFilter);

  return (
    <div className="projects-page">

      {/* Hero */}
      <section className="proj-hero">
        <div className="proj-hero-bg" />
        <div className="proj-hero-overlay" />
        <div className="container proj-hero-content">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <span className="proj-badge"><span className="proj-badge-dot" />Our Portfolio</span>
            <h1 className="proj-hero-title">Crafting <span className="proj-hero-gold">Iconic</span> Spaces</h1>
            <p className="proj-hero-sub">Landmark developments redefining luxury, innovation, and architectural excellence across the UAE.</p>
            <div className="proj-hero-stats">
              <div className="proj-hero-stat"><span className="proj-hero-stat-num">50+</span><span className="proj-hero-stat-label">Projects</span></div>
              <div className="proj-hero-stat-divider" />
              <div className="proj-hero-stat"><span className="proj-hero-stat-num">UAE</span><span className="proj-hero-stat-label">Market</span></div>
              <div className="proj-hero-stat-divider" />
              <div className="proj-hero-stat"><span className="proj-hero-stat-num">6+</span><span className="proj-hero-stat-label">Years</span></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="proj-main">
        <div className="container">

          <motion.div className="proj-filters" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            {FILTERS.map((f) => (
              <button key={f} className={"proj-filter-btn" + (activeFilter === f ? " active" : "")} onClick={() => setActiveFilter(f)}>
                {f}{f !== "All" && <span className="proj-filter-count">{PROJECTS.filter((p) => p.tag === f).length}</span>}
              </button>
            ))}
          </motion.div>

          <div className="pv-grid">
            <AnimatePresence>
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  className="pv-card"
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                >
                  {/* Image */}
                  <div className="pv-card-img">
                    {project.image
                      ? <img src={project.image} alt={project.name} className="pv-img" />
                      : <div className="pv-img-placeholder" />
                    }
                    <span className={"pv-type-badge"}>{project.type}</span>
                    <div className="pv-img-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="pv-card-body">
                    <div className="pv-name-row">
                      <h3 className="pv-name">{project.name.toUpperCase()}</h3>
                      {project.developerLogo && (
                        <span className="pv-dev-badge">{project.developerLogo}</span>
                      )}
                    </div>

                    <p className="pv-desc">{project.description}</p>

                    <div className="pv-meta-grid">
                      <div className="pv-meta-box">
                        <span className="pv-meta-label"><MapPin size={11} /> Location</span>
                        <span className="pv-meta-val">{project.location}</span>
                      </div>
                      <div className="pv-meta-box">
                        <span className="pv-meta-label"><Calendar size={11} /> Year</span>
                        <span className="pv-meta-val">{project.year}</span>
                      </div>
                      <div className="pv-meta-box">
                        <span className="pv-meta-label">&#9632; Units</span>
                        <span className="pv-meta-val">{project.units}</span>
                      </div>
                      <div className="pv-meta-box">
                        <span className="pv-meta-label"><Star size={11} /> Price</span>
                        <span className="pv-meta-val">{project.price}</span>
                      </div>
                    </div>

                    <div className="pv-highlights">
                      <h4 className="pv-highlights-label">Key Highlights:</h4>
                      <ul className="pv-highlights-list">
                        {project.highlights.slice(0, 4).map((h, j) => (
                          <li key={j}><span className="pv-hl-dot" />{h}</li>
                        ))}
                      </ul>
                    </div>

                    <button
                      className="pv-learn-btn"
                      onClick={() => navigate("/projects/" + project.slug)}
                    >
                      Learn More <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Projects;