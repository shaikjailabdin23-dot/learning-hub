import React, { useEffect } from 'react';

const ToolDetailsModal = ({ tool, onClose }) => {
  if (!tool) return null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="dev-modal-overlay" onClick={onClose}>
      <div className="dev-modal-container animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="dev-modal-header">
          <div className="dev-modal-title-row">
            <div
              className="dev-modal-icon-badge"
              style={{ background: tool.accentGradient || 'var(--accent-gradient)' }}
            >
              <span>{tool.iconText}</span>
            </div>
            <div>
              <div className="dev-modal-meta">
                <span className="dev-tool-category-badge">{tool.category}</span>
                <span className="dev-tool-group-tag">• {tool.group}</span>
              </div>
              <h2 className="dev-modal-name">{tool.name}</h2>
            </div>
          </div>
          <button
            type="button"
            className="dev-modal-close-btn"
            onClick={onClose}
            aria-label="Close details"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="dev-modal-body">
          {/* Overview */}
          <div className="dev-modal-section">
            <h4 className="dev-section-title">Overview & Importance</h4>
            <p className="dev-modal-desc">{tool.details?.overview || tool.description}</p>
          </div>

          {/* Key Features */}
          {tool.details?.keyFeatures && (
            <div className="dev-modal-section">
              <h4 className="dev-section-title">Core Capabilities & Why Developers Use It</h4>
              <ul className="dev-features-list">
                {tool.details.keyFeatures.map((feature, idx) => (
                  <li key={idx} className="dev-feature-item">
                    <span className="dev-feature-bullet">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Getting Started Quickstart */}
          {tool.details?.gettingStarted && (
            <div className="dev-modal-section">
              <h4 className="dev-section-title">Quickstart / Getting Started</h4>
              <div className="dev-code-box">
                <code>{tool.details.gettingStarted}</code>
              </div>
            </div>
          )}

          {/* Student Pro Tip */}
          {tool.details?.studentTip && (
            <div className="dev-student-tip-box">
              <div className="dev-tip-icon">💡</div>
              <div>
                <strong>Student Engineering Tip:</strong>
                <p>{tool.details.studentTip}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="dev-modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
          {tool.websiteUrl && (
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>Visit Official Documentation</span>
              <span>↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolDetailsModal;
