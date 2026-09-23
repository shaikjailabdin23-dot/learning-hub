const Project = require('../models/Project');

// @desc    Get projects (all or filtered by user/category)
// @route   GET /api/projects
// @access  Public / Optional Auth
const getProjects = async (req, res) => {
  try {
    const { category, myProjects } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (myProjects === 'true' && req.user) {
      filter.user = req.user._id;
    }

    const projects = await Project.find(filter)
      .populate('user', 'name college branch')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error('[GetProjects Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch projects.',
    });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('user', 'name college branch');
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('[GetProjectById Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch project details.',
    });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const {
      title,
      problemStatement,
      description,
      category,
      technologies,
      role,
      features,
      githubUrl,
      demoUrl,
      challenges,
      solutions,
      lessonsLearned,
      outcome,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Title, Category, and Description.',
      });
    }

    const techArray = Array.isArray(technologies)
      ? technologies
      : (technologies ? technologies.split(',').map((t) => t.trim()) : []);

    const featuresArray = Array.isArray(features)
      ? features
      : (features ? features.split('\n').map((f) => f.trim()).filter(Boolean) : []);

    const project = await Project.create({
      user: req.user._id,
      title: title.trim(),
      problemStatement: problemStatement || '',
      description: description.trim(),
      category,
      technologies: techArray,
      role: role || 'Full Stack Developer',
      features: featuresArray,
      githubUrl: githubUrl || '',
      demoUrl: demoUrl || '',
      challenges: challenges || '',
      solutions: solutions || '',
      lessonsLearned: lessonsLearned || '',
      outcome: outcome || '',
    });

    const populated = await Project.findById(project._id).populate('user', 'name college branch');

    return res.status(201).json({
      success: true,
      message: 'Project created successfully!',
      data: populated,
    });
  } catch (error) {
    console.error('[CreateProject Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create project.',
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    // Verify ownership
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this project.',
      });
    }

    const {
      title,
      problemStatement,
      description,
      category,
      technologies,
      role,
      features,
      githubUrl,
      demoUrl,
      challenges,
      solutions,
      lessonsLearned,
      outcome,
    } = req.body;

    if (title) project.title = title.trim();
    if (problemStatement !== undefined) project.problemStatement = problemStatement;
    if (description) project.description = description.trim();
    if (category) project.category = category;
    if (role) project.role = role;
    if (githubUrl !== undefined) project.githubUrl = githubUrl;
    if (demoUrl !== undefined) project.demoUrl = demoUrl;
    if (challenges !== undefined) project.challenges = challenges;
    if (solutions !== undefined) project.solutions = solutions;
    if (lessonsLearned !== undefined) project.lessonsLearned = lessonsLearned;
    if (outcome !== undefined) project.outcome = outcome;

    if (technologies !== undefined) {
      project.technologies = Array.isArray(technologies)
        ? technologies
        : technologies.split(',').map((t) => t.trim()).filter(Boolean);
    }

    if (features !== undefined) {
      project.features = Array.isArray(features)
        ? features
        : features.split('\n').map((f) => f.trim()).filter(Boolean);
    }

    await project.save();
    const updated = await Project.findById(project._id).populate('user', 'name college branch');

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully!',
      data: updated,
    });
  } catch (error) {
    console.error('[UpdateProject Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update project.',
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    // Verify ownership
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this project.',
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    console.error('[DeleteProject Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete project.',
    });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
