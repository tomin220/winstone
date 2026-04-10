import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import AdminProjects from './sections/AdminProjects';
import AdminSiteInfo from './sections/AdminSiteInfo';
import AdminAwards from './sections/AdminAwards';
import AdminTestimonials from './sections/AdminTestimonials';
import './Admin.css';

const NAV_ITEMS = [
  { id: 'projects',     label: 'Projects',      icon: '🏗️' },
  { id: 'siteinfo',     label: 'Site Info',      icon: '📝' },
  { id: 'awards',       label: 'Awards',         icon: '🏆' },
  { id: 'testimonials', label: 'Testimonials',   icon: '💬' },
];

function AdminDashboard() {
  const [active, setActive] = useState('projects');
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const logout = () => {
    sessionStorage.removeItem('admin_auth');
    navigate('/admin');
  };

  const renderSection = () => {
    switch (active) {
      case 'projects':     return <AdminProjects />;
      case 'siteinfo':     return <AdminSiteInfo />;
      case 'awards':       return <AdminAwards />;
      case 'testimonials': return <AdminTestimonials />;
      default:             return <AdminProjects />;
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <img src="/images/winstonelogo.jpg" alt="Winstone" className="admin-brand-logo" />
          <div>
            <div className="admin-brand-name">WINSTONE</div>
            <div className="admin-brand-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`admin-nav-item${active === item.id ? ' active' : ''}`}
              onClick={() => setActive(item.id)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" className="admin-view-site">↗ View Site</a>
          <button onClick={logout} className="admin-logout-btn">Sign Out</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h2 className="admin-page-title">
            {NAV_ITEMS.find(n => n.id === active)?.icon}{' '}
            {NAV_ITEMS.find(n => n.id === active)?.label}
          </h2>
          <span className="admin-topbar-badge">Admin</span>
        </div>
        <div className="admin-content">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
