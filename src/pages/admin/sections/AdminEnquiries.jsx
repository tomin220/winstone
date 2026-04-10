import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setEnquiries(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchEnquiries(); }, []);

  const deleteEnquiry = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    await supabase.from('enquiries').delete().eq('id', id);
    setEnquiries(e => e.filter(x => x.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <p className="admin-section-desc">
          All enquiries submitted through the contact form. Total: <strong style={{ color: '#C9A14A' }}>{enquiries.length}</strong>
        </p>
        <button className="admin-btn-ghost" onClick={fetchEnquiries}>↻ Refresh</button>
      </div>

      {loading && <div className="admin-enq-loading">Loading enquiries...</div>}
      {error && <div className="admin-enq-error">Error: {error}</div>}

      {!loading && !error && enquiries.length === 0 && (
        <div className="admin-enq-empty">
          <span>📭</span>
          <p>No enquiries yet. They'll appear here once someone submits the contact form.</p>
        </div>
      )}

      {!loading && enquiries.length > 0 && (
        <div className="admin-enq-layout">
          {/* List */}
          <div className="admin-enq-list">
            {enquiries.map(enq => (
              <div
                key={enq.id}
                className={`admin-enq-item${selected?.id === enq.id ? ' admin-enq-item--active' : ''}`}
                onClick={() => setSelected(enq)}
              >
                <div className="admin-enq-item-top">
                  <span className="admin-enq-name">{enq.name || '—'}</span>
                  <span className="admin-enq-date">{formatDate(enq.created_at)}</span>
                </div>
                <div className="admin-enq-email">{enq.email}</div>
                <div className="admin-enq-preview">
                  {enq.message?.substring(0, 80)}{enq.message?.length > 80 ? '...' : ''}
                </div>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div className="admin-enq-detail">
            {!selected ? (
              <div className="admin-enq-detail-empty">
                <span>👆</span>
                <p>Select an enquiry to view details</p>
              </div>
            ) : (
              <>
                <div className="admin-enq-detail-header">
                  <div>
                    <h3 className="admin-enq-detail-name">{selected.name}</h3>
                    <span className="admin-enq-detail-date">{formatDate(selected.created_at)}</span>
                  </div>
                  <button className="admin-btn-delete" onClick={() => deleteEnquiry(selected.id)}>Delete</button>
                </div>

                <div className="admin-enq-detail-fields">
                  <div className="admin-enq-field">
                    <label>Email</label>
                    <a href={`mailto:${selected.email}`} className="admin-enq-link">{selected.email}</a>
                  </div>
                  {selected.company && (
                    <div className="admin-enq-field">
                      <label>Company</label>
                      <span>{selected.company}</span>
                    </div>
                  )}
                  <div className="admin-enq-field admin-enq-field--full">
                    <label>Message</label>
                    <div className="admin-enq-message">{selected.message}</div>
                  </div>
                </div>

                <a href={`mailto:${selected.email}?subject=Re: Your Enquiry - Winstone Projects`} className="admin-btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  ✉ Reply via Email
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminEnquiries;
