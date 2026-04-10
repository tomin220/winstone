import { useState } from 'react';

const STORAGE_KEY = 'admin_awards';

const DEFAULT_AWARDS = [
  { id: 1, year: '2023', title: 'Excellence in Real Estate Development', agency: 'NAR India (National Association of Realtors)', desc: 'Recognition for outstanding achievements in luxury real estate development and innovative architectural solutions.' },
  { id: 2, year: '2022', title: 'Sustainable Development Excellence', agency: "CREDAI (Confederation of Real Estate Developers' Associations)", desc: 'Acknowledged for implementing eco-friendly practices and sustainable construction methodologies.' },
  { id: 3, year: '2021', title: 'Innovation in Design Excellence', agency: 'Karnataka Real Estate Regulatory Authority', desc: 'Acknowledged for pioneering design-driven architecture and technology-integrated development projects.' },
  { id: 4, year: '2020', title: 'Outstanding Project Management', agency: 'NAREDCO (National Real Estate Development Council)', desc: 'Honored for exceptional project execution and timely delivery of large-scale residential and commercial projects.' },
  { id: 5, year: '2019', title: 'Customer Satisfaction Award', agency: 'Indian Real Estate Forum', desc: 'Awarded for maintaining highest standards of customer service and client satisfaction across all projects.' },
  { id: 6, year: '2018', title: 'Best Luxury Villa Development', agency: 'South India Property Awards', desc: 'Recognized as the best luxury villa developer for creating premium residential spaces with world-class amenities.' },
];

const empty = { id: Date.now(), year: '', title: '', agency: '', desc: '' };

function AdminAwards() {
  const [awards, setAwards] = useState(() => {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : DEFAULT_AWARDS;
  });
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(empty);
  const [saved, setSaved] = useState(false);

  const persist = (updated) => {
    setAwards(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const startEdit = (a) => { setEditing(a.id); setAdding(false); setForm({ ...a }); };
  const startAdd = () => { setAdding(true); setEditing(null); setForm({ ...empty, id: Date.now() }); };
  const cancel = () => { setEditing(null); setAdding(false); };
  const handleChange = (f, v) => setForm(x => ({ ...x, [f]: v }));

  const save = () => {
    if (adding) persist([...awards, form]);
    else persist(awards.map(a => a.id === editing ? form : a));
    cancel();
  };

  const del = (id) => { if (window.confirm('Delete this award?')) persist(awards.filter(a => a.id !== id)); };

  const isOpen = editing !== null || adding;

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <p className="admin-section-desc">Manage awards and recognition shown on the website.</p>
        <button className="admin-btn-primary" onClick={startAdd}>+ Add Award</button>
      </div>
      {saved && <div className="admin-toast">✓ Saved</div>}

      {!isOpen && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Year</th><th>Title</th><th>Agency</th><th>Actions</th></tr></thead>
            <tbody>
              {awards.map(a => (
                <tr key={a.id}>
                  <td><span className="admin-tag">{a.year}</span></td>
                  <td className="admin-td-name">{a.title}</td>
                  <td>{a.agency}</td>
                  <td className="admin-td-actions">
                    <button className="admin-btn-edit" onClick={() => startEdit(a)}>Edit</button>
                    <button className="admin-btn-delete" onClick={() => del(a.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isOpen && (
        <div className="admin-form-card">
          <h3 className="admin-form-title">{adding ? 'Add Award' : 'Edit Award'}</h3>
          <div className="admin-form-grid">
            <div className="admin-field"><label>Year</label><input value={form.year} onChange={e => handleChange('year', e.target.value)} placeholder="2023" /></div>
            <div className="admin-field"><label>Title</label><input value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="Award title" /></div>
            <div className="admin-field admin-field--full"><label>Agency / Organization</label><input value={form.agency} onChange={e => handleChange('agency', e.target.value)} placeholder="Awarding body" /></div>
            <div className="admin-field admin-field--full"><label>Description</label><textarea rows={3} value={form.desc} onChange={e => handleChange('desc', e.target.value)} /></div>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn-primary" onClick={save}>{adding ? 'Add Award' : 'Save'}</button>
            <button className="admin-btn-ghost" onClick={cancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAwards;
