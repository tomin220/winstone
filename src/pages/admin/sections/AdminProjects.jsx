import { useState } from 'react';
import { PROJECTS as DEFAULT_PROJECTS } from '../../../data/projects';

const STORAGE_KEY = 'admin_projects';

const emptyProject = {
  id: Date.now(),
  slug: '',
  name: '',
  developer: '',
  developerLogo: '',
  type: '',
  location: '',
  locationShort: '',
  year: '',
  units: '',
  price: '',
  tag: 'Active',
  description: '',
  highlights: '',
  image: '',
  enquiry: false,
  isSingleProject: true,
  subProjects: [],
};

const emptySubProject = {
  id: '',
  name: '',
  type: 'Residential',
  location: '',
  year: '',
  price: '',
  highlights: '',
  image: '',
  imageRight: false,
};

function AdminProjects() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
  });

  // Main project form state
  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyProject);

  // Sub-project form state
  const [editingSubId, setEditingSubId] = useState(null);
  const [addingSub, setAddingSub] = useState(false);
  const [subForm, setSubForm] = useState(emptySubProject);

  const [saved, setSaved] = useState(false);

  const persist = (updated) => {
    setProjects(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // ── Main project actions ──
  const startEdit = (p) => {
    setEditingId(p.id);
    setAdding(false);
    cancelSub();
    setForm({
      ...p,
      highlights: Array.isArray(p.highlights) ? p.highlights.join('\n') : p.highlights || '',
      image: p.image || '',
      developerLogo: p.developerLogo || '',
    });
  };

  const startAdd = () => {
    setAdding(true);
    setEditingId(null);
    cancelSub();
    setForm({ ...emptyProject, id: Date.now(), subProjects: [] });
  };

  const cancelMain = () => { setEditingId(null); setAdding(false); cancelSub(); };

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const saveProject = () => {
    const cleaned = {
      ...form,
      highlights: typeof form.highlights === 'string'
        ? form.highlights.split('\n').map(h => h.trim()).filter(Boolean)
        : form.highlights,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      image: form.image || null,
      developerLogo: form.developerLogo || null,
    };
    if (adding) {
      persist([...projects, cleaned]);
    } else {
      persist(projects.map(p => p.id === editingId ? cleaned : p));
    }
    cancelMain();
  };

  const deleteProject = (id) => {
    if (window.confirm('Delete this project?')) persist(projects.filter(p => p.id !== id));
  };

  // ── Sub-project actions ──
  const startEditSub = (sp) => {
    setEditingSubId(sp.id);
    setAddingSub(false);
    setSubForm({
      ...sp,
      highlights: Array.isArray(sp.highlights) ? sp.highlights.join('\n') : sp.highlights || '',
      image: sp.image || '',
    });
  };

  const startAddSub = () => {
    setAddingSub(true);
    setEditingSubId(null);
    setSubForm({ ...emptySubProject, id: 's' + Date.now() });
  };

  const cancelSub = () => { setEditingSubId(null); setAddingSub(false); };

  const handleSubChange = (field, value) => setSubForm(f => ({ ...f, [field]: value }));

  const saveSub = () => {
    const cleaned = {
      ...subForm,
      highlights: typeof subForm.highlights === 'string'
        ? subForm.highlights.split('\n').map(h => h.trim()).filter(Boolean)
        : subForm.highlights,
      image: subForm.image || null,
    };
    const currentSubs = form.subProjects || [];
    const updatedSubs = addingSub
      ? [...currentSubs, cleaned]
      : currentSubs.map(s => s.id === editingSubId ? cleaned : s);
    setForm(f => ({ ...f, subProjects: updatedSubs }));
    cancelSub();
  };

  const deleteSub = (subId) => {
    if (window.confirm('Delete this sub-project?')) {
      setForm(f => ({ ...f, subProjects: (f.subProjects || []).filter(s => s.id !== subId) }));
    }
  };

  const isMainOpen = editingId !== null || adding;
  const isSubOpen = editingSubId !== null || addingSub;

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <p className="admin-section-desc">Manage all projects and their sub-projects shown on the website.</p>
        {!isMainOpen && (
          <button className="admin-btn-primary" onClick={startAdd}>+ Add Project</button>
        )}
      </div>

      {saved && <div className="admin-toast">✓ Saved successfully</div>}

      {/* ── Projects table ── */}
      {!isMainOpen && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Developer</th>
                <th>Type</th>
                <th>Status</th>
                <th>Sub-projects</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td className="admin-td-name">{p.name}</td>
                  <td>{p.developer}</td>
                  <td><span className="admin-tag">{p.type}</span></td>
                  <td><span className={`admin-status admin-status--${p.tag?.toLowerCase()}`}>{p.tag}</span></td>
                  <td>
                    {p.subProjects?.length > 0
                      ? <span className="admin-tag">{p.subProjects.length} sub</span>
                      : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>none</span>
                    }
                  </td>
                  <td className="admin-td-actions">
                    <button className="admin-btn-edit" onClick={() => startEdit(p)}>Edit</button>
                    <button className="admin-btn-delete" onClick={() => deleteProject(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Main project form ── */}
      {isMainOpen && (
        <div className="admin-form-card">
          <h3 className="admin-form-title">{adding ? '+ Add New Project' : `Editing: ${form.name}`}</h3>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Project Name *</label>
              <input value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. DAMAC Projects" />
            </div>
            <div className="admin-field">
              <label>Slug (URL key)</label>
              <input value={form.slug} onChange={e => handleChange('slug', e.target.value)} placeholder="auto-generated if empty" />
            </div>
            <div className="admin-field">
              <label>Developer</label>
              <input value={form.developer} onChange={e => handleChange('developer', e.target.value)} placeholder="e.g. DAMAC" />
            </div>
            <div className="admin-field">
              <label>Developer Logo Text</label>
              <input value={form.developerLogo} onChange={e => handleChange('developerLogo', e.target.value)} placeholder="e.g. DAMAC" />
            </div>
            <div className="admin-field">
              <label>Type</label>
              <select value={form.type} onChange={e => handleChange('type', e.target.value)}>
                <option value="">Select type</option>
                {['Residential','Commercial','Villa','Township','High-Rise','Smart City'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label>Status</label>
              <select value={form.tag} onChange={e => handleChange('tag', e.target.value)}>
                <option>Active</option><option>Ongoing</option><option>Completed</option>
              </select>
            </div>
            <div className="admin-field">
              <label>Location (full)</label>
              <input value={form.location} onChange={e => handleChange('location', e.target.value)} placeholder="Dubai, UAE" />
            </div>
            <div className="admin-field">
              <label>Location (short)</label>
              <input value={form.locationShort} onChange={e => handleChange('locationShort', e.target.value)} placeholder="Dubai, UAE" />
            </div>
            <div className="admin-field">
              <label>Year</label>
              <input value={form.year} onChange={e => handleChange('year', e.target.value)} placeholder="2025" />
            </div>
            <div className="admin-field">
              <label>Units</label>
              <input value={form.units} onChange={e => handleChange('units', e.target.value)} placeholder="e.g. 4-5 BR Villas" />
            </div>
            <div className="admin-field">
              <label>Price</label>
              <input value={form.price} onChange={e => handleChange('price', e.target.value)} placeholder="Starting from AED 2.25M" />
            </div>
            <div className="admin-field">
              <label>Image path</label>
              <input value={form.image} onChange={e => handleChange('image', e.target.value)} placeholder="/images/damac.jpg" />
            </div>
            <div className="admin-field admin-field--full">
              <label>Description</label>
              <textarea rows={3} value={form.description} onChange={e => handleChange('description', e.target.value)} />
            </div>
            <div className="admin-field admin-field--full">
              <label>Key Highlights (one per line)</label>
              <textarea rows={4} value={form.highlights} onChange={e => handleChange('highlights', e.target.value)} placeholder="Waterfront community&#10;Modern villas&#10;Resort amenities" />
            </div>
            <div className="admin-field">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.enquiry} onChange={e => handleChange('enquiry', e.target.checked)} />
                Learn More → goes to enquiry form
              </label>
            </div>
            <div className="admin-field">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isSingleProject} onChange={e => handleChange('isSingleProject', e.target.checked)} />
                Single project layout (Saif/Commercial style)
              </label>
            </div>
          </div>

          {/* ── Sub-projects section ── */}
          <div className="admin-sub-section">
            <div className="admin-sub-header">
              <h4 className="admin-sub-title">Sub-Projects ({(form.subProjects || []).length})</h4>
              {!isSubOpen && (
                <button className="admin-btn-edit" onClick={startAddSub}>+ Add Sub-Project</button>
              )}
            </div>
            <p className="admin-sub-hint">Sub-projects appear inside the project detail page (e.g. DAMAC Islands, DAMAC Apartments inside DAMAC Projects).</p>

            {/* Sub-projects table */}
            {!isSubOpen && (form.subProjects || []).length > 0 && (
              <div className="admin-table-wrap" style={{ marginTop: '12px' }}>
                <table className="admin-table">
                  <thead>
                    <tr><th>Name</th><th>Location</th><th>Year</th><th>Price</th><th>Image Side</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {(form.subProjects || []).map(sp => (
                      <tr key={sp.id}>
                        <td className="admin-td-name">{sp.name}</td>
                        <td>{sp.location}</td>
                        <td>{sp.year}</td>
                        <td>{sp.price}</td>
                        <td><span className="admin-tag">{sp.imageRight ? 'Right' : 'Left'}</span></td>
                        <td className="admin-td-actions">
                          <button className="admin-btn-edit" onClick={() => startEditSub(sp)}>Edit</button>
                          <button className="admin-btn-delete" onClick={() => deleteSub(sp.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sub-project form */}
            {isSubOpen && (
              <div className="admin-sub-form">
                <h5 className="admin-sub-form-title">{addingSub ? 'Add Sub-Project' : 'Edit Sub-Project'}</h5>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Name *</label>
                    <input value={subForm.name} onChange={e => handleSubChange('name', e.target.value)} placeholder="e.g. DAMAC Islands" />
                  </div>
                  <div className="admin-field">
                    <label>Type</label>
                    <select value={subForm.type} onChange={e => handleSubChange('type', e.target.value)}>
                      {['Residential','Commercial','Villa','Township','High-Rise'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Location</label>
                    <input value={subForm.location} onChange={e => handleSubChange('location', e.target.value)} placeholder="Dubai, UAE" />
                  </div>
                  <div className="admin-field">
                    <label>Year</label>
                    <input value={subForm.year} onChange={e => handleSubChange('year', e.target.value)} placeholder="2025" />
                  </div>
                  <div className="admin-field">
                    <label>Price</label>
                    <input value={subForm.price} onChange={e => handleSubChange('price', e.target.value)} placeholder="Starting from AED 2.25M" />
                  </div>
                  <div className="admin-field">
                    <label>Image path</label>
                    <input value={subForm.image} onChange={e => handleSubChange('image', e.target.value)} placeholder="/images/damac.jpg" />
                  </div>
                  <div className="admin-field admin-field--full">
                    <label>Key Highlights (one per line)</label>
                    <textarea rows={3} value={subForm.highlights} onChange={e => handleSubChange('highlights', e.target.value)} placeholder="Waterfront community&#10;Modern villas" />
                  </div>
                  <div className="admin-field">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={subForm.imageRight} onChange={e => handleSubChange('imageRight', e.target.checked)} />
                      Image on right side
                    </label>
                  </div>
                </div>
                <div className="admin-form-actions">
                  <button className="admin-btn-primary" onClick={saveSub}>{addingSub ? 'Add Sub-Project' : 'Save Sub-Project'}</button>
                  <button className="admin-btn-ghost" onClick={cancelSub}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Main form actions */}
          <div className="admin-form-actions" style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
            <button className="admin-btn-primary" onClick={saveProject}>{adding ? 'Add Project' : 'Save Changes'}</button>
            <button className="admin-btn-ghost" onClick={cancelMain}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProjects;
