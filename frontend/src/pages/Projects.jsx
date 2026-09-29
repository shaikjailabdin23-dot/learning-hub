import React, { useState, useEffect } from 'react';
import projectService from '../services/projectService';
import ProjectCard from '../components/ProjectCard';
import SearchBar from '../components/SearchBar';
import { projectCategories } from '../data/projectData';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    problemStatement: '',
    description: '',
    category: 'Web Projects',
    technologies: '',
    role: 'Lead Developer',
    githubUrl: '',
    demoUrl: '',
    challenges: '',
    solutions: '',
  });

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProjectId(null);
    setFormData({
      title: '',
      problemStatement: '',
      description: '',
      category: 'Web Projects',
      technologies: '',
      role: 'Full Stack Developer',
      githubUrl: '',
      demoUrl: '',
      challenges: '',
      solutions: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingProjectId(proj._id);
    setFormData({
      title: proj.title || '',
      problemStatement: proj.problemStatement || '',
      description: proj.description || '',
      category: proj.category || 'Web Projects',
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : '',
      role: proj.role || 'Full Stack Developer',
      githubUrl: proj.githubUrl || '',
      demoUrl: proj.demoUrl || '',
      challenges: proj.challenges || '',
      solutions: proj.solutions || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await projectService.deleteProject(id);
      loadProjects();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    const payload = {
      ...formData,
      technologies: formData.technologies
        ? formData.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : ['JavaScript'],
    };

    if (editingProjectId) {
      await projectService.updateProject(editingProjectId, payload);
    } else {
      await projectService.createProject(payload);
    }

    setIsModalOpen(false);
    loadProjects();
  };

  const filtered = projects.filter((p) => {
    const matchesCat = selectedCategory === 'All Categories' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.technologies && p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="projects-workspace-page animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>Management Hub — Projects Workspace</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage, publish, track, and showcase your software engineering capstones and web platforms.
          </p>
        </div>

        <button type="button" className="btn-primary" onClick={openCreateModal}>
          + Create New Project 🚀
        </button>
      </div>

      {/* Search and Filters */}
      <section className="filter-search-bar">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search your projects by name or technology..."
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {projectCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </section>

      {/* Projects Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.6rem' }}>No Projects Yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            Your engineering portfolio workspace is clean and ready. Add your first capstone project to publish it to the Project Hub!
          </p>
          <button type="button" className="btn-primary" onClick={openCreateModal}>
            + Create New Project 🚀
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
          <h3>No projects found in this view</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
            Try adjusting your search query or selected category.
          </p>
        </div>
      ) : (
        <div className="topics-grid">
          {filtered.map((proj) => (
            <ProjectCard
              key={proj._id}
              project={proj}
              onEdit={openEditModal}
              onDelete={handleDelete}
              canEdit={true}
            />
          ))}
        </div>
      )}

      {/* Project Create/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.5rem' }}>
                {editingProjectId ? 'Edit Project Details' : 'Add New Capstone Project'}
              </h2>
              <button type="button" className="icon-btn" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Task Queue"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      {projectCategories.filter((c) => c !== 'All Categories').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                      Your Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Backend Lead, Solo Creator"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Problem Statement
                  </label>
                  <input
                    type="text"
                    placeholder="What real-world pain point does this solve?"
                    value={formData.problemStatement}
                    onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Description *
                  </label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Comprehensive architecture overview, algorithms used, and outcomes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Technologies (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, Express, MongoDB, Redis, Docker"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/username/repo"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://myproject.demo.dev"
                      value={formData.demoUrl}
                      onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProjectId ? 'Update Project' : 'Save & Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
