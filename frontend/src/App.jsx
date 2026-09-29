import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TechnicalHub from './pages/TechnicalHub';
import SkillsHub from './pages/SkillsHub';
import CodingHub from './pages/CodingHub';
import CareerHub from './pages/CareerHub';
import ProjectHub from './pages/ProjectHub';
import Topic from './pages/Topic';
import Quiz from './pages/Quiz';
import Projects from './pages/Projects';
import Progress from './pages/Progress';
import Help from './pages/Help';
import Community from './pages/Community';
import Info from './pages/Info';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content-wrapper">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="main-content">
          <Routes>
            {/* Public Landing & Auth Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Curricula Hubs */}
            <Route path="/technical-hub" element={<TechnicalHub />} />
            <Route path="/technical-skills" element={<Navigate to="/technical-hub" replace />} />
            <Route path="/skills-hub" element={<SkillsHub />} />
            <Route path="/coding-hub" element={<CodingHub />} />
            <Route path="/career-hub" element={<CareerHub />} />
            <Route path="/project-hub" element={<ProjectHub />} />

            {/* Curriculum Reader & Quiz Interactive Modules */}
            <Route path="/topic/:topicSlug" element={<Topic />} />
            <Route path="/quiz/:topicSlug" element={<Quiz />} />

            {/* Student Dedicated CRUD & Progress Workspaces */}
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route path="/management-hub" element={<Navigate to="/projects" replace />} />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />

            {/* Community & Support */}
            <Route path="/community" element={<Community />} />
            <Route path="/help" element={<Help />} />
            <Route path="/info" element={<Info />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProgressProvider>
          <AppLayout />
        </ProgressProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
