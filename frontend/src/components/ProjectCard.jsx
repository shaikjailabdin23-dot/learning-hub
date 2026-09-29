import React from 'react';

const ProjectCard = ({ project, onEdit, onDelete, canEdit = true }) => {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <span className="badge badge-accent">{project.category || 'Web Projects'}</span>
        {canEdit && (
          <div className="project-crud-actions">
            {onEdit && (
              <button
                type="button"
                className="icon-btn"
                onClick={() => onEdit(project)}
                title="Edit Project"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="icon-btn delete"
                onClick={() => onDelete(project._id)}
                title="Delete Project"
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>

      <h3 className="project-card-title">{project.title}</h3>

      {project.problemStatement && (
        <div
          className="project-problem-snippet"
          style={{
            background: 'rgba(236, 72, 153, 0.08)',
            borderLeft: '3px solid #ec4899',
            padding: '0.6rem 0.85rem',
            borderRadius: '0 8px 8px 0',
            marginBottom: '0.85rem',
            fontSize: '0.85rem',
            lineHeight: '1.45',
            color: 'var(--text-secondary)',
          }}
        >
          <span style={{ color: '#f472b6', fontWeight: 600, display: 'inline-block', marginRight: '0.35rem' }}>
            🎯 Problem Statement:
          </span>
          {project.problemStatement}
        </div>
      )}

      <p className="project-card-desc">{project.description}</p>

      {project.technologies && project.technologies.length > 0 && (
        <div className="project-tech-tags">
          {project.technologies.map((tech, index) => (
            <span key={index} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="project-card-actions">
        <div className="project-links">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link-btn"
              title="Open GitHub Repository"
            >
              <span>GitHub</span> ↗
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link-btn"
              style={{
                borderColor: '#10b981',
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.1)',
                fontWeight: 600,
              }}
              title="Open Live Deployment"
            >
              <span>Live Demo</span> 🚀
            </a>
          )}
        </div>

        {project.role && (
          <span
            style={{
              fontSize: '0.78rem',
              color: '#c4b5fd',
              background: 'rgba(139, 92, 246, 0.15)',
              padding: '0.25rem 0.6rem',
              borderRadius: '999px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              fontWeight: 600,
            }}
          >
            Role: {project.role}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
