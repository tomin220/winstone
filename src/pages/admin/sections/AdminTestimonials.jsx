import { useState } from 'react';

const STORAGE_KEY = 'admin_testimonials';

const DEFAULT = [
  { id: 1, quote: 'Working with Winstone Group has been a journey of professionalism. Their commitment to quality in real estate development sets them apart in the UAE market.', name: 'Ahmed Al Farsi', role: 'Real Estate Investor, Abu Dhabi', initial: 'A' },
  { id: 2, quote: 'The DAMAC Islands project exceeded every expectation. Winstone\'s expertise in luxury developments is unmatched in the region.', name: 'Khalid Al Mansoori', role: 'Property Developer, Dubai', initial: 'K' },
  { id: 3, quote: 'From the first meeting to handover, the Winstone team was transparent, professional and genuinely invested in our success. Highly recommended.', name: 'Sara Al Hashimi', role: 'Investment Director, Abu Dhabi', initial: 'S' },
  { id: 4, quote: 'Winstone\'s deep knowledge of the UAE real estate market and their premium project portfolio make them the go-to partner for luxury investments.', name: 'Omar Al Rashid', role: 'CEO, Gulf Capital Properties, Dubai', initial: 'O' },
];

const empty = { id: Date.now(), quote: '', name: '', role: '', initial: '' };

function AdminTestimonials() {
  const [items, setItems] = useState(() => {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : DEFAULT;
  });
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(empty);
  const [saved, setSaved] = useState(false);

  const persist = (updated) => {
    setItems(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const startEdit = (t) => { setEditing(t.id); setAdding(false); setForm({ ...t }); };
  const startAdd = () => { setAdding(true); setEditing(null); setForm({ ...empty, id: Date.now() }); };
  const cancel = () => { setEditing(null); setAdding(false); };
  const handleChange = (f, v) => setForm(x => ({ ...x, [f]: v }));

  const save = () => {
    const cleaned = { ...form, initial: form.initial || form.name.charAt(0).toUpperCase() };
    if (adding) persist([...items, cleaned]);
    else persist(items.map(t => t.id === editing ? cleaned : t));
    cancel();
  };

  const del = (id) => { if (window.confirm('Delete this testimonial?')) persist(items.filter(t => t.id !== id)); };

  const isOpen = editing !== null || adding;

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <p className="admin-section-desc">Manage client testimonials shown on the website.</p>
        <button className="admin-btn-primary" onClick={startAdd}>+ Add Testimonial</button>
      </div>
      {saved && <div className="admin-toast">✓ Saved</div>}

      {!isOpen && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Role</th><th>Quote</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(t => (
                <tr key={t.id}>
                  <td className="admin-td-name">{t.name}</td>
                  <td>{t.role}</td>
                  <td className="admin-td-quote">"{t.quote.substring(0, 60)}..."</td>
                  <td className="admin-td-actions">
                    <button className="admin-btn-edit" onClick={() => startEdit(t)}>Edit</button>
                    <button className="admin-btn-delete" onClick={() => del(t.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isOpen && (
        <div className="admin-form-card">
          <h3 className="admin-form-title">{adding ? 'Add Testimonial' : 'Edit Testimonial'}</h3>
          <div className="admin-form-grid">
            <div className="admin-field"><label>Client Name</label><input value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="John Doe" /></div>
            <div className="admin-field"><label>Role / Company</label><input value={form.role} onChange={e => handleChange('role', e.target.value)} placeholder="CEO, Company Name" /></div>
            <div className="admin-field admin-field--full"><label>Testimonial Quote</label><textarea rows={4} value={form.quote} onChange={e => handleChange('quote', e.target.value)} placeholder="What they said about Winstone..." /></div>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn-primary" onClick={save}>{adding ? 'Add' : 'Save'}</button>
            <button className="admin-btn-ghost" onClick={cancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTestimonials;
