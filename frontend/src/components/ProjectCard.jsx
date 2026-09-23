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
        <div className="project-problem-snippet">
          💡 Problem: {project.problemStatement}
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
              style={{ borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}
            >
              <span>Live Demo</span> 🚀
            </a>
          )}
        </div>

        {project.role && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Role: {project.role}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
