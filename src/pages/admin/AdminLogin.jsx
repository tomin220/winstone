import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const ADMIN_PASSWORD = 'admin123';

function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <img src="/images/winstonelogo.jpg" alt="Winstone" />
        </div>
        <h1 className="admin-login-title">Admin Portal</h1>
        <p className="admin-login-sub">Winstone Projects Management</p>

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter admin password"
              autoFocus
            />
          </div>
          {error && <p className="admin-error">{error}</p>}
          <button type="submit" className="admin-login-btn">Sign In</button>
        </form>

        <a href="/" className="admin-back-link">← Back to Website</a>
      </div>
    </div>
  );
}

export default AdminLogin;
