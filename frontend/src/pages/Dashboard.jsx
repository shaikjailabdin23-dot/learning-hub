import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProgress } from '../hooks/useProgress';
import hubService from '../services/hubService';
import HubCard from '../components/HubCard';
import ProgressBar from '../components/ProgressBar';

const Dashboard = () => {
  const { user } = useAuth();
  const { progress } = useProgress();
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hubService.getHubs().then((data) => {
      setHubs(data);
      setLoading(false);
    });
  }, []);

  const overallPct = progress?.overallPercentage || 68;

  return (
    <div className="dashboard animate-fade-in">
      {/* Hero Welcome Banner */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            ⚡ Student Engineering HQ • Year {user?.year || 3}
          </div>
          <h1 className="hero-title">
            Welcome back, <span>{user?.name || 'Engineer'}</span>!
          </h1>
          <p className="hero-desc">
            You are on a <strong>{progress?.streak || 7}-day streak</strong>! Continue your deep-dive
            in the Technical Hub or solve algorithmic challenges in the Coding Hub today.
          </p>

          <div className="hero-actions">
            <Link to="/technical-hub" className="btn-primary">
              Continue Learning <span>→</span>
            </Link>
            <Link to="/coding-hub" className="btn-secondary">
              Solve Coding Problem ⚡
            </Link>
            <Link to="/projects" className="btn-outline">
              Manage Projects 📁
            </Link>
          </div>
        </div>

        <div className="hero-progress-summary">
          <div className="hero-progress-val">{overallPct}%</div>
          <div className="hero-progress-label">Overall Completion</div>
          <div style={{ width: '100%', marginTop: '0.75rem' }}>
            <ProgressBar value={overallPct} height="6px" />
          </div>
        </div>
      </section>

      {/* Stats Metrics Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-topics">📚</div>
          <div className="stat-info">
            <span className="stat-val">{progress?.completedTopicsCount || 24}</span>
            <span className="stat-label">Topics Completed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-quizzes">🎯</div>
          <div className="stat-info">
            <span className="stat-val">{progress?.completedQuizzesCount || 18}</span>
            <span className="stat-label">Quizzes Passed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-projects">🚀</div>
          <div className="stat-info">
            <span className="stat-val">{progress?.totalProjects || 6}</span>
            <span className="stat-label">Showcase Projects</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-streak">🔥</div>
          <div className="stat-info">
            <span className="stat-val">{progress?.streak || 7} Days</span>
            <span className="stat-label">Active Learning Streak</span>
          </div>
        </div>
      </section>

      {/* Continue Learning Banner */}
      <section className="continue-learning-section">
        <div className="continue-left">
          <div className="continue-icon">💡</div>
          <div>
            <div className="continue-title">Next Recommended Lesson: React Fundamentals</div>
            <div className="continue-subtitle">
              Component Architecture, Virtual DOM diffing & Hooks (useState, useEffect)
            </div>
          </div>
        </div>
        <Link to="/topic/react-fundamentals" className="btn-primary" style={{ padding: '0.65rem 1.4rem' }}>
          Resume Lesson →
        </Link>
      </section>

      {/* Five Hubs Overview Grid */}
      <section>
        <div className="section-header">
          <div>
            <h2 className="section-title">Explore Your Hubs</h2>
            <p className="section-subtitle">
              Click any hub to access tailored curricula, lessons, and hands-on drills.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading Hubs...</p>
          </div>
        ) : (
          <div className="hubs-grid">
            {hubs.map((hub) => {
              const hubPct = progress?.hubStats?.[hub.slug]?.percentage || 65;
              return <HubCard key={hub._id || hub.slug} hub={hub} progress={hubPct} />;
            })}
          </div>
        )}
      </section>

      {/* Recent & Recommended Topics Dual Grid */}
      <section className="dual-section-grid">
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div className="section-header" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>🕒 Recently Studied Topics</h3>
          </div>
          <div className="recent-list">
            <Link to="/topic/variables-and-data-types" className="recent-item">
              <div>
                <div className="recent-item-title">Variables & Data Types</div>
                <div className="recent-item-cat">Programming Fundamentals</div>
              </div>
              <span className="topic-completed-indicator">✓ Completed</span>
            </Link>

            <Link to="/topic/rest-apis-and-node" className="recent-item">
              <div>
                <div className="recent-item-title">Node.js, Express & REST APIs</div>
                <div className="recent-item-cat">Web Development</div>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)' }}>In Progress</span>
            </Link>

            <Link to="/topic/arrays-and-dp-essentials" className="recent-item">
              <div>
                <div className="recent-item-title">Arrays & Dynamic Programming</div>
                <div className="recent-item-cat">Data Structures & Algorithms</div>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Resume →</span>
            </Link>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div className="section-header" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>⭐ Curated Recommendations</h3>
          </div>
          <div className="recent-list">
            <Link to="/topic/cybersecurity-authentication-jwt" className="recent-item">
              <div>
                <div className="recent-item-title">Authentication & JWT Security</div>
                <div className="recent-item-cat">Cybersecurity</div>
              </div>
              <span className="badge badge-intermediate">Intermediate</span>
            </Link>

            <Link to="/topic/cloud-computing-aws-docker" className="recent-item">
              <div>
                <div className="recent-item-title">Cloud Computing & Docker</div>
                <div className="recent-item-cat">Cloud Computing</div>
              </div>
              <span className="badge badge-intermediate">Intermediate</span>
            </Link>

            <Link to="/coding-hub" className="recent-item">
              <div>
                <div className="recent-item-title">Solve: Two Sum Problem</div>
                <div className="recent-item-cat">DSA Problem Solving</div>
              </div>
              <span className="badge badge-beginner">Easy</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
