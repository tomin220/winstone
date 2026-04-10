import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes — no navbar/footer */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* Public routes */}
        <Route path="/*" element={
          <div className="app">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
