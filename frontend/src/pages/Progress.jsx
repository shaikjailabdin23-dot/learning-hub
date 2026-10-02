import React from 'react';
import { useProgress } from '../hooks/useProgress';
import { useAuth } from '../hooks/useAuth';
import ProgressBar from '../components/ProgressBar';

const Progress = () => {
  const { user } = useAuth();
  const { progress } = useProgress();

  const overallPct = progress?.overallPercentage || 68;
  const hubStats = progress?.hubStats || {};

  return (
    <div className="progress-dashboard animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Top Banner with Circular Gauge */}
      <section className="progress-hero-banner">
        <div style={{ maxWidth: '480px' }}>
          <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>
            Academic Milestone Tracker
          </span>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>
            {user?.name || 'Student'}’s Analytics & Budget
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
            Track your mastery across all five engineering hubs in real-time. Consistent daily practice
            compounds into formidable software engineering capability.
          </p>
        </div>

        {/* Pure CSS Conic Gradient Circular Progress */}
        <div className="circular-gauge-container">
          <div
            className="circular-progress"
            style={{
              background: `conic-gradient(var(--accent) 0% ${overallPct}%, rgba(255,255,255,0.08) ${overallPct}% 100%)`,
            }}
          >
            <div className="circular-progress-inner">
              <span className="circular-progress-val">{overallPct}%</span>
              <span className="circular-progress-sub">Platform Completion</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Progress Statistics Cards */}
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
          <div className="stat-icon-wrapper" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            📊
          </div>
          <div className="stat-info">
            <span className="stat-val">{progress?.avgQuizScore || 84}%</span>
            <span className="stat-label">Average Quiz Score</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-streak">🔥</div>
          <div className="stat-info">
            <span className="stat-val">{progress?.streak || 7} Days</span>
            <span className="stat-label">Learning Streak</span>
          </div>
        </div>
      </section>

      {/* Hub by Hub Breakdown Progress Grid */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Curriculum Progress by Hub</h2>
        </div>

        <div className="hub-progress-grid">
          <div className="hub-progress-card">
            <div className="hub-progress-card-header">
              <span className="hub-progress-name">💻 Technical Hub</span>
              <span className="hub-progress-pct">{hubStats.technical?.percentage || 67}%</span>
            </div>
            <ProgressBar value={hubStats.technical?.percentage || 67} height="7px" gradient="var(--accent-gradient)" />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {hubStats.technical?.completed || 6} of {hubStats.technical?.total || 9} modules completed
            </div>
          </div>

          <div className="hub-progress-card">
            <div className="hub-progress-card-header">
              <span className="hub-progress-name">✨ Skills Hub</span>
              <span className="hub-progress-pct" style={{ color: '#38bdf8' }}>
                {hubStats.skills?.percentage || 63}%
              </span>
            </div>
            <ProgressBar value={hubStats.skills?.percentage || 63} height="7px" gradient="linear-gradient(135deg, #00d4ff 0%, #0284c7 100%)" />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {hubStats.skills?.completed || 5} of {hubStats.skills?.total || 8} competencies developed
            </div>
          </div>

          <div className="hub-progress-card">
            <div className="hub-progress-card-header">
              <span className="hub-progress-name">⚡ Coding Hub</span>
              <span className="hub-progress-pct" style={{ color: '#10b981' }}>
                {hubStats.coding?.percentage || 71}%
              </span>
            </div>
            <ProgressBar value={hubStats.coding?.percentage || 71} height="7px" gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)" />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {hubStats.coding?.completed || 10} of {hubStats.coding?.total || 14} algorithms mastered
            </div>
          </div>

          <div className="hub-progress-card">
            <div className="hub-progress-card-header">
              <span className="hub-progress-name">🎯 Career Hub</span>
              <span className="hub-progress-pct" style={{ color: '#f59e0b' }}>
                {hubStats.career?.percentage || 80}%
              </span>
            </div>
            <ProgressBar value={hubStats.career?.percentage || 80} height="7px" gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {hubStats.career?.completed || 4} of {hubStats.career?.total || 5} placement milestones
            </div>
          </div>

          <div className="hub-progress-card">
            <div className="hub-progress-card-header">
              <span className="hub-progress-name">🚀 Project Hub</span>
              <span className="hub-progress-pct" style={{ color: '#ec4899' }}>
                {hubStats.project?.percentage || 60}%
              </span>
            </div>
            <ProgressBar value={hubStats.project?.percentage || 60} height="7px" gradient="linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)" />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {hubStats.project?.completed || 3} of {hubStats.project?.total || 5} capstones published
            </div>
          </div>
        </div>
      </section>

      {/* Student Engineering & Learning Resource Budget */}
      <section style={{ marginTop: '2rem' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Student Resource & Learning Budget</h2>
            <p className="section-subtitle">
              Manage your academic study hours, developer tools quota, and deployment resources.
            </p>
          </div>
        </div>

        <div className="hub-progress-grid">
          <div className="hub-progress-card">
            <div className="hub-progress-card-header">
              <span className="hub-progress-name">⏱️ Weekly Study Time Budget</span>
              <span className="hub-progress-pct" style={{ color: 'var(--accent-secondary)' }}>80%</span>
            </div>
            <ProgressBar value={80} height="7px" gradient="var(--accent-gradient)" />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              24.0 of 30.0 targeted study hours completed this week
            </div>
          </div>

          <div className="hub-progress-card">
            <div className="hub-progress-card-header">
              <span className="hub-progress-name">☁️ Cloud Sandbox & Deployments</span>
              <span className="hub-progress-pct" style={{ color: '#4ade80' }}>85%</span>
            </div>
            <ProgressBar value={85} height="7px" gradient="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              $42.50 of $50.00 student cloud credits remaining
            </div>
          </div>

          <div className="hub-progress-card">
            <div className="hub-progress-card-header">
              <span className="hub-progress-name">🤖 AI Assistant & API Tokens</span>
              <span className="hub-progress-pct" style={{ color: '#a78bfa' }}>74%</span>
            </div>
            <ProgressBar value={74} height="7px" gradient="linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)" />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              185,000 of 250,000 monthly educational tokens active
            </div>
          </div>

          <div className="hub-progress-card">
            <div className="hub-progress-card-header">
              <span className="hub-progress-name">🚀 Capstone Portfolio Target</span>
              <span className="hub-progress-pct" style={{ color: '#ec4899' }}>75%</span>
            </div>
            <ProgressBar value={75} height="7px" gradient="linear-gradient(135deg, #ec4899 0%, #db2777 100%)" />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              3 of 4 planned capstone portfolio projects published
            </div>
          </div>
        </div>
      </section>

      {/* Activity Timeline */}
      <section className="activity-card">
        <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>📅 Recent Activity Timeline</h3>
        <div className="timeline-list">
          <div className="timeline-item">
            <div className="timeline-dot" />
            <div>
              <div style={{ fontWeight: 600 }}>Completed Quiz: React Fundamentals</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Score: 100% (4/4 correct) • 2 hours ago</div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot" />
            <div>
              <div style={{ fontWeight: 600 }}>Solved Algorithmic Challenge: Two Sum (Hash Map)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Coding Hub • Yesterday</div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot" />
            <div>
              <div style={{ fontWeight: 600 }}>Updated Job Application: Stripe (Interview Scheduled)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Career Hub • 2 days ago</div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot" />
            <div>
              <div style={{ fontWeight: 600 }}>Studied Lesson: Operating Systems: Concurrency & Threads</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Technical Hub • 3 days ago</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Progress;
