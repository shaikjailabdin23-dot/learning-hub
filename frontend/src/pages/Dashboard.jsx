import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProgress } from '../hooks/useProgress';
import hubService from '../services/hubService';
import careerService from '../services/careerService';
import HubCard from '../components/HubCard';
import ProgressBar from '../components/ProgressBar';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const { progress } = useProgress();
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [careerInfo, setCareerInfo] = useState({
    selectedCareer: 'Software Developer',
    roadmapProgress: 65,
    nextSkill: 'React.js',
    projectsCompleted: 3,
    interviewReadiness: 40,
  });

  useEffect(() => {
    hubService.getHubs().then((data) => {
      setHubs(data);
      setLoading(false);
    });

    careerService.getProfile().then((data) => {
      if (data) {
        setCareerInfo({
          selectedCareer: data.selectedCareer || 'Software Developer',
          roadmapProgress: data.roadmapProgress || 65,
          nextSkill: (data.completedSkills && data.completedSkills.includes('React.js') ? 'Node.js & Express' : 'React.js'),
          projectsCompleted: data.projectsCompleted !== undefined ? data.projectsCompleted : 3,
          interviewReadiness: data.careerReadiness || 40,
        });
      }
    });
  }, []);

  const overallPct = progress?.overallPercentage || 68;

  return (
    <div className="dashboard animate-fade-in">
      {/* Hero Welcome Banner */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            {isAdmin ? '🛡️ Platform Administration HQ • Full CRUD Access' : `⚡ Student Engineering HQ • Year ${user?.year || 3}`}
          </div>
          <h1 className="hero-title">
            Welcome back, <span>{user?.name || (isAdmin ? 'Administrator' : 'Engineer')}</span>!
          </h1>
          <p className="hero-desc">
            {isAdmin
              ? 'Administrator Console: Manage and publish production-ready capstone projects, review curriculum hubs, and maintain engineering resources for students.'
              : `You are on a ${progress?.streak || 7}-day streak! Continue your deep-dive in the Technical Hub or solve algorithmic challenges in the Coding Hub today.`}
          </p>

          <div className="hero-actions">
            {isAdmin ? (
              <>
                <Link to="/projects" className="btn-primary">
                  Project Management 🛠️
                </Link>
                <Link to="/projects?action=create" className="btn-secondary" style={{ borderColor: '#ec4899', color: '#f472b6' }}>
                  + Add New Project 🚀
                </Link>
                <Link to="/project-hub" className="btn-outline">
                  View Project Hub 👁️
                </Link>
              </>
            ) : (
              <>
                <Link to="/technical-hub" className="btn-primary">
                  Continue Learning <span>→</span>
                </Link>
                <Link to="/coding-hub" className="btn-secondary">
                  Solve Coding Problem ⚡
                </Link>
                <Link to="/project-hub" className="btn-outline">
                  Explore Project Hub 📁
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-progress-summary">
          <div className="hero-progress-val">{overallPct}%</div>
          <div className="hero-progress-label">{isAdmin ? 'Platform Sync Rate' : 'Overall Completion'}</div>
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

      {/* Career Hub Planning Card (Requirement 29) */}
      <section style={{ marginBottom: '2rem' }}>
        <Link
          to="/career-hub"
          style={{
            display: 'block',
            background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.14) 0%, rgba(0, 212, 255, 0.12) 100%)',
            border: '1px solid rgba(108, 99, 255, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem 1.75rem',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'all 0.25s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          }}
          className="career-dashboard-card"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '1.6rem' }}>🎯</span>
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--accent-secondary)', fontWeight: 800, letterSpacing: '0.8px' }}>
                  STUDENT CAREER ROADMAP & READINESS
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '0.1rem 0 0' }}>
                  Career: {careerInfo.selectedCareer}
                </h2>
              </div>
            </div>
            <span className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}>
              Open Career Hub →
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', background: 'rgba(13, 27, 42, 0.6)', padding: '1.15rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Career Track</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>{careerInfo.selectedCareer}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Progress</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>{careerInfo.roadmapProgress}%</div>
              <div style={{ marginTop: '0.35rem' }}><ProgressBar value={careerInfo.roadmapProgress} height="4px" /></div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Next Skill</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.2rem' }}>⚡ {careerInfo.nextSkill}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Projects Completed</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#22c55e', marginTop: '0.2rem' }}>{careerInfo.projectsCompleted}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Interview Readiness</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ec4899', marginTop: '0.2rem' }}>{careerInfo.interviewReadiness}%</div>
              <div style={{ marginTop: '0.35rem' }}><ProgressBar value={careerInfo.interviewReadiness} height="4px" color="#ec4899" /></div>
            </div>
          </div>
        </Link>
      </section>

      {/* Admin Project Management Quick Console */}
      {isAdmin && (
        <section
          className="continue-learning-section"
          style={{
            background: 'linear-gradient(90deg, rgba(236, 72, 153, 0.15) 0%, rgba(108, 99, 255, 0.15) 100%)',
            border: '1px solid rgba(236, 72, 153, 0.35)',
            marginBottom: '2rem',
          }}
        >
          <div className="continue-left">
            <div className="continue-icon" style={{ background: 'rgba(236, 72, 153, 0.25)', color: '#f472b6' }}>
              🛡️
            </div>
            <div>
              <div className="continue-title" style={{ color: '#f472b6' }}>
                Admin Command Center & Project Governance
              </div>
              <div className="continue-subtitle">
                View real-time telemetry, manage registered students, audit platform activity, and dispatch weekly reports.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              to="/admin/dashboard"
              className="btn-primary"
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                padding: '0.65rem 1.3rem',
              }}
            >
              Admin Dashboard 🛡️
            </Link>
            <Link to="/projects" className="btn-secondary" style={{ padding: '0.65rem 1.3rem' }}>
              Project Management 📋
            </Link>
          </div>
        </section>
      )}

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
