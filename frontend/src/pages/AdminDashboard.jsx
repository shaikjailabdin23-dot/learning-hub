import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import adminService from '../services/adminService';
import projectService from '../services/projectService';
import ProjectFullFrameModal from '../components/ProjectFullFrameModal';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'users' | 'activity' | 'projects'
  const [userSearch, setUserSearch] = useState('');
  const [dispatchStatus, setDispatchStatus] = useState(null);
  const [dispatching, setDispatching] = useState(false);
  const [activeFullFrameProject, setActiveFullFrameProject] = useState(null);

  // Load real admin statistics and records
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes, actRes, projRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        adminService.getActivity(50),
        projectService.getProjects(),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data || []);
      setActivities(actRes.data || []);
      setProjects(projRes.data || []);
    } catch (err) {
      console.error('[AdminDashboard Load Error]:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load admin statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendWeeklyReport = async () => {
    setDispatching(true);
    setDispatchStatus(null);
    try {
      const res = await adminService.sendWeeklyReport();
      setDispatchStatus({ success: true, message: res.message || 'Weekly report dispatched to admin email successfully!' });
    } catch (err) {
      setDispatchStatus({ success: false, message: err.response?.data?.message || 'Failed to dispatch report.' });
    } finally {
      setDispatching(false);
      setTimeout(() => setDispatchStatus(null), 6000);
    }
  };

  // Filter users by search
  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.branch?.toLowerCase().includes(q) ||
      u.college?.toLowerCase().includes(q)
    );
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="page-container admin-dashboard-page animate-fade-in" style={{ padding: '1.5rem 2rem' }}>
      {/* Top Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.18) 0%, rgba(236, 72, 153, 0.15) 100%)',
          border: '1px solid rgba(108, 99, 255, 0.3)',
          borderRadius: 'var(--radius)',
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                letterSpacing: '0.8px',
              }}
            >
              👑 Platform Administrator
            </span>
            <span style={{ color: 'var(--accent-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
              Live Telemetry & Management
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.4rem' }}>
            Administrator Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
            Logged in as <strong style={{ color: '#fff' }}>{user?.email || 'shaikjailabdin23@gmail.com'}</strong>.
            Real-time analytics, user tracking, platform activity, and project governance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={loadData}
            disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>🔄</span> Refresh Data
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSendWeeklyReport}
            disabled={dispatching}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>📬</span> {dispatching ? 'Dispatching...' : 'Send Weekly Report Now'}
          </button>
          <Link
            to="/projects"
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>🛠️</span> Project Hub Manager
          </Link>
        </div>
      </div>

      {dispatchStatus && (
        <div
          style={{
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            borderRadius: 'var(--radius-sm)',
            background: dispatchStatus.success ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${dispatchStatus.success ? 'var(--success)' : 'var(--danger)'}`,
            color: dispatchStatus.success ? '#86efac' : '#fca5a5',
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>{dispatchStatus.success ? '✅' : '❌'}</span>
          <span>{dispatchStatus.message}</span>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--danger)',
            color: '#fca5a5',
            fontSize: '0.92rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border)',
          marginBottom: '1.75rem',
          paddingBottom: '0.5rem',
        }}
      >
        {[
          { id: 'analytics', label: '📊 Platform Analytics', badge: null },
          { id: 'users', label: '👥 Registered Users', badge: users.length },
          { id: 'activity', label: '⚡ Real Platform Activity', badge: activities.length },
          { id: 'projects', label: '📁 Managed Projects', badge: projects.length },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--surface-active)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              padding: '0.65rem 1.15rem',
              borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
            }}
          >
            <span>{tab.label}</span>
            {tab.badge !== null && (
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  background: activeTab === tab.id ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                  color: '#fff',
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading && !stats ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Aggregating live platform metrics from database...</p>
        </div>
      ) : null}

      {/* TAB 1: ANALYTICS & STATS */}
      {activeTab === 'analytics' && stats && (
        <div className="animate-fade-in">
          {/* Main Users & Traffic KPI Grid */}
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>
            User Population & Traffic Metrics
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div className="hub-stat-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>
                Total Registered Users
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#fff', margin: '0.35rem 0' }}>
                {stats.totalRegisteredUsers}
              </div>
              <div style={{ color: '#22c55e', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>●</span> Real database accounts
              </div>
            </div>

            <div className="hub-stat-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>
                New Users (This Week)
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#22c55e', margin: '0.35rem 0' }}>
                +{stats.newUsersThisWeek}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                +{stats.newUsersToday} registered today
              </div>
            </div>

            <div className="hub-stat-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>
                Active Users (30 Days)
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#38bdf8', margin: '0.35rem 0' }}>
                {stats.activeUsers}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                {stats.dailyUsers} active in last 24h
              </div>
            </div>

            <div className="hub-stat-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>
                Total Platform Logins
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f59e0b', margin: '0.35rem 0' }}>
                {stats.totalLogins}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                Across all active students
              </div>
            </div>
          </div>

          {/* Timeframe User Retention */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ background: 'rgba(19, 34, 56, 0.6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📅</span>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.4rem' }}>Daily Users (Past 24h)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>{stats.dailyUsers}</div>
            </div>

            <div style={{ background: 'rgba(19, 34, 56, 0.6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🗓️</span>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.4rem' }}>Weekly Users (Past 7d)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>{stats.weeklyUsers}</div>
            </div>

            <div style={{ background: 'rgba(19, 34, 56, 0.6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📈</span>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.4rem' }}>Monthly Users (Past 30d)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>{stats.monthlyUsers}</div>
            </div>

            <div style={{ background: 'rgba(19, 34, 56, 0.6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📁</span>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.4rem' }}>Total Managed Projects</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ec4899' }}>{stats.totalProjects}</div>
            </div>
          </div>

          {/* Module Engagement & Usage Statistics */}
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>
            Hub & Module Engagement Statistics
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2.5rem',
            }}
          >
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', fontWeight: 600 }}>Technical Hub</span>
                <span style={{ fontSize: '1.2rem' }}>🖥️</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#6c63ff', marginTop: '0.5rem' }}>
                {stats.technicalHubUsage}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lesson visits & curricula reads</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', fontWeight: 600 }}>Coding Hub</span>
                <span style={{ fontSize: '1.2rem' }}>💻</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '0.5rem' }}>
                {stats.codingHubUsage}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Problem executions & submissions</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', fontWeight: 600 }}>Developer Tools</span>
                <span style={{ fontSize: '1.2rem' }}>🛠️</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.5rem' }}>
                {stats.developerToolsUsage}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tool drawer & toolkit opens</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', fontWeight: 600 }}>Project Views</span>
                <span style={{ fontSize: '1.2rem' }}>📁</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ec4899', marginTop: '0.5rem' }}>
                {stats.projectViews}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Portfolio & showcase views</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', fontWeight: 600 }}>Career Hub</span>
                <span style={{ fontSize: '1.2rem' }}>🎯</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.5rem' }}>
                {stats.careerHubUsage}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Roadmaps, skills & gaps tracked</div>
            </div>
          </div>

          {/* Daily Activity Trends Chart */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
              Daily Platform Activity & Logins (Past 7 Days)
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${stats.chartData?.length || 7}, 1fr)`,
                gap: '1rem',
                alignItems: 'flex-end',
                height: '180px',
                padding: '1rem 0.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {stats.chartData?.map((item, idx) => {
                const max = Math.max(...stats.chartData.map((c) => c.totalActivity || 1), 5);
                const heightPct = Math.max(15, Math.round(((item.totalActivity || 0) / max) * 100));

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                      justifyContent: 'flex-end',
                      gap: '0.4rem',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>
                      {item.totalActivity || 0}
                    </span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '42px',
                        height: `${heightPct}%`,
                        background: 'linear-gradient(180deg, #6c63ff 0%, #3b82f6 100%)',
                        borderRadius: '6px 6px 0 0',
                        boxShadow: '0 0 12px rgba(108, 99, 255, 0.3)',
                        transition: 'height 0.4s ease',
                      }}
                      title={`${item.date}: ${item.totalActivity} activities, ${item.logins} logins`}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {item.date.split(',')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', background: '#6c63ff', borderRadius: '2px' }}></span>
                Platform Interactions & Navigation Events
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED USERS TABLE */}
      {activeTab === 'users' && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              Registered Student & User Accounts ({filteredUsers.length})
            </h2>

            <div style={{ width: '300px' }}>
              <input
                type="text"
                placeholder="Search user name, email, branch..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                style={{ width: '100%', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              overflowX: 'auto',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>User Name</th>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Email Address</th>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Registration Date</th>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Last Login</th>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Last Active</th>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Modules Used</th>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No registered users matched your query.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr
                      key={u._id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background 0.15s',
                      }}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: u.role === 'admin' ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' : 'var(--accent)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.78rem',
                              color: '#fff',
                              fontWeight: 700,
                            }}
                          >
                            {u.role === 'admin' ? '🛡️' : u.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                        <a href={`mailto:${u.email}`} style={{ color: 'var(--accent-secondary)' }}>
                          {u.email}
                        </a>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                        {formatDate(u.createdAt)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                        {formatDate(u.lastLogin)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#86efac' }}>
                        {formatDate(u.lastActive)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                          {(u.modulesUsed && u.modulesUsed.length > 0
                            ? u.modulesUsed
                            : ['Technical Hub', 'Coding Hub']
                          ).map((mod, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '0.7rem',
                                padding: '0.15rem 0.45rem',
                                borderRadius: '4px',
                                background: 'rgba(108, 99, 255, 0.15)',
                                color: '#c4b5fd',
                                border: '1px solid rgba(108, 99, 255, 0.3)',
                              }}
                            >
                              {mod}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '999px',
                            background: u.role === 'admin' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(34, 197, 94, 0.15)',
                            color: u.role === 'admin' ? '#f472b6' : '#86efac',
                            border: `1px solid ${u.role === 'admin' ? '#f472b6' : '#22c55e'}`,
                          }}
                        >
                          {u.role === 'admin' ? 'Admin' : 'Student'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REAL PLATFORM ACTIVITY STREAM */}
      {activeTab === 'activity' && (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>
            Real-Time Activity Audit Trail ({activities.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activities.length === 0 ? (
              <div style={{ background: 'var(--bg-secondary)', padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
                No activity records recorded yet. Interactions from students will appear here in real time.
              </div>
            ) : (
              activities.map((act) => {
                const typeColor =
                  act.type === 'registration'
                    ? '#22c55e'
                    : act.type === 'login' || act.type === 'first_login'
                    ? '#38bdf8'
                    : act.type === 'coding_hub'
                    ? '#10b981'
                    : act.type === 'project_view' || act.type === 'project_manage'
                    ? '#ec4899'
                    : '#f59e0b';

                return (
                  <div
                    key={act._id}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: typeColor,
                          boxShadow: `0 0 8px ${typeColor}`,
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>
                          {act.userName || 'Student'} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({act.userEmail || 'N/A'})</span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                          Action: <strong style={{ color: typeColor }}>{act.type}</strong> in{' '}
                          <strong style={{ color: '#fff' }}>{act.module}</strong>
                          {act.details && Object.keys(act.details).length > 0 && (
                            <span style={{ color: 'var(--text-muted)' }}> — {JSON.stringify(act.details)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {formatDate(act.createdAt)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 4: MANAGED PROJECTS */}
      {activeTab === 'projects' && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              Project Hub Portfolio ({projects.length})
            </h2>
            <Link to="/projects" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              + Add / Edit Project in Management Hub
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {projects.map((proj) => (
              <div
                key={proj._id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>{proj.category}</span>
                    <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(34, 197, 94, 0.15)', color: '#86efac' }}>
                      {proj.status || 'Active'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>{proj.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                    {proj.description?.substring(0, 110)}...
                  </p>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {proj.technologies?.map((tech, i) => (
                      <span key={i} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setActiveFullFrameProject(proj)}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      padding: '0.4rem 0.6rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      background: 'linear-gradient(135deg, #6c63ff 0%, #00d4ff 100%)',
                    }}
                    title="Open Project in Full Frame Viewer"
                  >
                    <span>Full Frame</span>
                    <span>⛶</span>
                  </button>

                  <Link to="/projects" className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
                    Edit
                  </Link>

                  {proj.demoUrl && (
                    <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
                      ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Standalone Interactive Full-Frame Project Viewer */}
      {activeFullFrameProject && (
        <ProjectFullFrameModal
          project={activeFullFrameProject}
          onClose={() => setActiveFullFrameProject(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
