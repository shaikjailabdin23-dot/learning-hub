import React, { useState, useEffect } from 'react';

const ProjectFullFrameModal = ({ project, onClose }) => {
  const [deviceView, setDeviceView] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [isLoading, setIsLoading] = useState(true);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const handleCopyUrl = () => {
    if (project.demoUrl) {
      navigator.clipboard.writeText(project.demoUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey(Date.now());
  };

  // Determine container width based on device preview mode
  const getFrameWidth = () => {
    if (deviceView === 'mobile') return '380px';
    if (deviceView === 'tablet') return '768px';
    return '100%';
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: '#07111f',
        zIndex: 600,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      {/* Top Full-Frame Control Header Bar */}
      <header
        style={{
          height: '64px',
          background: 'rgba(13, 27, 42, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          gap: '1rem',
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        {/* Left: Project Brand & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6c63ff 0%, #00d4ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            🚀
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '360px',
                }}
              >
                {project.title}
              </h2>
              {project.status && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.5rem',
                    borderRadius: '999px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    color: '#86efac',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {project.status}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {project.category} • Role: {project.role || 'Lead Developer'}
            </div>
          </div>
        </div>

        {/* Center: Device View Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '0.25rem 0.4rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
          }}
        >
          <button
            type="button"
            onClick={() => setDeviceView('desktop')}
            style={{
              background: deviceView === 'desktop' ? 'var(--accent)' : 'transparent',
              color: deviceView === 'desktop' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s',
            }}
            title="Desktop 100% Full Width"
          >
            <span>🖥️</span> Desktop
          </button>

          <button
            type="button"
            onClick={() => setDeviceView('tablet')}
            style={{
              background: deviceView === 'tablet' ? 'var(--accent)' : 'transparent',
              color: deviceView === 'tablet' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s',
            }}
            title="Tablet View (768px)"
          >
            <span>💻</span> Tablet
          </button>

          <button
            type="button"
            onClick={() => setDeviceView('mobile')}
            style={{
              background: deviceView === 'mobile' ? 'var(--accent)' : 'transparent',
              color: deviceView === 'mobile' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s',
            }}
            title="Mobile View (380px)"
          >
            <span>📱</span> Mobile
          </button>
        </div>

        {/* Right: Actions (Reload, External link, Info, Close) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {project.demoUrl && (
            <>
              <button
                type="button"
                className="icon-btn"
                onClick={handleReload}
                title="Reload Frame"
                style={{ fontSize: '0.95rem' }}
              >
                🔄
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={handleCopyUrl}
                title="Copy Live Project Link"
                style={{ fontSize: '0.9rem' }}
              >
                {copied ? '✓' : '📋'}
              </button>
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  borderColor: '#10b981',
                  color: '#34d399',
                }}
                title="Open directly in new browser tab"
              >
                <span>New Tab</span>
                <span>↗</span>
              </a>
            </>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
              title="Open GitHub Repository"
            >
              <span>GitHub</span>
              <span>↗</span>
            </a>
          )}

          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowInfoDrawer((prev) => !prev)}
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.8rem',
              background: showInfoDrawer ? 'rgba(108, 99, 255, 0.25)' : 'transparent',
              borderColor: showInfoDrawer ? 'var(--accent)' : 'var(--border)',
            }}
            title="Toggle Project Details & Problem Statement"
          >
            <span>ℹ️</span> Details
          </button>

          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            title="Close Full Frame (Esc)"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              marginLeft: '0.5rem',
            }}
          >
            ✕
          </button>
        </div>
      </header>

      {/* Main Full-Frame Stage Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: '#040b14',
        }}
      >
        {/* Frame Workspace (Centers tablet/mobile viewports or spans 100% desktop) */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: deviceView === 'desktop' ? '0' : '1.5rem',
            background:
              deviceView === 'desktop'
                ? '#040b14'
                : 'radial-gradient(circle at 50% 50%, rgba(108, 99, 255, 0.08) 0%, transparent 60%), #030811',
            transition: 'all 0.3s ease',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {project.demoUrl ? (
            <div
              style={{
                width: getFrameWidth(),
                height: '100%',
                background: '#ffffff',
                boxShadow: deviceView === 'desktop' ? 'none' : '0 10px 40px rgba(0, 0, 0, 0.8)',
                borderRadius: deviceView === 'desktop' ? '0' : '12px',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                border: deviceView === 'desktop' ? 'none' : '2px solid rgba(255,255,255,0.15)',
              }}
            >
              {/* Device Mockup Top Bar for Tablet & Mobile */}
              {deviceView !== 'desktop' && (
                <div
                  style={{
                    height: '24px',
                    background: '#1f2937',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 10px',
                    borderBottom: '1px solid #374151',
                  }}
                >
                  <div
                    style={{
                      width: '45px',
                      height: '4px',
                      borderRadius: '999px',
                      background: '#4b5563',
                    }}
                  />
                </div>
              )}

              {/* Iframe Loading Overlay */}
              {isLoading && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(7, 17, 31, 0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5,
                    gap: '1rem',
                  }}
                >
                  <div className="spinner" style={{ width: '40px', height: '40px' }} />
                  <p style={{ color: '#fff', fontSize: '0.92rem', margin: 0, fontWeight: 600 }}>
                    Connecting to live project at <span style={{ color: '#38bdf8' }}>{new URL(project.demoUrl).hostname}</span>...
                  </p>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Loading full frame web environment
                  </span>
                </div>
              )}

              {/* Interactive Live Project IFrame */}
              <iframe
                key={iframeKey}
                src={project.demoUrl}
                title={project.title}
                onLoad={() => setIsLoading(false)}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  flex: 1,
                  background: '#ffffff',
                }}
              />
            </div>
          ) : (
            /* Fallback if project does not have a live demo URL configured */
            <div
              style={{
                maxWidth: '600px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌐</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
                No Live URL Configured
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                This project does not currently have a live demo URL assigned. The administrator can edit this project and provide a live URL (e.g. Netlify, Vercel, or custom domain) to preview in full frame.
              </p>
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '0.65rem 1.4rem' }}>
                  Explore GitHub Source Repository →
                </a>
              )}
            </div>
          )}
        </div>

        {/* Slide-out Project Details Drawer */}
        {showInfoDrawer && (
          <aside
            style={{
              width: '380px',
              maxWidth: '90vw',
              background: 'rgba(13, 27, 42, 0.98)',
              backdropFilter: 'blur(20px)',
              borderLeft: '1px solid var(--border)',
              padding: '1.5rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              animation: 'slideInRight 0.25s ease-out',
              zIndex: 20,
              boxShadow: '-8px 0 25px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                Project Architecture
              </h3>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setShowInfoDrawer(false)}
                style={{ padding: '0.2rem' }}
              >
                ✕
              </button>
            </div>

            {project.problemStatement && (
              <div>
                <span style={{ fontSize: '0.75rem', color: '#f472b6', fontWeight: 700, textTransform: 'uppercase' }}>
                  🎯 Problem Statement
                </span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.55', marginTop: '0.25rem' }}>
                  {project.problemStatement}
                </p>
              </div>
            )}

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                📝 Description
              </span>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.55', marginTop: '0.25rem' }}>
                {project.description}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                💻 Technologies Applied
              </span>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.45rem' }}>
                {project.technologies?.map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      background: 'rgba(108, 99, 255, 0.18)',
                      color: '#c4b5fd',
                      border: '1px solid rgba(108, 99, 255, 0.3)',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {project.features && project.features.length > 0 && (
              <div>
                <span style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: 700, textTransform: 'uppercase' }}>
                  ✨ Key Features
                </span>
                <ul style={{ margin: '0.35rem 0 0', paddingLeft: '1.15rem', color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: '1.5' }}>
                  {project.features.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.challenges && (
              <div>
                <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase' }}>
                  ⚡ Engineering Challenges & Solutions
                </span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: '1.5', marginTop: '0.25rem' }}>
                  {project.challenges}
                </p>
              </div>
            )}

            <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ textAlign: 'center', fontSize: '0.84rem', padding: '0.6rem' }}
                >
                  Launch Full Page 🚀
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ textAlign: 'center', fontSize: '0.84rem', padding: '0.6rem' }}
                >
                  View GitHub Source
                </a>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default ProjectFullFrameModal;
