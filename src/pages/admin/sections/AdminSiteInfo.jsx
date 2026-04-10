import { useState } from 'react';

const STORAGE_KEY = 'admin_siteinfo';

const DEFAULT_INFO = {
  heroTitle: 'Winstone Projects',
  heroSubtitle: 'Premium Real Estate Developers',
  heroDesc: '"Where architectural dreams meet reality, creating spaces that inspire and endure."',
  heroMarket: 'India & UAE Markets',
  aboutTitle: 'Building Tomorrow\'s Legacy',
  aboutP1: 'Founded in 2018, the Winstone Group has rapidly evolved into a dynamic conglomerate with a clear vision: to redefine excellence across diverse industries while maintaining our core values of innovation, quality, and customer satisfaction.',
  aboutP2: 'From premium real estate development to luxury automotive services and community-focused social initiatives, we believe in creating comprehensive value that extends beyond business success to meaningful community impact.',
  contactEmail: 'Support@winstoneprojects.com',
  contactPhone: '+971 504 158 382',
  contactAddress: 'Al Wasl building, Sheikh Zayed Road, Near Dubai Mall Metro station, Dubai UAE',
  founderName: 'Nayaz Faiyaz Ahmed',
  founderTitle: 'Founder & Chairman',
  founderBio1: 'Born in Bangalore, Nayaz Faiyaz Ahmed made an early decision to pursue real estate despite having a different academic background. Since 2017, he has dedicated himself to mastering all aspects of the real estate business, founding Winstone Projects LLP in 2018.',
  founderBio2: 'Through facing competition, fraud, and various challenges, he built remarkable resilience. Today, he manages property development and township projects in Bangalore while successfully expanding into the UAE market, with ambitious plans for global growth in luxury real estate development.',
};

function AdminSiteInfo() {
  const [info, setInfo] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_INFO;
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => setInfo(i => ({ ...i, [field]: value }));

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const reset = () => {
    if (window.confirm('Reset all site info to defaults?')) {
      setInfo(DEFAULT_INFO);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const Field = ({ label, field, multiline, rows = 3 }) => (
    <div className={`admin-field${multiline ? ' admin-field--full' : ''}`}>
      <label>{label}</label>
      {multiline
        ? <textarea rows={rows} value={info[field]} onChange={e => handleChange(field, e.target.value)} />
        : <input value={info[field]} onChange={e => handleChange(field, e.target.value)} />
      }
    </div>
  );

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <p className="admin-section-desc">Edit text content shown across the website.</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="admin-btn-ghost" onClick={reset}>Reset Defaults</button>
          <button className="admin-btn-primary" onClick={save}>Save All Changes</button>
        </div>
      </div>

      {saved && <div className="admin-toast">✓ Saved successfully</div>}

      <div className="admin-info-group">
        <h3 className="admin-group-title">🏠 Hero Section</h3>
        <div className="admin-form-grid">
          <Field label="Hero Title" field="heroTitle" />
          <Field label="Hero Subtitle" field="heroSubtitle" />
          <Field label="Hero Description" field="heroDesc" multiline rows={2} />
          <Field label="Market Text" field="heroMarket" />
        </div>
      </div>

      <div className="admin-info-group">
        <h3 className="admin-group-title">ℹ️ About Section</h3>
        <div className="admin-form-grid">
          <Field label="Section Title" field="aboutTitle" />
          <Field label="Paragraph 1" field="aboutP1" multiline rows={3} />
          <Field label="Paragraph 2" field="aboutP2" multiline rows={3} />
        </div>
      </div>

      <div className="admin-info-group">
        <h3 className="admin-group-title">👤 Founder / Leadership</h3>
        <div className="admin-form-grid">
          <Field label="Founder Name" field="founderName" />
          <Field label="Title / Role" field="founderTitle" />
          <Field label="Bio Paragraph 1" field="founderBio1" multiline rows={3} />
          <Field label="Bio Paragraph 2" field="founderBio2" multiline rows={3} />
        </div>
      </div>

      <div className="admin-info-group">
        <h3 className="admin-group-title">📞 Contact Info</h3>
        <div className="admin-form-grid">
          <Field label="Email" field="contactEmail" />
          <Field label="Phone" field="contactPhone" />
          <Field label="Address" field="contactAddress" multiline rows={2} />
        </div>
      </div>

      <div className="admin-form-actions" style={{ marginTop: '24px' }}>
        <button className="admin-btn-primary" onClick={save}>Save All Changes</button>
      </div>
    </div>
  );
}

export default AdminSiteInfo;
