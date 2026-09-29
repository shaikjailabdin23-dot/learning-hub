import React from 'react';

const DeveloperToolCard = ({ tool, onLearnMore }) => {
  return (
    <div className="dev-tool-card">
      <div className="dev-card-top">
        <div
          className="dev-card-icon-wrapper"
          style={{ background: tool.accentGradient || 'var(--accent-gradient)' }}
          title={tool.name}
        >
          <span className="dev-card-icon-text">{tool.iconText}</span>
        </div>
        <span className="dev-tool-category-badge">{tool.category}</span>
      </div>

      <div className="dev-card-content">
        <h3 className="dev-card-title">{tool.name}</h3>
        <p className="dev-card-description">{tool.description}</p>
      </div>

      <div className="dev-card-footer">
        <span className="dev-card-group-pill">{tool.group}</span>
        <button
          type="button"
          className="dev-learn-more-btn"
          onClick={() => onLearnMore(tool)}
          aria-label={`Learn more about ${tool.name}`}
        >
          <span>Learn More</span>
          <span className="dev-arrow-icon">→</span>
        </button>
      </div>
    </div>
  );
};

export default DeveloperToolCard;
