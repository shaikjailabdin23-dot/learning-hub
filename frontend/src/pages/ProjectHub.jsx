import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectCategories } from '../data/projectData';
import projectService from '../services/projectService';
import ProjectCard from '../components/ProjectCard';
import SearchBar from '../components/SearchBar';

const ProjectHub = () => {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects({
        category: activeCategory,
      });
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeCategory]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.technologies && p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesSearch;
  });

  return (
    <div className="project-hub-page animate-fade-in">
      {/* Hero Banner */}
      <section className="hub-hero">
        <div className="hub-hero-header">
          <div className="hub-hero-icon" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' }}>
            🚀
          </div>
          <div>
            <h1 className="hub-hero-title">Project Hub</h1>
            <p className="hub-hero-desc">
              Theory without implementation is quickly forgotten. Explore, architect, and showcase production-grade
              capstone projects with clear problem statements, modern tech stacks, and live GitHub repositories.
            </p>
          </div>
        </div>

        <div className="hub-stats-row">
          <div className="hub-stat-item">
            <span className="hub-stat-num">{projects.length}</span>
            <span className="hub-stat-text">Showcase Projects</span>
          </div>
          <div className="hub-stat-item">
            <span className="hub-stat-num">{projectCategories.length - 1}</span>
            <span className="hub-stat-text">Domains</span>
          </div>
          <div className="hub-stat-item">
            <span className="hub-stat-num">Full CRUD</span>
            <span className="hub-stat-text">Portfolio System</span>
          </div>
          <div className="hub-stat-item">
            <span className="hub-stat-num">Production</span>
            <span className="hub-stat-text">Ready Deployments</span>
          </div>
        </div>
      </section>

      {/* Action CTA Bar */}
      <div
        className="continue-learning-section"
        style={{ marginBottom: '2rem', background: 'linear-gradient(90deg, rgba(236, 72, 153, 0.15) 0%, rgba(13, 27, 42, 0.9) 100%)' }}
      >
        <div className="continue-left">
          <div className="continue-icon" style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6' }}>
            🛠️
          </div>
          <div>
            <div className="continue-title">Build & Manage Your Own Engineering Portfolio</div>
            <div className="continue-subtitle">
              Add your custom full-stack web, AI, or mobile projects with GitHub and Live Demo links.
            </div>
          </div>
        </div>
        <Link to="/projects" className="btn-primary" style={{ padding: '0.65rem 1.4rem' }}>
          Open Project Workspace 📁
        </Link>
      </div>

      {/* Filter and Search */}
      <section className="filter-search-bar">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by project name, tech stack (React, Node, Python, Docker)..."
        />
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredProjects.length}</strong> featured projects
        </div>
      </section>

      {/* Category Tabs */}
      <div className="category-tabs" role="tablist">
        {projectCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <h3>No projects found</h3>
          <p style={{ marginTop: '0.5rem' }}>Try clearing your search query or choosing another category.</p>
        </div>
      ) : (
        <div className="topics-grid">
          {filteredProjects.map((proj) => (
            <ProjectCard
              key={proj._id}
              project={proj}
              canEdit={false} // Read-only in showcase view; editing is done in /projects workspace
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectHub;
