import React, { useState } from 'react';
import { jobStatuses, initialJobApplications, interviewGuides, resumeTips } from '../data/careerData';

const CareerHub = () => {
  const [activeTab, setActiveTab] = useState('tracker'); // 'tracker', 'interviews', 'resume'
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('hub_career_applications');
    return saved ? JSON.parse(saved) : initialJobApplications;
  });

  const [newJobModal, setNewJobModal] = useState(false);
  const [newJobData, setNewJobData] = useState({
    company: '',
    position: '',
    applicationDate: new Date().toISOString().split('T')[0],
    status: 'Applied',
    interviewDate: '',
    result: 'Under Review',
    notes: '',
  });

  const handleStatusChange = (jobId, newStatus) => {
    const updated = applications.map((job) =>
      job.id === jobId ? { ...job, status: newStatus } : job
    );
    setApplications(updated);
    localStorage.setItem('hub_career_applications', JSON.stringify(updated));
  };

  const handleAddJob = (e) => {
    e.preventDefault();
    if (!newJobData.company || !newJobData.position) return;
    const newEntry = {
      ...newJobData,
      id: 'job-' + Date.now(),
    };
    const updated = [newEntry, ...applications];
    setApplications(updated);
    localStorage.setItem('hub_career_applications', JSON.stringify(updated));
    setNewJobModal(false);
    setNewJobData({
      company: '',
      position: '',
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      interviewDate: '',
      result: 'Under Review',
      notes: '',
    });
  };

  const handleDeleteJob = (jobId) => {
    const updated = applications.filter((j) => j.id !== jobId);
    setApplications(updated);
    localStorage.setItem('hub_career_applications', JSON.stringify(updated));
  };

  return (
    <div className="career-hub-page animate-fade-in">
      {/* Hero Banner */}
      <section className="hub-hero">
        <div className="hub-hero-header">
          <div className="hub-hero-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
            🎯
          </div>
          <div>
            <h1 className="hub-hero-title">Career & Placement Hub</h1>
            <p className="hub-hero-desc">
              Accelerate your transition into high-growth software roles. Manage job applications,
              master technical and STAR behavioral interviews, and craft an ATS-optimized engineering resume.
            </p>
          </div>
        </div>

        <div className="hub-stats-row">
          <div className="hub-stat-item">
            <span className="hub-stat-num">{applications.length}</span>
            <span className="hub-stat-text">Active Applications</span>
          </div>
          <div className="hub-stat-item">
            <span className="hub-stat-num">
              {applications.filter((a) => a.status === 'Interview' || a.status === 'Shortlisted').length}
            </span>
            <span className="hub-stat-text">In Interview Loops</span>
          </div>
          <div className="hub-stat-item">
            <span className="hub-stat-num">
              {applications.filter((a) => a.status === 'Selected').length}
            </span>
            <span className="hub-stat-text">Offers Received</span>
          </div>
          <div className="hub-stat-item">
            <span className="hub-stat-num">4</span>
            <span className="hub-stat-text">Interview Tracks</span>
          </div>
        </div>
      </section>

      {/* Career Sub-navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          type="button"
          className={activeTab === 'tracker' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveTab('tracker')}
        >
          💼 Job & Internship Tracker
        </button>
        <button
          type="button"
          className={activeTab === 'interviews' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveTab('interviews')}
        >
          🎙️ Interview Prep Guides
        </button>
        <button
          type="button"
          className={activeTab === 'resume' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveTab('resume')}
        >
          📄 ATS Resume Blueprint
        </button>
      </div>

      {activeTab === 'tracker' && (
        <section>
          <div className="job-tracker-header">
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Campus & Off-Campus Application Pipeline</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Keep track of every resume submission, screening round, and technical interview in one place.
              </p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setNewJobModal(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              + Add Application
            </button>
          </div>

          <div className="job-table-container">
            <table className="job-table">
              <thead>
                <tr>
                  <th>Company & Role</th>
                  <th>Applied On</th>
                  <th>Current Status</th>
                  <th>Interview Date</th>
                  <th>Notes & Outcome</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div className="job-company">{job.company}</div>
                      <div className="job-position">{job.position}</div>
                    </td>
                    <td>{job.applicationDate || '—'}</td>
                    <td>
                      <select
                        value={job.status}
                        onChange={(e) => handleStatusChange(job.id, e.target.value)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid var(--border)',
                          padding: '0.35rem 0.6rem',
                          fontSize: '0.82rem',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        {jobStatuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{job.interviewDate || 'Pending'}</td>
                    <td style={{ maxWidth: '280px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                        {job.result}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {job.notes}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="icon-btn delete"
                        onClick={() => handleDeleteJob(job.id)}
                        title="Delete application"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'interviews' && (
        <section>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Full-Spectrum Interview Preparation</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Industry tech interviews evaluate more than just LeetCode. Review specialized tracks covering systems,
              whiteboard live coding, STAR behavioral methodology, and HR compensation alignment.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {interviewGuides.map((guide) => (
              <div key={guide.id} className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="badge badge-accent">Track</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>⏱️ {guide.duration}</span>
                </div>

                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>{guide.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  {guide.summary}
                </p>

                <div style={{ marginBottom: '1.25rem' }}>
                  <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>
                    Key Focus Areas:
                  </h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {guide.keyTopics.map((k, i) => (
                      <span key={i} className="tech-tag">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#fbbf24', marginBottom: '0.5rem' }}>
                    Typical Questions Asked:
                  </h5>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    {guide.sampleQuestions.map((q, i) => (
                      <li key={i} style={{ marginBottom: '0.35rem' }}>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'resume' && (
        <section>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>ATS-Compliant Resume Architecture</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Pass automated resume screening software (Applicant Tracking Systems) and catch recruiter attention in 6 seconds.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {resumeTips.map((tip, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>✨</div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{tip.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {tip.description}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Resume Template Preview */}
          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              maxWidth: '800px',
              margin: '0 auto',
              background: '#040911',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', letterSpacing: '0.5px' }}>ALEX MERCER</h2>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                San Francisco, CA • alex.mercer@email.com • linkedin.com/in/alex-dev • github.com/alex-dev
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>
                EDUCATION
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                <span>B.S. in Computer Science — State Engineering University</span>
                <span>Expected May 2027</span>
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>GPA: 3.85/4.00 • Relevant Coursework: Data Structures, Operating Systems, Database Design</div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>
                TECHNICAL SKILLS
              </h4>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <strong>Languages:</strong> JavaScript (ES6+), Python, C++, SQL, HTML5, CSS3<br />
                <strong>Frameworks & Tools:</strong> React.js, Node.js, Express, MongoDB, Git, Docker, REST APIs, JWT
              </div>
            </div>

            <div>
              <h4 style={{ color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>
                FEATURED PROJECTS
              </h4>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span>Hub Learning SaaS Platform (React, Node, Express, MongoDB)</span>
                  <span>June 2026</span>
                </div>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  <li>Engineered a full-stack educational platform with 5 specialized hubs, serving over 500 active campus learners.</li>
                  <li>Implemented secure stateless JWT authentication and custom Mongoose aggregation queries reducing latency by 35%.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Add Job Modal */}
      {newJobModal && (
        <div className="modal-overlay" onClick={() => setNewJobModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.5rem' }}>Add New Job Application</h2>
              <button type="button" className="icon-btn" onClick={() => setNewJobModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleAddJob}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, Amazon, Startup"
                    value={newJobData.company}
                    onChange={(e) => setNewJobData({ ...newJobData, company: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    Position Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer Intern"
                    value={newJobData.position}
                    onChange={(e) => setNewJobData({ ...newJobData, position: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      Application Date
                    </label>
                    <input
                      type="date"
                      value={newJobData.applicationDate}
                      onChange={(e) => setNewJobData({ ...newJobData, applicationDate: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      Status
                    </label>
                    <select
                      value={newJobData.status}
                      onChange={(e) => setNewJobData({ ...newJobData, status: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      {jobStatuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    Interview Date (if scheduled)
                  </label>
                  <input
                    type="date"
                    value={newJobData.interviewDate}
                    onChange={(e) => setNewJobData({ ...newJobData, interviewDate: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    Notes & Referral Info
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Applied via alumni referral, completed OA round 1..."
                    value={newJobData.notes}
                    onChange={(e) => setNewJobData({ ...newJobData, notes: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setNewJobModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerHub;
